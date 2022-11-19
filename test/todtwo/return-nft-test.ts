import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { expect } from "chai"
import { Contract, ContractFactory } from "ethers"
import { ethers } from "hardhat"

describe("Return NFT Test", function () {
  let ClarkTwo: ContractFactory, TodTwo: ContractFactory
  let clarkTwo: Contract, todTwo: Contract

  let owner: SignerWithAddress,
    lender: SignerWithAddress,
    borrower: SignerWithAddress,
    borrower2: SignerWithAddress

  before(async function () {
    ;[owner, lender, borrower, borrower2] = await ethers.getSigners()

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
    await clarkTwo.connect(owner).safeMint(lender.address) // tokenId 1

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

    // lender call lendNFT
    await clarkTwo.connect(lender).approve(todTwo.address, 1)
    await todTwo
      .connect(lender)
      .lendNFT(
        clarkTwo.address,
        1,
        ethers.utils.parseEther("2"),
        ethers.utils.parseEther("0.1"),
        2
      )

    // borrower call borrowNFT
    await todTwo.connect(borrower).borrowNFT(0, {
      value: ethers.utils.parseEther("1.05"),
    })

    // borrower2 call borrowNFT
    await todTwo.connect(borrower2).borrowNFT(1, {
      value: ethers.utils.parseEther("2.10"),
    })
  })

  describe("Return NFT", function () {
    it("Should let borrower return NFT", async () => {
      let currentClarkTwo0OwnerAddress = await clarkTwo
        .connect(borrower)
        .ownerOf(0)

      expect(currentClarkTwo0OwnerAddress).to.equal(borrower.address)

      // return without borrower's approval
      await expect(
        todTwo.connect(borrower).returnNFT(clarkTwo.address, 0)
      ).to.be.revertedWith("nft not approved")

      await clarkTwo.connect(borrower).approve(todTwo.address, 0)
      await expect(
        todTwo.connect(borrower).returnNFT(clarkTwo.address, 0)
      ).to.changeEtherBalances(
        [borrower, todTwo],
        [ethers.utils.parseEther("1"), ethers.utils.parseEther("-1")]
      )

      currentClarkTwo0OwnerAddress = await clarkTwo.connect(borrower).ownerOf(0)
      expect(currentClarkTwo0OwnerAddress).to.equal(todTwo.address)

      const nftDetails = await todTwo.connect(borrower).getNFTDetails(0)

      expect(nftDetails.status).to.equal(0) // AVAILABLE
      expect(nftDetails.deadline).to.equal(0)

      const userBorrowedProfile = await todTwo
        .connect(borrower)
        .viewUserBorrowedProfile(borrower.address)

      expect(userBorrowedProfile.length).to.equal(0)

      // late return
      await new Promise((r) => setTimeout(r, 4000))
      await clarkTwo.connect(borrower2).approve(todTwo.address, 1)
      await expect(
        todTwo.connect(borrower2).returnNFT(clarkTwo.address, 1)
      ).to.be.revertedWith("Too late to return this NFT")
    })
  })
})
