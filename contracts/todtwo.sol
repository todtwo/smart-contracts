// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

struct LendingConditions {
    uint256 collateralFee;
    uint256 borrowFee;
    uint256 lendingDuration;
}

struct NFTDetails {
    address nftAddress;
    uint256 nftTokenId;
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

contract TodTwo {
    NFTDetails[] nftLPList;
    mapping(address => uint256[]) lenders;
    mapping(address => uint256[]) borrowers;

    constructor() {}

    function getAllAvailableNFTs() public view returns (NFTDetails[] memory) {
        return nftLPList;
    }

    function getNFTDetails(uint256 _idx)
        public
        view
        returns (NFTDetails memory)
    {
        return nftLPList[_idx];
    }

    function borrowNFT(uint256 _idx) public returns (bool) {}

    function returnNFT(address _nftContAddr, uint256 idx)
        public
        returns (bool)
    {}

    function viewUserLentProfile(address _userAddr)
        public
        view
        returns (NFTDetails[] memory)
    {
        uint256[] memory idxs = lenders[_userAddr];
        NFTDetails[] memory result = new NFTDetails[](idxs.length);
        for (uint256 i; i < idxs.length; i++) {
            result[i] = nftLPList[idxs[i]];
        }
        return result;
    }

    function viewUserBorrowedProfile(address _userAddr)
        public
        view
        returns (NFTDetails[] memory)
    {
        uint256[] memory idxs = borrowers[_userAddr];
        NFTDetails[] memory result = new NFTDetails[](idxs.length);
        for (uint256 i; i < idxs.length; i++) {
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
        require(
            IERC721(_nftContAddr).getApproved(_tokenId) == address(this),
            "nft not approved"
        );

        IERC721(_nftContAddr).transferFrom(msg.sender, address(this), _tokenId);

        NFTDetails memory lendingNFT = NFTDetails({
            nftAddress: _nftContAddr,
            nftTokenId: _tokenId,
            lender: msg.sender,
            condition: LendingConditions(_collFee, _borrowFee, _duration),
            deadline: 0,
            status: nftStatus.AVAILABLE
        });
        nftLPList.push(lendingNFT);
        lenders[msg.sender].push(nftLPList.length - 1);
    }

    function redeemNFT(address _nftContAddr, uint256 _tokenId) public {
        // check isExist, else return not found
        bool isFound = false;
        uint256 nftDetailIdx;
        uint256[] memory lenderIdx = lenders[msg.sender];
        for (uint256 i = 0; i < lenderIdx.length; i++) {
            console.log(lenderIdx[i]);
            NFTDetails memory nftDetails = nftLPList[lenderIdx[i]];
            // isExist
            if (
                nftDetails.nftAddress == _nftContAddr &&
                nftDetails.nftTokenId == _tokenId
            ) {
                isFound = true;
                nftDetailIdx = lenderIdx[i];
                break;
            }
        }
        require(isFound, "NFT Not found");

        // check whether that nft is in AVAILABLE state, else return cannot redeem
        // check whether msg.sender is the owner, else return not owner
        // transfer that nft to owner
        // update status to deleted
        // call removebyshifting at lenders[msg.sender]
    }

    function redeemCollateral(address _nftContAddr, uint256 idx) public {}

    function _removeByShifting(uint256 _index, uint256[] storage arr) private {
        require(_index < arr.length, "index out of bound");

        for (uint256 i = _index; i < arr.length - 1; i++) {
            arr[i] = arr[i + 1];
        }
        arr.pop();
    }
}
