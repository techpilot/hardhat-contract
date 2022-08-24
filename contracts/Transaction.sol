//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;

import "hardhat/console.sol";

contract Transaction {
    address public contractOwner;
    uint256 private constant _NOT_ENTERED = 1;
    uint256 private constant _ENTERED = 2;

    uint256 private _status;

    mapping(address => uint256) public deposits;
    mapping(address => uint256) public wid;

    modifier nonReentrant() {
        require(_status != _ENTERED, "ReentrancyGuard: reentrant call");
        _status = _ENTERED;
        _;

        _status = _NOT_ENTERED;
    }

    constructor() {
        contractOwner = msg.sender;
        _status = _NOT_ENTERED;
    }

    function showOwner() public view returns (address) {
        return contractOwner;
    }

    function deposit(
        address payee,
        address owner,
        uint256 amount
    ) public payable {
        uint256 amountPerc = (amount * 10) / 100;

        deposits[payee] = deposits[payee] + amount - amountPerc;
        wid[owner] = wid[owner] + amountPerc;
    }

    function withdraw(address payee, address owner) public nonReentrant {
        uint256 payment = deposits[payee];
        uint256 ownerPayment = wid[owner];

        require(payment > 0);
        require(ownerPayment > 0);

        deposits[payee] = 0;
        payable(payee).transfer(payment);

        wid[owner] = 0;
        payable(owner).transfer(ownerPayment);
    }

    function transact(address payee, address owner) public payable {
        deposit(payee, owner, msg.value);
        withdraw(payee, owner);
    }

    function fund() public payable {
        payable(contractOwner).transfer(msg.value);
    }

    fallback() external payable {
        fund();
    }

    receive() external payable {
        fund();
    }
}
