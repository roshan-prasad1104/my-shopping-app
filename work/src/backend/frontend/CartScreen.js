import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { useCart } from './CartContext';

export default function CartScreen({ navigation }) {
    const { cartItems, removeFromCart } = useCart();
    const totalBill = cartItems.reduce((acc, item) => acc + item.price, 0);

    if (cartItems.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Your cart is empty 🛒</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Your Cart ({cartItems.length})</Text>
            <FlatList
                data={cartItems}
                keyExtractor={(item, index) => (item._id || item.id || index).toString()}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Image source={{ uri: item.image }} style={styles.image} />
                        <View style={styles.details}>
                            <Text style={styles.name}>{item.title}</Text>
                            <Text style={styles.price}>${item.price}</Text>
                        </View>
                        <TouchableOpacity
                            style={styles.removeButton}
                            onPress={() => removeFromCart(item._id || item.id)}
                        >
                            <Text style={styles.removeText}>Remove</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />
            <View style={styles.footer}>
                <View style={styles.billContainer}>
                    <Text style={styles.totalLabel}>Total Bill:</Text>
                    <Text style={styles.totalPrice}>${totalBill.toFixed(2)}</Text>
                </View>
                <TouchableOpacity
                    style={styles.checkoutButton}
                    onPress={() => navigation.navigate('Checkout', {
                        items: cartItems,
                        total: totalBill
                    })}
                >
                    <Text style={styles.checkoutText}>Proceed to Checkout</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0f172a',
        padding: 16,
    },
    emptyContainer: {
        flex: 1,
        backgroundColor: '#0f172a',
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        color: '#94a3b8',
        fontSize: 20,
        fontWeight: 'bold',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#f8fafc',
        marginBottom: 20,
    },
    card: {
        flexDirection: 'row',
        backgroundColor: '#1e293b',
        borderRadius: 12,
        padding: 10,
        marginBottom: 12,
        alignItems: 'center',
    },
    image: {
        width: 60,
        height: 60,
        borderRadius: 8,
    },
    details: {
        flex: 1,
        marginLeft: 12,
    },
    name: {
        color: '#e2e8f0',
        fontSize: 16,
        fontWeight: '600',
    },
    price: {
        color: '#94a3b8',
        fontSize: 14,
        marginTop: 4,
    },
    removeButton: {
        backgroundColor: '#ef4444',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 6,
    },
    removeText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    footer: {
        marginTop: 20,
        borderTopWidth: 1,
        borderTopColor: '#334155',
        paddingTop: 16,
    },
    billContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
        paddingHorizontal: 5
    },
    totalLabel: {
        color: '#94a3b8',
        fontSize: 16,
        fontWeight: '600'
    },
    totalPrice: {
        color: '#4ade80',
        fontSize: 22,
        fontWeight: 'bold'
    },
    checkoutButton: {
        backgroundColor: '#22c55e',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    checkoutText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
