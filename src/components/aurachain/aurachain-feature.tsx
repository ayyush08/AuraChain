import { WalletButton } from '../solana/solana-provider'
import { AuraProgramExplorerLink, AuraProgram, CreateAuraProfile } from './aurachain-ui'
import { AppHero } from '../app-hero'
import { useWalletUi } from '@wallet-ui/react'

export default function AurachainFeature() {
  const { account } = useWalletUi()

  if (!account) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="hero py-[64px]">
          <div className="hero-content text-center">
            <WalletButton />
          </div>
        </div>
      </div>
    )
  }

  return (
      <AppHero title="Aurachain" >
    <div>
      <AuraProgram />
    </div>
      </AppHero>
  )
}
