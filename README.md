# Project Name

TodTwo - NFT Lending Platform

# Objective

Final project of Blockchain Class 2022/1

# Contracts

## 1. Mock NFT Contract

All contracts are based on ERC721 standard.

1. FahTwo
2. ClarkTwo
3. ThunTwo

## 2. Controller Contract - TodTwo

Structs

```c
struct LendingConditions {
    uint256 collateralFee; // NFT Collateral Fee (wei)
    uint256 borrowFee; // NFT Borrow Fee (wei)
    uint256 lendingDuration; // Lending Duration (seconds)
}
```

```c
struct NFTDetails {
    address nftAddress; // Address of NFT contract
    uint256 nftTokenId; // Token Id of NFT
    address lender; // Lender of NFT
    LendingConditions condition; // Conditions (see LendingConditions struct)
    uint256 deadline; // Deadline in seconds (UNIX)
    nftStatus status; // NFT LP Status (see enum NFTStatus)
}
```

Enumerators

```c
enum nftStatus {
    AVAILABLE, // This NFT is available and can be borrowed.
    BEING_BORROWED, // This NFT is being borrowed by someone and hasn't been returned.
    DELETED // This NFT is either redeemed by Owner (Remove LP) or the owner had redeemed collateral if exceeds the deadline.
}
```

Fields

```ts
NFTDetails[] public nftLPList; // Array of NFTDetails
mapping(address => uint256[]) public lenders; // Array of index in nftLPList that maps between address of lenders and NFT LP details
mapping(address => uint256[]) public borrowers; // Array of index in nftLPList that maps between address of borrowers and NFT LP details
```

Functions

```ts
 /**
  * @notice Get All NFT LP Details
  */
function getAllAvailableNFTs() public view returns (NFTDetails[] memory)
```

```ts
/**
  * @notice Get NFT LP Details by idx
  * @param _idx The index of nftLPList
  * @return NFTDetail of the coresponded NFT
  */
function getNFTDetails(uint256 _idx) public view returns (NFTDetails memory)
```

```ts
/**
  * @notice Borrow NFT
  * @param _idx The index of nftLPList
  * @return true if success
  */
function borrowNFT(uint256 _idx) public payable returns (bool)
```

```ts
/**
  * @notice Return NFT
  * @param _nftContAddr NFT's contract address
  * @param _tokenId NFT's token id
  * @return true if success
  */
function returnNFT(address _nftContAddr, uint256 _tokenId) public returns (bool)
```

```ts
/**
  * @notice View user lent profile
  * @param _userAddr User's Address
  * @return Array of NFTDetails of related NFTs
  */
 function viewUserLentProfile(address _userAddr) public view returns (NFTDetails[] memory)
```

```ts
/**
  * @notice View user borrowed profile
  * @param _userAddr User's Address
  * @return Array of NFTDetails of related NFTs
  */
function viewUserBorrowedProfile(address _userAddr) public view returns (NFTDetails[] memory)
```

```ts
/**
  * @notice Provide NFT LP
  * @param _nftContAddr NFT's contract address
  * @param _tokenId NFT's token id
  * @param _collFee Collateral Fee
  * @param _borrowFee BorrowFee
  * @param _duration Lending Duration
  */
function lendNFT(address _nftContAddr, uint256 _tokenId, uint256 _collFee, uint256 _borrowFee, uint256 _duration) public
```

```ts
/**
  * @notice Redeem NFT from cotroller contract
  * @param _nftContAddr NFT's contract address
  * @param _tokenId NFT's token id
  * @return true if successful
  */
function redeemNFT(address _nftContAddr, uint256 _tokenId) public returns (bool)
```

```ts
/**
  * @notice Redeem NFT's collateral if exceeds deadline
  * @param _nftContAddr NFT's contract address
  * @param _tokenId NFT's token id
  * @return true if successful
  */
function redeemCollateral(address _nftContAddr, uint256 _tokenId) public returns (bool)
```

# Deployment and Hosting

All contracts were deployed to Ethereum Goerli Testnet with the following addresses:

1. FahTwo: `0x13502Ea6F6D14f00025a3AdDe02BFf050be24532`
2. ClarkTwo:
   `0xFA6b6B5Eb53F951Bc4CfC607DbeC230DDE638eD5`
3. ThunTwo:
   `0x40e3b499A062153158C90572f378132Bab6AB07B`
4. TodTwo:
   `0x81b69493Da8c5F6aE84e9c574044c4a241688FCa`

IPFS Hosting CID for NFT Metadata and Images:

1. FahTwo

   - Metadata: `QmRAF5XqH7sbHHnqQWh2tCPraxuw8eRPty9kmJkL2Rabj5`
   - Images: `QmedCditeBrwQfJ5F3yV72rd7yuqVpD87ieYQ94tGb1hQD`

2. ClarkTwo

   - Metadata: `QmWmE4SXUdAd2xRmmM6ke8Qx2Q5cxGgkxHbv7RC3xr9twH`
   - Images: `QmdUcBhhwWESRMtfWEpycnJBZBxQPTooCxLVFvmuqTBTDn`

3. ThunTwo
   - Metadata: `QmeyuTWxvrWNsQi6CJGrrTLGpkHna86MeuFL3s8Bzy9Noo`
   - Images: `QmWUwXcYctHTpqjHZKKKXF6KyxQdoMxtak8SWFhW2TmSuS`

# Environment Setup

Please setup the following environment variables in .env file (See .env.template)

```ts
ETH_MAINNET_ALCHEMY_URL="https://eth-mainnet.alchemyapi.io/v2/<key>"
ETH_GOERLI_ALCHEMY_URL="https://eth-goerli.alchemyapi.io/v2/<key>"
PRIVATE_KEY=<string>
ETHERSCAN_API_KEY=<string>
```

See section Sample Hardhat Project

# How to run

See section Sample Hardhat Project

# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.ts
```
