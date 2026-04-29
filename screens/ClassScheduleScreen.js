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

const classes = [
  {
    id: 1,
    name: 'Morning Yoga',
    time: '7:00 AM - 8:00 AM',
    trainer: 'Sarah Wilson',
    description: 'Improve flexibility, breathing and balance.',
  },
  {
    id: 2,
    name: 'Cardio Blast',
    time: '10:00 AM - 11:00 AM',
    trainer: 'Mike Johnson',
    description: 'High-energy cardio session for endurance.',
  },
  {
    id: 3,
    name: 'Strength Training',
    time: '5:00 PM - 6:00 PM',
    trainer: 'David Smith',
    description: 'Build strength using guided resistance training.',
  },
  {
    id: 4,
    name: 'Zumba Fitness',
    time: '6:30 PM - 7:30 PM',
    trainer: 'Emma Brown',
    description: 'Dance-based workout with fun music and movement.',
  },
];

export default function ClassScheduleScreen({ navigation }) {
  const [selectedClass, setSelectedClass] = useState(null);

  const handleRegisterClass = async () => {
    if (!selectedClass) {
      Alert.alert('Select a Class', 'Please choose a class before registering.');
      return;
    }

    const classData = {
      ...selectedClass,
      status: 'Registered',
    };

    try {
      await AsyncStorage.setItem(
        'selectedClass',
        JSON.stringify(classData)
      );

      Alert.alert('Success', `You registered for ${selectedClass.name}.`);
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert('Error', 'Unable to save selected class.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.page}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Classes</Text>
          <Text style={styles.headerSubtitle}>
            Book your session and stay consistent
          </Text>
        </View>

        {/* Class Cards */}
        {classes.map((gymClass) => {
          const isSelected = selectedClass?.id === gymClass.id;

          return (
            <TouchableOpacity
              key={gymClass.id}
              activeOpacity={0.9}
              style={[
                styles.classCard,
                isSelected && styles.selectedClassCard,
              ]}
              onPress={() => setSelectedClass(gymClass)}
            >
              <View style={styles.classHeader}>
                <Text style={styles.className}>{gymClass.name}</Text>

                <View
                  style={[
                    styles.selectBadge,
                    isSelected && styles.selectBadgeActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.selectText,
                      isSelected && { color: '#ffffff' },
                    ]}
                  >
                    {isSelected ? 'Selected' : 'Select'}
                  </Text>
                </View>
              </View>

              <Text style={styles.time}>{gymClass.time}</Text>
              <Text style={styles.trainer}>
                Trainer: {gymClass.trainer}
              </Text>
              <Text style={styles.description}>
                {gymClass.description}
              </Text>
            </TouchableOpacity>
          );
        })}

        {/* Confirm Button */}
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleRegisterClass}
        >
          <Text style={styles.primaryText}>
            Confirm Class Booking
          </Text>
        </TouchableOpacity>

        {/* Back Button */}
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
    backgroundColor: '#0B1F17',
  },
  page: {
    padding: 20,
    paddingBottom: 40,
  },

  header: {
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#9fd8c0',
    marginTop: 4,
  },

  classCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#e6e6e6',
  },

  selectedClassCard: {
    borderColor: '#00A86B',
    backgroundColor: '#E8FFF5',
  },

  classHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },

  className: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#101820',
  },

  time: {
    color: '#00A86B',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },

  trainer: {
    color: '#333',
    fontSize: 13,
    marginBottom: 4,
  },

  description: {
    color: '#666',
    fontSize: 13,
    lineHeight: 18,
  },

  selectBadge: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },

  selectBadgeActive: {
    backgroundColor: '#00A86B',
    borderColor: '#00A86B',
  },

  selectText: {
    fontSize: 12,
    color: '#555',
  },

  primaryButton: {
    backgroundColor: '#00A86B',
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 10,
  },

  primaryText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  backButton: {
    borderColor: '#00A86B',
    borderWidth: 1.5,
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 10,
  },

  backText: {
    color: '#00A86B',
    fontSize: 15,
    fontWeight: 'bold',
  },
});