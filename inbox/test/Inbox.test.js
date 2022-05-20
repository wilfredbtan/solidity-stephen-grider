const assert = require('assert');
const ganache = require('ganache-cli');
// Web3 is a constructor function used to create instances of web3 (thus capitalised)
const Web3 = require('web3');
// Provider changes depending on what network want to connect to
const web3 = new Web3(ganache.provider());
const { interface, bytecode } = require('../compile');

let accounts;
let inbox;
const INITIAL_STRING = 'Hi there!';

beforeEach(async () => {
    // Get a list of all accounts
    console.log("before each");
    accounts = await web3.eth.getAccounts()

    // Use one of the accounts to deploy the contract
    inbox = await new web3.eth.Contract(JSON.parse(interface)) // Teaches web3 about what methods an inbox contract has
        .deploy({ data: bytecode, arguments: [INITIAL_STRING] }) // Tells web3 that we want to deploy a new copy of this contract
        .send({ from: accounts[0], gas: '1000000' }) // Instructs web3 to send out a transaction that creates this contract
});

describe('Inbox', () => {
    it('deploys a contract', () => {
        assert.ok(inbox.options.address);
    });

    it('has a default message', async () => {
        const message = await inbox.methods.message().call();
        assert.equal(message, INITIAL_STRING);
    })

    it('can change the message', async () => {
        // Transaction hash is returned but not the actual message. If fail, test suite will fail so don't need to assign
        await inbox.methods.setMessage('bye').send({ from: accounts[0] });
        const message = await inbox.methods.message().call();
        assert.equal(message, 'bye');
    });
});
