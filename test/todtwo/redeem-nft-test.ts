import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { expect } from "chai"
import { Contract, ContractFactory } from "ethers"
import { ethers } from "hardhat"

describe("Redeem NFT Test", function () {
  let ClarkTwo: ContractFactory, TodTwo: ContractFactory
  let clarkTwo: Contract, todTwo: Contract

  let owner: SignerWithAddress, lender: SignerWithAddress

  before(async function () {
    ;[owner, lender] = await ethers.getSigners()

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

      const currentClarkTwo0OwnerAddress = await clarkTwo
        .connect(lender)
        .ownerOf(0)

      expect(currentClarkTwo0OwnerAddress).to.equal(todTwo.address)
    })
  })
})
