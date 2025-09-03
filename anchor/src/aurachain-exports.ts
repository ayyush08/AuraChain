// Here we export some useful types and functions for interacting with the Anchor program.
import { address } from 'gill'
import { SolanaClusterId } from '@wallet-ui/react'
import { AURACHAIN_PROGRAM_ADDRESS } from './client/js'
import AurachainIDL from '../target/idl/aurachain.json'

// Re-export the generated IDL and type
export { AurachainIDL }

// This is a helper function to get the program ID for the Aurachain program depending on the cluster.
export function getAurachainProgramId(cluster: SolanaClusterId) {
  switch (cluster) {
    case 'solana:devnet':
    case 'solana:testnet':
      // This is the program ID for the Aurachain program on devnet and testnet.
      return address('71AHpFUaCzauR7qZkwYLSCjsj8R6fwhBLLmoG4UKLZ9j')
    case 'solana:mainnet':
    default:
      return AURACHAIN_PROGRAM_ADDRESS
  }
}

export * from './client/js'
