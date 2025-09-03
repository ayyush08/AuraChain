use crate::error::AuraError;
use crate::state::AuraAccount;
use anchor_lang::prelude::*;

pub fn _increase_aura(ctx: Context<IncreaseAuraContext>, amount: u64) -> Result<()> {
    let aura_account = &mut ctx.accounts.aura_account;

    
    require!(amount > 0, AuraError::InvalidAmount);

    // Ensure signer is the owner
    require_keys_eq!(
        aura_account.owner,
        ctx.accounts.user.key(),
        AuraError::Unauthorized
    );

    aura_account.aura_points = aura_account
        .aura_points
        .checked_add(amount)
        .ok_or(AuraError::Overflow)?;

    msg!(
        "✨ {} gained {} aura points! Total = {}",
        aura_account.username,
        amount,
        aura_account.aura_points
    );

    Ok(())
}

#[derive(Accounts)]
pub struct IncreaseAuraContext<'info> {
    #[account(
        mut,
        seeds = [b"aura", user.key().as_ref(),aura_account.username.as_bytes()],
        bump
        
    )]
    pub aura_account: Account<'info, AuraAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
}
