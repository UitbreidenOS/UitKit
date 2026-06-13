# Blockchain y Criptomonedas

## Cuándo activar
Construcción de aplicaciones blockchain, implementación de smart contracts con Solidity, integración con redes Ethereum o Layer 2, construcción de dApps con Web3.py o Ethers.js, auditoría de seguridad de smart contracts, o gestión de wallets y transacciones.

## Cuándo NO usar
Aplicaciones fintech general sin blockchain. Gestión de datos distribuida que no requiere inmutabilidad en cadena.

## Instrucciones

### Smart Contracts con Solidity

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleStorage {
    uint256 private storedValue;

    event ValueChanged(uint256 newValue);

    function setValue(uint256 newValue) public {
        storedValue = newValue;
        emit ValueChanged(newValue);
    }

    function getValue() public view returns (uint256) {
        return storedValue;
    }
}
```

### Interacción con Contratos (Web3.py)

```python
from web3 import Web3

w3 = Web3(Web3.HTTPProvider('http://localhost:8545'))

contract_abi = [...] # ABI from contract
contract = w3.eth.contract(address=contract_address, abi=contract_abi)

# Call read-only function
value = contract.functions.getValue().call()

# Send transaction
tx_hash = contract.functions.setValue(42).transact({'from': account})
```

---
