import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { expect } from "chai"
import { Contract, ContractFactory } from "ethers"
import { ethers } from "hardhat"

describe("Redeem NFT Test", function () {
  let ClarkTwo: ContractFactory, TodTwo: ContractFactory
  let clarkTwo: Contract, todTwo: Contract

  let owner: SignerWithAddress,
    lender: SignerWithAddress,
    lender2: SignerWithAddress

  before(async function () {
    ;[owner, lender, lender2] = await ethers.getSigners()

    // deploy nft
    ClarkTwo = await ethers.getContractFactory("ClarkTwo")
    clarkTwo = await ClarkTwo.connect(owner).deploy()

    await clarkTwo.deployed()

    // deploy contract
    TodTwo = await ethers.getContractFactory("TodTwo")
    todTwo = await TodTwo.connect(owner).deploy()

    await todTwo.deployed()
  })

  describe("Redeem NFT", function () {
    it("Should let lender redeem NFT correctly", async () => {
      // mint clarkTwo #0 to lender
      await clarkTwo.connect(owner).safeMint(lender.address) // tokenId 0
      await clarkTwo.connect(owner).safeMint(lender2.address) // tokenId 1
      await clarkTwo.connect(owner).safeMint(lender.address) // tokenId 2

      // lender lend their NFTs
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

      let currentClarkTwo0OwnerAddress
      currentClarkTwo0OwnerAddress = await clarkTwo.connect(lender).ownerOf(0)

      expect(currentClarkTwo0OwnerAddress).to.equal(todTwo.address)

      await clarkTwo.connect(lender).approve(todTwo.address, 2)
      await todTwo
        .connect(lender)
        .lendNFT(
          clarkTwo.address,
          2,
          ethers.utils.parseEther("1"),
          ethers.utils.parseEther("0.05"),
          3600
        )

      let currentClarkTwo2OwnerAddress
      currentClarkTwo2OwnerAddress = await clarkTwo.connect(lender).ownerOf(2)

      expect(currentClarkTwo2OwnerAddress).to.equal(todTwo.address)

      // lender2 lend their NFT
      await clarkTwo.connect(lender2).approve(todTwo.address, 1)
      await todTwo
        .connect(lender2)
        .lendNFT(
          clarkTwo.address,
          1,
          ethers.utils.parseEther("2"),
          ethers.utils.parseEther("0.1"),
          3600
        )

      const currentClarkTwo1OwnerAddress = await clarkTwo
        .connect(lender)
        .ownerOf(1)

      expect(currentClarkTwo1OwnerAddress).to.equal(todTwo.address)

      await expect(
        todTwo.connect(lender).redeemNFT(clarkTwo.address, 1000)
      ).to.be.revertedWith("NFT Not found")

      // not the owner of that nft because no data about that nft
      await expect(
        todTwo.connect(lender).redeemNFT(clarkTwo.address, 1)
      ).to.be.revertedWith("NFT Not found")

      await todTwo.connect(lender).redeemNFT(clarkTwo.address, 0)

      currentClarkTwo0OwnerAddress = await clarkTwo.connect(lender).ownerOf(0)
      expect(currentClarkTwo0OwnerAddress).to.equal(lender.address)

      const lenderProfile = await todTwo
        .connect(lender)
        .viewUserLentProfile(lender.address)
      expect(lenderProfile.length).to.equal(1)

      const nftLPList_0 = await todTwo.connect(lender).nftLPList(0)
      expect(nftLPList_0.status).to.equal(2) // DELETED

      const nftLPList_1 = await todTwo.connect(lender).nftLPList(1)
      expect(nftLPList_1.status).to.equal(0) // AVAILABLE
    })
  })
})
