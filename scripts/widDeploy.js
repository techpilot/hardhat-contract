const { ethers, run, network } = require("hardhat");

async function main() {
  // Deploy the contract
  const Transaction = await ethers.getContractFactory("Transaction");
  const transaction = await Transaction.deploy();

  await transaction.deployed();

  console.log("Transaction deployed to:", transaction.address);

  // checks if the contract is deployed on local network or actual network
  if (network.config.chainId === 5 && process.env.ETHERSCAN_API_KEY) {
    console.log("waiting for block txes...");
    await transaction.deployTransaction.wait(6);
    await verify(transaction.address, []);
  }

  // interact with the contract
  console.log("showing...");
  const contractValue = await transaction.showOwner();
  console.log("contract value is: ", contractValue);
}

async function verify(contractAddress, args) {
  // Verify the contract on Etherscan
  console.log("verifying contract...");
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    });
  } catch (error) {
    if (error.message.toLowerCase().includes("already verified")) {
      console.log("contract already verified");
    } else {
      console.log(error);
      throw error;
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
