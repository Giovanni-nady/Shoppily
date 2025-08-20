"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect, type ReactNode } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import type { Product, CartItem, CartContextType } from "../types"

interface CartState {
  items: CartItem[]
}

type CartAction =
  | { type: "LOAD_CART"; payload: CartItem[] }
  | { type: "ADD_TO_CART"; payload: Product }
  | { type: "REMOVE_FROM_CART"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" }

const CartContext = createContext<CartContextType | undefined>(undefined)

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "LOAD_CART":
      return { ...state, items: action.payload }

    case "ADD_TO_CART":
      const existingItem = state.items.find((item) => item.product.id === action.payload.id)
      if (existingItem) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.product.id === action.payload.id ? { ...item, quantity: item.quantity + 1 } : item,
          ),
        }
      }
      return {
        ...state,
        items: [...state.items, { product: action.payload, quantity: 1 }],
      }

    case "REMOVE_FROM_CART":
      return {
        ...state,
        items: state.items.filter((item) => item.product.id !== action.payload),
      }

    case "UPDATE_QUANTITY":
      return {
        ...state,
        items: state.items
          .map((item) =>
            item.product.id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item,
          )
          .filter((item) => item.quantity > 0),
      }

    case "CLEAR_CART":
      return { ...state, items: [] }

    default:
      return state
  }
}

interface CartProviderProps {
  children: ReactNode
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [] })

  useEffect(() => {
    loadCart()
  }, [])

  useEffect(() => {
    saveCart()
  }, [state.items])

  const loadCart = async (): Promise<void> => {
    try {
      const savedCart = await AsyncStorage.getItem("cart")
      if (savedCart) {
        dispatch({ type: "LOAD_CART", payload: JSON.parse(savedCart) })
      }
    } catch (error) {
      console.error("Error loading cart:", error)
    }
  }

  const saveCart = async (): Promise<void> => {
    try {
      await AsyncStorage.setItem("cart", JSON.stringify(state.items))
    } catch (error) {
      console.error("Error saving cart:", error)
    }
  }

  const addToCart = (product: Product): void => {
    dispatch({ type: "ADD_TO_CART", payload: product })
  }

  const removeFromCart = (productId: string): void => {
    dispatch({ type: "REMOVE_FROM_CART", payload: productId })
  }

  const updateQuantity = (productId: string, quantity: number): void => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id: productId, quantity } })
  }

  const clearCart = (): void => {
    dispatch({ type: "CLEAR_CART" })
  }

  const getTotalPrice = (): number => {
    return state.items.reduce((total, item) => total + item.product.price * item.quantity, 0)
  }

  const getTotalItems = (): number => {
    return state.items.reduce((total, item) => total + item.quantity, 0)
  }

  const contextValue: CartContextType = {
    items: state.items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems,
  }

  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
}

export const useCart = (): CartContextType => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
