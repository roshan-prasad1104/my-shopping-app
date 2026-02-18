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
    const { products, loading, deleteProduct, updateProduct, addProduct: addNewProduct } = useProducts();
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
    const [editForm, setEditForm] = useState({ title: '', price: '' });
    const [showAddForm, setShowAddForm] = useState(false);
    const [newProduct, setNewProduct] = useState({
        title: '',
        price: '',
        category: 'electronics',
        image: null
    });

    const handleEdit = (item) => {
        setEditingId(item.id);
        setEditForm({ title: item.title, price: item.price.toString() });
    };

    const saveEdit = (id) => {
        const item = products.find(p => p.id === id);
        updateProduct({ ...item, title: editForm.title, price: parseFloat(editForm.price) });
        setEditingId(null);
        Alert.alert("Success", "Product updated globally!");
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 4],
            quality: 1,
        });

        if (!result.canceled) {
            setNewProduct({ ...newProduct, image: result.assets[0].uri });
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
            image: null
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

                            <View style={styles.imagePickerContainer}>
                                <TouchableOpacity onPress={pickImage} style={styles.imagePickerBtn}>
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
                <View style={styles.inventoryCard}>
                    <Text style={styles.cardTitle}>📦 Inventory Manager</Text>
                    {Object.keys(products.reduce((acc, p) => {
                        if (!acc[p.category]) acc[p.category] = [];
                        acc[p.category].push(p);
                        return acc;
                    }, {})).map(category => (
                        <View key={category} style={{ marginBottom: 20 }}>
                            <Text style={styles.typeLabel}>{category.toUpperCase()}</Text>
                            {products.filter(p => p.category === category).map(item => (
                                <View key={item.id} style={styles.productRowWrapper}>
                                    {editingId === item.id ? (
                                        <View style={styles.editForm}>
                                            <TextInput
                                                style={styles.editInput}
                                                value={editForm.title}
                                                onChangeText={(t) => setEditForm({ ...editForm, title: t })}
                                                placeholder="Title"
                                                placeholderTextColor="#94a3b8"
                                            />
                                            <TextInput
                                                style={[styles.editInput, { width: 80 }]}
                                                value={editForm.price}
                                                onChangeText={(p) => setEditForm({ ...editForm, price: p })}
                                                keyboardType="numeric"
                                                placeholder="Price"
                                                placeholderTextColor="#94a3b8"
                                            />
                                            <TouchableOpacity onPress={() => saveEdit(item.id)} style={styles.saveBtn}>
                                                <Text style={styles.saveBtnText}>Save</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => setEditingId(null)} style={styles.cancelBtn}>
                                                <Text style={styles.cancelBtnText}>✕</Text>
                                            </TouchableOpacity>
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
});
