/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/aurachain.json`.
 */
export type Aurachain = {
  "address": "71AHpFUaCzauR7qZkwYLSCjsj8R6fwhBLLmoG4UKLZ9j",
  "metadata": {
    "name": "aurachain",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "decreaseAura",
      "discriminator": [
        117,
        2,
        50,
        109,
        57,
        162,
        96,
        7
      ],
      "accounts": [
        {
          "name": "auraAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  117,
                  114,
                  97
                ]
              },
              {
                "kind": "account",
                "path": "user"
              }
            ]
          }
        },
        {
          "name": "user",
          "writable": true,
          "signer": true
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "increaseAura",
      "discriminator": [
        59,
        15,
        155,
        251,
        37,
        233,
        54,
        151
      ],
      "accounts": [
        {
          "name": "auraAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  117,
                  114,
                  97
                ]
              },
              {
                "kind": "account",
                "path": "user"
              }
            ]
          }
        },
        {
          "name": "user",
          "writable": true,
          "signer": true
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "initialize",
      "discriminator": [
        175,
        175,
        109,
        31,
        13,
        152,
        155,
        237
      ],
      "accounts": [
        {
          "name": "auraAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  117,
                  114,
                  97
                ]
              },
              {
                "kind": "account",
                "path": "user"
              }
            ]
          }
        },
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "username",
          "type": "string"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "auraAccount",
      "discriminator": [
        144,
        174,
        173,
        138,
        14,
        15,
        48,
        139
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "usernameTooLong",
      "msg": "Username too long"
    },
    {
      "code": 6001,
      "name": "invalidAmount",
      "msg": "Amount must be greater than zero"
    },
    {
      "code": 6002,
      "name": "selfAuraNotAllowed",
      "msg": "You cannot increase/decrease your own aura"
    },
    {
      "code": 6003,
      "name": "mathError",
      "msg": "Overflow or underflow detected"
    },
    {
      "code": 6004,
      "name": "unauthorized",
      "msg": "You are not authorized to perform this action."
    },
    {
      "code": 6005,
      "name": "invalidAuraAmount",
      "msg": "Invalid aura amount."
    },
    {
      "code": 6006,
      "name": "overflow",
      "msg": "Overflow occurred while updating aura."
    },
    {
      "code": 6007,
      "name": "insufficientAura",
      "msg": "Not enough aura points."
    },
    {
      "code": 6008,
      "name": "usernameAlreadyClaimed",
      "msg": "Username already claimed."
    }
  ],
  "types": [
    {
      "name": "auraAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "username",
            "type": "string"
          },
          {
            "name": "auraPoints",
            "type": "u64"
          }
        ]
      }
    }
  ]
};
