const hre = require("hardhat");

async function main() {
    // Get the ContractFactory and Signers here.
    const Faucet = await hre.ethers.getContractFactory("contracts/Faucet.sol:Faucet");
    
    const tokenFiteFaucet = await Faucet.deploy("0x53f245b834973FECFA6948eA197EBFD287893d6f");
    await tokenFiteFaucet.waitForDeployment()
    console.log("TokenFiteFaucet deployed to address:", tokenFiteFaucet.target);

    const token2010Faucet = await Faucet.deploy("0x8726EC83Aad2eAd44624FA0Be7721080A2642E23");
    await token2010Faucet.waitForDeployment()
    console.log("Token2010 deployed to address:", token2010Faucet.target)
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});