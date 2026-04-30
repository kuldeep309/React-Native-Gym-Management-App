import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const trainers = [
  {
    id: 1,
    name: 'Alex Carter',
    specialization: 'Strength Training',
    hours: '20 hours/week',
    experience: '5 years experience',
  },
  {
    id: 2,
    name: 'Mia Roberts',
    specialization: 'Yoga & Flexibility',
    hours: '15 hours/week',
    experience: '4 years experience',
  },
  {
    id: 3,
    name: 'Daniel Lee',
    specialization: 'Cardio & Weight Loss',
    hours: '18 hours/week',
    experience: '6 years experience',
  },
];

export default function TrainerScreen({ navigation }) {
  const [selectedTrainer, setSelectedTrainer] = useState(null);

  const handleAssignTrainer = async () => {
    if (!selectedTrainer) {
      Alert.alert('Select Trainer', 'Please select a trainer first.');
      return;
    }

    const trainerData = {
      ...selectedTrainer,
      status: 'Assigned',
    };

    try {
      await AsyncStorage.setItem('assignedTrainer', JSON.stringify(trainerData));
      Alert.alert('Success', `${selectedTrainer.name} has been assigned.`);
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert('Error', 'Unable to assign trainer.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.page}>
        <View style={styles.header}>
          <Text style={styles.smallText}>Trainer Assignment</Text>
          <Text style={styles.title}>Choose Your Trainer</Text>
          <Text style={styles.subtitle}>
            Assign a trainer and track weekly working hours.
          </Text>
        </View>

        {trainers.map((trainer) => {
          const isSelected = selectedTrainer?.id === trainer.id;

          return (
            <TouchableOpacity
              key={trainer.id}
              activeOpacity={0.9}
              style={[
                styles.trainerCard,
                isSelected && styles.selectedTrainerCard,
              ]}
              onPress={() => setSelectedTrainer(trainer)}
            >
              <View style={styles.trainerHeader}>
                <View>
                  <Text style={styles.trainerName}>{trainer.name}</Text>
                  <Text style={styles.specialization}>
                    {trainer.specialization}
                  </Text>
                </View>

                <View
                  style={[
                    styles.selectBadge,
                    isSelected && styles.selectBadgeActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.selectText,
                      isSelected && styles.selectTextActive,
                    ]}
                  >
                    {isSelected ? 'Selected' : 'Select'}
                  </Text>
                </View>
              </View>

              <Text style={styles.detail}>Experience: {trainer.experience}</Text>
              <Text style={styles.detail}>Working Hours: {trainer.hours}</Text>
            </TouchableOpacity>
          );
        })}

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleAssignTrainer}
        >
          <Text style={styles.primaryText}>Assign Trainer</Text>
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
  trainerCard: {
    backgroundColor: '#ffffff',
    borderRadius: 22,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  selectedTrainerCard: {
    backgroundColor: '#E8FFF5',
    borderColor: '#00A86B',
  },
  trainerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  trainerName: {
    fontSize: 21,
    fontWeight: 'bold',
    color: '#101820',
  },
  specialization: {
    color: '#00A86B',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 4,
  },
  detail: {
    color: '#555',
    fontSize: 14,
    marginBottom: 6,
  },
  selectBadge: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  selectBadgeActive: {
    backgroundColor: '#00A86B',
    borderColor: '#00A86B',
  },
  selectText: {
    color: '#555',
    fontSize: 12,
    fontWeight: 'bold',
  },
  selectTextActive: {
    color: '#ffffff',
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