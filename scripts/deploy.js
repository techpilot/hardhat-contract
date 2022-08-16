const { ethers, run, network } = require("hardhat");

async function main() {
  // Deploy the contract
  const SimpleStorage = await ethers.getContractFactory("SimpleStorage");
  const simpleStorage = await SimpleStorage.deploy();

  await simpleStorage.deployed();

  console.log("SimpleStorage deployed to:", simpleStorage.address);

  // checks if the contract is deployed on local network or actual network
  if (network.config.chainId === 5 && process.env.ETHERSCAN_API_KEY) {
    console.log("waiting for block txes...");
    await simpleStorage.deployTransaction.wait(6);
    await verify(simpleStorage.address, []);
  }

  // interact with the contract
  const currentValue = await simpleStorage.retrieve();
  console.log("current value is: ", currentValue);

  const transactionResponse = await simpleStorage.store(7);
  await transactionResponse.wait(1);
  const updatedValue = await simpleStorage.retrieve();
  console.log("updated value is: ", updatedValue);
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

// yarn hardhat run scripts/deploy.js --network goerli
// yarn hardhat node
// yarn hardhat console --network localhost
// yarn hardhat test --grep SimpleStorage

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });

// scripts folder is mainly for local development functionality
