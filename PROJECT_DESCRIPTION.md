# Project Description

**Deployed Frontend URL:** [Aurachain Deployed](https://aura-chain-whth.vercel.app/aurachain)

**Solana Program ID:** 8VdwhnxhGCYkKv38VGBMAWxxnz5r2Yp1s41fqCbxps5S

## Project Overview

### Description
AuraChain is a decentralized reputation and engagement system built on Solana. Each user has a unique profile account (derived via PDA) that stores their "aura points," representing credibility, contribution, or reputation within the app. Users can increase or decrease aura points, and once created, profiles persist on-chain to ensure transparency and fairness.

This dApp demonstrates intermediate Solana program development concepts including PDAs, account initialization, and controlled state modifications.

### Key Features
- **Create Profile**: Initialize your on-chain profile with aura points storage.

- **Increase Aura**: Add aura points to a user’s profile.

- **Decrease Aura**: Deduct aura points from a user’s profile (with safety checks).

- **View Profile**: Display current aura points and ownership


### How to Use the dApp
1. **Connect Wallet** - Connect your Solana wallet
2. **Initialize Profile** - Click "Initialize Aura Profile" to create your profile
3. **Increase Aura** - Use the "+" button to increase your aura points
4. **Decrease Aura** - Click "-" to decrease your aura points
5. **View Profile** - See your current aura points and profile information

## Program Architecture
The AuraChain dApp uses a simple architecture with one main account type and three core instructions. The program leverages PDAs to create unique profile accounts for  user, ensuring data isolation and preventing conflicts between different users' profiles.

### PDA Usage
The program uses Program Derived Addresses to create deterministic counter accounts for each user.

**PDAs Used:**
- **Profile PDA**: Derived from seeds `["aura", user_wallet_pubkey, username]` - ensures each user has a unique profile account.



### Program Instructions

**Instructions Implemented:**

- **InitializeProfile**: Creates a new aura account for a user with default values.

- **IncreaseAura**: Adds N aura points to the profile.

- **DecreaseAura**: Deducts N aura points, ensuring the balance doesn’t go below zero.

- **ViewProfile**: Reads stored profile data (owner, aura points, etc.).

### Account Structure
```rust

#[account]
#[derive(InitSpace)]
pub struct AuraAccount {
    pub owner: Pubkey, //The wallet that owns this profile
    #[max_len(32)]
    pub username: String, //User's chosen name
    pub aura_points: u64, // aura points
}

```

## Testing

### Test Coverage
Comprehensive test suite covering all instructions with both successful operations and error conditions to ensure program security and reliability.

**Happy Path Tests:**

- **Initialize Profile**: Successfully creates a new profile with correct initial values.

- **Increase Aura**: Properly adds the given number of points.

- **Decrease Aura**: Deducts points without going negative.


**Unhappy Path Tests:**
- **Initialize Duplicate**: Fails when trying to initialize a profile that already exists
- **Increase Unauthorized**: Fails when non-owner tries to increase someone else's aura points
- **Decrease Unauthorized**: Fails when non-owner tries to decrease someone else's aura points
- **Account Not Found**: Fails when trying to operate on non-existent profile

### Running Tests
```bash
yarn install    # install dependencies
anchor test     # run tests
```

### Additional Notes for Evaluators

This was my first Solana dApp and the learning curve was steep! The biggest challenges were figuring out account ownership validation (kept getting unauthorized errors) and dealing with async transaction confirmations. PDAs were confusing at first but once they clicked, the deterministic addressing made everything much cleaner.