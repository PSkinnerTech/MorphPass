const hre = require("hardhat");

const tokens = (n) => {
  return ethers.parseUnits(n.toString(), "ether");
};

async function main() {
  const [creator] = await ethers.getSigners();
  const NAME = "MorphPass";
  const SYMBOL = "MP";

  console.log("Deploying MorphPass contract...");
  const MorphPass = await ethers.getContractFactory("MorphPass");
  const morphPass = await MorphPass.deploy(NAME, SYMBOL);

  console.log("Waiting for deployment...");
  await morphPass.waitForDeployment();

  console.log(`Deployed MorphPass Contract at: ${await morphPass.getAddress()}\n`);

  const instances = [
    {
      name: "Morphin Time Token2049",
      cost: tokens(3),
      tickets: 100,
      time: "6:00PM SGT",
      date: "Sept 18th, 2024",
      location: "Singapore",
    },
    {
      name: "AniMorphs Devcon",
      cost: tokens(1),
      tickets: 125,
      time: "1:00PM ICT",
      date: "Nov 11th, 2024",
      location: "Bangkok, Thailand",
    },
    {
      name: "Koalify - The MorphL2 Hackathon",
      cost: tokens(0.25),
      tickets: 200,
      time: "10:00AM EST",
      date: "Jan 15th, 2025",
      location: "Online",
    },
    {
      name: "How to Build a Consumer dApp on MorphL2",
      cost: tokens(5),
      tickets: 100,
      time: "2:30PM CST",
      date: "Feb 1st, 2025",
      location: "Online",
    },
    {
      name: "Koality Time with MorphL2 - ETHDenver",
      cost: tokens(1.5),
      tickets: 125,
      date: "March 1st, 2025",
      time: "11:00AM EST",
      location: "Denver, Colorado",
    },
  ];

  for (let i = 0; i < instances.length; i++) {
    const transaction = await morphPass.list(
      instances[i].name,
      instances[i].cost,
      instances[i].tickets,
      instances[i].time,
      instances[i].date,
      instances[i].location
    );

    await transaction.wait();

    console.log(`Listed Event ${i + 1}: ${instances[i].name}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});