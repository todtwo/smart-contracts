# Project Name

TodTwo - NFT Lending Platform

# Objective

Final project of Blockchain Class 2022/1

# Contracts

### 1. Mock NFT Contract

All contracts are based on ERC721 standard.

1. FahTwo
2. ClarkTwo
3. ThunTwo

### 2. Controller Contract - TodTwo

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

```c
NFTDetails[] public nftLPList; // Array of NFTDetails
mapping(address => uint256[]) public lenders; // Array of index in nftLPList that maps between address of lenders and NFT LP details
mapping(address => uint256[]) public borrowers; // Array of index in nftLPList that maps between address of borrowers and NFT LP details
```

Functions

# Deployment and Hosting

# How to run

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
