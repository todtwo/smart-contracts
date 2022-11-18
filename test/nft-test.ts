import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { expect } from "chai"
import { BigNumber, Contract, ContractFactory } from "ethers"
import { ethers } from "hardhat"

describe("Mock NFT Contract Test", function () {
  let ClarkTwo: ContractFactory
  let clarkTwo: Contract

  let owner: SignerWithAddress, user: SignerWithAddress

  before(async function () {
    ;[owner, user] = await ethers.getSigners()

    ClarkTwo = await ethers.getContractFactory("ClarkTwo")
    clarkTwo = await ClarkTwo.connect(owner).deploy()

    await clarkTwo.deployed()
  })

  describe("Mint NFT", function () {
    it("Should let contract owner mint NFT to user", async function () {
      const userBalanceBeforeMinted = await clarkTwo
        .connect(user)
        .balanceOf(user.address)
      expect(userBalanceBeforeMinted).to.equal(BigNumber.from(0))

      await clarkTwo.connect(owner).safeMint(user.address)

      const userBalanceAfterMinted = await clarkTwo
        .connect(user)
        .balanceOf(user.address)
      expect(userBalanceAfterMinted).to.equal(BigNumber.from(1))
    })

    it("Should not be able to mint when all NFTs had been minted", async function () {
      for (let i = 0; i < 2; i++) {
        await clarkTwo.connect(owner).safeMint(user.address)
      }

      const userBalanceAfterMinted = await clarkTwo
        .connect(user)
        .balanceOf(user.address)
      expect(userBalanceAfterMinted).to.equal(BigNumber.from(3))

      await expect(
        clarkTwo.connect(owner).safeMint(user.address)
      ).to.be.revertedWith("All NFT had been minted")
    })
  })
})
