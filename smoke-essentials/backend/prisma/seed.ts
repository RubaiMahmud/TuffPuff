import { PrismaClient, ProductCategory, Role } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ---- Create Admin User ----
  const adminEmail = 'mafrubai@gmail.com';
  const adminPassword = await bcrypt.hash('admin696969', 12);

  // Also create or update the admin in Firebase Auth
  let firebaseUid = '';
  try {
    const { firebaseAdmin } = await import('../src/lib/firebase');
    let fbUser;
    try {
      fbUser = await firebaseAdmin.auth().getUserByEmail(adminEmail);
      firebaseUid = fbUser.uid;
    } catch {
      // User doesn't exist in Firebase yet, create them
      fbUser = await firebaseAdmin.auth().createUser({
        email: adminEmail,
        password: 'admin696969',
        displayName: 'Admin',
      });
      firebaseUid = fbUser.uid;
    }
    console.log(`✅ Firebase admin user ready: ${fbUser.uid}`);
  } catch (err) {
    console.log('⚠️ Firebase Admin SDK not available, skipping Firebase user creation. Create the user manually via the signup page.');
  }

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { role: Role.ADMIN, password: adminPassword, ...(firebaseUid ? { firebaseUid } : {}) },
    create: {
      name: 'Admin',
      email: adminEmail,
      phone: '+8801234567890',
      password: adminPassword,
      role: Role.ADMIN,
      ageVerified: true,
      termsAccepted: true,
      ...(firebaseUid ? { firebaseUid } : {}),
    },
  });
  console.log(`✅ Admin user created: ${admin.email}`);

  // ---- Create Test User ----
  const userPassword = await bcrypt.hash('user1234', 12);
  const testUser = await prisma.user.upsert({
    where: { email: 'john@example.com' },
    update: {},
    create: {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1987654321',
      password: userPassword,
      role: Role.USER,
      ageVerified: true,
      termsAccepted: true,
    },
  });
  console.log(`✅ Test user created: ${testUser.email}`);

  // ---- Seed Products ----
  const products = [
    // Cigarettes
    {
      name: 'Marlboro Red',
      brand: 'Marlboro',
      category: ProductCategory.CIGARETTES,
      description: 'Full-flavored cigarettes with a bold, rich taste. Classic red pack.',
      price: 12.99,
      stock: 200,
      image: '/images/products/marlboro-red.jpg',
      packSize: '20 cigarettes',
    },
    {
      name: 'Marlboro Gold',
      brand: 'Marlboro',
      category: ProductCategory.CIGARETTES,
      description: 'Smooth, lighter taste with a refined gold blend.',
      price: 13.49,
      stock: 180,
      image: '/images/products/marlboro-gold.jpg',
      packSize: '20 cigarettes',
    },
    {
      name: 'Camel Blue',
      brand: 'Camel',
      category: ProductCategory.CIGARETTES,
      description: 'Smooth and mellow blend with a distinctive taste.',
      price: 11.99,
      stock: 150,
      image: '/images/products/camel-blue.jpg',
      packSize: '20 cigarettes',
    },
    {
      name: 'Lucky Strike Original',
      brand: 'Lucky Strike',
      category: ProductCategory.CIGARETTES,
      description: 'Classic American blend tobacco with toasted flavor.',
      price: 10.99,
      stock: 120,
      image: '/images/products/lucky-strike.jpg',
      packSize: '20 cigarettes',
    },
    {
      name: 'Winston Classic',
      brand: 'Winston',
      category: ProductCategory.CIGARETTES,
      description: 'Premium full-flavored blend with rich tobacco taste.',
      price: 11.49,
      stock: 160,
      image: '/images/products/winston-classic.jpg',
      packSize: '20 cigarettes',
    },
    // Lighters
    {
      name: 'Zippo Classic Chrome',
      brand: 'Zippo',
      category: ProductCategory.LIGHTERS,
      description: 'Iconic windproof lighter with polished chrome finish.',
      price: 29.99,
      stock: 80,
      image: '/images/products/zippo-chrome.jpg',
      packSize: '1 lighter',
    },
    {
      name: 'BIC Classic Lighter 5-Pack',
      brand: 'BIC',
      category: ProductCategory.LIGHTERS,
      description: 'Reliable everyday lighters in assorted colors.',
      price: 7.99,
      stock: 300,
      image: '/images/products/bic-5pack.jpg',
      packSize: '5 lighters',
    },
    // Rolling Papers
    {
      name: 'RAW Classic King Size',
      brand: 'RAW',
      category: ProductCategory.ROLLING_PAPERS,
      description: 'Unbleached, natural rolling papers. Slim king size.',
      price: 3.99,
      stock: 250,
      image: '/images/products/raw-classic.jpg',
      packSize: '32 papers',
    },
    {
      name: 'OCB Premium Slim',
      brand: 'OCB',
      category: ProductCategory.ROLLING_PAPERS,
      description: 'Ultra-thin premium rolling papers for a smooth experience.',
      price: 2.99,
      stock: 200,
      image: '/images/products/ocb-slim.jpg',
      packSize: '32 papers',
    },
    // Beverages
    {
      name: 'Red Bull Energy Drink',
      brand: 'Red Bull',
      category: ProductCategory.BEVERAGES,
      description: 'Classic energy drink to keep you going.',
      price: 3.49,
      stock: 400,
      image: '/images/products/redbull.jpg',
      packSize: '250ml',
    },
    {
      name: 'Monster Energy Original',
      brand: 'Monster',
      category: ProductCategory.BEVERAGES,
      description: 'Bold and powerful energy drink with iconic green claw.',
      price: 3.99,
      stock: 350,
      image: '/images/products/monster.jpg',
      packSize: '500ml',
    },
    // Snacks
    {
      name: 'Lay\'s Classic Chips',
      brand: 'Lay\'s',
      category: ProductCategory.SNACKS,
      description: 'Classic salted potato chips, perfectly crispy.',
      price: 4.49,
      stock: 200,
      image: '/images/products/lays-classic.jpg',
      packSize: '170g',
    },
    {
      name: 'Snickers Bar',
      brand: 'Mars',
      category: ProductCategory.SNACKS,
      description: 'Packed with roasted peanuts, caramel, and nougat coated in chocolate.',
      price: 1.99,
      stock: 500,
      image: '/images/products/snickers.jpg',
      packSize: '52g',
    },
    // Condoms
    {
      name: 'Durex Extra Sensitive',
      brand: 'Durex',
      category: ProductCategory.CONDOMS,
      description: 'Ultra fine lubricated latex condoms for heightened sensitivity.',
      price: 6.99,
      stock: 150,
      image: '/images/products/durex-sensitive.jpg',
      packSize: '3 condoms',
    },
    {
      name: 'Trojan ENZ Lubricated',
      brand: 'Trojan',
      category: ProductCategory.CONDOMS,
      description: 'Classic trusted protection. Premium quality latex.',
      price: 5.99,
      stock: 200,
      image: '/images/products/trojan-enz.jpg',
      packSize: '3 condoms',
    },
    // Essentials
    {
      name: 'Orbit Spearmint Gum',
      brand: 'Orbit',
      category: ProductCategory.ESSENTIALS,
      description: 'Sugar-free spearmint chewing gum for fresh breath.',
      price: 2.49,
      stock: 300,
      image: '/images/products/orbit-gum.jpg',
      packSize: '14 pieces',
    },
    {
      name: 'Kleenex Pocket Tissues',
      brand: 'Kleenex',
      category: ProductCategory.ESSENTIALS,
      description: 'Soft, strong 3-ply tissues for on-the-go comfort.',
      price: 1.99,
      stock: 400,
      image: '/images/products/kleenex.jpg',
      packSize: '10 tissues',
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { id: product.name.toLowerCase().replace(/[^a-z0-9]/g, '-') },
      update: product,
      create: {
        ...product,
        id: product.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      },
    });
  }
  console.log(`✅ ${products.length} products seeded`);

  // ---- Create Address for Test User ----
  await prisma.address.upsert({
    where: { id: 'test-address-1' },
    update: {},
    create: {
      id: 'test-address-1',
      userId: testUser.id,
      label: 'Home',
      fullAddress: '123 Main Street, New York, NY 10001',
      lat: 40.7128,
      lng: -74.006,
      isDefault: true,
    },
  });
  console.log('✅ Test address created');

  console.log('🎉 Seeding complete!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
