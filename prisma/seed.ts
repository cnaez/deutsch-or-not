const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // Real words
  const realWords = [
    "Schmetterling",
    "Eichhörnchen",
    "Dachgepäckträger",
    "Geschwindigkeit",
    "Hochgeschwindigkeitszug",
    "Kraftfahrzeug",
    "Wirtschaftswissenschaften",
    "Zahnärztliche",
    "Fahrkartenautomat",
    "Ergebnisorientiert",
    "Unabhängigkeitserklärung",
    "Lebensmittelunverträglichkeit",
    "Autobahnkreuz",
    "Mietspiegel",
    "Berufsausbildung",
    "Staatsschutzbehörde",
    "Verschlüsselungstechnologie",
    "Gehirnoperation",
    "Klimaanlage",
    "Krankenversicherung",
  ];

  // Fake words
  const fakeWords = [
    "Brimblon",
    "Kextralor",
    "Zibblit",
    "Fronkelix",
    "Vendralic",
    "Quomblar",
    "Lepzicor",
    "Drifomax",
    "Torglix",
    "Mivorlo",
    "Splatron",
    "Worvexil",
    "Trekblin",
    "Grombulis",
    "Flixtor",
    "Zorplin",
    "Kritivox",
    "Velcronis",
    "Blastron",
    "Nixolir",
  ];

  // Add real words to database
  for (const word of realWords) {
    await prisma.word.create({
      data: { word, isReal: true },
    });
  }

  // Add fake words to database
  for (const word of fakeWords) {
    await prisma.word.create({
      data: { word, isReal: false },
    });
  }
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
