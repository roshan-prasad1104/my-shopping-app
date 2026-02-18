import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ImageBackground,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Animated
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '../firebaseConfig';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSignup, setIsSignup] = useState(false);

    // Animation values
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;
    const buttonScale = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        // Fade in and slide up animation on mount
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.spring(slideAnim, {
                toValue: 0,
                tension: 50,
                friction: 7,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    // Animate when switching between login/signup
    useEffect(() => {
        Animated.sequence([
            Animated.timing(fadeAnim, {
                toValue: 0.7,
                duration: 150,
                useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 150,
                useNativeDriver: true,
            }),
        ]).start();
    }, [isSignup]);

    const [role, setRole] = useState('store'); // 'store' or 'admin'

    const handleAuth = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Please fill in all fields.");
            return;
        }

        // Button press animation
        Animated.sequence([
            Animated.timing(buttonScale, {
                toValue: 0.95,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(buttonScale, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            }),
        ]).start();

        try {
            if (isSignup) {
                await createUserWithEmailAndPassword(auth, email, password);
                Alert.alert("Success", "Account created successfully!");
            } else {
                await signInWithEmailAndPassword(auth, email, password);
            }
            // Save role preference
            await AsyncStorage.setItem('userRole', role);
        } catch (error) {
            Alert.alert("Authentication Error", error.message);
        }
    };

    return (
        <ImageBackground
            source={require("../../../assets/shopping.jpg")}
            style={styles.container}
            resizeMode="cover"
        >
            <View style={styles.overlay}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={styles.innerContainer}
                >
                    <ScrollView contentContainerStyle={styles.scrollContent}>
                        <Animated.View
                            style={[
                                styles.card,
                                {
                                    opacity: fadeAnim,
                                    transform: [{ translateY: slideAnim }]
                                }
                            ]}
                        >
                            <Text style={styles.title}>{isSignup ? "Create Account" : "Welcome Back"}</Text>
                            <Text style={styles.subtitle}>
                                {isSignup ? "Sign up to start shopping" : "Sign in to continue"}
                            </Text>

                            <View style={styles.roleContainer}>
                                <TouchableOpacity
                                    style={[styles.roleButton, role === 'store' && styles.activeRole]}
                                    onPress={() => setRole('store')}
                                >
                                    <Text style={[styles.roleText, role === 'store' && styles.activeRoleText]}>🛒 Store</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.roleButton, role === 'admin' && styles.activeRole]}
                                    onPress={() => setRole('admin')}
                                >
                                    <Text style={[styles.roleText, role === 'admin' && styles.activeRoleText]}>👨‍💼 Admin</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Email</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="your@email.com"
                                    placeholderTextColor="#94a3b8"
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Password</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="••••••••"
                                    placeholderTextColor="#94a3b8"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry
                                />
                            </View>

                            <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                                <TouchableOpacity style={styles.authButton} onPress={handleAuth}>
                                    <Text style={styles.authButtonText}>{isSignup ? "Sign Up" : "Sign In"}</Text>
                                </TouchableOpacity>
                            </Animated.View>

                            <View style={styles.divider}>
                                <View style={styles.line} />
                                <Text style={styles.dividerText}>OR</Text>
                                <View style={styles.line} />
                            </View>

                            <TouchableOpacity
                                style={styles.googleButton}
                                onPress={() => Alert.alert("Google Sign-In", "Google Sign-In requires additional configuration. Please use Email/Password for now.")}
                            >
                                <Text style={styles.googleButtonText}>Continue with Google</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.switchButton}
                                onPress={() => setIsSignup(!isSignup)}
                            >
                                <Text style={styles.switchText}>
                                    {isSignup ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
                                </Text>
                            </TouchableOpacity>
                        </Animated.View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(15, 23, 42, 0.7)', // Dark blue tint
        justifyContent: 'center',
    },
    innerContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 24,
    },
    card: {
        backgroundColor: 'rgba(30, 41, 59, 0.95)', // slate-800
        padding: 30,
        borderRadius: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 15,
        elevation: 10,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#f8fafc',
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#94a3b8',
        textAlign: 'center',
        marginBottom: 32,
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        color: '#e2e8f0',
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#0f172a',
        color: '#fff',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#334155',
    },
    authButton: {
        backgroundColor: '#3b82f6',
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 10,
    },
    authButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 24,
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: '#334155',
    },
    dividerText: {
        color: '#64748b',
        marginHorizontal: 10,
        fontSize: 12,
    },
    googleButton: {
        backgroundColor: '#fff',
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    googleButtonText: {
        color: '#1e293b',
        fontSize: 16,
        fontWeight: '600',
    },
    switchButton: {
        marginTop: 24,
        alignItems: 'center',
    },
    switchText: {
        color: '#3b82f6',
        fontSize: 14,
        fontWeight: '600',
    },
    roleContainer: {
        flexDirection: 'row',
        backgroundColor: '#0f172a',
        borderRadius: 12,
        padding: 4,
        marginBottom: 24,
    },
    roleButton: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 8,
    },
    activeRole: {
        backgroundColor: '#3b82f6',
    },
    roleText: {
        color: '#94a3b8',
        fontWeight: '600',
    },
    activeRoleText: {
        color: '#fff',
    },
});
