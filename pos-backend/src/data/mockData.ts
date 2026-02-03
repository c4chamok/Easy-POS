import { Product } from '../../generated/prisma/client';

export const categories = [
  'All',
  'Beverages',
  'Snacks',
  'Dairy',
  'Bakery',
  'Frozen',
  'Household',
];

export const mockProducts: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: 'Coca Cola 500ml',
    sku: 'BEV-001',
    price: 45,
    category: 'Beverages',
    stockQty: 150,
    image:
      'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=200&h=200&fit=crop',
    description: 'Refreshing carbonated soft drink',
  },
  {
    name: 'Lays Classic Chips',
    sku: 'SNK-001',
    price: 35,
    category: 'Snacks',
    stockQty: 8,
    image:
      'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=200&h=200&fit=crop',
    description: 'Crispy potato chips with classic salted flavor',
  },
  {
    name: 'Fresh Milk 1L',
    sku: 'DRY-001',
    price: 85,
    category: 'Dairy',
    stockQty: 45,
    image:
      'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=200&h=200&fit=crop',
    description: 'Farm fresh pasteurized milk',
  },
  {
    name: 'Whole Wheat Bread',
    sku: 'BKY-001',
    price: 55,
    category: 'Bakery',
    stockQty: 0,
    image:
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&h=200&fit=crop',
    description: 'Freshly baked whole wheat bread loaf',
  },
  {
    name: 'Orange Juice 1L',
    sku: 'BEV-002',
    price: 120,
    category: 'Beverages',
    stockQty: 32,
    image:
      'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=200&h=200&fit=crop',
    description: '100% pure orange juice with no added sugar',
  },
  {
    name: 'Frozen Pizza',
    sku: 'FRZ-001',
    price: 350,
    category: 'Frozen',
    stockQty: 15,
    image:
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&h=200&fit=crop',
    description: 'Cheese and pepperoni frozen pizza',
  },
  {
    name: 'Greek Yogurt',
    sku: 'DRY-002',
    price: 75,
    category: 'Dairy',
    stockQty: 5,
    image:
      'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=200&h=200&fit=crop',
    description: 'Creamy Greek yogurt with live cultures',
  },
  {
    name: 'Dish Soap',
    sku: 'HH-001',
    price: 95,
    category: 'Household',
    stockQty: 40,
    image:
      'https://images.unsplash.com/photo-1585441695325-21557f44e1b9?w=200&h=200&fit=crop',
    description: "Lemon scented dish washing liqu 'in-stock'",
  },
  {
    name: 'Croissant',
    sku: 'BKY-002',
    price: 40,
    category: 'Bakery',
    stockQty: 25,
    image:
      'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=200&h=200&fit=crop',
    description: 'Buttery French croissant',
  },
  {
    name: 'Mineral Water 1L',
    sku: 'BEV-003',
    price: 25,
    category: 'Beverages',
    stockQty: 200,
    image:
      'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=200&h=200&fit=crop',
    description: 'Natural mineral water',
  },
  {
    name: 'Ice Cream Tub',
    sku: 'FRZ-002',
    price: 280,
    category: 'Frozen',
    stockQty: 12,
    image:
      'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=200&h=200&fit=crop',
    description: 'Vanilla ice cream family pack',
  },
  {
    name: 'Chocolate Bar',
    sku: 'SNK-002',
    price: 50,
    category: 'Snacks',
    stockQty: 60,
    image:
      'https://images.unsplash.com/photo-1548907040-4baa42d10919?w=200&h=200&fit=crop',
    description: 'Premium milk chocolate bar',
  },
];
