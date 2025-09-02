use anchor_lang::prelude::*;

#[error_code]
pub enum AuraError {
    #[msg("Username too long")]
    UsernameTooLong,
    #[msg("Amount must be greater than zero")]
    InvalidAmount,
    #[msg("You cannot increase/decrease your own aura")]
    SelfAuraNotAllowed,
    #[msg("Overflow or underflow detected")]
    MathError,
    #[msg("You are not authorized to perform this action.")]
    Unauthorized,
    #[msg("Invalid aura amount.")]
    InvalidAuraAmount,
    #[msg("Overflow occurred while updating aura.")]
    Overflow,
     #[msg("Not enough aura points.")]
    InsufficientAura,
    #[msg("Username already claimed.")]
    UsernameAlreadyClaimed,
}
