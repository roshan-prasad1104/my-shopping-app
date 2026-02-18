import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Alert, Pressable, Animated, PanResponder, ActivityIndicator } from 'react-native';
import { useCart } from './CartContext';
import { useProducts } from './ProductContext';

export default function ProductScreen({ navigation, route }) {
    const { addToCart, removeFromCart } = useCart();
    const { products: globalProducts, loading: globalLoading } = useProducts();
    const { category } = route.params;
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState(null);

    useEffect(() => {
        if (!globalLoading && globalProducts.length > 0) {
            setLoading(true);
            // Normalize category names for matching
            const filtered = globalProducts.filter(p => {
                const productCat = p.category.toLowerCase().replace("'", "");
                const searchCat = category.toLowerCase().replace("'", "");
                return productCat === searchCat ||
                    productCat.includes(searchCat) ||
                    searchCat.includes(productCat);
            });
            setProducts(filtered);
            setLoading(false);
            setErrorMsg(null);
        }
    }, [category, globalProducts, globalLoading]);

    const handleProductPress = (item) => {
        navigation.navigate('ProductDetails', { item });
    };

    const renderProductItem = ({ item }) => (
        <ProductItem
            item={item}
            onPress={() => handleProductPress(item)}
            addToCart={addToCart}
            removeFromCart={removeFromCart}
        />
    );

    if (loading) return <View style={styles.centerIndicator}><ActivityIndicator size="large" color="#3b82f6" /></View>;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{category} Collection</Text>

            {errorMsg && (
                <View style={styles.errorBanner}>
                    <Text style={styles.errorText}>{errorMsg}</Text>
                    <TouchableOpacity onPress={() => fetchProducts()} style={styles.editBtn}>
                        <Text style={styles.editBtnText}>🔄 Retry</Text>
                    </TouchableOpacity>
                </View>
            )}

            <FlatList
                data={products}
                keyExtractor={(item) => (item.id).toString()}
                numColumns={2}
                renderItem={renderProductItem}
                ListEmptyComponent={
                    <View style={styles.centerIndicator}>
                        <Text style={{ color: '#94a3b8' }}>No products available in this category.</Text>
                    </View>
                }
            />
        </View>
    );
}

const ProductItem = ({ item, onPress, addToCart, removeFromCart }) => {
    const panY = useRef(new Animated.Value(0)).current;

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => false,
            onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dy) > 10,
            onPanResponderGrant: () => {
                panY.setOffset(panY._value);
                panY.setValue(0);
            },
            onPanResponderMove: Animated.event([null, { dy: panY }], { useNativeDriver: false }),
            onPanResponderRelease: (_, gestureState) => {
                panY.flattenOffset();
                if (gestureState.dy < -100) {
                    addToCart(item);
                    Alert.alert("Added to Cart", `${item.title} added via drag up!`);
                }
                Animated.spring(panY, { toValue: 0, friction: 5, useNativeDriver: false }).start();
            },
            onPanResponderTerminate: () => {
                Animated.spring(panY, { toValue: 0, useNativeDriver: false }).start();
            }
        })
    ).current;

    return (
        <Animated.View style={{ transform: [{ translateY: panY }], zIndex: 1 }} {...panResponder.panHandlers}>
            <Pressable
                style={({ pressed }) => [styles.card, pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] }]}
                onPress={onPress}
                onLongPress={() => {
                    removeFromCart(item.id);
                    Alert.alert("Removed from Cart", `${item.title} removed via long press.`);
                }}
                delayLongPress={500}
                android_ripple={{ color: '#334155' }}
            >
                <View style={styles.imageWrapper}>
                    <Image source={{ uri: item.image }} style={styles.image} resizeMode="contain" />
                </View>
                <Text style={styles.name} numberOfLines={2}>{item.title}</Text>
                <Text style={styles.price}>{`$${item.price}`}</Text>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={[styles.button, styles.cartButton]}
                        onPress={() => {
                            addToCart(item);
                            Alert.alert("Added to Cart", `${item.title} added via button.`);
                        }}
                    >
                        <Text style={styles.buttonText}>Cart</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.button, styles.buyButton]}
                        onPress={() => Alert.alert("Purchase Successful", `You bought ${item.title}!`)}
                    >
                        <Text style={styles.buttonText}>Buy</Text>
                    </TouchableOpacity>
                </View>
            </Pressable>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0f172a', padding: 10 },
    centerIndicator: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f172a', padding: 20 },
    title: { fontSize: 24, fontWeight: 'bold', color: '#f8fafc', marginBottom: 20, marginTop: 10, textAlign: 'center' },
    card: { flex: 1, backgroundColor: '#1e293b', margin: 8, borderRadius: 12, padding: 10, alignItems: 'center', shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 5 },
    imageWrapper: { width: '100%', height: 120, backgroundColor: '#fff', borderRadius: 10, marginBottom: 10, padding: 5 },
    image: { width: '100%', height: '100%' },
    name: { color: '#e2e8f0', fontSize: 14, fontWeight: '600', marginBottom: 4, textAlign: 'center', height: 40 },
    price: { color: '#3b82f6', fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
    buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', gap: 8 },
    button: { paddingVertical: 8, borderRadius: 8, flex: 1, alignItems: 'center' },
    cartButton: { backgroundColor: '#64748b' },
    buyButton: { backgroundColor: '#3b82f6' },
    buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
    errorBanner: { backgroundColor: '#450a0a', padding: 12, borderRadius: 10, marginBottom: 15, borderWidth: 1, borderColor: '#991b1b' },
    errorText: { color: '#fca5a5', fontSize: 12, textAlign: 'center', fontWeight: 'bold' },
    editBtn: { alignSelf: 'center', marginTop: 8, paddingHorizontal: 15, paddingVertical: 4, borderRadius: 5, backgroundColor: 'rgba(255,255,255,0.1)' },
    editBtnText: { color: '#fff', fontSize: 11, fontWeight: '600' },
});
