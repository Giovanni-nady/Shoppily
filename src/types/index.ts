export interface Product {
    id: string
    name: string
    price: number
    image: string
    description: string
    category: string
    rating: number
    reviews: number
    images: string[]
    specifications: Record<string, string>
    inStock: boolean
  }
  
  export interface CartItem {
    product: Product
    quantity: number
  }
  
  export interface CartContextType {
    items: CartItem[]
    addToCart: (product: Product) => void
    removeFromCart: (productId: string) => void
    updateQuantity: (productId: string, quantity: number) => void
    clearCart: () => void
    getTotalPrice: () => number
    getTotalItems: () => number
  }
  
  export interface ThemeContextType {
    isDark: boolean
    toggleTheme: () => void
    colors: {
      primary: string
      background: string
      surface: string
      text: string
      textSecondary: string
      border: string
      card: string
      success: string
      error: string
    }
  }
  
  export type RootStackParamList = {
    ProductList: undefined
    ProductDetail: { product: Product }
    Cart: undefined
  }
  