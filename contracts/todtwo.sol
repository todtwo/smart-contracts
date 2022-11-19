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
    NFTDetails[] public nftLPList;
    mapping(address => uint256[]) public lenders;
    mapping(address => uint256[]) public borrowers;

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

    function borrowNFT(uint256 _idx) public payable returns (bool) {
        // check if nft status is AVAILABLE, else return not available
        require(
            nftLPList[_idx].status == nftStatus.AVAILABLE,
            "NFT unavailable"
        );
        // check if borrower has enough ETH balance, else return insufficient funds

        require(
            msg.value >=
                nftLPList[_idx].condition.collateralFee +
                    nftLPList[_idx].condition.borrowFee,
            "Insufficient funds"
        );

        // transfer 95% of borrowfee to lender
        _safeTransferETH(
            nftLPList[_idx].lender,
            (95 * nftLPList[_idx].condition.borrowFee) / 100
        );

        // update nft status to BEING_BORROWED
        nftLPList[_idx].status = nftStatus.BEING_BORROWED;

        // update deadline to block.timestamp  + lending duration
        nftLPList[_idx].deadline =
            block.timestamp +
            nftLPList[_idx].condition.lendingDuration;

        // update borrowers[msg.sender]
        borrowers[msg.sender].push(_idx);

        // transfer NFT to borrower
        IERC721(nftLPList[_idx].nftAddress).safeTransferFrom(
            address(this),
            msg.sender,
            nftLPList[_idx].nftTokenId
        );

        return true;
    }

    function returnNFT(address _nftContAddr, uint256 _tokenId)
        public
        returns (bool)
    {
        // check if tobereturned nft is approved to this address, else return not approved yet
        require(
            IERC721(_nftContAddr).getApproved(_tokenId) == address(this),
            "nft not approved"
        );

        // check isExist, else return not found
        bool isFound = false;
        uint256 nftDetailIdx;
        uint256 toBeRemovedIdx;
        uint256[] memory borrowerIdx = borrowers[msg.sender];
        for (uint256 i = 0; i < borrowerIdx.length; i++) {
            // console.log(lenderIdx[i]);
            NFTDetails memory nftDetails = nftLPList[borrowerIdx[i]];
            // isExist
            // console.log(nftDetails.nftAddress);
            // console.log(_nftContAddr);
            // console.log(nftDetails.nftTokenId);
            // console.log(_tokenId);
            if (
                nftDetails.nftAddress == _nftContAddr &&
                nftDetails.nftTokenId == _tokenId
            ) {
                isFound = true;
                nftDetailIdx = borrowerIdx[i];
                toBeRemovedIdx = i;
                break;
            }
        }
        require(isFound, "NFT Not found");

        // check if block.timestamp < deadline, else return too late
        require(
            block.timestamp < nftLPList[nftDetailIdx].deadline,
            "Too late to return this NFT"
        );

        // update nft status to AVAILABLE
        nftLPList[nftDetailIdx].status = nftStatus.AVAILABLE;

        // update deadline to 0
        nftLPList[nftDetailIdx].deadline = 0;

        // call removebyshifting at borrowers[msg.sender] by finding
        _removeByShifting(toBeRemovedIdx, borrowers[msg.sender]);

        // transfer nft to contract
        IERC721(_nftContAddr).transferFrom(msg.sender, address(this), _tokenId);

        // transfer nft collateral to msg.sender
        _safeTransferETH(
            msg.sender,
            nftLPList[nftDetailIdx].condition.collateralFee
        );

        // return true if successful
        return true;
    }

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
        uint256 toBeRemovedIdx;
        uint256[] memory lenderIdx = lenders[msg.sender];
        for (uint256 i = 0; i < lenderIdx.length; i++) {
            // console.log(lenderIdx[i]);
            NFTDetails memory nftDetails = nftLPList[lenderIdx[i]];
            // isExist
            // console.log(nftDetails.nftAddress);
            // console.log(_nftContAddr);
            // console.log(nftDetails.nftTokenId);
            // console.log(_tokenId);
            if (
                nftDetails.nftAddress == _nftContAddr &&
                nftDetails.nftTokenId == _tokenId
            ) {
                isFound = true;
                nftDetailIdx = lenderIdx[i];
                toBeRemovedIdx = i;
                break;
            }
        }
        require(isFound, "NFT Not found");

        // check whether that nft is in AVAILABLE state, else return cannot redeem
        require(
            nftLPList[nftDetailIdx].status == nftStatus.AVAILABLE,
            "Cannot redeem the current NFT now."
        );

        // transfer that nft to owner
        IERC721(_nftContAddr).safeTransferFrom(
            address(this),
            msg.sender,
            _tokenId
        );

        // update status to deleted
        nftLPList[nftDetailIdx].status = nftStatus.DELETED;

        // call removebyshifting at lenders[msg.sender]
        _removeByShifting(toBeRemovedIdx, lenders[msg.sender]);
    }

    function redeemCollateral(address _nftContAddr, uint256 idx) public {}

    // private functions
    function _removeByShifting(uint256 _index, uint256[] storage arr) private {
        require(_index < arr.length, "index out of bound");

        for (uint256 i = _index; i < arr.length - 1; i++) {
            arr[i] = arr[i + 1];
        }
        arr.pop();
    }

    function _safeTransferETH(address to, uint256 value) internal {
        (bool success, ) = to.call{value: value}(new bytes(0));
        require(success, "ETH transfer failed");
    }

    receive() external payable {}
}
