---
name: nft-marketplace
description: Build NFT contracts and marketplaces — ERC-721/1155, metadata standards, royalties, and listing mechanisms
allowed-tools: [Read, Write, Bash, Grep]
effort: medium
---

## When to activate

- Creating NFT collections (PFP, art, gaming, utility)
- Building NFT marketplace or auction contracts
- Implementing ERC-2981 royalty standards
- Designing dynamic NFTs with on-chain metadata
- Integrating with OpenSea, Blur, or custom marketplaces

## When NOT to use

- For fungible token (ERC-20) development
- For centralized digital asset management
- For physical art inventory systems

## Instructions

1. **Choose standard.** ERC-721 (unique), ERC-1155 (semi-fungible/batch), ERC-6551 (token-bound accounts).
2. **Design metadata.** On-chain vs off-chain (IPFS/Arweave). Follow OpenSea metadata schema. Include traits, rarity.
3. **Implement minting.** Allowlist (Merkle tree), public sale, Dutch auction, or reveal mechanics.
4. **Add royalties.** ERC-2981 for on-chain royalty info. Operator filter for marketplace enforcement.
5. **Build marketplace.** Listings, offers, auctions (English/Dutch). Escrow pattern for safe transfers.
6. **Gas optimization.** Batch minting (ERC-1155), lazy minting (sign-to-mint), compressed metadata.
7. **Security.** Prevent double-spend, reentrancy in transfers, enumeration attacks on large collections.

## Example

```solidity
// ERC-721 with Merkle allowlist mint
contract NFTCollection is ERC721, ERC721Enumerable {
    bytes32 public merkleRoot;
    mapping(address => bool) public claimed;
    
    function allowlistMint(bytes32[] calldata proof) external {
        require(!claimed[msg.sender], "Already claimed");
        require(MerkleProof.verify(proof, merkleRoot, keccak256(abi.encodePacked(msg.sender))));
        claimed[msg.sender] = true;
        _safeMint(msg.sender, totalSupply() + 1);
    }
}
```
