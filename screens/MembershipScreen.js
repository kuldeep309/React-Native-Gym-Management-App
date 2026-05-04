import React, { useState, useLayoutEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const plans = [
  {
    id: 1,
    name: 'Basic',
    price: '£20/month',
    description: 'Perfect for beginners',
    features: ['Gym access', 'Locker facility', 'Basic support'],
  },
  {
    id: 2,
    name: 'Standard',
    price: '£35/month',
    description: 'Best for regular members',
    features: ['Gym access', 'Group classes', 'Locker facility', 'Diet guidance'],
  },
  {
    id: 3,
    name: 'Premium',
    price: '£50/month',
    description: 'Complete fitness experience',
    features: ['Gym access', 'All classes', 'Personal trainer', 'Priority support'],
  },
];

export default function MembershipScreen({ navigation }) {
  const [selectedPlan, setSelectedPlan] = useState(null);

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const getUserId = (user) => user?.id || user?.email;

  const handleConfirm = async () => {
    if (!selectedPlan) {
      Alert.alert('Select a Plan', 'Please choose a membership plan first.');
      return;
    }

    try {
      const storedUser = await AsyncStorage.getItem('currentUser');

      if (!storedUser) {
        Alert.alert('Error', 'No logged-in user found.');
        return;
      }

      const user = JSON.parse(storedUser);
      const userId = getUserId(user);

      const startDate = new Date();
      const expiryDate = new Date();
      expiryDate.setMonth(expiryDate.getMonth() + 1);

      const subscriptionData = {
        ...selectedPlan,
        status: 'Active',
        startDate: startDate.toISOString(),
        billingDate: startDate.toLocaleDateString(),
        expiryDate: expiryDate.toISOString(),
      };

      // Save current active plan
      await AsyncStorage.setItem(
        `membershipPlan_${userId}`,
        JSON.stringify(subscriptionData)
      );

      // Save billing history
      const historyKey = `billingHistory_${userId}`;
      const storedHistory = await AsyncStorage.getItem(historyKey);
      const history = storedHistory ? JSON.parse(storedHistory) : [];

      const newHistoryItem = {
        planName: selectedPlan.name,
        amount: selectedPlan.price,
        date: startDate.toLocaleDateString(),
      };

      const updatedHistory = [newHistoryItem, ...history];

      await AsyncStorage.setItem(historyKey, JSON.stringify(updatedHistory));

      Alert.alert('Success', `${selectedPlan.name} plan activated successfully.`);
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert('Error', 'Unable to save membership plan.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#1554D9" />

      <ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>
        <LinearGradient colors={['#1554D9', '#4338CA']} style={styles.header}>
          <Text style={styles.headerLabel}>MEMBERSHIP</Text>
          <Text style={styles.headerTitle}>Choose Your Plan</Text>
          <Text style={styles.headerSub}>
            Select the right plan for your training goals.
          </Text>
        </LinearGradient>

        <View style={styles.content}>
          {plans.map((plan) => {
            const isSelected = selectedPlan?.id === plan.id;

            return (
              <TouchableOpacity
                key={plan.id}
                style={[styles.planCard, isSelected && styles.selectedPlanCard]}
                onPress={() => setSelectedPlan(plan)}
              >
                <View style={styles.planTop}>
                  <View>
                    <Text style={styles.planName}>{plan.name}</Text>
                    <Text style={styles.planDescription}>{plan.description}</Text>
                  </View>

                  <View style={[styles.radioCircle, isSelected && styles.radioCircleSelected]}>
                    {isSelected && <Ionicons name="checkmark" size={18} color="#ffffff" />}
                  </View>
                </View>

                <Text style={styles.price}>{plan.price}</Text>

                {plan.features.map((feature, index) => (
                  <View key={index} style={styles.featureRow}>
                    <Ionicons name="checkmark-circle" size={18} color="#1554D9" />
                    <Text style={styles.feature}>{feature}</Text>
                  </View>
                ))}
              </TouchableOpacity>
            );
          })}

          <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
            <Text style={styles.confirmText}>Confirm Membership Plan</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F4F7FB' },
  page: { paddingBottom: 100 },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 50,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerLabel: { color: '#DDE6FF', fontSize: 13, fontWeight: '900' },
  headerTitle: { color: '#fff', fontSize: 30, fontWeight: '900' },
  headerSub: { color: '#E0E7FF', marginTop: 10 },
  content: { padding: 18 },
  planCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    marginBottom: 15,
  },
  selectedPlanCard: {
    borderWidth: 2,
    borderColor: '#1554D9',
  },
  planTop: { flexDirection: 'row', justifyContent: 'space-between' },
  planName: { fontSize: 20, fontWeight: '900' },
  planDescription: { color: '#64748B' },
  price: { fontSize: 22, color: '#1554D9', marginVertical: 10 },
  featureRow: { flexDirection: 'row', marginTop: 5 },
  feature: { marginLeft: 8 },
  radioCircle: {
    width: 25,
    height: 25,
    borderRadius: 15,
    borderWidth: 2,
  },
  radioCircleSelected: { backgroundColor: '#1554D9' },
  confirmButton: {
    backgroundColor: '#1554D9',
    padding: 15,
    borderRadius: 15,
    marginTop: 10,
  },
  confirmText: { color: '#fff', textAlign: 'center', fontWeight: '900' },
});