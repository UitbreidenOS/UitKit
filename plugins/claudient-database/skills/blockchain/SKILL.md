---
name: "Blockchain and Smart Contracts"
description: "Writing or reviewing Solidity smart contracts, implementing ERC-20/721/1155 token standards, building DeFi protocols, optimi"
---

# Blockchain and Smart Contracts

## When to activate
Writing or reviewing Solidity smart contracts, implementing ERC-20/721/1155 token standards, building DeFi protocols, optimizing gas costs, performing smart contract security reviews, setting up Hardhat or Foundry development and test environments, or writing fuzz tests for smart contracts.

## When NOT to use
Blockchain infrastructure that does not involve smart contracts (node setup, RPC endpoints, indexers). Off-chain applications that merely read blockchain state via ethers.js or viem without writing contracts. NFT minting front ends where the contract is already deployed and audited. General cryptography problems that do not involve on-chain execution.

## Instructions

### OpenZeppelin Inheritance

Always use OpenZeppelin's battle-tested base contracts as the foundation — do not reimplement standard token logic from scratch:

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

Prefer `AccessControl` over `Ownable` when multiple roles with different permissions are needed. Use `Ownable2Step` instead of `Ownable` when single-owner control is sufficient — it prevents ownership being transferred to an incorrect address (requires the new owner to accept).

### Gas Optimization

**Pack storage slots**: the EVM stores state in 32-byte slots. Pack multiple small values into one slot — reading a slot costs 2,100 gas (cold) regardless of how many values are packed:

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

**Use `calldata` for read-only function parameters**:

```solidity
// Memory — copies array into memory, more expensive
function sum(uint256[] memory values) public pure returns (uint256) { ... }

// Calldata — reads directly from call data, no copy
function sum(uint256[] calldata values) external pure returns (uint256) { ... }
```

**Custom errors are cheaper than `require` strings**:

```solidity
// Expensive: require stores and reverts with a string
require(msg.sender == owner, "Not the owner");

// Cheap: custom error uses ~50% less gas, also cleaner stack traces
error Unauthorized(address caller);
if (msg.sender != owner) revert Unauthorized(msg.sender);
```

**`unchecked` arithmetic when overflow is impossible**:

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

**ERC-20**: fungible token. Override `decimals()` to return 6 for stablecoins (USDC convention) or use default 18.

**ERC-721**: non-fungible token. Implement `tokenURI` to return IPFS or on-chain metadata URI:

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

**ERC-1155**: multi-token standard — both fungible and non-fungible in one contract. Use for game items, event tickets, multi-edition NFTs:

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

**ERC-2981**: on-chain royalty standard — marketplaces query `royaltyInfo(tokenId, salePrice)` to compute creator fees. Pair with ERC-721 or ERC-1155.

### Security Patterns

**Reentrancy guard — checks-effects-interactions**:

Always update state before making external calls. Reentrancy attacks exploit a callback that re-enters the function before state is updated:

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

**Never use `tx.origin` for authorization** — it can be spoofed by a malicious intermediary contract:

```solidity
// Wrong
require(tx.origin == owner, "Not owner");

// Correct
require(msg.sender == owner, "Not owner");
```

**Integer overflow**: Solidity 0.8+ has built-in overflow checks. Only use `unchecked` blocks where you have explicitly proven overflow is impossible.

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

Foundry runs fuzz tests with random inputs automatically — find edge cases that hand-written tests miss:

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

Run with high iteration count for security-critical paths:

```bash
forge test --fuzz-runs 10000 -vvv
```

## Example

Write an ERC-721 NFT contract with allowlist minting, ERC-2981 royalties, and a Foundry fuzz test:

1. Contract inherits `ERC721URIStorage`, `ERC2981`, `Ownable2Step`, `ReentrancyGuard`, `Pausable`.
2. Allowlist stored as `mapping(address => uint256) public allowlistBalance` — set by owner before mint opens.
3. `mintAllowlist(string calldata uri)` checks `allowlistBalance[msg.sender] > 0`, decrements, calls `_safeMint`. Uses checks-effects-interactions and `nonReentrant`.
4. Custom errors: `NotAllowlisted()`, `AllowlistExhausted()`, `ExceedsMaxSupply()` — cheaper than require strings.
5. `royaltyInfo` returns 5% (500 bps) to owner address via inherited ERC-2981.
6. Foundry fuzz test `testFuzz_royaltyNeverExceedsSalePrice(uint256 salePrice)` runs 10,000 iterations asserting royalty <= salePrice for all inputs. Second fuzz test `testFuzz_allowlistMintDecrementsBalance(address minter, uint256 quota)` verifies balance always decrements exactly 1 per mint regardless of initial quota.

---
