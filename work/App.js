import {
  Text,
  StyleSheet,
  Pressable,
  Alert,
  ImageBackground,
  Switch,
  StatusBar,
  View,
  Animated,
  ScrollView,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProductScreen from './src/backend/frontend/ProductScreen';
import { CartProvider } from './src/backend/frontend/CartContext';
import CartScreen from './src/backend/frontend/CartScreen';
import ProductDetailsScreen from './src/backend/frontend/ProductDetailsScreen';
import LoginScreen from './src/backend/frontend/LoginScreen';
import AdminDashboard from './src/backend/frontend/AdminDashboard';
import { ProductProvider, useProducts } from './src/backend/frontend/ProductContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from './src/backend/firebaseConfig';
import { onAuthStateChanged, signOut } from 'firebase/auth';

const Stack = createNativeStackNavigator();

// Horizontal Product Card for Home Screen
function ProductCard({ item, navigation }) {
  return (
    <AnimatedPressable
      onPress={() => navigation.navigate('ProductDetails', { item })}
      animationScale={0.94}
    >
      <View style={styles.productCard}>
        <View style={styles.imageWrapper}>
          <Image
            source={{ uri: item.image }}
            style={styles.cardImage}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.cardPrice}>${item.price}</Text>
        <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
      </View>
    </AnimatedPressable>
  );
}

// Animated Pressable Component for smooth button animations
function AnimatedPressable({ children, onPress, style, animationScale = 0.95 }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: animationScale,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
  };

  return (
    <Animated.View style={style}>
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <Pressable
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        >
          {children}
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
}

function HomeScreen({ navigation }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { products, loading: productsLoading } = useProducts();
  const [categories, setCategories] = useState({});

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const darkModeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      // Group products by category
      const grouped = products.reduce((acc, product) => {
        const cat = product.category;
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(product);
        return acc;
      }, {});
      setCategories(grouped);
    }
  }, [products]);

  // Animate dark mode transition
  useEffect(() => {
    Animated.timing(darkModeAnim, {
      toValue: isDarkMode ? 1 : 0,
      duration: 400,
      useNativeDriver: false, // Color animations need native driver false
    }).start();
  }, [isDarkMode]);

  // Interpolate colors for smooth transitions
  const overlayBackgroundColor = darkModeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(0, 0, 0, 0.3)', 'rgba(0, 0, 0, 0.7)']
  });

  const titleColor = darkModeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#f8fafc', '#ffffff']
  });

  const sectionHeaderColor = darkModeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#93c5fd', '#60a5fa']
  });

  return (
    <ImageBackground
      source={require("./assets/shopping.jpg")}
      style={styles.container}
      resizeMode="cover"
    >
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={isDarkMode ? "#020617" : "#f8fafc"}
      />

      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
        <Animated.View style={{ flex: 1, backgroundColor: overlayBackgroundColor }}>
          <View style={[styles.header, {
            backgroundColor: isDarkMode ? "rgb(0,0,0)" : "white"
          }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.headerText}>Dark Mode</Text>
              <Switch
                value={isDarkMode}
                onValueChange={setIsDarkMode}
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={isDarkMode ? "#f5dd4b" : "#f4f3f4"}
              />
            </View>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <AnimatedPressable
                style={styles.cartButtonHeader}
                onPress={() => navigation.navigate('Cart')}
                animationScale={0.92}
              >
                <Text style={styles.cartButtonText}>🛒 Cart</Text>
              </AnimatedPressable>
              <AnimatedPressable
                style={[styles.cartButtonHeader, { backgroundColor: '#ef4444' }]}
                onPress={() => signOut(auth)}
                animationScale={0.92}
              >
                <Text style={styles.cartButtonText}>Sign Out</Text>
              </AnimatedPressable>
            </View>
          </View>

          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingBottom: 30 }}
            showsVerticalScrollIndicator={false}
          >
            <Animated.Text style={[styles.title, { color: titleColor }]}>✨ Featured Collections</Animated.Text>

            {/* Quick Filter Categories */}
            {!productsLoading && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.chipContainer}
                contentContainerStyle={{ paddingHorizontal: 10 }}
              >
                {Object.keys(categories).map(cat => (
                  <TouchableOpacity
                    key={cat}
                    style={styles.chip}
                    onPress={() => navigation.navigate('Product', { category: cat })}
                  >
                    <Text style={styles.chipText}>{cat.charAt(0).toUpperCase() + cat.slice(1).split("'")[0]}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}

            {productsLoading ? (
              <ActivityIndicator size="large" color="#3b82f6" style={{ marginTop: 50 }} />
            ) : (
              Object.keys(categories).map(category => (
                <View key={category} style={styles.categorySection}>
                  <View style={styles.sectionHeaderRow}>
                    <Animated.Text style={[styles.sectionHeader, { color: sectionHeaderColor }]}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </Animated.Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Product', { category })}>
                      <Text style={{ color: '#60a5fa', fontSize: 13 }}>View All ➔</Text>
                    </TouchableOpacity>
                  </View>
                  <FlatList
                    data={categories[category]}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => <ProductCard item={item} navigation={navigation} />}
                    contentContainerStyle={{ paddingLeft: 5 }}
                  />
                </View>
              ))
            )}
          </ScrollView>
        </Animated.View>
      </Animated.View>
    </ImageBackground >
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState('store');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (u) {
        const role = await AsyncStorage.getItem('userRole');
        setUserRole(role || 'store');
      }
      setUser(u);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) return null;

  return (
    <ProductProvider>
      <CartProvider>
        <NavigationContainer>
          <Stack.Navigator>
            {!user ? (
              <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            ) : (
              <>
                {userRole === 'admin' ? (
                  <>
                    <Stack.Screen name="AdminDashboard" component={AdminDashboard} options={{
                      title: 'Seller Dashboard',
                      headerStyle: { backgroundColor: '#0f172a' },
                      headerTintColor: '#fff'
                    }} />
                    <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
                  </>
                ) : (
                  <>
                    <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
                    <Stack.Screen name="AdminDashboard" component={AdminDashboard} options={{
                      title: 'Seller Dashboard',
                      headerStyle: { backgroundColor: '#0f172a' },
                      headerTintColor: '#fff'
                    }} />
                  </>
                )}
                <Stack.Screen name="Product" component={ProductScreen} />
                <Stack.Screen name="Cart" component={CartScreen} options={{
                  headerStyle: { backgroundColor: '#0f172a' },
                  headerTintColor: '#fff',
                  title: 'My Cart'
                }} />
                <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} options={{ title: 'Product Details' }} />
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </CartProvider>
    </ProductProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 32,
  },
  overlay: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    padding: 10,
    borderRadiusBottom: 8,
    paddingVertical: 12
  },
  headerText: {
    color: "#73b7eeff",
    fontSize: 16,
    fontWeight: "600",
  },
  cartButtonHeader: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cartButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  title: {
    color: "#f8fafc",
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 12,
    textAlign: "center",
  },
  sectionHeader: {
    color: "#93c5fd",
    fontSize: 18,
    fontWeight: "700",
    marginTop: 16,
    marginBottom: 6,
  },
  item: {
    backgroundColor: "#0b1220",
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#1f2933",
  },
  itemText: {
    color: "#e5e7eb",
    fontSize: 16,
  },
  categorySection: {
    marginBottom: 25,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
    marginBottom: 12,
  },
  productCard: {
    width: 150,
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
    borderRadius: 16,
    padding: 10,
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  imageWrapper: {
    width: '100%',
    height: 120,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 8,
    marginBottom: 8,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardTitle: {
    color: '#e2e8f0',
    fontSize: 12,
    fontWeight: '500',
  },
  cardPrice: {
    color: '#3b82f6',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  chipContainer: {
    marginVertical: 15,
    maxHeight: 40,
  },
  chip: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  chipText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
});
