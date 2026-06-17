---
name: wallet-integration
description: Integrate Web3 wallets in dApps — MetaMask, WalletConnect, transaction signing, and account abstraction
allowed-tools: [Read, Write, Bash, Grep]
effort: medium
---

## When to activate

- Connecting MetaMask/WalletConnect to a dApp frontend
- Implementing EIP-712 typed data signing
- Building transaction flows with gas estimation and confirmation
- Implementing account abstraction (ERC-4337) smart wallets
- Handling multi-chain wallet connections and chain switching

## When NOT to use

- For custodial wallet management (exchange wallets)
- For server-to-server blockchain interactions
- For backend-only blockchain integrations

## Instructions

1. **Choose connection library.** wagmi + viem (React), ethers.js (vanilla JS), web3modal (multi-wallet).
2. **Implement connect flow.** Detect injected provider → offer WalletConnect → handle rejection gracefully.
3. **Chain management.** Detect current chain, prompt to switch, add custom chains. Handle chain change events.
4. **Transaction flow.** Estimate gas → show confirmation UI → send transaction → poll for receipt → handle revert.
5. **Message signing.** EIP-191 (personal_sign) for auth, EIP-712 for structured data. Verify signatures server-side.
6. **Account abstraction.** Smart contract wallets (ERC-4337), gasless transactions (paymaster), social recovery.
7. **Error handling.** User rejected, insufficient funds, nonce too low, gas estimation failed, chain not supported.

## Example

```typescript
// wagmi + viem transaction flow
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'

function MintButton() {
  const { writeContract, data: hash } = useWriteContract()
  const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash })

  const mint = () => writeContract({
    address: '0x1234...',
    abi: contractAbi,
    functionName: 'mint',
    args: [1],
    value: parseEther('0.01'),
  })

  return (
    <button onClick={mint} disabled={isLoading}>
      {isLoading ? 'Minting...' : isSuccess ? 'Minted!' : 'Mint NFT'}
    </button>
  )
}
```
