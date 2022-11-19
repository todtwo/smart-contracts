import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { expect } from "chai"
import { Contract, ContractFactory } from "ethers"
import { ethers } from "hardhat"

describe("Borrow NFT Test", function () {
  let ClarkTwo: ContractFactory, TodTwo: ContractFactory
  let clarkTwo: Contract, todTwo: Contract

  let owner: SignerWithAddress,
    lender: SignerWithAddress,
    borrower: SignerWithAddress

  before(async function () {
    ;[owner, lender, borrower] = await ethers.getSigners()

    // deploy nft
    ClarkTwo = await ethers.getContractFactory("ClarkTwo")
    clarkTwo = await ClarkTwo.connect(owner).deploy()

    await clarkTwo.deployed()

    // deploy contract
    TodTwo = await ethers.getContractFactory("TodTwo")
    todTwo = await TodTwo.connect(owner).deploy()

    await todTwo.deployed()

    // owner mint ClarkTwo #0 to lender
    await clarkTwo.connect(owner).safeMint(lender.address) // tokenId 0

    // lender call lendNFT
    await clarkTwo.connect(lender).approve(todTwo.address, 0)
    await todTwo
      .connect(lender)
      .lendNFT(
        clarkTwo.address,
        0,
        ethers.utils.parseEther("1"),
        ethers.utils.parseEther("0.05"),
        3600
      )
  })

  describe("Borrow NFT", function () {
    it("Should let borrower borrower NFT", async () => {
      let currentClarkTwo0OwnerAddress = await clarkTwo
        .connect(lender)
        .ownerOf(0)

      expect(currentClarkTwo0OwnerAddress).to.equal(todTwo.address)

      await expect(todTwo.connect(lender).borrowNFT(1000)).to.be.reverted

      await expect(
        todTwo.connect(borrower).borrowNFT(0, {
          value: ethers.utils.parseEther("1.05"),
        })
      ).to.changeEtherBalances(
        [lender, todTwo],
        [
          ethers.utils.parseEther(((0.05 * 95) / 100).toString()),
          ethers.utils.parseEther((1.05 - (0.05 * 95) / 100).toString()),
        ]
      )

      currentClarkTwo0OwnerAddress = await clarkTwo.connect(lender).ownerOf(0)
      expect(currentClarkTwo0OwnerAddress).to.equal(borrower.address)

      const nftDetails = await todTwo.connect(borrower).getNFTDetails(0)
      console.log(nftDetails)

      expect(nftDetails.status).to.equal(1)

      const blockNumBefore = await ethers.provider.getBlockNumber()
      const blockBefore = await ethers.provider.getBlock(blockNumBefore)
      const timestampBefore = blockBefore.timestamp
      expect(nftDetails.deadline).to.equal(timestampBefore + 3600)

      const userBorrowedProfile = await todTwo
        .connect(borrower)
        .viewUserBorrowedProfile(borrower.address)
      console.log(userBorrowedProfile)
      expect(userBorrowedProfile.length).to.equal(1)
    })
  })
})
