import { ethers } from "hardhat"

async function main() {
  const owner = new ethers.Wallet(
    <string>process.env.PRIVATE_KEY,
    ethers.provider
  )
  const TodTwo = await ethers.getContractFactory("TodTwo")
  const todTwo = await TodTwo.connect(owner).deploy()

  await todTwo.deployed()

  console.log(`TodTwo deployed at ${todTwo.address}`)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
