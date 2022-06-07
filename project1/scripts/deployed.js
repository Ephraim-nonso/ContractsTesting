const { ethers } = require("hardhat");

const main = async() => {

    const initialSupply = ethers.utils.parseEther("100000")

    const [deployer] = await ethers.getSigners()
    // console.log(deployer);
    // console.log("Address deploying the contract is:", deployer.address);

    const tokenFactory = await ethers.getContractFactory("Token")
    const contract = await tokenFactory.deploy(initialSupply)

    await contract.deployed()

    console.log(`Token contract is ${contract.address}`);

}

main().then(() => process.exit(0)).catch(error => {
    console.error(error);
    process.exit(1)
})