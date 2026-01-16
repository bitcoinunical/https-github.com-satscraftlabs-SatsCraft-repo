
import { BuilderContent } from '../types';

export const BUILDER_CONTENT: Record<string, BuilderContent> = {
  // Module 3.3: Script Language (Bitcoin Script)
  '3.3': {
    id: '3.3',
    title: 'Script Construction Lab',
    steps: [
      {
        id: 'step1',
        title: 'Pay-to-PubKey-Hash (P2PKH)',
        description: 'Construct the standard locking script (ScriptPubKey) for a P2PKH transaction.\n\nStack Goal: Ensure the spender provides a Signature and PubKey that hashes to the specific address.',
        language: 'bitcoin-script',
        initialCode: `// Complete the P2PKH Locking Script
// Input: <Signature> <PubKey>
// Output needed: TRUE

OP_DUP
OP_HASH160
<PubKeyHash>
// ... add missing opcodes here
`,
        hint: 'You need to verify the hash matches (OP_EQUALVERIFY) and then check the signature (OP_CHECKSIG).',
        successMessage: 'Script Validated: Standard P2PKH structure confirmed.',
        validationFunction: (code: string) => {
            const clean = code.replace(/\/\/.*$/gm, '').replace(/\s+/g, ' ').trim();
            if (clean.includes('OP_EQUALVERIFY OP_CHECKSIG')) {
                return { passed: true };
            }
            return { passed: false, error: 'Stack Check Failed: Script did not end with proper verification opcodes.' };
        }
      },
      {
        id: 'step2',
        title: 'Timelock (CLTV)',
        description: 'Create a script that funds can ONLY be spent after block height 850,000.',
        language: 'bitcoin-script',
        initialCode: `// Check LockTime Verify
<850000>
// ... which opcode checks the locktime?
OP_DROP
<PubKey>
OP_CHECKSIG
`,
        hint: 'Use OP_CHECKLOCKTIMEVERIFY (or OP_CLTV) before dropping the height.',
        successMessage: 'Timelock Validated: Transaction effectively frozen until block 850,000.',
        validationFunction: (code: string) => {
            const clean = code.toUpperCase();
            if (clean.includes('OP_CHECKLOCKTIMEVERIFY') || clean.includes('OP_CLTV')) {
                return { passed: true };
            }
            return { passed: false, error: 'Execution Failed: Block height not verified against nLockTime field.' };
        }
      }
    ]
  },

  // Module 4.2: Node Config (LND)
  '4.2': {
    id: '4.2',
    title: 'LND Configuration Lab',
    steps: [
      {
        id: 'step1',
        title: 'Basic Node Identity',
        description: 'Configure your `lnd.conf` to set a public alias and color. This allows other nodes to identify you on the graph.',
        language: 'ini',
        initialCode: `[Application Options]
# Set your node alias (visible to network)
alias=

# Set your node color (hex code)
color=#000000

# Enable Wumbo channels (large channels)
protocol.wumbo-channels=false
`,
        hint: 'Set a name for alias= and change wumbo-channels to true.',
        successMessage: 'Config Validated: Node identity parameters set correctly.',
        validationFunction: (code: string) => {
             if (!/alias=.+/.test(code)) return { passed: false, error: 'Config Error: Alias cannot be empty.' };
             if (/alias=\s*$/.test(code)) return { passed: false, error: 'Config Error: Please provide a name.' };
             return { passed: true };
        }
      },
      {
        id: 'step2',
        title: 'Performance Tuning',
        description: 'Enable the "Wumbo" protocol to support channels larger than 0.16 BTC.',
        language: 'ini',
        initialCode: `[Application Options]
alias=Satoshi_Node
color=#F7931A

# Enable Wumbo channels
protocol.wumbo-channels=false
`,
        hint: 'Set protocol.wumbo-channels=true',
        successMessage: 'Daemon Restarted: Wumbo channels enabled. 5BTC channels now supported.',
        validationFunction: (code: string) => {
            if (code.includes('protocol.wumbo-channels=true')) {
                return { passed: true };
            }
            return { passed: false, error: 'Protocol Error: Wumbo channels explicitly disabled.' };
        }
      }
    ]
  },

  // Module 5.1: Merchant Architecture (JSON)
  '5.1': {
    id: '5.1',
    title: 'Invoice Payload Construction',
    steps: [
      {
        id: 'step1',
        title: 'BTCPay Invoice API',
        description: 'Construct a JSON payload to create an invoice for $50.00 USD. Ensure the "speedPolicy" is set to "MediumSpeed" to balance security and UX.',
        language: 'json',
        initialCode: `{
  "amount": 50.00,
  "currency": "USD",
  "metadata": {
    "orderId": "ORD-1024"
  },
  "checkout": {
    "speedPolicy": "HighSpeed",
    "expirationMinutes": 15
  }
}`,
        hint: 'Change "speedPolicy" to "MediumSpeed" (1 confirmation).',
        successMessage: 'API 200 OK: Invoice generated successfully.',
        validationFunction: (code: string) => {
            if (code.includes('"speedPolicy": "MediumSpeed"')) {
                return { passed: true };
            }
            return { passed: false, error: 'Risk Alert: HighSpeed policy (0-conf) poses double-spend risk for this amount.' };
        }
      }
    ]
  }
};
