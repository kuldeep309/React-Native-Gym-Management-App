import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
      await AsyncStorage.setItem(
        'membershipPlan',
        JSON.stringify(subscriptionData)
      );

      Alert.alert('Success', `${selectedPlan.name} plan selected successfully.`);
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert('Error', 'Unable to save membership plan.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.page}>
        <View style={styles.header}>
          <Text style={styles.smallText}>Membership Plans</Text>
          <Text style={styles.title}>Choose Your Plan</Text>
          <Text style={styles.subtitle}>
            Select a membership plan that fits your fitness journey.
          </Text>
        </View>

        {plans.map((plan) => {
          const isSelected = selectedPlan?.id === plan.id;

          return (
            <TouchableOpacity
              key={plan.id}
              activeOpacity={0.9}
              style={[
                styles.planCard,
                isSelected && styles.selectedPlanCard,
              ]}
              onPress={() => setSelectedPlan(plan)}
            >
              <View style={styles.planHeader}>
                <View>
                  <Text
                    style={[
                      styles.planName,
                      isSelected && styles.selectedText,
                    ]}
                  >
                    {plan.name}
                  </Text>
                  <Text
                    style={[
                      styles.planDescription,
                      isSelected && styles.selectedSubText,
                    ]}
                  >
                    {plan.description}
                  </Text>
                </View>

                <View
                  style={[
                    styles.radioCircle,
                    isSelected && styles.radioCircleSelected,
                  ]}
                >
                  {isSelected && <Text style={styles.tick}>✓</Text>}
                </View>
              </View>

              <Text
                style={[
                  styles.price,
                  isSelected && styles.selectedPrice,
                ]}
              >
                {plan.price}
              </Text>

              <View style={styles.featureList}>
                {plan.features.map((feature, index) => (
                  <Text
                    key={index}
                    style={[
                      styles.feature,
                      isSelected && styles.selectedFeature,
                    ]}
                  >
                    ✓ {feature}
                  </Text>
                ))}
              </View>
            </TouchableOpacity>
          );
        })}

        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
          <Text style={styles.confirmText}>Confirm Membership Plan</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.backText}>Back to Home</Text>
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
  header: {
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
  planCard: {
    backgroundColor: '#ffffff',
    borderRadius: 22,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  selectedPlanCard: {
    backgroundColor: '#E8FFF5',
    borderColor: '#00A86B',
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  planName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#101820',
  },
  planDescription: {
    color: '#777',
    fontSize: 14,
    marginTop: 4,
  },
  price: {
    color: '#00A86B',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 14,
  },
  featureList: {
    marginTop: 4,
  },
  feature: {
    color: '#333',
    fontSize: 14,
    marginBottom: 6,
  },
  selectedText: {
    color: '#071A12',
  },
  selectedSubText: {
    color: '#305C47',
  },
  selectedPrice: {
    color: '#008A58',
  },
  selectedFeature: {
    color: '#071A12',
    fontWeight: '500',
  },
  radioCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#B8B8B8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleSelected: {
    backgroundColor: '#00A86B',
    borderColor: '#00A86B',
  },
  tick: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  confirmButton: {
    backgroundColor: '#00A86B',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 12,
  },
  confirmText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    borderColor: '#00A86B',
    borderWidth: 1.5,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  backText: {
    color: '#00A86B',
    fontSize: 16,
    fontWeight: 'bold',
  },
});