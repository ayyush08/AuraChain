use crate::error::AuraError;
use crate::state::AuraAccount;
use anchor_lang::prelude::*;

pub fn _decrease_aura(ctx: Context<DecreaseAuraContext>, amount: u64) -> Result<()> {
    let aura_account = &mut ctx.accounts.aura_account;

    // Ensure valid amount
    require!(amount > 0, AuraError::InvalidAuraAmount);

    // Ensure signer is the owner
    require_keys_eq!(
        aura_account.owner,
        ctx.accounts.user.key(),
        AuraError::Unauthorized
    );

    // Ensure sufficient balance
    require!(
        aura_account.aura_points >= amount,
        AuraError::InsufficientAura
    );

    aura_account.aura_points = aura_account
        .aura_points
        .checked_sub(amount)
        .ok_or(AuraError::Overflow)?;

    msg!(
        "🔥 {} spent {} aura points! Remaining = {}",
        aura_account.username,
        amount,
        aura_account.aura_points
    );

    Ok(())
}

#[derive(Accounts)]
pub struct DecreaseAuraContext<'info> {
    #[account(
        mut,
        seeds = [b"aura", user.key().as_ref()],
        bump,
    )]
    pub aura_account: Account<'info, AuraAccount>,

    #[account(mut)]
    pub user: Signer<'info>,
}
