import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen({ navigation }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    };

    getUser();
  }, []);

  const handleLogout = () => {
    navigation.navigate('Welcome');
  };

  return (
    <View style={styles.page}>
      <View style={styles.headerCard}>
        <Text style={styles.smallText}>Welcome back</Text>
        <Text style={styles.title}>
          {user ? user.name : 'Gym Member'}
        </Text>
        <Text style={styles.subtitle}>
          Sprint 1 prototype: member registration and login completed.
        </Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.cardTitle}>Account Details</Text>

        <View style={styles.row}>
          <Text style={styles.label}>Name</Text>
          <Text style={styles.value}>{user ? user.name : '-'}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{user ? user.email : '-'}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.primaryButton}>
        <Text style={styles.primaryText}>Continue to Membership Plans</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#101820',
    padding: 24,
    justifyContent: 'center',
  },
  headerCard: {
    backgroundColor: '#00A86B',
    borderRadius: 22,
    padding: 24,
    marginBottom: 18,
  },
  smallText: {
    color: '#eafff6',
    fontSize: 15,
    marginBottom: 6,
  },
  title: {
    color: '#ffffff',
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    color: '#eafff6',
    fontSize: 15,
    lineHeight: 22,
  },
  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 22,
    padding: 22,
    marginBottom: 18,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#101820',
    marginBottom: 16,
  },
  row: {
    marginBottom: 12,
  },
  label: {
    color: '#777',
    fontSize: 14,
  },
  value: {
    color: '#101820',
    fontSize: 17,
    fontWeight: 'bold',
    marginTop: 3,
  },
  primaryButton: {
    backgroundColor: '#00A86B',
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    borderColor: '#00A86B',
    borderWidth: 1,
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: 'center',
  },
  logoutText: {
    color: '#00A86B',
    fontSize: 16,
    fontWeight: 'bold',
  },
});