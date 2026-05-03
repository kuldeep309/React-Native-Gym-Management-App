import React, { useState, useLayoutEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    try {
      const storedUser = await AsyncStorage.getItem('user');

      if (!storedUser) {
        Alert.alert('Error', 'No registered user found. Please register first.');
        return;
      }

      const user = JSON.parse(storedUser);

      if (email === user.email && password === user.password) {
        const userRole = user.role || 'Member';
        Alert.alert('Success', `Login successful as ${userRole}`);
        navigation.navigate('Home');
      } else {
        Alert.alert('Error', 'Invalid email or password');
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to login');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.page}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="light-content" backgroundColor="#1D4ED8" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <LinearGradient colors={['#1D4ED8', '#4338CA']} style={styles.header}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>
            Login to continue managing your gym account
          </Text>
        </LinearGradient>

        <View style={styles.card}>
          <Text style={styles.label}>Email</Text>
          <View style={styles.inputBox}>
            <Ionicons name="mail-outline" size={24} color="#6B7280" />
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="#7B8190"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <Text style={styles.label}>Password</Text>
          <View style={styles.inputBox}>
            <Ionicons name="lock-closed-outline" size={24} color="#6B7280" />
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              placeholderTextColor="#7B8190"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={25}
                color="#6B7280"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity activeOpacity={0.8}>
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.primaryButton}
            onPress={handleLogin}
          >
            <Text style={styles.primaryText}>Login</Text>
          </TouchableOpacity>

          <View style={styles.dividerRow}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.divider} />
          </View>

          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.createButton}
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.createText}>Create New Account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#F4F7FB',
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    paddingTop: 95,
    paddingBottom: 150,
    paddingHorizontal: 24,
  },
  title: {
    color: '#ffffff',
    fontSize: 40,
    fontWeight: '900',
    marginBottom: 18,
  },
  subtitle: {
    color: '#DDE6FF',
    fontSize: 19,
    fontWeight: '800',
    lineHeight: 28,
  },
  card: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    marginTop: -105,
    borderRadius: 30,
    paddingHorizontal: 24,
    paddingTop: 34,
    paddingBottom: 36,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  label: {
    color: '#6B7280',
    fontSize: 17,
    fontWeight: '900',
    marginBottom: 10,
    marginLeft: 4,
  },
  inputBox: {
    height: 66,
    backgroundColor: '#F1F3F6',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  input: {
    flex: 1,
    color: '#111827',
    fontSize: 17,
    fontWeight: '600',
    marginLeft: 13,
  },
  forgotText: {
    color: '#0B55D9',
    fontSize: 16,
    fontWeight: '900',
    textAlign: 'right',
    marginTop: -10,
    marginBottom: 30,
  },
  primaryButton: {
    backgroundColor: '#0B55D9',
    height: 64,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0B55D9',
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 5,
  },
  primaryText: {
    color: '#ffffff',
    fontSize: 21,
    fontWeight: '900',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 34,
  },
  divider: {
    flex: 1,
    height: 1.5,
    backgroundColor: '#CBD2E1',
  },
  dividerText: {
    color: '#6B7280',
    fontSize: 15,
    fontWeight: '900',
    marginHorizontal: 18,
    letterSpacing: 2,
  },
  createButton: {
    height: 62,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#0B55D9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  createText: {
    color: '#0B55D9',
    fontSize: 19,
    fontWeight: '900',
  },
});