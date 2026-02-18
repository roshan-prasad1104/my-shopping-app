import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Alert,
    ActivityIndicator,
    ImageBackground,
    Image
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

import { useProducts } from './ProductContext';

export default function AdminDashboard({ navigation }) {
    const { products, orders, loading, deleteProduct, updateProduct, addProduct: addNewProduct, addOrder, updateOrder } = useProducts();
    const [activeTab, setActiveTab] = useState('inventory'); // 'inventory' or 'orders'
    const [stats, setStats] = useState({
        totalProducts: 0,
        categories: 0,
        avgPrice: 0
    });

    useEffect(() => {
        if (products.length > 0) {
            const cats = new Set(products.map(p => p.category)).size;
            const avg = products.reduce((acc, curr) => acc + curr.price, 0) / products.length;

            setStats({
                totalProducts: products.length,
                categories: cats,
                avgPrice: avg.toFixed(2)
            });
        }
    }, [products]);

    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({ title: '', price: '', category: '', image: null, description: '' });
    const [showAddForm, setShowAddForm] = useState(false);
    const [newProduct, setNewProduct] = useState({
        title: '',
        price: '',
        category: 'electronics',
        image: null,
        description: ''
    });

    const handleEdit = (item) => {
        setEditingId(item.id);
        setEditForm({
            title: item.title,
            price: item.price.toString(),
            category: item.category,
            image: item.image,
            description: item.description || ''
        });
    };

    const saveEdit = (id) => {
        const item = products.find(p => p.id === id);
        updateProduct({
            ...item,
            title: editForm.title,
            price: parseFloat(editForm.price),
            category: editForm.category,
            image: editForm.image,
            description: editForm.description
        });
        setEditingId(null);
        Alert.alert("Success", "Product updated globally!");
    };

    const pickImage = async (isEdit = false) => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 4],
            quality: 1,
        });

        if (!result.canceled) {
            if (isEdit) {
                setEditForm({ ...editForm, image: result.assets[0].uri });
            } else {
                setNewProduct({ ...newProduct, image: result.assets[0].uri });
            }
        }
    };

    const handleAddProduct = () => {
        if (!newProduct.title || !newProduct.price) {
            Alert.alert("Error", "Please enter title and price.");
            return;
        }

        const newItem = {
            ...newProduct,
            id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
            price: parseFloat(newProduct.price)
        };

        addNewProduct(newItem);
        setShowAddForm(false);
        setNewProduct({
            title: '',
            price: '',
            category: 'electronics',
            image: null,
            description: ''
        });
        Alert.alert("Success", "New product added to store!");
    };

    const handleDelete = (id) => {
        Alert.alert(
            "Delete Product",
            "This will delete product from the entire store.",
            [
                { text: "Cancel" },
                {
                    text: "Confirm Delete", onPress: () => {
                        deleteProduct(id);
                        Alert.alert("Success", "Product removed from store.");
                    }
                }
            ]
        );
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#3b82f6" />
                <Text style={{ color: '#94a3b8', marginTop: 10 }}>Loading Dashboard...</Text>
            </View>
        );
    }

    return (
        <ImageBackground source={require('../../../assets/shopping.jpg')} style={styles.container}>
            <ScrollView style={styles.overlay}>
                <View style={styles.header}>
                    <View>
                        <Text style={styles.headerTitle}>📊 Admin Console</Text>
                        <Text style={styles.headerSub}>Fake Store Management Panel</Text>
                    </View>
                    <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.storeBtn}>
                        <Text style={styles.storeBtnText}>🛒 Store</Text>
                    </TouchableOpacity>
                </View>

                {/* Tab Switcher */}
                <View style={styles.tabContainer}>
                    <TouchableOpacity
                        onPress={() => setActiveTab('inventory')}
                        style={[styles.tab, activeTab === 'inventory' && styles.activeTab]}
                    >
                        <Text style={[styles.tabText, activeTab === 'inventory' && styles.activeTabText]}>📦 Inventory</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setActiveTab('orders')}
                        style={[styles.tab, activeTab === 'orders' && styles.activeTab]}
                    >
                        <Text style={[styles.tabText, activeTab === 'orders' && styles.activeTabText]}>🧾 Orders ({orders.length})</Text>
                    </TouchableOpacity>
                </View>

                {activeTab === 'inventory' ? (
                    <>
                        {/* Stats Summary */}
                        <View style={styles.statsContainer}>
                            <View style={styles.statCard}>
                                <Text style={styles.statLabel}>Products</Text>
                                <Text style={styles.statValue}>{stats.totalProducts}</Text>
                            </View>
                            <View style={styles.statCard}>
                                <Text style={styles.statLabel}>Categories</Text>
                                <Text style={styles.statValue}>{stats.categories}</Text>
                            </View>
                            <View style={styles.statCard}>
                                <Text style={styles.statLabel}>Avg Price</Text>
                                <Text style={styles.statValue}>${stats.avgPrice}</Text>
                            </View>
                        </View>

                        {/* Add Product Section */}
                        <View style={[styles.inventoryCard, { marginBottom: 25 }]}>
                            <View style={styles.sectionHeaderRow}>
                                <Text style={styles.cardTitle}>➕ Add New Product</Text>
                                <TouchableOpacity
                                    onPress={() => setShowAddForm(!showAddForm)}
                                    style={[styles.toggleBtn, showAddForm && { backgroundColor: '#ef4444' }]}
                                >
                                    <Text style={styles.toggleBtnText}>{showAddForm ? 'Close' : 'Add'}</Text>
                                </TouchableOpacity>
                            </View>

                            {showAddForm && (
                                <View style={styles.addForm}>
                                    <TextInput
                                        style={styles.fullInput}
                                        placeholder="Product Title"
                                        placeholderTextColor="#94a3b8"
                                        value={newProduct.title}
                                        onChangeText={(t) => setNewProduct({ ...newProduct, title: t })}
                                    />

                                    <View style={{ marginVertical: 10 }}>
                                        <Text style={styles.inputLabel}>Product Description (Appears below Price)</Text>
                                        <TextInput
                                            style={[styles.fullInput, { height: 100, textAlignVertical: 'top' }]}
                                            placeholder="Enter materials, fit, features, and full context..."
                                            placeholderTextColor="#94a3b8"
                                            multiline
                                            numberOfLines={4}
                                            value={newProduct.description}
                                            onChangeText={(d) => setNewProduct({ ...newProduct, description: d })}
                                        />
                                    </View>

                                    <View style={styles.imagePickerContainer}>
                                        <TouchableOpacity onPress={() => pickImage(false)} style={styles.imagePickerBtn}>
                                            <Text style={styles.imagePickerBtnText}>🖼️ Choose Product Photo</Text>
                                        </TouchableOpacity>
                                        {newProduct.image && (
                                            <Image source={{ uri: newProduct.image }} style={styles.previewImage} />
                                        )}
                                    </View>

                                    <TextInput
                                        style={[styles.fullInput, { marginVertical: 10 }]}
                                        placeholder="Price"
                                        placeholderTextColor="#94a3b8"
                                        keyboardType="numeric"
                                        value={newProduct.price}
                                        onChangeText={(p) => setNewProduct({ ...newProduct, price: p })}
                                    />
                                    <View style={{ marginVertical: 10 }}>
                                        <Text style={styles.inputLabel}>Select Category</Text>
                                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryPicker}>
                                            {['electronics', 'jewelery', "men's clothing", "women's clothing"].map(cat => (
                                                <TouchableOpacity
                                                    key={cat}
                                                    onPress={() => setNewProduct({ ...newProduct, category: cat })}
                                                    style={[styles.catChip, newProduct.category === cat && styles.activeCatChip]}
                                                >
                                                    <Text style={[styles.catChipText, newProduct.category === cat && styles.activeCatChipText]}>
                                                        {cat.charAt(0).toUpperCase() + cat.slice(1).split("'")[0]}
                                                    </Text>
                                                </TouchableOpacity>
                                            ))}
                                        </ScrollView>
                                    </View>

                                    <TouchableOpacity onPress={handleAddProduct} style={styles.submitBtn}>
                                        <Text style={styles.submitBtnText}>Confirm Add Product</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>

                        {/* Inventory List Grouped by Type */}
                        <View style={[styles.inventoryCard, { paddingBottom: 5 }]}>
                            <Text style={styles.cardTitle}>📦 Inventory Manager</Text>
                            {Object.keys(products.reduce((acc, p) => {
                                if (!acc[p.category]) acc[p.category] = [];
                                acc[p.category].push(p);
                                return acc;
                            }, {})).map(category => (
                                <View key={category} style={{ marginTop: 20 }}>
                                    <Text style={styles.typeLabel}>{category.toUpperCase()}</Text>
                                    {products.filter(p => p.category === category).map(item => (
                                        <View key={item.id} style={styles.productRowWrapper}>
                                            {editingId === item.id ? (
                                                <View style={styles.expandedEditForm}>
                                                    <Text style={styles.editLabel}>Editing Product</Text>

                                                    <TextInput
                                                        style={styles.fullInput}
                                                        value={editForm.title}
                                                        onChangeText={(t) => setEditForm({ ...editForm, title: t })}
                                                        placeholder="Title"
                                                        placeholderTextColor="#94a3b8"
                                                    />

                                                    <View style={{ marginVertical: 10 }}>
                                                        <Text style={styles.inputLabel}>Product Description (Appears below Price)</Text>
                                                        <TextInput
                                                            style={[styles.fullInput, { height: 100, textAlignVertical: 'top' }]}
                                                            value={editForm.description}
                                                            onChangeText={(d) => setEditForm({ ...editForm, description: d })}
                                                            placeholder="Enter details..."
                                                            placeholderTextColor="#94a3b8"
                                                            multiline
                                                            numberOfLines={4}
                                                        />
                                                    </View>

                                                    <View style={styles.imagePickerContainer}>
                                                        <TouchableOpacity onPress={() => pickImage(true)} style={styles.imagePickerBtn}>
                                                            <Text style={styles.imagePickerBtnText}>🖼️ Change Photo</Text>
                                                        </TouchableOpacity>
                                                        {editForm.image && (
                                                            <Image source={{ uri: editForm.image }} style={styles.previewImage} />
                                                        )}
                                                    </View>

                                                    <TextInput
                                                        style={[styles.fullInput, { marginVertical: 10 }]}
                                                        value={editForm.price}
                                                        onChangeText={(p) => setEditForm({ ...editForm, price: p })}
                                                        keyboardType="numeric"
                                                        placeholder="Price"
                                                        placeholderTextColor="#94a3b8"
                                                    />

                                                    <View style={{ marginVertical: 10 }}>
                                                        <Text style={styles.inputLabel}>Change Category</Text>
                                                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryPicker}>
                                                            {['electronics', 'jewelery', "men's clothing", "women's clothing"].map(cat => (
                                                                <TouchableOpacity
                                                                    key={cat}
                                                                    onPress={() => setEditForm({ ...editForm, category: cat })}
                                                                    style={[styles.catChip, editForm.category === cat && styles.activeCatChip]}
                                                                >
                                                                    <Text style={[styles.catChipText, editForm.category === cat && styles.activeCatChipText]}>
                                                                        {cat.charAt(0).toUpperCase() + cat.slice(1).split("'")[0]}
                                                                    </Text>
                                                                </TouchableOpacity>
                                                            ))}
                                                        </ScrollView>
                                                    </View>

                                                    <View style={styles.editActions}>
                                                        <TouchableOpacity onPress={() => saveEdit(item.id)} style={[styles.submitBtn, { flex: 1, marginTop: 0 }]}>
                                                            <Text style={styles.submitBtnText}>Save Changes</Text>
                                                        </TouchableOpacity>
                                                        <TouchableOpacity onPress={() => setEditingId(null)} style={styles.cancelActionBtn}>
                                                            <Text style={styles.cancelActionBtnText}>Cancel</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                            ) : (
                                                <View style={styles.productRow}>
                                                    <View style={{ flex: 1 }}>
                                                        <Text style={styles.prodName} numberOfLines={1}>{item.title}</Text>
                                                        <Text style={styles.prodMeta}>${item.price}</Text>
                                                    </View>
                                                    <View style={styles.actionButtons}>
                                                        <TouchableOpacity onPress={() => handleEdit(item)} style={styles.editBtn}>
                                                            <Text style={styles.editBtnText}>✏️</Text>
                                                        </TouchableOpacity>
                                                        <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteBtn}>
                                                            <Text style={styles.deleteBtnText}>🗑️</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                            )}
                                        </View>
                                    ))}
                                </View>
                            ))}
                        </View>
                    </>
                ) : (
                    <View style={styles.inventoryCard}>
                        <Text style={styles.cardTitle}>📜 Customer Orders</Text>
                        {orders.length === 0 ? (
                            <Text style={{ color: '#94a3b8', marginTop: 20, textAlign: 'center' }}>No orders placed yet.</Text>
                        ) : (
                            orders.map(order => (
                                <View key={order.id} style={styles.orderCard}>
                                    <View style={styles.orderHeader}>
                                        <Text style={styles.orderId}>{order.id}</Text>
                                        <TouchableOpacity
                                            onPress={() => {
                                                const statuses = ['Processing', 'Packed', 'Out for Delivery', 'Delivered'];
                                                const nextIdx = (statuses.indexOf(order.status) + 1) % statuses.length;
                                                updateOrder({ ...order, status: statuses[nextIdx] });
                                            }}
                                            style={[
                                                styles.statusBadge,
                                                order.status === 'Delivered' && { backgroundColor: '#22c55e' }
                                            ]}
                                        >
                                            <Text style={styles.statusText}>{order.status}</Text>
                                        </TouchableOpacity>
                                    </View>

                                    <Text style={styles.orderCustomer}>{order.shipping.name}</Text>
                                    <Text style={styles.orderAddress}>{order.shipping.address}</Text>

                                    <View style={styles.orderFooter}>
                                        <Text style={styles.orderItems}>{order.items.length} Items</Text>
                                        <Text style={styles.orderTotal}>${order.total.toFixed(2)}</Text>
                                    </View>
                                </View>
                            ))
                        )}
                    </View>
                )}

                <View style={{ height: 10 }} />
            </ScrollView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    overlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.92)', padding: 20 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f172a' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, marginBottom: 20 },
    headerTitle: { fontSize: 26, fontWeight: 'bold', color: '#fff' },
    headerSub: { color: '#94a3b8', fontSize: 13, marginTop: 2 },
    storeBtn: { backgroundColor: '#10b981', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 10 },
    storeBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
    statsContainer: { flexDirection: 'row', gap: 10, marginBottom: 25 },
    statCard: { flex: 1, backgroundColor: 'rgba(30, 41, 59, 0.9)', padding: 15, borderRadius: 15, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(59, 130, 246, 0.2)' },
    statLabel: { color: '#94a3b8', fontSize: 12, marginBottom: 5 },
    statValue: { color: '#3b82f6', fontSize: 18, fontWeight: 'bold' },
    inventoryCard: { backgroundColor: 'rgba(30, 41, 59, 0.95)', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    cardTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
    sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
    toggleBtn: { backgroundColor: '#3b82f6', paddingHorizontal: 15, paddingVertical: 6, borderRadius: 8 },
    toggleBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
    addForm: { marginTop: 10 },
    fullInput: { backgroundColor: '#0f172a', color: '#fff', padding: 12, borderRadius: 10, fontSize: 14, borderWidth: 1, borderColor: '#334155' },
    submitBtn: { backgroundColor: '#3b82f6', padding: 14, borderRadius: 12, alignItems: 'center', marginTop: 10 },
    submitBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
    imagePickerContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 10, gap: 10 },
    imagePickerBtn: { flex: 1, backgroundColor: 'rgba(59, 130, 246, 0.1)', padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#3b82f6', borderStyle: 'dashed', alignItems: 'center' },
    imagePickerBtnText: { color: '#3b82f6', fontWeight: '600' },
    previewImage: { width: 50, height: 50, borderRadius: 8 },
    inputLabel: { color: '#94a3b8', fontSize: 12, marginBottom: 8, fontWeight: '600' },
    categoryPicker: { flexDirection: 'row', marginBottom: 5 },
    catChip: { backgroundColor: '#0f172a', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, marginRight: 10, borderWidth: 1, borderColor: '#334155' },
    activeCatChip: { backgroundColor: '#3b82f6', borderColor: '#3b82f6' },
    catChipText: { color: '#94a3b8', fontSize: 12, fontWeight: '600' },
    activeCatChipText: { color: '#fff' },
    typeLabel: { color: '#3b82f6', fontSize: 12, fontWeight: 'bold', letterSpacing: 1, marginBottom: 10, opacity: 0.8 },
    productRowWrapper: { borderBottomWidth: 1, borderBottomColor: 'rgba(51, 65, 85, 0.5)', paddingVertical: 10 },
    productRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 5 },
    editForm: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 5 },
    editInput: { flex: 1, backgroundColor: '#0f172a', color: '#fff', padding: 8, borderRadius: 8, fontSize: 14, borderWidth: 1, borderColor: '#334155' },
    saveBtn: { backgroundColor: '#10b981', padding: 10, borderRadius: 8 },
    saveBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
    cancelBtn: { padding: 10 },
    cancelBtnText: { color: '#94a3b8', fontSize: 16 },
    actionButtons: { flexDirection: 'row', alignItems: 'center', gap: 15 },
    prodName: { color: '#fff', fontSize: 15, fontWeight: '600' },
    prodMeta: { color: '#64748b', fontSize: 12, marginTop: 2 },
    editBtn: { padding: 5 },
    editBtnText: { fontSize: 18 },
    deleteBtn: { padding: 5 },
    deleteBtnText: { fontSize: 18 },
    expandedEditForm: { backgroundColor: 'rgba(15, 23, 42, 0.5)', padding: 15, borderRadius: 15, borderLeftWidth: 3, borderLeftColor: '#10b981' },
    editLabel: { color: '#10b981', fontSize: 12, fontWeight: 'bold', marginBottom: 12, textTransform: 'uppercase' },
    editActions: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 5 },
    cancelActionBtn: { padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#334155' },
    cancelActionBtnText: { color: '#94a3b8', fontWeight: '600' },
    tabContainer: { flexDirection: 'row', gap: 10, marginBottom: 20 },
    tab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 12, backgroundColor: 'rgba(30, 41, 59, 0.5)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
    activeTab: { backgroundColor: '#3b82f6', borderColor: '#3b82f6' },
    tabText: { color: '#94a3b8', fontWeight: 'bold' },
    activeTabText: { color: '#fff' },
    orderCard: { backgroundColor: 'rgba(15, 23, 42, 0.5)', borderRadius: 15, padding: 15, marginBottom: 15, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
    orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
    orderId: { color: '#3b82f6', fontWeight: 'bold', fontSize: 13 },
    statusBadge: { backgroundColor: '#334155', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
    statusText: { color: '#fff', fontSize: 11, fontWeight: 'bold' },
    orderCustomer: { color: '#f8fafc', fontWeight: 'bold', fontSize: 16, marginBottom: 4 },
    orderAddress: { color: '#94a3b8', fontSize: 12, marginBottom: 12 },
    orderFooter: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)', paddingTop: 10 },
    orderItems: { color: '#64748b', fontSize: 13 },
    orderTotal: { color: '#4ade80', fontWeight: 'bold', fontSize: 15 },
});
