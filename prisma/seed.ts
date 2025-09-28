import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const products = [
  {
    id: '1',
    name: 'Premium Organic Jaggery',
    description: 'Pure organic jaggery made from sugarcane juice, rich in iron and minerals. Perfect for daily consumption and traditional recipes.',
    price: 15000,
    originalPrice: 17500,
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop&crop=center',
    category: 'Organic Jaggery',
    rating: 4.8,
    reviews: 124,
    inStock: true,
    weight: '500g',
    ingredients: ['Organic Sugarcane Juice'],
    benefits: ['Rich in Iron', 'Natural Sweetener', 'Boosts Immunity', 'Digestive Health'],
    isFeatured: true
  },
  {
    id: '2',
    name: 'Palm Jaggery - Traditional',
    description: 'Authentic palm jaggery with a unique flavor profile. Made using traditional methods passed down through generations.',
    price: 20000,
    image: 'https://images.unsplash.com/photo-1609501676725-7186f3a0b0c0?w=300&h=300&fit=crop&crop=center',
    category: 'Palm Jaggery',
    rating: 4.9,
    reviews: 89,
    inStock: true,
    weight: '500g',
    ingredients: ['Palm Sap', 'Natural Preservatives'],
    benefits: ['Low Glycemic Index', 'Rich in Antioxidants', 'Natural Energy', 'Bone Health'],
    isFeatured: true
  },
  {
    id: '3',
    name: 'Jaggery Powder - Fine Grade',
    description: 'Finely ground jaggery powder perfect for baking, beverages, and cooking. Easy to dissolve and use.',
    price: 10000,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&h=300&fit=crop&crop=center',
    category: 'Jaggery Powder',
    rating: 4.7,
    reviews: 156,
    inStock: true,
    weight: '250g',
    ingredients: ['Pure Jaggery'],
    benefits: ['Easy to Use', 'Quick Dissolving', 'Versatile', 'Natural Sweetness'],
    isFeatured: false
  },
  {
    id: '4',
    name: 'Traditional Jaggery Ladoo',
    description: 'Delicious jaggery ladoos made with pure jaggery, ghee, and nuts. A perfect traditional sweet for festivals.',
    price: 22500,
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7b1b4b?w=300&h=300&fit=crop&crop=center',
    category: 'Traditional Sweets',
    rating: 4.9,
    reviews: 67,
    inStock: true,
    weight: '12 pieces',
    ingredients: ['Jaggery', 'Ghee', 'Nuts', 'Cardamom'],
    benefits: ['Traditional Recipe', 'Rich in Nutrients', 'Festival Favorite', 'Energy Booster'],
    isFeatured: true
  },
  {
    id: '5',
    name: 'Organic Jaggery Cubes',
    description: 'Convenient jaggery cubes for easy portion control. Perfect for tea, coffee, and cooking.',
    price: 12500,
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop&crop=center',
    category: 'Organic Jaggery',
    rating: 4.6,
    reviews: 98,
    inStock: true,
    weight: '400g',
    ingredients: ['Organic Sugarcane Juice'],
    benefits: ['Portion Control', 'Convenient', 'Pure Quality', 'Long Shelf Life'],
    isFeatured: false
  },
  {
    id: '6',
    name: 'Jaggery Gift Pack - Premium',
    description: 'Elegant gift pack containing premium jaggery products. Perfect for gifting on special occasions.',
    price: 45000,
    originalPrice: 55000,
    image: 'https://images.unsplash.com/photo-1609501676725-7186f3a0b0c0?w=300&h=300&fit=crop&crop=center',
    category: 'Gift Packs',
    rating: 4.8,
    reviews: 45,
    inStock: true,
    weight: '1kg',
    ingredients: ['Premium Jaggery', 'Traditional Sweets', 'Gift Box'],
    benefits: ['Gift Ready', 'Premium Quality', 'Variety Pack', 'Elegant Packaging'],
    isFeatured: true
  },
  {
    id: '7',
    name: 'Palm Jaggery Powder',
    description: 'Fine palm jaggery powder with a distinct flavor. Ideal for South Indian cuisine and traditional recipes.',
    price: 16500,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&h=300&fit=crop&crop=center',
    category: 'Palm Jaggery',
    rating: 4.7,
    reviews: 73,
    inStock: true,
    weight: '300g',
    ingredients: ['Palm Jaggery'],
    benefits: ['Distinct Flavor', 'South Indian Cuisine', 'Fine Texture', 'Natural Sweetness'],
    isFeatured: false
  },
  {
    id: '8',
    name: 'Jaggery Chikki - Mixed Nuts',
    description: 'Crunchy jaggery chikki with mixed nuts. A healthy and delicious snack packed with nutrients.',
    price: 10000,
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7b1b4b?w=300&h=300&fit=crop&crop=center',
    category: 'Traditional Sweets',
    rating: 4.5,
    reviews: 112,
    inStock: true,
    weight: '200g',
    ingredients: ['Jaggery', 'Mixed Nuts', 'Ghee'],
    benefits: ['Healthy Snack', 'Nut Rich', 'Energy Dense', 'Crunchy Texture'],
    isFeatured: false
  }
];

async function main() {
  console.log('Starting database seed...');

  // Create products
  for (const product of products) {
    await prisma.product.upsert({
      where: { id: product.id },
      update: product,
      create: product,
    });
  }

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });