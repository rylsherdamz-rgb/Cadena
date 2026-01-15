import { ethers } from "hardhat";

async function main() {
  const Election = await ethers.getContractFactory("Election");

  const names = [
    "Bong Go",
    "Bam Aquino",
    "Bato Dela Rosa",
    "Erwin Tulfo",
    "Kiko Pangilinan",
    "Rodante Marcoleta",
    "Ping Lacson",
    "Tito Sotto III",
    "Pia Cayetano",
    "Camille Villar",
    "Lito Lapid",
    "Imee Marcos",
    "Benhur Abalos",
    "Ben Bitag Tulfo",
    "Ramon Bong Revilla Jr.",
    "Abby Binay",
    "Manny Pacquiao",
    "Phillip Salvador",
    "Jerome Adonis",
    "Nars Alyn Andamo",
    "Wilson Amad",

    "4PS Partylist",
    "Kabataan Partylist",
    "Duterte Youth Partylist",
    "PBBM Partylist",
    "1-Rider Partylist",
    "United Senior Citizens Partylist",
    "ACT Teachers Partylist",
    "Gabriela Partylist",
    "Magdalo Partylist",
    "Akbayan Partylist"
  ];

  const parties = [
    // Senate parties
    "PDPLBN",
    "KNP",
    "PDPLBN",
    "LAKAS",
    "LP",
    "IND",
    "IND",
    "NPC",
    "NP",
    "NP",
    "NPC",
    "NP",
    "PFP",
    "IND",
    "LAKAS",
    "NPC",
    "PFP",
    "PDPLBN",
    "MKBYN",
    "MKBYN",
    "IND",

    // Party-list ballot names
    "4PS",
    "Kabataan",
    "Duterte Youth",
    "PBBM",
    "1-RIDER",
    "United Senior Citizens",
    "ACT Teachers",
    "Gabriela",
    "Magdalo",
    "Akbayan"
  ];

  const positions = [
    2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,

    3,3,3,3,3,3,3,3,3,3
  ];

  const election = await Election.deploy(names, parties, positions);
  await election.waitForDeployment();

  console.log("Election deployed at:", await election.getAddress());
}

main().catch(console.error);
