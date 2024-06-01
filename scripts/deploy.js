const hre = require("hardhat");

async function main() {
    // Get the ContractFactory and Signers here.
    const Token = await hre.ethers.getContractFactory("contracts/ERC20CappedBurnableToken.sol:ERC20CappedBurnableToken");

    /*
        Deployment scripts for TokenFite
        Token details:
        1. Name - TokenFite
        2. initial supply (send to owner) - 200,000
        3. max supply (capped) - 2,000,000
        4. burnable - Yes
        5. miner block reward - 20
    */
    const tokenFite = await Token.deploy("TokenFite", "FITE", 2000000, 20, 200000);
    await tokenFite.waitForDeployment()
    console.log("TokenFite deployed to address:", tokenFite.target)

    /*
        Deployment scripts for Token2010
        Token details:
        1. Name - Token2010
        2. initial supply (send to owner) - 100,000
        3. max supply (capped) - 1,000,000
        4. burnable - Yes
        5. miner block reward - 10
    */
    const token2010 = await Token.deploy("Token2010", "T2010", 1000000, 10, 100000);
    await token2010.waitForDeployment()
    console.log("Token2010 deployed to address:", token2010.target)
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});