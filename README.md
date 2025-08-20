# E-Commerce Shopping App

A modern React Native Expo e-commerce application with product browsing, cart management, and dark mode support.

## Features

### ✅ Core Requirements
- **Product Catalog**: Browse products with images, names, prices, and descriptions
- **Pull to Refresh**: Refresh product list with pull-down gesture
- **Product Details**: Detailed product view with image gallery and specifications
- **Shopping Cart**: Add/remove items, quantity management, total calculation
- **Performance Optimized**: Efficient rendering for large product lists
- **Dark Mode**: Toggle between light and dark themes

### 🚀 Additional Features
- **Persistent Storage**: Cart and theme preferences saved locally
- **Haptic Feedback**: Enhanced user experience with tactile feedback
- **Image Gallery**: Multiple product images with thumbnail navigation
- **Stock Management**: Real-time stock status display
- **Rating System**: Product ratings with star display
- **Responsive Design**: Optimized for various screen sizes

## Technology Stack

### Core Technologies
- **React Native**: Cross-platform mobile development
- **Expo**: Development platform and toolchain
- **React Navigation**: Navigation library for screens and tabs
- **Context API**: State management for cart and theme

### Key Libraries
- **@react-navigation/native**: Navigation framework
- **@react-navigation/stack**: Stack navigation
- **@react-navigation/bottom-tabs**: Tab navigation
- **expo-image**: Optimized image component
- **@expo/vector-icons**: Icon library
- **@react-native-async-storage/async-storage**: Local storage
- **expo-haptics**: Haptic feedback
- **react-native-reanimated**: Smooth animations

### Performance Optimizations
- **React.memo**: Prevent unnecessary re-renders
- **useCallback**: Memoize functions
- **useMemo**: Memoize expensive calculations
- **FlatList optimizations**: Efficient list rendering
- **Image caching**: Expo Image with built-in caching
- **Lazy loading**: Load images as needed

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI: `npm install -g @expo/cli`
- iOS Simulator (Mac) or Android Studio (for emulators)

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd expo-ecommerce-app
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   # or
   yarn install
   \`\`\`

3. **Start the development server**
   \`\`\`bash
   npx expo start
   \`\`\`

4. **Run on device/simulator**
   - **iOS**: Press `i` in terminal or scan QR code with Camera app
   - **Android**: Press `a` in terminal or scan QR code with Expo Go app
   - **Web**: Press `w` in terminal

### Building for Production

1. **Build for iOS**
   \`\`\`bash
   npx expo build:ios
   \`\`\`

2. **Build for Android**
   \`\`\`bash
   npx expo build:android
   \`\`\`

## Project Structure

\`\`\`
src/
├── context/
│   ├── CartContext.js      # Shopping cart state management
│   └── ThemeContext.js     # Dark/light theme management
├── data/
│   └── mockProducts.js     # Mock product data and API simulation
├── screens/
│   ├── ProductListScreen.js    # Product catalog with grid layout
│   ├── ProductDetailScreen.js  # Detailed product view
│   └── CartScreen.js          # Shopping cart management
└── App.js                     # Main app component with navigation
\`\`\`

## Key Design Decisions

### State Management
- **Context API**: Chosen over Redux for simplicity and built-in React support
- **useReducer**: Complex cart operations handled with reducer pattern
- **AsyncStorage**: Persistent storage for cart items and theme preference

### Performance Strategy
- **FlatList**: Efficient rendering of large product lists
- **Image Optimization**: Expo Image with automatic caching and optimization
- **Memoization**: Strategic use of React.memo, useCallback, and useMemo
- **Lazy Loading**: Images loaded on-demand to reduce initial load time

### User Experience
- **Haptic Feedback**: Tactile responses for user actions
- **Pull to Refresh**: Intuitive gesture for data refresh
- **Dark Mode**: System-aware theme switching
- **Smooth Animations**: React Native Reanimated for fluid transitions

### Code Organization
- **Component Separation**: Logical separation of concerns
- **Custom Hooks**: Reusable logic extraction
- **Mock API**: Simulated network delays for realistic testing
- **TypeScript Ready**: Structure supports easy TypeScript migration

## Testing the App

### Mock Data
The app includes 5 sample products with:
- High-quality product images
- Detailed specifications
- Stock management
- Rating system

### Features to Test
1. **Product Browsing**: Scroll through product grid
2. **Pull to Refresh**: Pull down on product list
3. **Product Details**: Tap any product for details
4. **Image Gallery**: Swipe through product images
5. **Add to Cart**: Test cart functionality
6. **Quantity Management**: Increase/decrease quantities
7. **Dark Mode**: Toggle theme in header
8. **Persistence**: Close and reopen app to verify saved state

## Future Enhancements

- User authentication and profiles
- Product search and filtering
- Wishlist functionality
- Order history
- Push notifications
- Payment integration
- Product reviews and ratings
- Social sharing
- Offline support

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details
