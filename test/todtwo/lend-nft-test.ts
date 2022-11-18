import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { expect } from "chai"
import { BigNumber, Contract, ContractFactory } from "ethers"
import { ethers } from "hardhat"

describe("Lend NFT Test", function () {
  let ClarkTwo: ContractFactory, TodTwo: ContractFactory
  let clarkTwo: Contract, todTwo: Contract

  let owner: SignerWithAddress,
    lender: SignerWithAddress,
    unrelatedUser: SignerWithAddress

  before(async function () {
    ;[owner, lender, unrelatedUser] = await ethers.getSigners()

    // deploy nft
    ClarkTwo = await ethers.getContractFactory("ClarkTwo")
    clarkTwo = await ClarkTwo.connect(owner).deploy()

    await clarkTwo.deployed()

    // deploy contract
    TodTwo = await ethers.getContractFactory("TodTwo")
    todTwo = await TodTwo.connect(owner).deploy()

    await todTwo.deployed()
  })

  describe("Lend NFT", function () {
    it("Should let lender lend NFT correctly", async () => {
      // mint clarkTwo #0 to lender
      await clarkTwo.connect(owner).safeMint(lender.address) // tokenId 0
      await clarkTwo.connect(owner).safeMint(unrelatedUser.address) // tokenId 1
      await clarkTwo.connect(owner).safeMint(lender.address) //tokenId 2

      const userBalanceAfterMinted = await clarkTwo
        .connect(lender)
        .balanceOf(lender.address)
      expect(userBalanceAfterMinted).to.equal(BigNumber.from(2))

      await expect(
        clarkTwo.connect(lender).approve(todTwo.address, 1)
      ).to.be.revertedWith(
        "ERC721: approve caller is not token owner or approved for all"
      )

      await clarkTwo.connect(lender).approve(todTwo.address, 0)
      // lender call lendNFT
      await todTwo
        .connect(lender)
        .lendNFT(
          clarkTwo.address,
          0,
          ethers.utils.parseEther("1"),
          ethers.utils.parseEther("0.05"),
          3600
        )

      await clarkTwo.connect(lender).approve(todTwo.address, 2)
      // lender call lendNFT
      await todTwo
        .connect(lender)
        .lendNFT(
          clarkTwo.address,
          2,
          ethers.utils.parseEther("2"),
          ethers.utils.parseEther("0.20"),
          3600
        )

      const currentClarkTwo0OwnerAddress = await clarkTwo
        .connect(lender)
        .ownerOf(0)

      expect(currentClarkTwo0OwnerAddress).to.equal(todTwo.address)

      const currentClarkTwo2OwnerAddress = await clarkTwo
        .connect(lender)
        .ownerOf(2)

      expect(currentClarkTwo2OwnerAddress).to.equal(todTwo.address)

      const lenderProfile = await todTwo
        .connect(lender)
        .callStatic.viewUserLentProfile(lender.address)

      console.log(lenderProfile)

      expect(lenderProfile.length).to.equal(2)
    })
  })
})
