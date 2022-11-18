// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

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

    enum nftStatus{ AVAILABLE, BEING_BORROWED, DELETED }
    
    NFTDetails[] nftLPList;
    mapping(address=>uint256[]) lenders;
    mapping(address=>uint256[]) borrowers;

    function getAllAvailableNFTs() public view returns(NFTDetails[] memory) {
        return nftLPList;
    }

    function getNFTDetails(uint256 _idx) public view returns(NFTDetails memory) {
        return nftLPList[_idx];
    }

    function borrowNFT(uint256 _idx) public returns(bool) {
    }

    function returnNFT(
        address _nftContAddr, uint256 idx
    ) public returns(bool){
    }

    function viewUserLentProfile(address _userAddr) public view returns(NFTDetails[] memory) {
        uint256[] memory idxs = lenders[_userAddr];
        NFTDetails[] memory result = new NFTDetails[](idxs.length);
        for(uint i; i < idxs.length; i++) {
            result[i] = nftLPList[idxs[i]];
        }
        return result;
    }

    function viewUserBorrowedProfile(address _userAddr) public view returns(NFTDetails[] memory) {
        uint256[] memory idxs = borrowers[_userAddr];
        NFTDetails[] memory result = new NFTDetails[](idxs.length);
        for(uint i; i < idxs.length; i++) {
            result[i] = nftLPList[idxs[i]];
        }
        return result;
    }

    function lendNFT(
        address _nftContAddr,
        uint256 _tokenId,
        uint256 _collFee,
        uint256 _borrowFee,
        uint256 _duration
    ) public {
        // require approve nft to this address
        require(IERC721(_nftContAddr).getApproved(_tokenId) == address(this),"nft not approved");
        IERC721(_nftContAddr).transferFrom(msg.sender, address(this), _tokenId);
        NFTDetails memory lendingNFT = NFTDetails({
            nftAddress: _nftContAddr,
            nftIdx: _tokenId,
            lender: msg.sender,
            condition: LendingConditions(_collFee, _borrowFee, _duration),
            deadline: 0,
            status: nftStatus.AVAILABLE
        });
        nftLPList.push(lendingNFT);
        lenders[msg.sender].push(nftLPList.length-1);
    }

    function redeemNFT(
        address _nftContAddr, 
        uint256 idx
    ) public {
    }

    function redeemCollateral(
        address _nftContAddr, 
        uint256 idx
    ) public {
    }
}