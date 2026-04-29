import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [membershipPlan, setMembershipPlan] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const storedUser = await AsyncStorage.getItem('user');
      const storedPlan = await AsyncStorage.getItem('membershipPlan');
      const storedClass = await AsyncStorage.getItem('selectedClass');

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }

      if (storedPlan) {
        setMembershipPlan(JSON.parse(storedPlan));
      }

      if (storedClass) {
        setSelectedClass(JSON.parse(storedClass));
      }
    };

    const unsubscribe = navigation.addListener('focus', loadData);
    return unsubscribe;
  }, [navigation]);

  const handleLogout = () => {
    navigation.navigate('Welcome');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.page}>
        <View style={styles.headerCard}>
          <Text style={styles.smallText}>Welcome back</Text>
          <Text style={styles.title}>{user ? user.name : 'Gym Member'}</Text>
          <Text style={styles.subtitle}>
            Manage your gym account, membership plan and billing status.
          </Text>
        </View>

        <View style={styles.card}>
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

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Membership & Billing</Text>

          {membershipPlan ? (
            <>
              <View style={styles.row}>
                <Text style={styles.label}>Plan</Text>
                <Text style={styles.value}>{membershipPlan.name}</Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.label}>Price</Text>
                <Text style={styles.value}>{membershipPlan.price}</Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.label}>Status</Text>
                <Text style={styles.activeStatus}>{membershipPlan.status}</Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.label}>Billing Date</Text>
                <Text style={styles.value}>{membershipPlan.billingDate}</Text>
              </View>
            </>
          ) : (
            <Text style={styles.emptyText}>No membership plan selected yet.</Text>
          )}

        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Class & Activity</Text>

          {selectedClass ? (
            <>
              <View style={styles.row}>
                <Text style={styles.label}>Class</Text>
                <Text style={styles.value}>{selectedClass.name}</Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.label}>Time</Text>
                <Text style={styles.value}>{selectedClass.time}</Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.label}>Trainer</Text>
                <Text style={styles.value}>{selectedClass.trainer}</Text>
              </View>
            </>
          ) : (
            <Text style={styles.emptyText}>
              No class selected yet.
            </Text>
          )}
        </View>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate('Membership')}
        >
          <Text style={styles.primaryText}>
            {membershipPlan ? 'Change Membership Plan' : 'Choose Membership Plan'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate('Classes')}
        >
          <Text style={styles.primaryText}>
            Choose Class / Activity
          </Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#071A12',
  },
  page: {
    padding: 20,
    paddingBottom: 40,
  },
  headerCard: {
    backgroundColor: '#00A86B',
    borderRadius: 24,
    padding: 24,
    marginBottom: 18,
  },
  smallText: {
    color: '#E8FFF5',
    fontSize: 14,
    marginBottom: 6,
  },
  title: {
    color: '#ffffff',
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    color: '#E8FFF5',
    fontSize: 15,
    lineHeight: 22,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 22,
    padding: 22,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#101820',
    marginBottom: 18,
  },
  row: {
    marginBottom: 14,
  },
  label: {
    color: '#777',
    fontSize: 13,
    marginBottom: 4,
  },
  value: {
    color: '#101820',
    fontSize: 16,
    fontWeight: 'bold',
  },
  activeStatus: {
    color: '#00A86B',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyText: {
    color: '#777',
    fontSize: 15,
  },
  primaryButton: {
    backgroundColor: '#00A86B',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 12,
  },
  primaryText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    borderColor: '#00A86B',
    borderWidth: 1.5,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  logoutText: {
    color: '#00A86B',
    fontSize: 16,
    fontWeight: 'bold',
  },
});