# Blockchain and Smart Contracts

## Wanneer activeren
Schrijven of reviewen van Solidity smart contracts, implementeren van ERC-20/721/1155 token standards, bouwen van DeFi protocols, optimaliseren van gas costs, uitvoeren van smart contract security reviews, instellen van Hardhat of Foundry development en test environments, of schrijven van fuzz tests voor smart contracts.

## Wanneer NIET gebruiken
Blockchain infrastructure zonder smart contracts. Off-chain applicaties die blockchain state lezen zonder contracts te schrijven. NFT minting front ends waar contract al deployed is. Algemene cryptography problemen.

## Instructies

### OpenZeppelin Inheritance

Altijd gebruik OpenZeppelin's battle-tested base contracts als foundation:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract GovernanceToken is ERC20, AccessControl, ReentrancyGuard {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    uint256 public constant MAX_SUPPLY = 100_000_000 * 10 ** 18;

    constructor(address admin) ERC20("Governance Token", "GOV") {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(MINTER_ROLE, admin);
    }

    function mint(address to, uint256 amount)
        external
        onlyRole(MINTER_ROLE)
        nonReentrant
    {
        require(totalSupply() + amount <= MAX_SUPPLY, "Exceeds max supply");
        _mint(to, amount);
    }
}
```

Prefer `AccessControl` over `Ownable` wanneer multiple roles nodig zijn. Gebruik `Ownable2Step` in plaats van `Ownable` — prevent ownership transfer naar incorrect address.

### Gas Optimization

**Pack storage slots**: EVM stores state in 32-byte slots. Pack multiple kleine values in één slot:

```solidity
// Inefficient — 3 slots
contract Unoptimized {
    uint256 price;
    bool    isActive;
    address owner;
}

// Optimized — 2 slots
contract Optimized {
    uint256 price;
    address owner;       // slot 1: 20 bytes
    bool    isActive;    // slot 1: 1 byte packed
}
```

**Gebruik `calldata` voor read-only parameters** — no copy, direct read:

```solidity
// Memory — expensive copy
function sum(uint256[] memory values) public pure returns (uint256) { ... }

// Calldata — cheaper
function sum(uint256[] calldata values) external pure returns (uint256) { ... }
```

**Custom errors zijn goedkoper dan `require` strings**:

```solidity
// Expensive
require(msg.sender == owner, "Not the owner");

// Cheap
error Unauthorized(address caller);
if (msg.sender != owner) revert Unauthorized(msg.sender);
```

### ERC Standards

**ERC-20**: fungible token.
**ERC-721**: non-fungible token. Implementeer `tokenURI`.
**ERC-1155**: multi-token standard — fungible en non-fungible in één contract.
**ERC-2981**: on-chain royalty standard.

### Security Patterns

**Reentrancy guard — checks-effects-interactions**: update state voor external calls:

```solidity
function withdraw(uint256 amount) external nonReentrant {
    require(balances[msg.sender] >= amount, "Insufficient balance");
    balances[msg.sender] -= amount;  // effects first
    (bool success,) = msg.sender.call{value: amount}("");  // interaction last
    require(success, "Transfer failed");
}
```

**Nooit gebruik `tx.origin` voor authorization** — kan spoofed door malicious intermediary.

### Hardhat Testing

```typescript
import { expect } from "chai";
import { ethers } from "hardhat";

describe("CollectionNFT", function () {
    it("mints token and sets URI", async function () {
        const [owner] = await ethers.getSigners();
        const NFT = await ethers.getContractFactory("CollectionNFT");
        const nft = await NFT.deploy(owner.address, 500);
        await nft.mint(owner.address, "ipfs://Qm.../0");
        expect(await nft.tokenURI(0)).to.equal("ipfs://Qm.../0");
    });
});
```

---
