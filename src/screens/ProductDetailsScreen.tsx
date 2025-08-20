import type React from "react"
import { useState, useEffect, useCallback } from "react"
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
  StyleSheet,
} from "react-native"
import { Image } from "expo-image"
import { Ionicons } from "@expo/vector-icons"
import * as Haptics from "expo-haptics"
import type { StackNavigationProp } from "@react-navigation/stack"
import type { RouteProp } from "@react-navigation/native"
import { useTheme } from "../context/ThemeContext"
import { useCart } from "../context/CartContext"
import type { Product, RootStackParamList } from "../types"

const { width } = Dimensions.get("window")

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  errorText: {
    fontSize: 16,
  },
  imageContainer: {
    backgroundColor: "white",
  },
  mainImage: {
    width: width,
    height: width,
  },
  thumbnailContainer: {
    paddingVertical: 10,
  },
  thumbnailContent: {
    paddingHorizontal: 15,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 10,
    overflow: "hidden",
  },
  thumbnailImage: {
    width: "100%",
    height: "100%",
  },
  infoContainer: {
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
  },
  productName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  stars: {
    flexDirection: "row",
    marginRight: 8,
  },
  ratingText: {
    fontSize: 14,
  },
  price: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  stockContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
  },
  stockText: {
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 8,
  },
  specificationsContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  specRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  specKey: {
    fontSize: 16,
    flex: 1,
  },
  specValue: {
    fontSize: 16,
    fontWeight: "500",
    flex: 1,
    textAlign: "right",
  },
  bottomContainer: {
    padding: 20,
    borderTopWidth: 1,
  },
  addToCartButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
  },
  addToCartText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 8,
  },
})

type ProductDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, "ProductDetail">
type ProductDetailScreenRouteProp = RouteProp<RootStackParamList, "ProductDetail">

interface ProductDetailScreenProps {
  navigation: ProductDetailScreenNavigationProp
  route: ProductDetailScreenRouteProp
}

export default function ProductDetailScreen({ route, navigation }: ProductDetailScreenProps): React.JSX.Element {
  const { product: routeProduct } = route.params
  const { theme } = useTheme()
  const { addToCart } = useCart()
  const [product, setProduct] = useState<Product | null>(routeProduct || null)
  const [loading, setLoading] = useState<boolean>(!routeProduct)
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0)

  useEffect(() => {
    if (!routeProduct) {
      loadProduct()
    }
  }, [routeProduct])

  const loadProduct = async (): Promise<void> => {
    try {
      if (routeProduct) {
        setProduct(routeProduct)
      } else {
        Alert.alert("Error", "Product not found")
        navigation.goBack()
      }
    } catch (error) {
      Alert.alert("Error", "Failed to load product details")
      navigation.goBack()
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = useCallback((): void => {
    if (product) {
      addToCart(product)
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
      Alert.alert("Success", `${product.name} added to cart!`)
    }
  }, [product, addToCart])

  const renderStars = (rating: number): React.JSX.Element[] => {
    const stars: React.JSX.Element[] = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Ionicons key={i} name="star" size={16} color="#FFD700" />)
    }

    if (hasHalfStar) {
      stars.push(<Ionicons key="half" name="star-half" size={16} color="#FFD700" />)
    }

    const emptyStars = 5 - Math.ceil(rating)
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Ionicons key={`empty-${i}`} name="star-outline" size={16} color="#FFD700" />)
    }

    return stars
  }

  if (loading) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.loadingText, { color: theme.colors.text }]}>Loading product...</Text>
      </View>
    )
  }

  if (!product) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.errorText, { color: theme.colors.text }]}>Product not found</Text>
      </View>
    )
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Image Gallery */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: product.images[selectedImageIndex] }}
            style={styles.mainImage}
            contentFit="cover"
            transition={300}
          />
          {product.images.length > 1 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.thumbnailContainer}
              contentContainerStyle={styles.thumbnailContent}
            >
              {product.images.map((image, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setSelectedImageIndex(index)}
                  style={[
                    styles.thumbnail,
                    {
                      borderColor: selectedImageIndex === index ? theme.colors.primary : theme.colors.border,
                      borderWidth: selectedImageIndex === index ? 2 : 1,
                    },
                  ]}
                >
                  <Image source={{ uri: image }} style={styles.thumbnailImage} contentFit="cover" />
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>

        {/* Product Info */}
        <View style={[styles.infoContainer, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.productName, { color: theme.colors.text }]}>{product.name}</Text>

          <View style={styles.ratingContainer}>
            <View style={styles.stars}>{renderStars(product.rating)}</View>
            <Text style={[styles.ratingText, { color: theme.colors.textSecondary }]}>
              ({product.rating}) • {product.reviews} reviews
            </Text>
          </View>

          <Text style={[styles.price, { color: theme.colors.primary }]}>${product.price.toFixed(2)}</Text>

          <Text style={[styles.description, { color: theme.colors.text }]}>{product.description}</Text>

          {/* Stock Status */}
          <View style={styles.stockContainer}>
            <Ionicons
              name={product.inStock ? "checkmark-circle" : "close-circle"}
              size={20}
              color={product.inStock ? theme.colors.success : theme.colors.error}
            />
            <Text style={[styles.stockText, { color: product.inStock ? theme.colors.success : theme.colors.error }]}>
              {product.inStock ? "In Stock" : "Out of Stock"}
            </Text>
          </View>

          {/* Specifications */}
          <View style={styles.specificationsContainer}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Specifications</Text>
            {Object.entries(product.specifications).map(([key, value]) => (
              <View key={key} style={[styles.specRow, { borderBottomColor: theme.colors.border }]}>
                <Text style={[styles.specKey, { color: theme.colors.textSecondary }]}>{key}</Text>
                <Text style={[styles.specValue, { color: theme.colors.text }]}>{value}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Add to Cart Button */}
      <View
        style={[
          styles.bottomContainer,
          { backgroundColor: theme.colors.background, borderTopColor: theme.colors.border },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.addToCartButton,
            {
              backgroundColor: product.inStock ? theme.colors.primary : theme.colors.textSecondary,
            },
          ]}
          onPress={handleAddToCart}
          disabled={!product.inStock}
          activeOpacity={0.8}
        >
          <Ionicons name="cart" size={24} color="white" />
          <Text style={styles.addToCartText}>{product.inStock ? "Add to Cart" : "Out of Stock"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}
