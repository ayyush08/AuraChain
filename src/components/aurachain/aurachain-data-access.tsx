import { AURA_ACCOUNT_DISCRIMINATOR, getAuraAccountDecoder, getAurachainProgramId } from '@project/anchor'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { toast } from 'sonner'
import { useWalletUi } from '@wallet-ui/react'
import { toastTx } from '@/components/toast-tx'
import { useWalletTransactionSignAndSend } from '@/components/solana/use-wallet-transaction-sign-and-send'
import { useWalletUiSigner } from '@/components/solana/use-wallet-ui-signer'
import { Address, createSolanaClient, createTransaction, getBase58Decoder, Instruction, signAndSendTransactionMessageWithSigners, SolanaClient, TransactionSigner } from 'gill'

export function useAurachainProgramId() {
  const { cluster } = useWalletUi()

  return useMemo(() => getAurachainProgramId(cluster.id), [cluster])
}

export function useGetProgramAccountQuery() {
  const { client, cluster } = useWalletUi()

  return useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => client.rpc.getAccountInfo(getAurachainProgramId(cluster.id)).send(),
  })
}


export async function processTransaction(
  signer: TransactionSigner,
  client: SolanaClient,
  instructions: Instruction[]
) {
  const { value: latestBlockhash } = await client.rpc.getLatestBlockhash().send()

  const { simulateTransaction } = createSolanaClient({
    urlOrMoniker: "https://api.devnet.solana.com",
  })
  toast.info("Please wait....")

  // toast.message("Creating transaction...")
  const transaction = createTransaction({
    latestBlockhash,
    feePayer: signer,
    version: 'legacy',
    instructions: Array.isArray(instructions) ? instructions : [instructions],
  })
  console.log("Transaction created:", transaction);

  // toast.message("Signing transaction...")
  const simulation = await simulateTransaction(transaction) 
  console.log("Simulation:",simulation);



  const signature = await signAndSendTransactionMessageWithSigners(transaction);
  console.log("Transaction signature:", signature);

  const decoder = getBase58Decoder()
  const sig58 = decoder.decode(signature)
  console.log(sig58)
}


export async function fetchAuraProfiles(client: SolanaClient, programId: Address) {
  const allAccounts = await client.rpc.getProgramAccounts(programId, {
    encoding: "base64",
  }).send();

  const filteredAccounts = allAccounts.filter((account) => {
    const data = Buffer.from(account.account.data[0], "base64");
    const discriminator = data.subarray(0, 8);
    return discriminator.equals(Buffer.from(AURA_ACCOUNT_DISCRIMINATOR));
  });

  const decoder = getAuraAccountDecoder();

  return filteredAccounts.map((account) => ({
    address: account.pubkey,
    data: decoder.decode(Buffer.from(account.account.data[0], "base64")),
  }));
}