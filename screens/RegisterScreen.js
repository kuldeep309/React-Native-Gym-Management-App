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

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Member');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const handleRegister = async () => {
    if (!name || !email || !role || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    const userData = {
      name,
      email,
      role,
      password,
    };

    try {
      await AsyncStorage.setItem('user', JSON.stringify(userData));

      await AsyncStorage.removeItem('membershipPlan');
      await AsyncStorage.removeItem('selectedClass');
      await AsyncStorage.removeItem('assignedTrainer');

      Alert.alert('Success', `Registration successful as ${role}`);
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Error', 'Unable to save user data');
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
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>
            Join GymPro and manage your fitness journey
          </Text>
        </LinearGradient>

        <View style={styles.card}>
          <Text style={styles.label}>Full Name</Text>
          <View style={styles.inputBox}>
            <Ionicons name="person-outline" size={23} color="#6B7280" />
            <TextInput
              style={styles.input}
              placeholder="Enter your name"
              placeholderTextColor="#7B8190"
              value={name}
              onChangeText={setName}
            />
          </View>

          <Text style={styles.label}>Email Address</Text>
          <View style={styles.inputBox}>
            <Ionicons name="mail-outline" size={23} color="#6B7280" />
            <TextInput
              style={styles.input}
              placeholder="name@example.com"
              placeholderTextColor="#7B8190"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <Text style={styles.label}>Select Role</Text>
          <View style={styles.roleRow}>
            <TouchableOpacity
              activeOpacity={0.85}
              style={[
                styles.roleButton,
                role === 'Member' && styles.roleButtonActive,
              ]}
              onPress={() => setRole('Member')}
            >
              <Ionicons
                name="person-outline"
                size={22}
                color={role === 'Member' ? '#ffffff' : '#6B7280'}
              />
              <Text
                style={[
                  styles.roleText,
                  role === 'Member' && styles.roleTextActive,
                ]}
              >
                Member
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.85}
              style={[
                styles.roleButton,
                role === 'Staff' && styles.roleButtonActive,
              ]}
              onPress={() => setRole('Staff')}
            >
              <Ionicons
                name="briefcase-outline"
                size={22}
                color={role === 'Staff' ? '#ffffff' : '#6B7280'}
              />
              <Text
                style={[
                  styles.roleText,
                  role === 'Staff' && styles.roleTextActive,
                ]}
              >
                Staff
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Password</Text>
          <View style={styles.inputBox}>
            <Ionicons name="lock-closed-outline" size={23} color="#6B7280" />
            <TextInput
              style={styles.input}
              placeholder="Enter password"
              placeholderTextColor="#7B8190"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <Text style={styles.label}>Confirm Password</Text>
          <View style={styles.inputBox}>
            <Ionicons name="lock-closed-outline" size={23} color="#6B7280" />
            <TextInput
              style={styles.input}
              placeholder="Confirm password"
              placeholderTextColor="#7B8190"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.primaryButton}
            onPress={handleRegister}
          >
            <Text style={styles.primaryText}>Sign Up</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.linkText}>
              Already have an account? <Text style={styles.link}>Login</Text>
            </Text>
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
    paddingTop: 78,
    paddingBottom: 130,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  title: {
    color: '#ffffff',
    fontSize: 38,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    color: '#E0E7FF',
    fontSize: 19,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 28,
  },
  card: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    marginTop: -88,
    borderRadius: 30,
    paddingHorizontal: 24,
    paddingTop: 30,
    paddingBottom: 34,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  label: {
    color: '#2B2F3A',
    fontSize: 16,
    fontWeight: '900',
    marginBottom: 10,
    marginLeft: 4,
  },
  inputBox: {
    height: 64,
    borderWidth: 1.5,
    borderColor: '#C8CEDD',
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 22,
  },
  input: {
    flex: 1,
    color: '#111827',
    fontSize: 17,
    fontWeight: '600',
    marginLeft: 12,
  },
  roleRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 22,
  },
  roleButton: {
    flex: 1,
    height: 60,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#C8CEDD',
    backgroundColor: '#F8FAFC',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  roleButtonActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  roleText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '900',
    marginLeft: 8,
  },
  roleTextActive: {
    color: '#ffffff',
  },
  primaryButton: {
    backgroundColor: '#2563EB',
    height: 64,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 28,
    shadowColor: '#2563EB',
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
  linkText: {
    color: '#2B2F3A',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  link: {
    color: '#0B55D9',
    fontWeight: '900',
  },
});