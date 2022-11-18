// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "hardhat/console.sol";

contract todtwo {
    struct LendingConditions {
        uint256 collateralFee;
        uint256 borrowFee;
        uint256 lendingDuration;
    }

    struct NFTDetails {
        address nftAddress;
        uint256 nftIdx;
        address lender;
        LendingConditions condition;
        uint256 deadline;
        nftStatus status;
    }

    enum nftStatus {
        AVAILABLE,
        BEING_BORROWED,
        DELETED
    }

    NFTDetails[] nftLPList;
    mapping(address => uint256[]) lenders;
    mapping(address => uint256[]) borrowers;

    function getAllAvailableNFTs() public view returns (NFTDetails[] memory) {}

    function getNFTDetails(uint256 _idx)
        public
        view
        returns (NFTDetails memory)
    {}

    function borrowNFT(uint256 _idx) public returns (bool) {}

    function returnNFT(address _nftContAddr, uint256 idx)
        public
        returns (bool)
    {}

    function viewUserLentProfile(address _userAddr)
        public
        view
        returns (NFTDetails[] memory)
    {}

    function viewUserBorrowedProfile(address _userAddr)
        public
        view
        returns (NFTDetails[] memory)
    {}

    function lendNFT(
        address _nftContAddr,
        uint256 _idx,
        uint256 _collFee,
        uint256 _borrowFee,
        uint256 _duration
    ) public {}

    function redeemNFT(address _nftContAddr, uint256 idx) public {}

    function redeemCollateral(address _nftContAddr, uint256 idx) public {}
}
