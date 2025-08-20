import React, { useCallback } from "react"
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, type ListRenderItem } from "react-native"
import { Image } from "expo-image"
import { Ionicons } from "@expo/vector-icons"
import * as Haptics from "expo-haptics"
import type { StackNavigationProp } from "@react-navigation/stack"

import { useTheme } from "../context/ThemeContext"
import { useCart } from "../context/CartContext"
import type { CartItem, RootStackParamList } from "../types"

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyTitle: {
    fontSize: 24,
    marginTop: 20,
  },
  emptySubtitle: {
    fontSize: 16,
    marginTop: 10,
  },
  shopButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  shopButtonText: {
    color: "white",
    fontSize: 16,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerButton: {
    marginLeft: 10,
  },
  cartItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
  },
  itemImage: {
    width: 80,
    height: 80,
    marginRight: 10,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: "bold",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityButton: {
    padding: 5,
    borderRadius: 5,
  },
  quantity: {
    marginHorizontal: 10,
    fontSize: 16,
  },
  itemActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  removeButton: {
    padding: 5,
    borderRadius: 5,
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: "bold",
  },
  listContainer: {
    flexGrow: 1,
  },
  summaryContainer: {
    padding: 10,
    borderTopWidth: 1,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  summaryLabel: {
    fontSize: 16,
  },
  summaryValue: {
    fontSize: 16,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    paddingVertical: 10,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "bold",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "bold",
  },
  checkoutButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
  },
  checkoutButtonText: {
    color: "white",
    fontSize: 16,
  },
})

type CartScreenNavigationProp = StackNavigationProp<RootStackParamList, "Cart">

interface CartScreenProps {
  navigation: CartScreenNavigationProp
}

interface CartItemComponentProps {
  item: CartItem
  onUpdateQuantity: (productId: string, quantity: number) => void
  onRemove: (productId: string) => void
  theme: any
}

const CartItemComponent = React.memo<CartItemComponentProps>(({ item, onUpdateQuantity, onRemove, theme }) => {
  const handleIncrease = (): void => {
    onUpdateQuantity(item.product.id, item.quantity + 1)
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
  }

  const handleDecrease = (): void => {
    if (item.quantity > 1) {
      onUpdateQuantity(item.product.id, item.quantity - 1)
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    }
  }

  const handleRemove = (): void => {
    Alert.alert("Remove Item", `Remove ${item.product.name} from cart?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: () => {
          onRemove(item.product.id)
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
        },
      },
    ])
  }

  return (
    <View style={[styles.cartItem, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
      <Image source={{ uri: item.product.image }} style={styles.itemImage} contentFit="cover" />
      <View style={styles.itemInfo}>
        <Text style={[styles.itemName, { color: theme.colors.text }]} numberOfLines={2}>
          {item.product.name}
        </Text>
        <Text style={[styles.itemPrice, { color: theme.colors.primary }]}>${item.product.price.toFixed(2)}</Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={[styles.quantityButton, { backgroundColor: theme.colors.surface }]}
            onPress={handleDecrease}
            activeOpacity={0.7}
          >
            <Ionicons name="remove" size={20} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={[styles.quantity, { color: theme.colors.text }]}>{item.quantity}</Text>
          <TouchableOpacity
            style={[styles.quantityButton, { backgroundColor: theme.colors.surface }]}
            onPress={handleIncrease}
            activeOpacity={0.7}
          >
            <Ionicons name="add" size={20} color={theme.colors.text} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.itemActions}>
        <TouchableOpacity style={styles.removeButton} onPress={handleRemove} activeOpacity={0.7}>
          <Ionicons name="trash-outline" size={24} color={theme.colors.error} />
        </TouchableOpacity>
        <Text style={[styles.itemTotal, { color: theme.colors.text }]}>
          ${(item.product.price * item.quantity).toFixed(2)}
        </Text>
      </View>
    </View>
  )
})

export default function CartScreen({ navigation }: CartScreenProps): React.JSX.Element {
  const { theme, toggleTheme } = useTheme()
  const { items, updateQuantity, removeFromCart, clearCart: clearCartAction, getTotalPrice, getTotalItems } = useCart()

  React.useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={toggleTheme} style={styles.headerButton} activeOpacity={0.7}>
            <Ionicons name={theme.statusBar === "dark" ? "moon" : "sunny"} size={24} color={theme.colors.headerText} />
          </TouchableOpacity>
          {items.length > 0 && (
            <TouchableOpacity onPress={clearCartAction} style={styles.headerButton} activeOpacity={0.7}>
              <Ionicons name="trash-outline" size={24} color={theme.colors.error} />
            </TouchableOpacity>
          )}
        </View>
      ),
    })
  }, [navigation, theme, toggleTheme, items.length])

  const handleCheckout = useCallback((): void => {
    Alert.alert("Checkout", `Proceed to checkout with ${getTotalItems()} items for $${getTotalPrice().toFixed(2)}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Checkout",
        onPress: () => {
          // In a real app, this would navigate to checkout flow
          Alert.alert("Success", "Order placed successfully!", [
            {
              text: "OK",
              onPress: () => clearCartAction(),
            },
          ])
        },
      },
    ])
  }, [getTotalItems, getTotalPrice, clearCartAction])

  const renderCartItem: ListRenderItem<CartItem> = useCallback(
    ({ item }) => (
      <CartItemComponent item={item} onUpdateQuantity={updateQuantity} onRemove={removeFromCart} theme={theme} />
    ),
    [updateQuantity, removeFromCart, theme],
  )

  const keyExtractor = useCallback((item: CartItem): string => item.product.id, [])

  if (items.length === 0) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: theme.colors.background }]}>
        <Ionicons name="cart-outline" size={80} color={theme.colors.textSecondary} />
        <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>Your cart is empty</Text>
        <Text style={[styles.emptySubtitle, { color: theme.colors.textSecondary }]}>
          Add some products to get started
        </Text>
        <TouchableOpacity
          style={[styles.shopButton, { backgroundColor: theme.colors.primary }]}
          onPress={() => navigation.navigate("ProductList")}
          activeOpacity={0.8}
        >
          <Text style={styles.shopButtonText}>Start Shopping</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FlatList
        data={items}
        renderItem={renderCartItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      {/* Cart Summary */}
      <View
        style={[styles.summaryContainer, { backgroundColor: theme.colors.card, borderTopColor: theme.colors.border }]}
      >
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>Items ({getTotalItems()})</Text>
          <Text style={[styles.summaryValue, { color: theme.colors.text }]}>${getTotalPrice().toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>Shipping</Text>
          <Text style={[styles.summaryValue, { color: theme.colors.success }]}>FREE</Text>
        </View>
        <View style={[styles.totalRow, { borderTopColor: theme.colors.border }]}>
          <Text style={[styles.totalLabel, { color: theme.colors.text }]}>Total</Text>
          <Text style={[styles.totalValue, { color: theme.colors.primary }]}>${getTotalPrice().toFixed(2)}</Text>
        </View>
        <TouchableOpacity
          style={[styles.checkoutButton, { backgroundColor: theme.colors.primary }]}
          onPress={handleCheckout}
          activeOpacity={0.8}
        >
          <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}
