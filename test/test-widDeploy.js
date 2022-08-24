const { ethers } = require("hardhat");
const { expect, assert } = require("chai");

describe("transaction", function () {
  let transactionFactory, transaction;

  beforeEach(async function () {
    transactionFactory = await ethers.getContractFactory("Transaction");

    transaction = await transactionFactory.deploy();
  });

  it("should start with a favorite number of 0", async function () {
    const currentValue = await transaction.showOwner();
    const expectedValue = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";

    assert.equal(currentValue.toString(), expectedValue);
  });
});
