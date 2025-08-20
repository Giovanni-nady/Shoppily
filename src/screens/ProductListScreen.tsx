import React, { useState, useEffect, useCallback, useMemo } from "react"
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  Alert,
  type ListRenderItem,
} from "react-native"
import { Image } from "expo-image"
import { Ionicons } from "@expo/vector-icons"
import * as Haptics from "expo-haptics"
import type { StackNavigationProp } from "@react-navigation/stack"
import { useTheme } from "../context/ThemeContext"
import { useCart } from "../context/CartContext"
import { fetchProducts } from "../data/mockProducts"
import type { Product, RootStackParamList } from "../types"

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  listContainer: {
    paddingBottom: 16,
  },
  productCard: {
    flex: 1,
    margin: 8,
    borderRadius: 8,
    borderWidth: 1,
    overflow: "hidden",
  },
  productImage: {
    width: "100%",
    height: 140,
  },
  productInfo: {
    padding: 16,
  },
  productName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  productDescription: {
    fontSize: 14,
    marginTop: 4,
  },
  productFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "bold",
  },
  addButton: {
    padding: 8,
    borderRadius: 24,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerButton: {
    marginLeft: 16,
  },
  badge: {
    position: "absolute",
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    marginTop: 16,
  },
})

type ProductListScreenNavigationProp = StackNavigationProp<RootStackParamList, "ProductList">

interface ProductListScreenProps {
  navigation: ProductListScreenNavigationProp
}

interface ProductItemProps {
  item: Product
  onPress: (product: Product) => void
  onAddToCart: (product: Product) => void
  theme: any
}

const ProductItem = React.memo<ProductItemProps>(({ item, onPress, onAddToCart, theme }) => (
  <TouchableOpacity
    style={[styles.productCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
    onPress={() => onPress(item)}
    activeOpacity={0.7}
  >
    <Image source={{ uri: item.image }} style={styles.productImage} contentFit="cover" transition={200} />
    <View style={styles.productInfo}>
      <Text style={[styles.productName, { color: theme.colors.text }]} numberOfLines={2}>
        {item.name}
      </Text>
      <Text style={[styles.productDescription, { color: theme.colors.textSecondary }]} numberOfLines={2}>
        {item.description}
      </Text>
      <View style={styles.productFooter}>
        <Text style={[styles.productPrice, { color: theme.colors.primary }]}>${item.price.toFixed(2)}</Text>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: theme.colors.primary }]}
          onPress={() => onAddToCart(item)}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  </TouchableOpacity>
))

export default function ProductListScreen({ navigation }: ProductListScreenProps): React.JSX.Element {
  const { theme, toggleTheme } = useTheme()
  const { addToCart, getTotalItems } = useCart()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [refreshing, setRefreshing] = useState<boolean>(false)

  const loadProducts = useCallback(async (): Promise<void> => {
    try {
      const data = await fetchProducts()
      setProducts(data)
    } catch (error) {
      Alert.alert("Error", "Failed to load products")
    } finally {
      setLoading(false)
    }
  }, [])

  const onRefresh = useCallback(async (): Promise<void> => {
    setRefreshing(true)
    await loadProducts()
    setRefreshing(false)
  }, [loadProducts])

  const handleAddToCart = useCallback(
    (product: Product): void => {
      addToCart(product)
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    },
    [addToCart],
  )

  const handleProductPress = useCallback(
    (product: Product): void => {
      navigation.navigate("ProductDetail", { product })
    },
    [navigation],
  )

  useEffect(() => {
    loadProducts()
  }, [loadProducts])

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={toggleTheme} style={styles.headerButton} activeOpacity={0.7}>
            <Ionicons name={theme.statusBar === "dark" ? "moon" : "sunny"} size={24} color={theme.colors.headerText} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("Cart")} style={styles.headerButton} activeOpacity={0.7}>
            <Ionicons name="cart-outline" size={24} color={theme.colors.headerText} />
            {getTotalItems() > 0 && (
              <View style={[styles.badge, { backgroundColor: theme.colors.error }]}>
                <Text style={styles.badgeText}>{getTotalItems()}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      ),
    })
  }, [navigation, theme, toggleTheme, getTotalItems])

  const renderProduct: ListRenderItem<Product> = useCallback(
    ({ item }) => <ProductItem item={item} onPress={handleProductPress} onAddToCart={handleAddToCart} theme={theme} />,
    [handleProductPress, handleAddToCart, theme],
  )

  const keyExtractor = useCallback((item: Product): string => item.id, [])

  const memoizedProducts = useMemo(() => products, [products])

  if (loading) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.loadingText, { color: theme.colors.text }]}>Loading products...</Text>
      </View>
    )
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FlatList
        data={memoizedProducts}
        renderItem={renderProduct}
        keyExtractor={keyExtractor}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={10}
        initialNumToRender={6}
        getItemLayout={(data, index) => ({
          length: 280,
          offset: 280 * Math.floor(index / 2),
          index,
        })}
      />
    </View>
  )
}
