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

  const handleConfirm = async () => {
    if (!selectedPlan) {
      Alert.alert('Select a Plan', 'Please choose a membership plan first.');
      return;
    }

    const subscriptionData = {
      ...selectedPlan,
      status: 'Active',
      billingDate: new Date().toLocaleDateString(),
    };

    try {
      await AsyncStorage.setItem('membershipPlan', JSON.stringify(subscriptionData));
      Alert.alert('Success', `${selectedPlan.name} plan selected successfully.`);
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
                activeOpacity={0.9}
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

                <View style={styles.featureList}>
                  {plan.features.map((feature, index) => (
                    <View key={index} style={styles.featureRow}>
                      <Ionicons name="checkmark-circle" size={18} color="#1554D9" />
                      <Text style={styles.feature}>{feature}</Text>
                    </View>
                  ))}
                </View>
              </TouchableOpacity>
            );
          })}

          <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
            <Text style={styles.confirmText}>Confirm Membership Plan</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerItem} onPress={() => navigation.navigate('Home')}>
          <Ionicons name="grid-outline" size={23} color="#94A3B8" />
          <Text style={styles.footerText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.footerItem, styles.footerActive]}>
          <Ionicons name="card-outline" size={23} color="#1554D9" />
          <Text style={styles.footerActiveText}>Membership</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.footerItem} onPress={() => navigation.navigate('Classes')}>
          <MaterialCommunityIcons name="calendar-clock" size={23} color="#94A3B8" />
          <Text style={styles.footerText}>Classes</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.footerItem} onPress={() => navigation.navigate('Trainer')}>
          <MaterialCommunityIcons name="dumbbell" size={23} color="#94A3B8" />
          <Text style={styles.footerText}>Trainers</Text>
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
  page: {
    paddingBottom: 115,
  },
  header: {
    paddingTop: 62,
    paddingHorizontal: 22,
    paddingBottom: 58,
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
  content: {
    marginTop: -30,
    paddingHorizontal: 18,
  },
  planCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#ffffff',
    shadowColor: '#0F172A',
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  selectedPlanCard: {
    borderColor: '#1554D9',
    backgroundColor: '#F8FBFF',
  },
  planTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  planName: {
    color: '#111827',
    fontSize: 23,
    fontWeight: '900',
  },
  planDescription: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 5,
  },
  price: {
    color: '#1554D9',
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 14,
  },
  featureList: {
    gap: 8,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  feature: {
    color: '#334155',
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 8,
  },
  radioCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  radioCircleSelected: {
    backgroundColor: '#1554D9',
    borderColor: '#1554D9',
  },
  confirmButton: {
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
  confirmText: {
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
    marginHorizontal: 4,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerActive: {
    backgroundColor: '#EEF4FF',
  },
  footerText: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '900',
    marginTop: 4,
  },
  footerActiveText: {
    color: '#1554D9',
    fontSize: 11,
    fontWeight: '900',
    marginTop: 4,
  },
});