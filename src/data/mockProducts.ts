import type { Product } from "../types"

export const mockProducts: Product[] = [
  {
    id: "1",
    name: "iPhone 15 Pro",
    price: 999.99,
    description: "The most advanced iPhone yet with titanium design and A17 Pro chip.",
    image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400",
    images: [
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400",
      "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=400",
    ],
    specifications: {
      Display: "6.1-inch Super Retina XDR",
      Chip: "A17 Pro",
      Storage: "128GB",
      Camera: "48MP Main + 12MP Ultra Wide",
      Battery: "Up to 23 hours video playback",
    },
    category: "Electronics",
    rating: 4.8,
    reviews: 1250,
    inStock: true,
  },
  {
    id: "2",
    name: "MacBook Air M2",
    price: 1199.99,
    description: "Supercharged by M2 chip. Incredibly thin and light design.",
    image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400",
    images: [
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400",
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400",
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400",
    ],
    specifications: {
      Display: "13.6-inch Liquid Retina",
      Chip: "Apple M2",
      Memory: "8GB unified memory",
      Storage: "256GB SSD",
      Battery: "Up to 18 hours",
    },
    category: "Electronics",
    rating: 4.7,
    reviews: 890,
    inStock: true,
  },
  {
    id: "3",
    name: "AirPods Pro (2nd Gen)",
    price: 249.99,
    description: "Active Noise Cancellation and Adaptive Transparency.",
    image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400",
    images: [
      "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400",
      "https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?w=400",
    ],
    specifications: {
      Audio: "Adaptive Audio",
      "Noise Cancellation": "Active Noise Cancellation",
      Battery: "Up to 6 hours listening time",
      Charging: "MagSafe Charging Case",
      "Water Resistance": "IPX4",
    },
    category: "Audio",
    rating: 4.6,
    reviews: 2100,
    inStock: true,
  },
  {
    id: "4",
    name: 'iPad Pro 12.9"',
    price: 1099.99,
    description: "The ultimate iPad experience with M2 chip and Liquid Retina XDR display.",
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400",
    images: [
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400",
      "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=400",
    ],
    specifications: {
      Display: "12.9-inch Liquid Retina XDR",
      Chip: "Apple M2",
      Storage: "128GB",
      Camera: "12MP Wide + 10MP Ultra Wide",
      Connectivity: "Wi-Fi 6E + 5G",
    },
    category: "Electronics",
    rating: 4.9,
    reviews: 750,
    inStock: true,
  },
  {
    id: "5",
    name: "Apple Watch Series 9",
    price: 399.99,
    description: "Your essential companion for a healthy life with advanced health features.",
    image: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400",
    images: [
      "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400",
      "https://images.unsplash.com/photo-1510017098667-27dfc7150acb?w=400",
    ],
    specifications: {
      Display: "45mm Always-On Retina",
      Chip: "S9 SiP",
      Health: "Blood Oxygen + ECG",
      Battery: "Up to 18 hours",
      "Water Resistance": "50 meters",
    },
    category: "Wearables",
    rating: 4.5,
    reviews: 1680,
    inStock: true,
  },
]

export const fetchProducts = (): Promise<Product[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockProducts)
    }, 1000)
  })
}

export const fetchProductById = (id: string): Promise<Product | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const product = mockProducts.find((p) => p.id === id)
      resolve(product)
    }, 500)
  })
}
