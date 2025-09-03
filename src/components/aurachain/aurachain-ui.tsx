
import { useCallback, useEffect, useState } from 'react'
import { useWalletUi, ellipsify } from '@wallet-ui/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@radix-ui/react-label'
import { ExplorerLink } from '@/components/cluster/cluster-ui'
import { AppModal } from '../app-modal'
import { useWalletUiSigner } from '../solana/use-wallet-ui-signer'
import { Address, getAddressEncoder, getProgramDerivedAddress, getUtf8Encoder } from 'gill'
import { useAurachainProgramId, useCreateAuraAccount, useGetAuraAccounts } from './aurachain-data-access'
import { getDecreaseAuraInstruction, getIncreaseAuraInstruction, getInitializeInstructionAsync } from '@project/anchor'
import { SYSTEM_PROGRAM_ADDRESS } from 'gill/programs'
import { Card, CardContent } from '../ui/card'
import { toast } from 'sonner'

export function AuraProgramExplorerLink() {

  const programId = useAurachainProgramId()
  return <ExplorerLink address={programId.toString()} label={ellipsify(programId.toString())} />
}


export function CreateAuraProfile() {
  const signer = useWalletUiSigner()
  const client = useWalletUi().client
  const programId = useAurachainProgramId()
  const [username, setUsername] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleInit = async () => {
    if (!signer) return
    if(username === '') {
      toast.error("Please enter a username");
      return;
    }

    const [pda, bump] = await getProgramDerivedAddress({
      programAddress: programId,
      seeds: [
        getUtf8Encoder().encode("aura"),
        getAddressEncoder().encode(signer.address),
        getUtf8Encoder().encode(username),
      ],
    })

    const ix = await getInitializeInstructionAsync({
      username,
      user: signer,
      systemProgram: SYSTEM_PROGRAM_ADDRESS,
      auraAccount: pda,
    })

    await useCreateAuraAccount(signer, client, [ix])
    setUsername('')
    setIsModalOpen(false)
  }

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setIsModalOpen(true)}
        className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-xl m-5"
      >
        Initialize Aura Profile
      </Button>

      {/* Modal */}
      <AppModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title="Initialize Aura Profile"
        submit={handleInit}
        submitLabel="Create"
      >
        <div>
          <Label htmlFor="username" className="text-sm text-gray-300">
            Username
          </Label>
          <Input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your aura username"
            className="mt-2 bg-gray-800 text-white border-gray-700 focus:ring-indigo-500"
          />
        </div>
      </AppModal>
    </>
  )
}




function IncreaseAura({ username, onChange, owner }: { username: string, onChange?: () => void, owner: Address }) {
  const [open, setOpen] = useState(false)
  const [amount, setAmount] = useState('')
  const signer = useWalletUiSigner()
  const client = useWalletUi().client
  const programId = useAurachainProgramId()

  const handleIncrease = async () => {
    if (amount === '') {
      toast.error("Please enter an amount");
      return;
    }
    if (!signer || !amount) return

    const [pda] = await getProgramDerivedAddress({
      programAddress: programId,
      seeds: [
        getUtf8Encoder().encode("aura"),
        getAddressEncoder().encode(owner),
        getUtf8Encoder().encode(username),
      ],
    })


    const ix = await getIncreaseAuraInstruction({
      user: signer,
      auraAccount: pda,
      amount: BigInt(amount),
    })

    // Send tx
    await useCreateAuraAccount(signer, client, [ix])

    toast.custom((t) => (
      <div className="flex items-center gap-3 bg-gradient-to-b from-green-700/80 to-black/80 text-white p-4 rounded-xl shadow-lg backdrop-blur-md">
        <div className="text-2xl">✨</div>
        <div className="flex-1">
          <span className="block font-bold text-lg">{username}</span>
          <p className="text-sm text-gray-200">
            gained <span className="font-semibold text-lime-300">{amount} AURA</span> 🌟
          </p>
        </div>
        <button onClick={() => toast.dismiss(t)} className="text-white/70 hover:text-white">
          ❌
        </button>
      </div>
    ))


    setAmount('')
    setOpen(false)
    onChange?.()
  }

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="bg-green-950/60 border border-green-600 hover:bg-green-600/40 text-white"
      >
        + Increase
      </Button>

      <AppModal
        open={open}
        onOpenChange={setOpen}
        title="Increase Aura"
        submit={handleIncrease}
        submitLabel="Increase"
      >
        <div>
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            type="number"
            min="1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter aura points"
          />
        </div>
      </AppModal>
    </>
  )
}




function DecreaseAura({ username, owner, previousAmount, onChange }: { username: string, owner: Address, onChange?: () => void, previousAmount: number }) {
  const [open, setOpen] = useState(false)
  const [amount, setAmount] = useState('')
  const signer = useWalletUiSigner()
  const { client } = useWalletUi()
  const programId = useAurachainProgramId()

  

  const handleDecrease = async () => {
    if (amount === '') {
      toast.error("Please enter an amount");

      return;
    }
    if (previousAmount < 1) {
      toast.custom((t) => (
        <div className="flex items-center gap-3 bg-gradient-to-r from-blue-600/80 to-indigo-600/80 text-white p-4 rounded-xl shadow-lg backdrop-blur-md border border-white/10">
          <div className="text-2xl">😅</div>
          <div className="flex-1">
            <span className="block font-bold text-lg italic">{username}</span>
            <p className="text-sm text-gray-200">
              already has <span className="font-semibold text-yellow-300">0 aura points</span> 😂
            </p>
          </div>
          <button onClick={() => toast.dismiss(t)} className="text-white/70 hover:text-white">
            ❌
          </button>
        </div>
      ))
      onChange?.()
      return;
    }
    if (!signer) return
    const [pda] = await getProgramDerivedAddress({
      programAddress: programId,
      seeds: [
        getUtf8Encoder().encode("aura"),
        getAddressEncoder().encode(owner),
        getUtf8Encoder().encode(username),
      ],
    })

    const ix = await getDecreaseAuraInstruction({
      user: signer,
      auraAccount: pda,
      amount: BigInt(amount),
    })
    await useCreateAuraAccount(signer, client, [ix])
    setAmount('')

    setOpen(false)
    toast.custom((t) => (
      <div className="flex items-center gap-3 bg-gradient-to-r from-red-500/70 to-rose-900/40 text-white p-4 rounded-xl shadow-lg backdrop-blur-md border border-white/10">
        <div className="text-2xl">🔥</div>
        <div className="flex-1">
          <span className="block font-bold text-lg italic">{username}</span>
          <p className="text-sm text-gray-200">
            just lost <span className="font-semibold text-500">{amount} auraz</span> 💨
          </p>
        </div>
        <button onClick={() => toast.dismiss(t)} className="text-white/70 hover:text-white">
          ❌
        </button>
      </div>
    ))

    onChange?.()
  }

  return (
    <>
      <Button onClick={() => setOpen(true)} className="bg-red-950/60 border border-red-600 hover:bg-red-600/40 text-white">
        – Decrease
      </Button>
      <AppModal open={open} onOpenChange={setOpen} title="Decrease Aura" submit={handleDecrease} submitLabel="Decrease">
        <Label htmlFor="amount">Amount</Label>
        <Input
          id="amount"
          type="number"
          min="1"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter aura points"
        />
      </AppModal>
    </>
  )
}

export function DisplayProfiles() {
  const { client } = useWalletUi()
  const programId = useAurachainProgramId()
  const [profiles, setProfiles] = useState<any[]>([])

  const refresh = useCallback(async () => {
    const accounts = await useGetAuraAccounts(client, programId)
    setProfiles(accounts)
  }, [client, programId])

  useEffect(() => {
    refresh()
  }, [refresh])

  console.log(profiles);
  return (
    <div className="w-full max-w-6xl mx-auto py-8 px-4 text-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <span>🌌</span> Aura Profiles
        </h2>
        <Button variant="outline" size="sm" onClick={refresh}>
          Refresh
        </Button>
      </div>

      {/* Profiles Grid */}
      {profiles.length === 0 ? (
        <p className="text-gray-400 text-center">No profiles found. Try creating one!</p>
      ) : (
        <div className="flex flex-wrap gap-6 justify-center">
          {profiles.map((profile, index) => (
            <Card
              key={index}
              className="bg-violet-950/30 border border-violet-500 shadow-md rounded-2xl hover:shadow-lg transition flex flex-col"
            >
              <CardContent className="p-6 flex flex-col justify-between h-full">
                {/* Profile Info */}
                <div>
                  <h3 className="text-lg font-semibold truncate">
                    {profile.data.username}
                  </h3>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-2xl font-bold text-purple-400">
                      ✨ {profile.data.auraPoints.toString()}
                    </span>
                    <span className="text-sm text-gray-400">points</span>
                  </div>
                </div>
                

                {/* Actions */}
                <div className="mt-6 flex gap-3">
                  <IncreaseAura username={profile.data.username} onChange={refresh} owner={profile.data.owner} />
                  <DecreaseAura username={profile.data.username} owner={profile.data.owner} previousAmount={Number(profile.data.auraPoints)} onChange={refresh} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}



export function AuraProgram() {
  const client = useWalletUi().client
  const programId = useAurachainProgramId()
  const [profiles, setProfiles] = useState<any[]>([])


  const refresh = async () => {
    const auraProfiles = await useGetAuraAccounts(client, programId)
    console.log("Fetched aura profiles:", auraProfiles);
    setProfiles(auraProfiles)
  }
  return (
    <div>
      <CreateAuraProfile />
      <br />
      <DisplayProfiles />
    </div>
  )
}
