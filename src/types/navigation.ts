import type { Product } from "./index" // Assuming Product is declared in another file

export type RootStackParamList = {
  ProductList: undefined
  ProductDetail: { product: Product }
  Cart: undefined
}

export type TabParamList = {
  Products: undefined
  Cart: undefined
}
