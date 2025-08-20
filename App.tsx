import type React from "react"
import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { StatusBar } from "expo-status-bar"
import { Ionicons } from "@expo/vector-icons"

import { ThemeProvider, useTheme } from "./src/context/ThemeContext"
import { CartProvider } from "./src/context/CartContext"
import type { RootStackParamList } from "./src/types"
import ProductListScreen from "./src/screens/ProductListScreen"
import ProductDetailScreen from "./src/screens/ProductDetailsScreen"
import CartScreen from "./src/screens/CartScreen"

const Stack = createStackNavigator<RootStackParamList>()

type TabParamList = {
  Products: undefined
  Cart: undefined
}

const Tab = createBottomTabNavigator<TabParamList>()

function ProductStack(): React.JSX.Element {
  const { theme } = useTheme()

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.header,
        },
        headerTintColor: theme.colors.headerText,
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Stack.Screen name="ProductList" component={ProductListScreen} options={{ title: "Products" }} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} options={{ title: "Product Details" }} />
    </Stack.Navigator>
  )
}

function MainTabs(): React.JSX.Element {
  const { theme } = useTheme()

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string
          if (route.name === "Products") {
            iconName = focused ? "storefront" : "storefront-outline"
          } else if (route.name === "Cart") {
            iconName = focused ? "cart" : "cart-outline"
          } else {
            iconName = "help-outline"
          }
          return <Ionicons name={iconName} size={size} color={color} />
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderTopColor: theme.colors.border,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Products" component={ProductStack} />
      <Tab.Screen name="Cart" component={CartScreen} />
    </Tab.Navigator>
  )
}

function AppContent(): React.JSX.Element {
  const { theme } = useTheme()

  return (
    <NavigationContainer>
      <StatusBar style={theme.statusBar} />
      <MainTabs />
    </NavigationContainer>
  )
}

export default function App(): React.JSX.Element {
  return (
    <ThemeProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </ThemeProvider>
  )
}
