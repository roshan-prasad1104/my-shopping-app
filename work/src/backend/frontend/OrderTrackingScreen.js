import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useProducts } from './ProductContext';

export default function OrderTrackingScreen({ navigation, route }) {
    const { order: initialOrder } = route.params;
    const { orders } = useProducts();

    // Always find the latest status from global state
    const order = orders.find(o => o.id === initialOrder.id) || initialOrder;

    const steps = [
        { label: 'Order Placed', status: 'completed', icon: '📝' },
        { label: 'Processing', status: order.status === 'Processing' ? 'active' : 'completed', icon: '⚙️' },
        { label: 'Packed', status: order.status === 'Packed' ? 'active' : (order.status === 'Processing' ? 'pending' : 'completed'), icon: '📦' },
        { label: 'Out for Delivery', status: order.status === 'Out for Delivery' ? 'active' : (order.status === 'Processing' || order.status === 'Packed' ? 'pending' : 'completed'), icon: '🚚' },
        { label: 'Delivered', status: order.status === 'Delivered' ? 'active' : 'pending', icon: '✅' },
    ];

    return (
        <ScrollView style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.trackingTitle}>Tracking ID: {order.id}</Text>
                <Text style={styles.orderDate}>Ordered on: {new Date(order.timestamp).toLocaleDateString()}</Text>
            </View>

            <View style={styles.statusContainer}>
                {steps.map((step, idx) => (
                    <View key={idx} style={styles.stepRow}>
                        <View style={styles.indicatorContainer}>
                            <View style={[
                                styles.dot,
                                step.status === 'completed' && styles.dotCompleted,
                                step.status === 'active' && styles.dotActive
                            ]} />
                            {idx < steps.length - 1 && (
                                <View style={[
                                    styles.line,
                                    step.status === 'completed' && styles.lineCompleted
                                ]} />
                            )}
                        </View>
                        <View style={styles.stepTextContainer}>
                            <Text style={[
                                styles.stepLabel,
                                step.status === 'active' && styles.stepLabelActive,
                                step.status === 'pending' && styles.stepLabelPending
                            ]}>
                                {step.icon} {step.label}
                            </Text>
                            {step.status === 'active' && <Text style={styles.activeSub}>In Progress...</Text>}
                        </View>
                    </View>
                ))}
            </View>

            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Delivery Address</Text>
                <Text style={styles.addressText}>{order.shipping.name}</Text>
                <Text style={styles.addressText}>{order.shipping.address}</Text>
                <Text style={styles.addressText}>Ph: {order.shipping.phone}</Text>
            </View>

            <TouchableOpacity
                style={styles.homeBtn}
                onPress={() => navigation.navigate('Home')}
            >
                <Text style={styles.homeBtnText}>Back to Home</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0f172a', padding: 20 },
    card: { backgroundColor: '#1e293b', borderRadius: 15, padding: 20, marginBottom: 20 },
    trackingTitle: { color: '#3b82f6', fontSize: 18, fontWeight: 'bold' },
    orderDate: { color: '#94a3b8', fontSize: 14, marginTop: 5 },
    statusContainer: { backgroundColor: '#1e293b', borderRadius: 15, padding: 20, marginBottom: 20 },
    stepRow: { flexDirection: 'row', height: 70 },
    indicatorContainer: { alignItems: 'center', width: 30 },
    dot: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#334155', zIndex: 1 },
    dotCompleted: { backgroundColor: '#4ade80' },
    dotActive: { backgroundColor: '#3b82f6', width: 16, height: 16, borderRadius: 8, borderWidth: 3, borderColor: '#60a5fa' },
    line: { width: 2, flex: 1, backgroundColor: '#334155' },
    lineCompleted: { backgroundColor: '#4ade80' },
    stepTextContainer: { marginLeft: 15, flex: 1 },
    stepLabel: { color: '#f8fafc', fontSize: 16, fontWeight: '600' },
    stepLabelActive: { color: '#3b82f6' },
    stepLabelPending: { color: '#64748b' },
    activeSub: { color: '#3b82f6', fontSize: 12, marginTop: 2 },
    sectionTitle: { color: '#93c5fd', fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
    addressText: { color: '#cbd5e1', fontSize: 14, marginBottom: 3 },
    homeBtn: { backgroundColor: '#3b82f6', padding: 18, borderRadius: 12, alignItems: 'center', marginBottom: 40 },
    homeBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});
