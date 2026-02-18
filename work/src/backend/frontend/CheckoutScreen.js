import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    ScrollView,
    Alert,
    Image,
    ActivityIndicator,
    TextInput
} from 'react-native';

const PAYMENT_METHODS = [
    { id: 'upi', name: 'UPI (GPay / PhonePe / Paytm)', icon: '📱' },
    { id: 'card', name: 'Credit / Debit Card', icon: '💳' },
    { id: 'cod', name: 'Cash on Delivery', icon: '💵' },
    { id: 'net', name: 'Net Banking', icon: '🏦' },
];

import { useProducts } from './ProductContext';

export default function CheckoutScreen({ navigation, route }) {
    const { items = [], total = 0 } = route.params || {};
    const { addOrder } = useProducts();
    const [selectedMethod, setSelectedMethod] = useState('upi');
    const [processing, setProcessing] = useState(false);

    // Shipping Details State
    const [shippingDetails, setShippingDetails] = useState({
        name: '',
        address: '',
        phone: ''
    });

    const handlePay = () => {
        // Validation
        if (!shippingDetails.name || !shippingDetails.address || !shippingDetails.phone) {
            Alert.alert("Shipping Info Required", "Please provide your name, delivery address, and phone number.");
            return;
        }

        setProcessing(true);
        // Simulate payment process
        setTimeout(() => {
            const trackingId = 'TRK' + Math.floor(Math.random() * 900000 + 100000);
            const newOrder = {
                id: trackingId,
                items,
                total,
                shipping: shippingDetails,
                method: selectedMethod,
                timestamp: new Date().toISOString(),
                status: 'Processing'
            };

            addOrder(newOrder);
            setProcessing(false);

            Alert.alert(
                "Order Successful! 🎉",
                `Thank you ${shippingDetails.name}! Your order has been placed.`,
                [{ text: "Track Order", onPress: () => navigation.navigate('OrderTracking', { order: newOrder }) }]
            );
        }, 2000);
    };

    return (
        <View style={styles.container}>
            <ScrollView style={styles.content}>
                <Text style={styles.sectionTitle}>Order Summary</Text>
                <View style={styles.summaryCard}>
                    {items.map((item, idx) => (
                        <View key={idx} style={styles.itemRow}>
                            <Text style={styles.itemText} numberOfLines={1}>{item.title}</Text>
                            <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
                        </View>
                    ))}
                    <View style={styles.divider} />
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Total Payable</Text>
                        <Text style={styles.totalAmount}>${total.toFixed(2)}</Text>
                    </View>
                </View>

                {/* Shipping Details Section */}
                <Text style={styles.sectionTitle}>🚚 Shipping Information</Text>
                <View style={styles.summaryCard}>
                    <TextInput
                        style={styles.shipInput}
                        placeholder="Full Name"
                        placeholderTextColor="#94a3b8"
                        value={shippingDetails.name}
                        onChangeText={(t) => setShippingDetails({ ...shippingDetails, name: t })}
                    />
                    <TextInput
                        style={[styles.shipInput, { marginVertical: 12, height: 80, textAlignVertical: 'top' }]}
                        placeholder="Complete Delivery Address"
                        placeholderTextColor="#94a3b8"
                        multiline
                        numberOfLines={3}
                        value={shippingDetails.address}
                        onChangeText={(t) => setShippingDetails({ ...shippingDetails, address: t })}
                    />
                    <TextInput
                        style={styles.shipInput}
                        placeholder="Phone Number"
                        placeholderTextColor="#94a3b8"
                        keyboardType="phone-pad"
                        value={shippingDetails.phone}
                        onChangeText={(t) => setShippingDetails({ ...shippingDetails, phone: t })}
                    />
                </View>

                <Text style={styles.sectionTitle}>💳 Payment Method</Text>
                {PAYMENT_METHODS.map((method) => (
                    <TouchableOpacity
                        key={method.id}
                        style={[
                            styles.methodCard,
                            selectedMethod === method.id && styles.selectedMethod
                        ]}
                        onPress={() => setSelectedMethod(method.id)}
                    >
                        <Text style={styles.methodIcon}>{method.icon}</Text>
                        <Text style={[
                            styles.methodName,
                            selectedMethod === method.id && styles.selectedMethodText
                        ]}>{method.name}</Text>
                        <View style={styles.radioOut}>
                            {selectedMethod === method.id && <View style={styles.radioIn} />}
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.payBtn, processing && { opacity: 0.7 }]}
                    onPress={handlePay}
                    disabled={processing}
                >
                    {processing ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.payBtnText}>Pay Now ${total.toFixed(2)}</Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0f172a' },
    content: { padding: 20 },
    sectionTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 15, marginTop: 10 },
    summaryCard: { backgroundColor: '#1e293b', borderRadius: 15, padding: 15, marginBottom: 25 },
    itemRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
    itemText: { color: '#94a3b8', flex: 1, marginRight: 10 },
    itemPrice: { color: '#f8fafc', fontWeight: '500' },
    divider: { height: 1, backgroundColor: '#334155', marginVertical: 10 },
    totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 5 },
    totalLabel: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    totalAmount: { color: '#4ade80', fontSize: 20, fontWeight: 'bold' },
    shipInput: {
        backgroundColor: '#0f172a',
        color: '#fff',
        padding: 12,
        borderRadius: 10,
        fontSize: 14,
        borderWidth: 1,
        borderColor: '#334155'
    },
    methodCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1e293b',
        padding: 15,
        borderRadius: 12,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#334155'
    },
    selectedMethod: { borderColor: '#3b82f6', backgroundColor: 'rgba(59, 130, 246, 0.1)' },
    methodIcon: { fontSize: 20, marginRight: 15 },
    methodName: { color: '#94a3b8', flex: 1, fontWeight: '600' },
    selectedMethodText: { color: '#fff' },
    radioOut: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#3b82f6', justifyContent: 'center', alignItems: 'center' },
    radioIn: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#3b82f6' },
    footer: { padding: 20, backgroundColor: '#0f172a', borderTopWidth: 1, borderTopColor: '#1e293b' },
    payBtn: { backgroundColor: '#3b82f6', padding: 18, borderRadius: 12, alignItems: 'center' },
    payBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});
