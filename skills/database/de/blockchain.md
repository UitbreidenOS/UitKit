# Blockchain und Smart Contracts

## Wann aktivieren
Schreiben oder Überprüfung von Solidity Smart Contracts, Implementierung von ERC-20/721/1155 Token Standards, Aufbau von DeFi Protokollen, Optimierung von Gas Costs, Durchführung von Smart Contract Security Reviews, Setup von Hardhat oder Foundry Development und Test Umgebungen oder Schreiben von Fuzz Tests für Smart Contracts.

## Wann NICHT verwenden
Blockchain Infrastruktur, die keine Smart Contracts umfasst (Node Setup, RPC Endpoints, Indexers). Off-Chain Anwendungen, die nur Blockchain State lesen via ethers.js oder viem, ohne Contracts zu schreiben. NFT Minting Front Ends, wo der Contract bereits deployed und audited ist. Allgemeine Cryptography Probleme, die keine On-Chain Execution umfassen.

## Anweisungen

### OpenZeppelin Inheritance

Verwenden Sie immer OpenZeppelin's Battle-Tested Base Contracts als Foundation — implementieren Sie Standard Token Logic nicht von Grund auf neu:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

contract GovernanceToken is ERC20, AccessControl, ReentrancyGuard, Pausable {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    uint256 public constant MAX_SUPPLY = 100_000_000 * 10 ** 18;

    constructor(address admin) ERC20("Governance Token", "GOV") {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(MINTER_ROLE, admin);
        _grantRole(PAUSER_ROLE, admin);
    }

    function mint(address to, uint256 amount)
        external
        onlyRole(MINTER_ROLE)
        whenNotPaused
        nonReentrant
    {
        require(totalSupply() + amount <= MAX_SUPPLY, "Exceeds max supply");
        _mint(to, amount);
    }
}
```

Bevorzugen Sie `AccessControl` über `Ownable`, wenn mehrere Roles mit verschiedenen Permissions benötigt werden. Verwenden Sie `Ownable2Step` statt `Ownable`, wenn Single-Owner Kontrolle ausreicht — es verhindert, dass Ownership zu einer falschen Address transferiert wird (erfordert, dass der neue Owner akzeptiert).

### Gas Optimization

**Pack Storage Slots**: die EVM speichert State in 32-Byte Slots. Packen Sie mehrere kleine Werte in einen Slot — Lesen eines Slots kostet 2.100 Gas (Cold) unabhängig davon, wie viele Werte gepackt sind:

```solidity
// Inefficient — 3 storage slots (3 × 20,000 gas to write)
contract Unoptimized {
    uint256 price;       // slot 0
    bool    isActive;    // slot 1 (wasted — bool uses full 32 bytes)
    address owner;       // slot 2
}

// Optimized — 2 storage slots
contract Optimized {
    uint256 price;       // slot 0
    address owner;       // slot 1: 20 bytes
    bool    isActive;    // slot 1: 1 byte (packed with owner)
    uint96  reserved;    // slot 1: remaining 11 bytes (explicit padding)
}
```

**Verwenden Sie `calldata` für Read-Only Function Parameter**:

```solidity
// Memory — copies array into memory, more expensive
function sum(uint256[] memory values) public pure returns (uint256) { ... }

// Calldata — reads directly from call data, no copy
function sum(uint256[] calldata values) external pure returns (uint256) { ... }
```

**Custom Errors sind billiger als `require` Strings**:

```solidity
// Expensive: require stores and reverts with a string
require(msg.sender == owner, "Not the owner");

// Cheap: custom error uses ~50% less gas, also cleaner stack traces
error Unauthorized(address caller);
if (msg.sender != owner) revert Unauthorized(msg.sender);
```

**`unchecked` Arithmetic, wenn Overflow unmöglich ist**:

```solidity
// Safe unchecked: loop index can never overflow uint256 in any realistic scenario
for (uint256 i = 0; i < length;) {
    process(arr[i]);
    unchecked { ++i; }   // saves ~30 gas per iteration vs checked increment
}

// Subtraction where underflow is validated by the check above
unchecked {
    uint256 remaining = cap - minted;   // safe because minted <= cap is checked earlier
}
```

### ERC Standards

**ERC-20**: fungible Token. Überschreiben Sie `decimals()`, um 6 für Stablecoins (USDC Convention) zurückzugeben, oder verwenden Sie Standard 18.

**ERC-721**: Non-Fungible Token. Implementieren Sie `tokenURI`, um IPFS oder On-Chain Metadata URI zurückzugeben:

```solidity
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";

contract CollectionNFT is ERC721URIStorage, ERC2981 {
    uint256 private _nextTokenId;

    constructor(address royaltyRecipient, uint96 royaltyBps)
        ERC721("My Collection", "MCL")
    {
        // ERC-2981: set default royalty (bps = basis points, 500 = 5%)
        _setDefaultRoyalty(royaltyRecipient, royaltyBps);
    }

    function mint(address to, string calldata uri)
        external
        returns (uint256 tokenId)
    {
        tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }

    // Required for diamond inheritance
    function supportsInterface(bytes4 interfaceId)
        public view override(ERC721URIStorage, ERC2981)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
```

**ERC-1155**: Multi-Token Standard — sowohl Fungible als auch Non-Fungible in einem Contract. Verwenden Sie für Game Items, Event Tickets, Multi-Edition NFTs:

```solidity
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract GameItems is ERC1155 {
    uint256 public constant GOLD   = 0;   // fungible
    uint256 public constant SWORD  = 1;   // non-fungible (max supply 1)
    uint256 public constant SHIELD = 2;

    constructor() ERC1155("https://api.game.io/metadata/{id}.json") {
        _mint(msg.sender, GOLD, 10_000, "");
    }
}
```

**ERC-2981**: On-Chain Royalty Standard — Marketplaces abfragen `royaltyInfo(tokenId, salePrice)`, um Creator Fees zu berechnen. Pair mit ERC-721 oder ERC-1155.

### Security Patterns

**Reentrancy Guard — Checks-Effects-Interactions**:

Aktualisieren Sie immer State, bevor Sie externe Calls machen. Reentrancy Attacken nutzen einen Callback aus, der die Funktion vor State Update erneut betritt:

```solidity
// Vulnerable — state updated after external call
function withdraw(uint256 amount) external {
    require(balances[msg.sender] >= amount);
    (bool success,) = msg.sender.call{value: amount}("");  // attacker re-enters here
    require(success);
    balances[msg.sender] -= amount;  // never reached in attack
}

// Safe — checks, then effects, then interactions
function withdraw(uint256 amount) external nonReentrant {
    require(balances[msg.sender] >= amount, "Insufficient balance");
    balances[msg.sender] -= amount;  // effects first
    (bool success,) = msg.sender.call{value: amount}("");  // interaction last
    require(success, "Transfer failed");
}
```

**Verwenden Sie niemals `tx.origin` für Authorization** — es kann von einem böswilligen Intermediary Contract gespoofed werden:

```solidity
// Wrong
require(tx.origin == owner, "Not owner");

// Correct
require(msg.sender == owner, "Not owner");
```

**Integer Overflow**: Solidity 0.8+ hat eingebaute Overflow Checks. Verwenden Sie nur `unchecked` Blöcke, wo Sie explizit bewiesen haben, dass Overflow unmöglich ist.

### Hardhat Testing

```typescript
import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";

describe("CollectionNFT", function () {
    async function deployFixture() {
        const [owner, minter, buyer] = await ethers.getSigners();
        const NFT = await ethers.getContractFactory("CollectionNFT");
        const nft = await NFT.deploy(owner.address, 500);  // 5% royalty
        return { nft, owner, minter, buyer };
    }

    it("mints token and sets URI", async function () {
        const { nft, owner } = await loadFixture(deployFixture);
        await nft.mint(owner.address, "ipfs://Qm.../0");
        expect(await nft.tokenURI(0)).to.equal("ipfs://Qm.../0");
    });

    it("returns correct royalty info", async function () {
        const { nft, owner } = await loadFixture(deployFixture);
        await nft.mint(owner.address, "ipfs://Qm.../0");
        const [recipient, amount] = await nft.royaltyInfo(0, ethers.parseEther("1"));
        expect(recipient).to.equal(owner.address);
        expect(amount).to.equal(ethers.parseEther("0.05"));  // 5%
    });
});
```

### Foundry Fuzz Testing

Foundry führt Fuzz Tests mit zufälligen Inputs automatisch aus — findet Edge Cases, die Hand-geschriebene Tests vermissen:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/CollectionNFT.sol";

contract CollectionNFTFuzzTest is Test {
    CollectionNFT nft;
    address owner = makeAddr("owner");

    function setUp() public {
        vm.prank(owner);
        nft = new CollectionNFT(owner, 500);
    }

    // Foundry automatically generates random `salePrice` values
    function testFuzz_royaltyIsAlways5Percent(uint256 salePrice) public view {
        vm.assume(salePrice > 0 && salePrice < type(uint256).max / 10_000);
        (, uint256 royalty) = nft.royaltyInfo(0, salePrice);
        assertEq(royalty, salePrice * 500 / 10_000);
    }

    function testFuzz_mintIncreasesBalance(address to) public {
        vm.assume(to != address(0));
        uint256 balanceBefore = nft.balanceOf(to);
        vm.prank(owner);
        nft.mint(to, "ipfs://test");
        assertEq(nft.balanceOf(to), balanceBefore + 1);
    }
}
```

Ausführen mit hoher Iterations Zahl für Security-Critical Paths:

```bash
forge test --fuzz-runs 10000 -vvv
```

## Beispiel

Schreiben Sie einen ERC-721 NFT Contract mit Allowlist Minting, ERC-2981 Royalties und einen Foundry Fuzz Test:

1. Contract erbt `ERC721URIStorage`, `ERC2981`, `Ownable2Step`, `ReentrancyGuard`, `Pausable`.
2. Allowlist gespeichert als `mapping(address => uint256) public allowlistBalance` — gesetzt von Owner vor Mint Open.
3. `mintAllowlist(string calldata uri)` überprüft `allowlistBalance[msg.sender] > 0`, decrements, ruft `_safeMint` auf. Verwendet Checks-Effects-Interactions und `nonReentrant`.
4. Custom Errors: `NotAllowlisted()`, `AllowlistExhausted()`, `ExceedsMaxSupply()` — billiger als Require Strings.
5. `royaltyInfo` gibt 5% (500 bps) an Owner Address via inherited ERC-2981 zurück.
6. Foundry Fuzz Test `testFuzz_royaltyNeverExceedsSalePrice(uint256 salePrice)` führt 10.000 Iterationen aus und assert dass Royalty <= SalePrice für alle Inputs. Zweiter Fuzz Test `testFuzz_allowlistMintDecrementsBalance(address minter, uint256 quota)` verifiziert Balance decrements immer genau 1 pro Mint unabhängig von Initial Quota.

---
