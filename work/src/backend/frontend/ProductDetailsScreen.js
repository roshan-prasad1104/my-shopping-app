import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useCart } from './CartContext';

export default function ProductDetailsScreen({ route }) {
    const { item } = route.params;
    const { addToCart } = useCart();

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.infoContainer}>
                <Text style={styles.name}>{item.title}</Text>
                <Text style={styles.price}>${item.price}</Text>
                <Text style={styles.description}>
                    Experience premium quality with this item. Perfect for any occasion, crafted with comfortable materials to ensure you look and feel your best.

                    Features:
                    • Premium Fabric
                    • Modern Fit
                    • Durable Stitching
                    • Easy Care
                </Text>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={[styles.button, styles.cartButton]}
                        onPress={() => {
                            addToCart(item);
                            Alert.alert('Added to Cart', `${item.title} is in your cart.`);
                        }}
                    >
                        <Text style={styles.buttonText}>Add to Cart</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.button, styles.buyButton]}
                        onPress={() => Alert.alert('Purchase Successful', `You bought ${item.title}!`)}
                    >
                        <Text style={styles.buttonText}>Buy Now</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0f172a',
    },
    content: {
        paddingBottom: 40,
    },
    image: {
        width: '100%',
        height: 400,
        resizeMode: 'cover',
    },
    infoContainer: {
        padding: 20,
        backgroundColor: '#1e293b',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        marginTop: -30,
        minHeight: 400,
    },
    name: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#f8fafc',
        marginBottom: 8,
    },
    price: {
        fontSize: 24,
        color: '#4ade80',
        fontWeight: '600',
        marginBottom: 16,
    },
    description: {
        fontSize: 16,
        color: '#cbd5e1',
        lineHeight: 24,
        marginBottom: 30,
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 16,
    },
    button: {
        flex: 1,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        elevation: 2,
    },
    cartButton: {
        backgroundColor: '#64748b',
    },
    buyButton: {
        backgroundColor: '#3b82f6',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
