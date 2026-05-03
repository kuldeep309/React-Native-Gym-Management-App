import React, { useEffect, useState, useLayoutEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function ProfileScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Member');
  const [storedPassword, setStoredPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const isStaff = role === 'Staff';

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');

        if (storedUser) {
          const user = JSON.parse(storedUser);
          setName(user.name || '');
          setEmail(user.email || '');
          setRole(user.role || 'Member');
          setStoredPassword(user.password || '');
        }
      } catch (error) {
        Alert.alert('Error', 'Unable to load profile details.');
      }
    };

    const unsubscribe = navigation.addListener('focus', loadUser);
    return unsubscribe;
  }, [navigation]);

  const handleUpdateProfile = async () => {
    if (!name || !email) {
      Alert.alert('Error', 'Name and email are required.');
      return;
    }

    if (!email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address.');
      return;
    }

    if (newPassword && newPassword.length < 6) {
      Alert.alert('Error', 'New password must be at least 6 characters.');
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    const updatedUser = {
      name,
      email,
      role,
      password: newPassword ? newPassword : storedPassword,
    };

    try {
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      setStoredPassword(updatedUser.password);
      setNewPassword('');
      setConfirmPassword('');
      Alert.alert('Success', 'Profile updated successfully.');
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert('Error', 'Unable to update profile.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#1554D9" />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.page}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <LinearGradient colors={['#1554D9', '#4338CA']} style={styles.header}>
            <Text style={styles.headerLabel}>PROFILE</Text>
            <Text style={styles.headerTitle}>Manage Account</Text>
            <Text style={styles.headerSub}>
              Update your personal details and account information.
            </Text>
          </LinearGradient>

          <View style={styles.profileCard}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>
                {name ? name.charAt(0).toUpperCase() : 'G'}
              </Text>
            </View>

            <Text style={styles.profileName}>{name || 'Gym User'}</Text>
            <Text style={styles.profileEmail}>{email || 'user@gympro.com'}</Text>

            <View style={styles.roleBadge}>
              <Ionicons
                name={isStaff ? 'briefcase-outline' : 'person-outline'}
                size={16}
                color="#1554D9"
              />
              <Text style={styles.roleBadgeText}>
                {isStaff ? 'Staff Account' : 'Member Account'}
              </Text>
            </View>
          </View>

          <View style={styles.formCard}>
            <Text style={styles.sectionTitle}>Personal Details</Text>

            <Text style={styles.label}>Full Name</Text>
            <View style={styles.inputBox}>
              <Ionicons name="person-outline" size={23} color="#64748B" />
              <TextInput
                style={styles.input}
                placeholder="Enter full name"
                placeholderTextColor="#94A3B8"
                value={name}
                onChangeText={setName}
              />
            </View>

            <Text style={styles.label}>Email Address</Text>
            <View style={styles.inputBox}>
              <Ionicons name="mail-outline" size={23} color="#64748B" />
              <TextInput
                style={styles.input}
                placeholder="Enter email address"
                placeholderTextColor="#94A3B8"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            <Text style={styles.label}>Account Role</Text>
            <View style={styles.roleInfoBox}>
              <Ionicons
                name={isStaff ? 'briefcase-outline' : 'person-outline'}
                size={22}
                color="#1554D9"
              />
              <View style={styles.roleTextBox}>
                <Text style={styles.roleTitle}>{role}</Text>
                <Text style={styles.roleDescription}>
                  {isStaff
                    ? 'Staff can manage class schedules and trainer assignments.'
                    : 'Members can manage profile, membership, classes and trainer details.'}
                </Text>
              </View>
            </View>

            <Text style={styles.sectionTitle}>Change Password</Text>

            <Text style={styles.helperText}>
              Leave password fields empty if you do not want to change your password.
            </Text>

            <Text style={styles.label}>New Password</Text>
            <View style={styles.inputBox}>
              <Ionicons name="lock-closed-outline" size={23} color="#64748B" />
              <TextInput
                style={styles.input}
                placeholder="Enter new password"
                placeholderTextColor="#94A3B8"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry={!showNewPassword}
              />
              <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}>
                <Ionicons
                  name={showNewPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={23}
                  color="#64748B"
                />
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Confirm Password</Text>
            <View style={styles.inputBox}>
              <Ionicons name="lock-closed-outline" size={23} color="#64748B" />
              <TextInput
                style={styles.input}
                placeholder="Confirm new password"
                placeholderTextColor="#94A3B8"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                <Ionicons
                  name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={23}
                  color="#64748B"
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={handleUpdateProfile}>
              <Text style={styles.saveText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerItem} onPress={() => navigation.navigate('Home')}>
          <Ionicons name="grid-outline" size={23} color="#94A3B8" />
          <Text style={styles.footerText}>Home</Text>
        </TouchableOpacity>

        {!isStaff && (
          <TouchableOpacity
            style={styles.footerItem}
            onPress={() => navigation.navigate('Membership')}
          >
            <Ionicons name="card-outline" size={23} color="#94A3B8" />
            <Text style={styles.footerText}>Membership</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.footerItem} onPress={() => navigation.navigate('Classes')}>
          <MaterialCommunityIcons name="calendar-clock" size={23} color="#94A3B8" />
          <Text style={styles.footerText}>Classes</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.footerItem} onPress={() => navigation.navigate('Trainer')}>
          <MaterialCommunityIcons name="dumbbell" size={23} color="#94A3B8" />
          <Text style={styles.footerText}>Trainers</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.footerItem, styles.footerActive]}>
          <Ionicons name="person-outline" size={23} color="#1554D9" />
          <Text style={styles.footerActiveText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4F7FB',
  },
  keyboardView: {
    flex: 1,
  },
  page: {
    paddingBottom: 115,
  },
  header: {
    paddingTop: 62,
    paddingHorizontal: 22,
    paddingBottom: 72,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerLabel: {
    color: '#DDE6FF',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 3,
    marginBottom: 8,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  headerSub: {
    color: '#E0E7FF',
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 22,
    marginTop: 10,
  },
  profileCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 18,
    marginTop: -42,
    borderRadius: 26,
    padding: 22,
    alignItems: 'center',
    shadowColor: '#0F172A',
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 5,
  },
  avatarCircle: {
    width: 82,
    height: 82,
    borderRadius: 28,
    backgroundColor: '#EEF4FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  avatarText: {
    color: '#1554D9',
    fontSize: 34,
    fontWeight: '900',
  },
  profileName: {
    color: '#111827',
    fontSize: 22,
    fontWeight: '900',
  },
  profileEmail: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 6,
  },
  roleBadge: {
    backgroundColor: '#EEF4FF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
  },
  roleBadgeText: {
    color: '#1554D9',
    fontSize: 13,
    fontWeight: '900',
    marginLeft: 6,
  },
  formCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 18,
    marginTop: 18,
    borderRadius: 24,
    padding: 20,
    shadowColor: '#0F172A',
    shadowOpacity: 0.05,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  sectionTitle: {
    color: '#111827',
    fontSize: 19,
    fontWeight: '900',
    marginBottom: 14,
    marginTop: 4,
  },
  helperText: {
    color: '#64748B',
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 20,
    marginBottom: 16,
  },
  label: {
    color: '#334155',
    fontSize: 14,
    fontWeight: '900',
    marginBottom: 8,
    marginLeft: 4,
  },
  inputBox: {
    height: 60,
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  input: {
    flex: 1,
    color: '#111827',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
  roleInfoBox: {
    backgroundColor: '#F1F5FF',
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 22,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  roleTextBox: {
    flex: 1,
    marginLeft: 12,
  },
  roleTitle: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '900',
  },
  roleDescription: {
    color: '#64748B',
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 19,
    marginTop: 4,
  },
  saveButton: {
    backgroundColor: '#1554D9',
    height: 56,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#1554D9',
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 5,
  },
  saveText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '900',
  },
  footer: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 10,
    height: 74,
    backgroundColor: '#ffffff',
    borderRadius: 24,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    shadowColor: '#0F172A',
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
    borderWidth: 1,
    borderColor: '#E5EAF3',
  },
  footerItem: {
    flex: 1,
    height: 56,
    marginHorizontal: 3,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerActive: {
    backgroundColor: '#EEF4FF',
  },
  footerText: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: '900',
    marginTop: 4,
  },
  footerActiveText: {
    color: '#1554D9',
    fontSize: 10,
    fontWeight: '900',
    marginTop: 4,
  },
});