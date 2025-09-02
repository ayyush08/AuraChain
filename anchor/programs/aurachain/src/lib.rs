use anchor_lang::prelude::*;

declare_id!("71AHpFUaCzauR7qZkwYLSCjsj8R6fwhBLLmoG4UKLZ9j");

pub mod instructions;
pub mod state;
pub mod error;

use instructions::*;

#[program]
pub mod aurachain {
    use super::*;

    pub fn initialize(ctx: Context<InitializeContext>,username:String) -> Result<()> {
        _initialize(ctx,username)
    }
    pub fn increase_aura(ctx: Context<IncreaseAuraContext>, amount: u64) -> Result<()> {
        _increase_aura(ctx, amount)
    }
    pub fn decrease_aura(ctx: Context<DecreaseAuraContext>, amount: u64) -> Result<()> {
        _decrease_aura(ctx, amount)
    }
}
