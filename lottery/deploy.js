const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const { interface, bytecode } = require('./compile');

const provider = new HDWalletProvider(
  // Test mnemonic
  'clown chief luggage genre clump moment mean strategy fame guitar shell obey',
  // Connect to Infura node
  'https://rinkeby.infura.io/v3/5712f77690f246b885ee7b99bafaccc0'
)
const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log('Attempting to deploy from account', accounts[0]);

  const result = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode })
    .send({ gas: '1000000', from: accounts[0] });

  console.log(interface)
  console.log('Contract deployed to', result.options.address);
  provider.engine.stop();
};
deploy();
