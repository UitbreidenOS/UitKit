# Blockchain et contrats intelligents

## Quand activer
Écriture ou examen de contrats intelligents Solidity, implémentation des standards ERC-20/721/1155, construction de protocoles DeFi, optimisation des coûts de gaz, audits de sécurité des contrats intelligents, configuration des environnements de développement et de test Hardhat ou Foundry, ou rédaction de tests fuzz pour contrats intelligents.

## Quand ne PAS utiliser
Infrastructure blockchain ne impliquant pas de contrats intelligents (configuration de nœud, endpoints RPC, indexeurs). Applications hors-chaîne qui lisent simplement l'état de la blockchain via ethers.js sans écrire de contrats. Frontends de mint NFT où le contrat est déjà déployé et audité. Problèmes généraux de cryptographie ne impliquant pas l'exécution sur-chaîne.

## Instructions

### Héritage OpenZeppelin

Toujours utiliser les contrats de base éprouvés d'OpenZeppelin — ne pas réimplémentter la logique standard de token à partir de zéro :

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
        external onlyRole(MINTER_ROLE) nonReentrant
    {
        require(totalSupply() + amount <= MAX_SUPPLY, "Exceeds max supply");
        _mint(to, amount);
    }
}
```

Préférer `AccessControl` sur `Ownable` quand plusieurs rôles avec permissions différentes sont nécessaires. Utiliser `Ownable2Step` au lieu de `Ownable` — cela prévient le transfert de propriété à une adresse incorrecte.

### Optimisation des gaz

**Empaqueter les slots de stockage** : l'EVM stocke l'état dans des slots de 32-octets. Empaqueter plusieurs petites valeurs dans un slot — lire un slot coûte 2 100 gas indépendamment du nombre de valeurs empaquetées :

```solidity
// Inefficace — 3 slots de stockage
contract Unoptimized {
    uint256 price;       // slot 0
    bool    isActive;    // slot 1 (gaspillé)
    address owner;       // slot 2
}

// Optimisé — 2 slots de stockage
contract Optimized {
    uint256 price;       // slot 0
    address owner;       // slot 1: 20 octets
    bool    isActive;    // slot 1: 1 octet (empaqueté avec owner)
}
```

**Utiliser `calldata` pour les paramètres de fonction en lecture seule** :

```solidity
// Calldata — lit directement à partir des données d'appel, pas de copie
function sum(uint256[] calldata values) external pure returns (uint256) { ... }
```

**Les erreurs personnalisées sont moins chères que les chaînes `require`** :

```solidity
error Unauthorized(address caller);
if (msg.sender != owner) revert Unauthorized(msg.sender);
```

**`unchecked` arithmétique quand le débordement est impossible** :

```solidity
for (uint256 i = 0; i < length;) {
    process(arr[i]);
    unchecked { ++i; }   // économise ~30 gas par itération
}
```

### Standards ERC

**ERC-20** : token fongible. Remplacer `decimals()` pour retourner 6 pour les stablecoins ou utiliser le défaut 18.

**ERC-721** : token non-fongible. Implémenter `tokenURI` pour retourner une URI de métadonnées IPFS ou on-chaîne :

```solidity
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";

contract CollectionNFT is ERC721URIStorage, ERC2981 {
    uint256 private _nextTokenId;

    constructor(address royaltyRecipient, uint96 royaltyBps)
        ERC721("My Collection", "MCL")
    {
        _setDefaultRoyalty(royaltyRecipient, royaltyBps);
    }

    function mint(address to, string calldata uri)
        external returns (uint256 tokenId)
    {
        tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }

    function supportsInterface(bytes4 interfaceId)
        public view override(ERC721URIStorage, ERC2981)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
```

**ERC-1155** : standard multi-token — à la fois fongible et non-fongible dans un contrat. À utiliser pour les articles de jeu, les tickets d'événement, les NFTs multi-édition.

**ERC-2981** : standard de royautés on-chaîne — les marchés demandent `royaltyInfo(tokenId, salePrice)` pour calculer les frais de créateur. Associer avec ERC-721 ou ERC-1155.

### Motifs de sécurité

**Garde de reentrancy — checks-effects-interactions** :

Toujours mettre à jour l'état avant d'effectuer les appels externes. Les attaques de reentrancy exploitent un callback qui rentre dans la fonction avant la mise à jour de l'état :

```solidity
// Sûr — checks, then effects, then interactions
function withdraw(uint256 amount) external nonReentrant {
    require(balances[msg.sender] >= amount, "Insufficient balance");
    balances[msg.sender] -= amount;
    (bool success,) = msg.sender.call{value: amount}("");
    require(success, "Transfer failed");
}
```

**Ne jamais utiliser `tx.origin` pour l'autorisation** — cela peut être usurpé :

```solidity
// Correct
require(msg.sender == owner, "Not owner");
```

### Tests Hardhat

```typescript
import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";

describe("CollectionNFT", function () {
    async function deployFixture() {
        const [owner, minter, buyer] = await ethers.getSigners();
        const NFT = await ethers.getContractFactory("CollectionNFT");
        const nft = await NFT.deploy(owner.address, 500);
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
        expect(amount).to.equal(ethers.parseEther("0.05"));
    });
});
```

### Tests Foundry Fuzz

Foundry exécute les tests fuzz avec des entrées aléatoires automatiquement :

```solidity
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

Exécuter avec le comptage d'itération élevé :

```bash
forge test --fuzz-runs 10000 -vvv
```

## Exemple

Écrire un contrat ERC-721 NFT avec mint de allowlist, royautés ERC-2981, et un test fuzz Foundry :

1. Le contrat hérite de `ERC721URIStorage`, `ERC2981`, `Ownable2Step`, `ReentrancyGuard`, `Pausable`.
2. Allowlist stockée sous `mapping(address => uint256) public allowlistBalance`.
3. `mintAllowlist(string calldata uri)` vérifie `allowlistBalance[msg.sender] > 0`, décrémente, appelle `_safeMint`. Utiliser checks-effects-interactions et `nonReentrant`.
4. Erreurs personnalisées : `NotAllowlisted()`, `AllowlistExhausted()`, `ExceedsMaxSupply()`.
5. `royaltyInfo` retourne 5% (500 bps) à l'adresse du propriétaire via ERC-2981 hérité.
6. Test fuzz Foundry `testFuzz_royaltyNeverExceedsSalePrice(uint256 salePrice)` s'exécute 10 000 itérations assertant royalty <= salePrice pour toutes les entrées.

---
