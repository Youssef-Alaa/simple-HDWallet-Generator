const bip39 = require('bip39');
const hdkey = require('hdkey');
const ethUtil = require('ethereumjs-util');
var createHash = require('create-hash');
var bs58check = require('bs58check');
const ethTx = require('ethereumjs-tx').Transaction;
const Web3 = require('web3');

const mnemonic = bip39.generateMnemonic(); //generates string 
console.log("mnemonic:",mnemonic);
const seed = bip39.mnemonicToSeedSync(mnemonic); //creates seed buffer
console.log("seed:",seed);

const root = hdkey.fromMasterSeed(seed);
console.log("root:",root);
const masterPrivateKey = root.privateKey.toString('hex');
console.log("masterPrivateKey:",masterPrivateKey);

const addrNode = root.derive("m/44'/60'/0'/0/0"); //line 1
console.log("addrNode:",addrNode)
const pubKey = ethUtil.privateToPublic(addrNode._privateKey);
console.log("publicKey:", pubKey);
const addr = ethUtil.publicToAddress(pubKey).toString('hex');
console.log("addr:", addr);
const address = ethUtil.toChecksumAddress(addr);
console.log("address:", address);
/*
   If using ethereumjs-wallet instead do after line 1:
   const address = addrNode.getWallet().getChecksumAddressString();
*/

    // const params = {
    //     nonce: 0,
    //     to: "0x4584158529818ef77D1142bEeb0b6648BD8eDb2f",
    //     from: "0x9E7060874634793e85f1A5fBdC831653b2a00305",
    //     value: 0.01,
    //     gasPrice: 5000000000,
    //     gasLimit: 21000,
    //     chainId: 3
    //   };

    // const tx = new ethTx(params);
    // console.log("transaction:", tx);
    // //Signing the transaction with the correct private key
    // tx.sign(addrNode._privateKey);
    // const serializedTx = tx.serialize();
    // console.log("serializedTx::",serializedTx)
    // const web3 = new Web3(
    //     new Web3.providers.HttpProvider('https://ropsten.infura.io/v3/1c0987b3ed054fcb8bfa4993db70586b')
    //  );
    //  //Verify connection is successful
    //  web3.eth.net.isListening()
    //     .then(() => console.log('is connected'))
    //     .catch(e => console.log('Wow. Something went wrong'));

    // web3.eth.sendSignedTransaction(
    //     `0x${serializedTx.toString('hex')}`, 
    //     (error, result) => { 
    //     if (error) { console.log(`Error: ${error}`); }  
    //     else { console.log(`Result: ${result}`); } 
    //     } 
    // );

const masterPublicKey = root.publicKey.toString('hex');
console.log("masterPublicKey:",masterPublicKey);

const addr2node = root.derive("m/44'/0'/0'/0/0");
console.log('addr2node', addr2node);
const clonedObjected = {...addr2node};
console.log('public key >>>>>>>>>> ', clonedObjected._publicKey.toString('hex'));

const step1 = addr2node._publicKey;
const step2 = createHash('sha256').update(step1).digest();
const step3 = createHash('rmd160').update(step2).digest();
console.log("Base Address:", step3.toString('hex'));

var step4 = Buffer.allocUnsafe(21);
step4.writeUInt8(0x00, 0);
step3.copy(step4, 1); //step4 now holds the extended RIPMD-160 result
const step9 = bs58check.encode(step4);
console.log('Base58Check: ' + step9);

/*
	Mainnet
	pubKeyHash: 0x00, 
	Testnet
	pubKeyHash: 0x6f,
*/