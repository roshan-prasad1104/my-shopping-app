import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        try {
            // Load Products
            const storedProducts = await AsyncStorage.getItem('custom_products');
            if (storedProducts) {
                setProducts(JSON.parse(storedProducts));
            } else {
                const response = await axios.get('https://fakestoreapi.com/products');
                setProducts(response.data);
                await AsyncStorage.setItem('custom_products', JSON.stringify(response.data));
            }

            // Load Orders
            const storedOrders = await AsyncStorage.getItem('store_orders');
            if (storedOrders) {
                setOrders(JSON.parse(storedOrders));
            }
        } catch (error) {
            console.error('Initial load error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const saveProducts = async (updatedList) => {
        try {
            await AsyncStorage.setItem('custom_products', JSON.stringify(updatedList));
        } catch (e) {
            console.error('Failed to save products:', e);
        }
    };

    const saveOrders = async (updatedList) => {
        try {
            await AsyncStorage.setItem('store_orders', JSON.stringify(updatedList));
        } catch (e) {
            console.error('Failed to save orders:', e);
        }
    };

    const addProduct = (newProduct) => {
        setProducts(prev => {
            const newList = [newProduct, ...prev];
            saveProducts(newList);
            return newList;
        });
    };

    const updateProduct = (updatedProduct) => {
        setProducts(prev => {
            const newList = prev.map(p => p.id === updatedProduct.id ? updatedProduct : p);
            saveProducts(newList);
            return newList;
        });
    };

    const deleteProduct = (id) => {
        setProducts(prev => {
            const newList = prev.filter(p => p.id !== id);
            saveProducts(newList);
            return newList;
        });
    };

    const addOrder = (order) => {
        setOrders(prev => {
            const newOrders = [order, ...prev];
            saveOrders(newOrders);
            return newOrders;
        });
    };

    const updateOrder = (updatedOrder) => {
        setOrders(prev => {
            const newOrders = prev.map(o => o.id === updatedOrder.id ? updatedOrder : o);
            saveOrders(newOrders);
            return newOrders;
        });
    };

    return (
        <ProductContext.Provider value={{
            products,
            orders,
            loading,
            addProduct,
            updateProduct,
            deleteProduct,
            addOrder,
            updateOrder,
            refreshProducts: loadData
        }}>
            {children}
        </ProductContext.Provider>
    );
};

export const useProducts = () => useContext(ProductContext);
