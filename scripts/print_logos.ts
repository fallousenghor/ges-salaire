import prisma from '../src/config/db';

async function main() {
  const entreprises = await prisma.entreprise.findMany({ select: { id: true, nom: true, logo: true } });
  console.log('Entreprises:');
  entreprises.forEach(e => {
    console.log(`${e.id} | ${e.nom} | ${e.logo}`);
  });
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
