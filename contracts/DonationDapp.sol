//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract DonationDapp {
    address public admin;
    uint256 public registrationFee;

    struct Creator {
        bool isRegistered;
        address payable donationAddress;
    }

    mapping(address => Creator) public creators;
    address[] public creatorsArray;

    event FundsDonated(
        address indexed from,
        address indexed to,
        uint256 amount
    );
    event FundsWithdrawn(address indexed by, uint256 amount);

    event CreatorAdded(address indexed creator);

    constructor(uint256 fee) {
        admin = msg.sender;
        registrationFee = fee;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call this function");
        _;
    }

    function becomeCreator() external payable {
        require(!creators[msg.sender].isRegistered, "Already a creator");
        require(msg.value == registrationFee, "Incorrect registration fee");

        creators[msg.sender] = Creator(true, payable(msg.sender));
        creatorsArray.push(msg.sender);

        emit CreatorAdded(msg.sender);
    }

    function donateToCreator(address creatorAddress) external payable {
        require(
            creators[creatorAddress].isRegistered,
            "Invalid creator address"
        );
        require(msg.value > 0, "Invalid donation amount");

        creators[creatorAddress].donationAddress.transfer(msg.value);
        emit FundsDonated(msg.sender, creatorAddress, msg.value);
    }

    function withdrawFunds() external onlyAdmin {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds available");

        payable(admin).transfer(balance);
        emit FundsWithdrawn(admin, balance);
    }

    function getCreators() external view returns (address[] memory) {
        return creatorsArray;
    }

    function isCreator(address creatorAddress) external view returns (bool) {
        return creators[creatorAddress].isRegistered;
    }

    // function creatorDetails(address creatorAddress)
    //     external
    //     view
    //     returns (address payable)
    // {
    //     return creators[creatorAddress].donationAddress;
    // }

    // function updateAddress(address payable newAddress) external {
    //     require(creators[msg.sender].isRegistered, "Not a registered creator");
    //     require(newAddress != address(0), "Invalid address");

    //     creators[msg.sender].donationAddress = newAddress;
    // }
}
