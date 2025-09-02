import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { PublicKey, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { Aurachain } from '../target/types/aurachain';
import assert from 'assert';

describe('aurachain aura points', () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.Aurachain as Program<Aurachain>;

  async function airdrop(to: PublicKey, lamports: number) {
    const sig = await provider.connection.requestAirdrop(to, lamports);
    await provider.connection.confirmTransaction(sig, 'confirmed');
  }

  function getAuraPda(user: PublicKey) {
    return PublicKey.findProgramAddressSync([Buffer.from('aura'), user.toBuffer()], program.programId);
  }

  async function initAura(user: anchor.web3.Keypair, username: string) {
    const [auraPda] = getAuraPda(user.publicKey);

    await program.methods
      .initialize(username)
      .accounts({
        //@ts-ignore
        auraAccount: auraPda,
        user: user.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([user])
      .rpc();

    return auraPda;
  }

  it('increase aura works normally', async () => {
    const user = anchor.web3.Keypair.generate();
    await airdrop(user.publicKey, 2 * LAMPORTS_PER_SOL);
    const auraPda = await initAura(user, `alice-${Date.now()}`);

    await program.methods.increaseAura(new anchor.BN(10))
      .accounts({
        //@ts-ignore
        auraAccount: auraPda, user: user.publicKey
      })
      .signers([user])
      .rpc();

    const acct = await program.account.auraAccount.fetch(auraPda);
    assert.equal(acct.auraPoints.toNumber(), 10);
  });

  it('fails when increasing by zero', async () => {
    const user = anchor.web3.Keypair.generate();
    await airdrop(user.publicKey, 2 * LAMPORTS_PER_SOL);
    const auraPda = await initAura(user, `bob-${Date.now()}`);

    try {
      await program.methods.increaseAura(new anchor.BN(0))
        .accounts({
          //@ts-ignore
          aauraAccount: auraPda, user: user.publicKey
        })
        .signers([user])
        .rpc();
      assert.fail('Expected InvalidAmount error');
    } catch (err: any) {
      const msg = (err.logs || []).join(' ').toLowerCase();
      assert(msg.includes('invalidamount'));
    }
  });

  it('decrease aura works normally', async () => {
    const user = anchor.web3.Keypair.generate();
    await airdrop(user.publicKey, 2 * LAMPORTS_PER_SOL);
    const auraPda = await initAura(user, `charlie-${Date.now()}`);

    // Increase first
    await program.methods.increaseAura(new anchor.BN(20))
      .accounts({
        //@ts-ignore
        auraAccount: auraPda, user: user.publicKey
      })
      .signers([user])
      .rpc();

    // Decrease
    await program.methods.decreaseAura(new anchor.BN(7))
      .accounts({
        //@ts-ignore
        auraAccount: auraPda, user: user.publicKey
      })
      .signers([user])
      .rpc();

    const acct = await program.account.auraAccount.fetch(auraPda);
    assert.equal(acct.auraPoints.toNumber(), 13);
  });

  it('fails when decreasing more than balance', async () => {
    const user = anchor.web3.Keypair.generate();
    await airdrop(user.publicKey, 2 * LAMPORTS_PER_SOL);
    const auraPda = await initAura(user, `dave-${Date.now()}`);

    await program.methods.increaseAura(new anchor.BN(5))
      .accounts({
        //@ts-ignore
        auraAccount: auraPda, user: user.publicKey
      })
      .signers([user])
      .rpc();

    try {
      await program.methods.decreaseAura(new anchor.BN(10))
        .accounts({
          //@ts-ignore
          auraAccount: auraPda, user: user.publicKey
        })
        .signers([user])
        .rpc();
      assert.fail('Expected InsufficientAura error');
    } catch (err: any) {
      const msg = (err.logs || []).join(' ').toLowerCase();
      assert(msg.includes('insufficientaura'));
    }
  });

  it('fails when decreasing zero', async () => {
    const user = anchor.web3.Keypair.generate();
    await airdrop(user.publicKey, 2 * LAMPORTS_PER_SOL);
    const auraPda = await initAura(user, `eve-${Date.now()}`);

    try {
      await program.methods.decreaseAura(new anchor.BN(0))
        .accounts({
          //@ts-ignore
          auraAccount: auraPda, user: user.publicKey
        })
        .signers([user])
        .rpc();
      assert.fail('Expected InvalidAuraAmount error');
    } catch (err: any) {
      const msg = (err.logs || []).join(' ').toLowerCase();
      assert(msg.includes('invalidauraamount'));
    }
  });
});
