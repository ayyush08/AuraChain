use anchor_lang::prelude::*;

pub const MAX_USERNAME_LEN: usize = 100;
pub const MAX_MESSAGE_LEN: usize = 200;

#[account]
#[derive(InitSpace)]
pub struct AuraAccount {
    pub owner: Pubkey,
    #[max_len(32)]
    pub username: String,
    pub aura_points: u64,
}


