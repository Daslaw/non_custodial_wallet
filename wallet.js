const ethers = require('ethers');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to validate a Bitcoin address for the non-custodial wallet
function validateBitcoinAddress(address) {
  // Regular expression pattern for Bitcoin address validation
  const bitcoinAddressPattern = /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/;

  // Check if the address matches the pattern
  const isValid = bitcoinAddressPattern.test(address);

  return isValid;
}

// Function to validate a numeric value
function validateNumericValue(value) {
  // Convert the value to a number
  const numericValue = Number(value);

  // Check if the numericValue is a valid number
  const isValid = !isNaN(numericValue) && isFinite(numericValue);

  return isValid;
}
// Create account

function createAccount() {
  const wallet = ethers.Wallet.createRandom();
  return {
    address: wallet.address,
    privateKey: wallet.privateKey,
  };
}

// Retrieve account
function retrieveAccount(privateKey) {
  const wallet = new ethers.Wallet(privateKey);
  return {
    address: wallet.address,
    privateKey: wallet.privateKey,
  };
}

// Receive bitcoin
async function receiveBitcoin(address) {
  const provider = ethers.getDefaultProvider('rinkeby');
  const balance = await provider.getBalance(address);
  return ethers.utils.formatEther(balance);
}

// Send bitcoin
async function sendBitcoin(privateKey, toAddress, amount) {
  const wallet = new ethers.Wallet(privateKey);
  const provider = ethers.getDefaultProvider('rinkeby');
  const transaction = {
    to: toAddress,
    value: ethers.utils.parseEther(amount.toString()),
  };

  try {
    const connectedWallet = await wallet.connect(provider);
    const tx = await connectedWallet.sendTransaction(transaction);
    return tx.hash;
  } catch (error) {
    return error.message;
  }
}

// Check balance
async function checkBalance(address) {
  const provider = ethers.getDefaultProvider('rinkeby');
  const balance = await provider.getBalance(address);
  return ethers.utils.formatEther(balance);
}
// MISS
// Help
function help() {
  return `
    Available commands:
    - createAccount(): Create a new account and get the address and private key.
    - retrieveAccount(privateKey): Retrieve an account using the private key and get the address and private key.
    - receiveBitcoin(address): Check the balance of an address and return the balance in Ether.
    Example: receiveBitcoin('0xABC...DEF')
    - sendBitcoin(privateKey, toAddress, amount): Send a specified amount of Ether from one account to another.
    Example: sendBitcoin('privateKey', '0xRecipientAddress', 1.5)
    - checkBalance(address): Check the balance of an address and return the balance in Ether.
    Example: checkBalance('0xABC...DEF')
    - help(): Display this help information.
    - exit(): Exit the application.
    `;
}
//  Prompt-based user interaction

function promptCreateAccount() {
  rl.question('Press any key to create a new account...', (answer) => {
    const account = createAccount();
    console.log('New Account Created:');
    console.log('Address:', account.address);
    console.log('Private Key:', account.privateKey);
    rl.close();
  });
}

function promptRetrieveAccount() {
  rl.question('Enter private key to retrieve the account...', (privateKey) => {
    const account = retrieveAccount(privateKey);
    console.log('Account Retrieved:');
    console.log('Address:', account.address);
    console.log('Private Key:', account.privateKey);
    rl.close();
  });
}

function promptReceiveBitcoin() {
  rl.question('Enter the address to check the balance...', (address) => {
    receiveBitcoin(address)
      .then(balance => {
        console.log('Balance:', balance);
        rl.close();
      })
      .catch(error => {
        console.error('Error:', error);
        rl.close();
      });
  });
}

function promptSendBitcoin() {
  rl.question('Enter your private key: ', (privateKey) => {
    rl.question('Enter recipient address: ', (toAddress) => {
      rl.question('Enter the amount to send: ', (amount) => {
        // Validate the inputs
        const validPrivateKey = validatePrivateKey(privateKey);
        const validToAddress = validateBitcoinAddress(toAddress);
        const validAmount = validateNumericValue(amount);

        if (!validPrivateKey) {
          console.error('Invalid private key');
          rl.close();
          return;
        }

        if (!validToAddress) {
          console.error('Invalid recipient address');
          rl.close();
          return;
        }

        if (!validAmount) {
          console.error('Invalid amount');
          rl.close();
          return;
        }

        sendBitcoin(privateKey, toAddress, amount)
          .then(txHash => {
            console.log('Transaction Hash:', txHash);
            rl.close();
          })
          .catch(error => {
            console.error('Error:', error);
            rl.close();
          });
      });
    });
  });
}


function promptCheckBalance() {
  rl.question('Enter the address to check the balance...', (address) => {
    checkBalance(address)
      .then(balance => {
        console.log('Balance:', balance);
        rl.close();
      })
      .catch(error => {
        console.error('Error:', error);
        rl.close();
      });
  });
}

function promptHelp() {
  console.log(help());
  rl.close();
}

function promptAction() {
  rl.question('Enter the number corresponding to the action you want to perform:\n' +
    '1. Create Account\n' +
    '2. Retrieve Account\n' +
    '3. Receive Bitcoin\n' +
    '4. Send Bitcoin\n' +
    '5. Check Balance\n' +
    '6. Help\n' +
    '7. Exit\n', (choice) => {
    switch (choice) {
    case '1':
    promptCreateAccount();
    break;
    case '2':
    promptRetrieveAccount();
    break;
    case '3':
    promptReceiveBitcoin();
    break;
    case '4':
    promptSendBitcoin();
    break;
    case '5':
    promptCheckBalance();
    break;
    case '6':
    promptHelp();
    break;
    case '7':
    rl.close();
    break;
    default:
    console.error('Invalid choice');
    rl.close();
    break;
    }
    });
}

// Run the promptAction function to start the application
promptAction();
