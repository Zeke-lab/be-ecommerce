const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkProducts() {
  try {
    console.log('Checking products in database...\n');
    
    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        price: true,
        qty: true,
      },
      take: 10,
    });
    
    console.log(`Found ${products.length} products:\n`);
    products.forEach(p => {
      console.log(`ID: ${p.id}, Name: ${p.name}, Price: $${p.price}, Stock: ${p.qty}`);
    });
    
    const totalProducts = await prisma.product.count();
    console.log(`\nTotal products in database: ${totalProducts}`);
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkProducts();
