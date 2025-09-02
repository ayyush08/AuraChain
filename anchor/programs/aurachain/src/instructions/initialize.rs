use crate::error::AuraError;
use crate::state::{AuraAccount, MAX_USERNAME_LEN};
use anchor_lang::prelude::*;

pub fn _initialize(ctx: Context<InitializeContext>, username: String) -> Result<()> {
    require!(
        username.len() <= MAX_USERNAME_LEN,
        AuraError::UsernameTooLong
    );



    let aura_account: &mut Account<'_, AuraAccount> = &mut ctx.accounts.aura_account;
    aura_account.owner = ctx.accounts.user.key();
    aura_account.username = username.clone();
    aura_account.aura_points = 0;

    // username_registry.owner = ctx.accounts.user.key();

    msg!("Aura initialized for {} ✨", aura_account.username);
    Ok(())
}

#[derive(Accounts)]
#[instruction(username: String)]
pub struct InitializeContext<'info> {
    #[account(
        init,
        payer = user,
        space = 8 + AuraAccount::INIT_SPACE,
        seeds = [b"aura", user.key().as_ref()],
        bump
    )]
    pub aura_account: Account<'info, AuraAccount>,

    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}
