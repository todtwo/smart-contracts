import { ethers } from "hardhat"

async function main() {
  const owner = new ethers.Wallet(
    <string>process.env.PRIVATE_KEY,
    ethers.provider
  )
  const ClarkTwo = await ethers.getContractFactory("ClarkTwo")
  const clarkTwo = await ClarkTwo.connect(owner).deploy()

  await clarkTwo.deployed()

  const FahTwo = await ethers.getContractFactory("FahTwo")
  const fahTwo = await FahTwo.connect(owner).deploy()

  await fahTwo.deployed()

  const ThunTwo = await ethers.getContractFactory("ThunTwo")
  const thunTwo = await ThunTwo.connect(owner).deploy()

  await thunTwo.deployed()

  console.log(`ClarkTwo deployed at ${clarkTwo.address}`)
  console.log(`FahTwo deployed at ${fahTwo.address}`)
  console.log(`ThunTwo deployed at ${thunTwo.address}`)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
