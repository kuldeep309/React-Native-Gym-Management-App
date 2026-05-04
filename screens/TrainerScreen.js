import React, { useEffect, useState, useLayoutEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  StatusBar,
  TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

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

const defaultClasses = [
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

export default function TrainerScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [availableClasses, setAvailableClasses] = useState(defaultClasses);
  const [assignedClass, setAssignedClass] = useState(null);
  const [workingHours, setWorkingHours] = useState('');
  const [savedAssignedTrainer, setSavedAssignedTrainer] = useState(null);
  const [history, setHistory] = useState([]);

  const userRole = user?.role || 'Member';
  const isStaff = userRole === 'Staff';

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const getUserId = (loggedUser) => {
    return loggedUser?.id || loggedUser?.email;
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedCurrentUser = await AsyncStorage.getItem('currentUser');
        const storedClasses = await AsyncStorage.getItem('classSchedules');

        if (!storedCurrentUser) {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
          return;
        }

        const currentUser = JSON.parse(storedCurrentUser);
        const userId = getUserId(currentUser);

        setUser(currentUser);

        if (storedClasses) {
          setAvailableClasses(JSON.parse(storedClasses));
        } else {
          await AsyncStorage.setItem('classSchedules', JSON.stringify(defaultClasses));
          setAvailableClasses(defaultClasses);
        }

        const storedAssignedTrainer = await AsyncStorage.getItem(
          `assignedTrainer_${userId}`
        );

        if (storedAssignedTrainer) {
          setSavedAssignedTrainer(JSON.parse(storedAssignedTrainer));
        } else {
          setSavedAssignedTrainer(null);
        }

        const storedHistory = await AsyncStorage.getItem(`trainerHistory_${userId}`);
        setHistory(storedHistory ? JSON.parse(storedHistory) : []);
      } catch (error) {
        Alert.alert('Error', 'Unable to load trainer details.');
      }
    };

    const unsubscribe = navigation.addListener('focus', loadData);
    return unsubscribe;
  }, [navigation]);

  const handleTrainerSelect = (trainer) => {
    setSelectedTrainer(trainer);
    setWorkingHours(trainer.hours);
  };

  const handleAssignTrainer = async () => {
    if (!selectedTrainer) {
      Alert.alert('Select Trainer', 'Please select a trainer first.');
      return;
    }

    if (!assignedClass) {
      Alert.alert('Select Class', 'Please select a class to assign this trainer to.');
      return;
    }

    if (!workingHours.trim()) {
      Alert.alert('Enter Hours', 'Please enter trainer working hours.');
      return;
    }

    if (!user) {
      Alert.alert('Error', 'No logged-in user found.');
      return;
    }

    const userId = getUserId(user);
    const currentDate = new Date();

    const trainerData = {
      ...selectedTrainer,
      assignedClass: assignedClass.name,
      assignedClassTime: assignedClass.time,
      hours: workingHours.trim(),
      status: 'Assigned',
      assignedAt: currentDate.toISOString(),
    };

    const historyRecord = {
      id: Date.now(),
      trainerName: selectedTrainer.name,
      specialization: selectedTrainer.specialization,
      assignedClass: assignedClass.name,
      assignedClassTime: assignedClass.time,
      hours: workingHours.trim(),
      date: currentDate.toLocaleDateString(),
      recordedAt: currentDate.toISOString(),
    };

    try {
      await AsyncStorage.setItem(
        `assignedTrainer_${userId}`,
        JSON.stringify(trainerData)
      );

      const storedHistory = await AsyncStorage.getItem(`trainerHistory_${userId}`);
      const oldHistory = storedHistory ? JSON.parse(storedHistory) : [];
      const updatedHistory = [historyRecord, ...oldHistory];

      await AsyncStorage.setItem(
        `trainerHistory_${userId}`,
        JSON.stringify(updatedHistory)
      );

      setSavedAssignedTrainer(trainerData);
      setHistory(updatedHistory);

      Alert.alert(
        'Success',
        `${selectedTrainer.name} has been assigned to ${assignedClass.name} and hours were recorded.`
      );

      navigation.navigate('Home');
    } catch (error) {
      Alert.alert('Error', 'Unable to assign trainer.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#1554D9" />

      <ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>
        <LinearGradient colors={['#1554D9', '#4338CA']} style={styles.header}>
          <Text style={styles.headerLabel}>
            {isStaff ? 'STAFF TRAINER MANAGEMENT' : 'TRAINER DETAILS'}
          </Text>

          <Text style={styles.headerTitle}>
            {isStaff ? 'Assign Trainers' : 'Your Trainer'}
          </Text>

          <Text style={styles.headerSub}>
            {isStaff
              ? 'Assign trainers to classes and track weekly working hours.'
              : 'View your assigned trainer, class and weekly training support.'}
          </Text>
        </LinearGradient>

        <View style={styles.content}>
          {!isStaff && (
            <>
              <View style={styles.memberCard}>
                <View style={styles.memberIconCircle}>
                  <MaterialCommunityIcons name="dumbbell" size={28} color="#1554D9" />
                </View>

                <Text style={styles.memberCardTitle}>
                  {savedAssignedTrainer ? savedAssignedTrainer.name : 'No Trainer Assigned'}
                </Text>

                <Text style={styles.memberCardSub}>
                  {savedAssignedTrainer
                    ? savedAssignedTrainer.specialization
                    : 'A staff member has not assigned a trainer yet.'}
                </Text>

                {savedAssignedTrainer?.assignedClass ? (
                  <View style={styles.memberInfoBox}>
                    <Text style={styles.memberInfoLabel}>Assigned Class</Text>
                    <Text style={styles.memberInfoValue}>
                      {savedAssignedTrainer.assignedClass}
                    </Text>
                  </View>
                ) : null}

                {savedAssignedTrainer?.assignedClassTime ? (
                  <View style={styles.memberInfoBox}>
                    <Text style={styles.memberInfoLabel}>Class Time</Text>
                    <Text style={styles.memberInfoValue}>
                      {savedAssignedTrainer.assignedClassTime}
                    </Text>
                  </View>
                ) : null}

                {savedAssignedTrainer?.hours ? (
                  <View style={styles.memberInfoBox}>
                    <Text style={styles.memberInfoLabel}>Working Hours</Text>
                    <Text style={styles.memberInfoValue}>{savedAssignedTrainer.hours}</Text>
                  </View>
                ) : null}
              </View>

              <View style={styles.currentAssignmentCard}>
                <Text style={styles.currentTitle}>Trainer Hours History</Text>

                {history.length === 0 ? (
                  <Text style={styles.currentMuted}>No trainer hour history available.</Text>
                ) : (
                  history.slice(0, 5).map((item) => (
                    <View key={item.id} style={styles.historyItem}>
                      <Text style={styles.currentText}>
                        {item.date} • {item.trainerName}
                      </Text>
                      <Text style={styles.currentMuted}>
                        Class: {item.assignedClass}
                      </Text>
                      <Text style={styles.currentMuted}>
                        Hours: {item.hours}
                      </Text>
                    </View>
                  ))
                )}
              </View>
            </>
          )}

          {isStaff && (
            <>
              <Text style={styles.sectionTitle}>Select Trainer</Text>

              {trainers.map((trainer) => {
                const isSelected = selectedTrainer?.id === trainer.id;

                return (
                  <TouchableOpacity
                    key={trainer.id}
                    activeOpacity={0.9}
                    style={[styles.trainerCard, isSelected && styles.selectedTrainerCard]}
                    onPress={() => handleTrainerSelect(trainer)}
                  >
                    <View style={styles.trainerTop}>
                      <View style={styles.avatarCircle}>
                        <Text style={styles.avatarText}>{trainer.name.charAt(0)}</Text>
                      </View>

                      <View style={styles.trainerInfo}>
                        <Text style={styles.trainerName}>{trainer.name}</Text>
                        <Text style={styles.specialization}>{trainer.specialization}</Text>
                      </View>

                      <View style={[styles.selectBadge, isSelected && styles.selectBadgeActive]}>
                        <Text style={[styles.selectText, isSelected && styles.selectTextActive]}>
                          {isSelected ? 'Selected' : 'Select'}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.detailGrid}>
                      <View style={styles.detailBox}>
                        <Ionicons name="briefcase-outline" size={18} color="#1554D9" />
                        <Text style={styles.detailLabel}>Experience</Text>
                        <Text style={styles.detailValue}>{trainer.experience}</Text>
                      </View>

                      <View style={styles.detailBox}>
                        <Ionicons name="time-outline" size={18} color="#1554D9" />
                        <Text style={styles.detailLabel}>Default Hours</Text>
                        <Text style={styles.detailValue}>{trainer.hours}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}

              <View style={styles.assignmentCard}>
                <View style={styles.assignmentHeader}>
                  <View style={styles.assignmentIcon}>
                    <MaterialCommunityIcons name="calendar-clock" size={23} color="#1554D9" />
                  </View>

                  <View style={styles.assignmentTextBox}>
                    <Text style={styles.assignmentTitle}>Assign to Class</Text>
                    <Text style={styles.assignmentSub}>
                      Choose which class this trainer will manage.
                    </Text>
                  </View>
                </View>

                {availableClasses.map((gymClass) => {
                  const isClassSelected = assignedClass?.id === gymClass.id;

                  return (
                    <TouchableOpacity
                      key={gymClass.id}
                      activeOpacity={0.85}
                      style={[styles.classOption, isClassSelected && styles.classOptionActive]}
                      onPress={() => setAssignedClass(gymClass)}
                    >
                      <View style={styles.classOptionTextBox}>
                        <Text style={styles.classOptionName}>{gymClass.name}</Text>
                        <Text style={styles.classOptionTime}>{gymClass.time}</Text>
                      </View>

                      <View style={[styles.smallRadio, isClassSelected && styles.smallRadioActive]}>
                        {isClassSelected && (
                          <Ionicons name="checkmark" size={14} color="#ffffff" />
                        )}
                      </View>
                    </TouchableOpacity>
                  );
                })}

                <Text style={styles.inputLabel}>Weekly Working Hours</Text>
                <View style={styles.inputBox}>
                  <Ionicons name="time-outline" size={22} color="#64748B" />
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. 20 hours/week"
                    placeholderTextColor="#94A3B8"
                    value={workingHours}
                    onChangeText={setWorkingHours}
                  />
                </View>
              </View>

              {savedAssignedTrainer && (
                <View style={styles.currentAssignmentCard}>
                  <Text style={styles.currentTitle}>Current Assignment</Text>
                  <Text style={styles.currentText}>
                    Trainer: {savedAssignedTrainer.name}
                  </Text>
                  <Text style={styles.currentMuted}>
                    Class: {savedAssignedTrainer.assignedClass || 'Not assigned'}
                  </Text>
                  <Text style={styles.currentMuted}>
                    Hours: {savedAssignedTrainer.hours || 'Not set'}
                  </Text>
                </View>
              )}

              <View style={styles.currentAssignmentCard}>
                <Text style={styles.currentTitle}>Trainer Hours History</Text>

                {history.length === 0 ? (
                  <Text style={styles.currentMuted}>No history yet.</Text>
                ) : (
                  history.slice(0, 5).map((item) => (
                    <View key={item.id} style={styles.historyItem}>
                      <Text style={styles.currentText}>
                        {item.date} • {item.trainerName}
                      </Text>
                      <Text style={styles.currentMuted}>
                        Class: {item.assignedClass}
                      </Text>
                      <Text style={styles.currentMuted}>
                        Hours: {item.hours}
                      </Text>
                    </View>
                  ))
                )}
              </View>

              <TouchableOpacity style={styles.primaryButton} onPress={handleAssignTrainer}>
                <Text style={styles.primaryText}>Confirm Trainer Assignment</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>

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

        <TouchableOpacity style={[styles.footerItem, styles.footerActive]}>
          <MaterialCommunityIcons name="dumbbell" size={23} color="#1554D9" />
          <Text style={styles.footerActiveText}>Trainers</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.footerItem} onPress={() => navigation.navigate('Profile')}>
          <Ionicons name="person-outline" size={23} color="#94A3B8" />
          <Text style={styles.footerText}>Profile</Text>
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
  sectionTitle: {
    color: '#111827',
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 14,
    marginLeft: 2,
  },
  memberCard: {
    backgroundColor: '#ffffff',
    borderRadius: 26,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#0F172A',
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 5,
  },
  memberIconCircle: {
    width: 78,
    height: 78,
    borderRadius: 26,
    backgroundColor: '#EEF4FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  memberCardTitle: {
    color: '#111827',
    fontSize: 22,
    fontWeight: '900',
    textAlign: 'center',
  },
  memberCardSub: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 21,
    marginTop: 8,
    marginBottom: 18,
  },
  memberInfoBox: {
    width: '100%',
    backgroundColor: '#F1F5FF',
    borderRadius: 16,
    padding: 14,
    marginTop: 10,
  },
  memberInfoLabel: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 4,
  },
  memberInfoValue: {
    color: '#111827',
    fontSize: 15,
    fontWeight: '900',
  },
  trainerCard: {
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
  selectedTrainerCard: {
    borderColor: '#1554D9',
    backgroundColor: '#F8FBFF',
  },
  trainerTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: '#EEF4FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#1554D9',
    fontSize: 22,
    fontWeight: '900',
  },
  trainerInfo: {
    flex: 1,
  },
  trainerName: {
    color: '#111827',
    fontSize: 19,
    fontWeight: '900',
  },
  specialization: {
    color: '#1554D9',
    fontSize: 13,
    fontWeight: '800',
    marginTop: 5,
  },
  selectBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 14,
    marginLeft: 8,
  },
  selectBadgeActive: {
    backgroundColor: '#1554D9',
  },
  selectText: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '900',
  },
  selectTextActive: {
    color: '#ffffff',
  },
  detailGrid: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 18,
  },
  detailBox: {
    flex: 1,
    backgroundColor: '#F1F5FF',
    borderRadius: 18,
    padding: 14,
  },
  detailLabel: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '800',
    marginTop: 8,
  },
  detailValue: {
    color: '#111827',
    fontSize: 13,
    fontWeight: '900',
    marginTop: 4,
  },
  assignmentCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 20,
    marginTop: 4,
    marginBottom: 16,
    shadowColor: '#0F172A',
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  assignmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  assignmentIcon: {
    width: 46,
    height: 46,
    borderRadius: 15,
    backgroundColor: '#EEF4FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  assignmentTextBox: {
    flex: 1,
  },
  assignmentTitle: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '900',
  },
  assignmentSub: {
    color: '#64748B',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 3,
    lineHeight: 18,
  },
  classOption: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  classOptionActive: {
    backgroundColor: '#F1F5FF',
    borderColor: '#1554D9',
  },
  classOptionTextBox: {
    flex: 1,
  },
  classOptionName: {
    color: '#111827',
    fontSize: 15,
    fontWeight: '900',
  },
  classOptionTime: {
    color: '#64748B',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 4,
  },
  smallRadio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  smallRadioActive: {
    backgroundColor: '#1554D9',
    borderColor: '#1554D9',
  },
  inputLabel: {
    color: '#334155',
    fontSize: 14,
    fontWeight: '900',
    marginBottom: 8,
    marginTop: 8,
    marginLeft: 4,
  },
  inputBox: {
    height: 56,
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    color: '#111827',
    fontSize: 15,
    fontWeight: '700',
    marginLeft: 10,
  },
  currentAssignmentCard: {
    backgroundColor: '#ffffff',
    borderRadius: 22,
    padding: 18,
    marginTop: 16,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: '#BFDBFE',
  },
  currentTitle: {
    color: '#111827',
    fontSize: 17,
    fontWeight: '900',
    marginBottom: 8,
  },
  currentText: {
    color: '#334155',
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 5,
  },
  currentMuted: {
    color: '#64748B',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 4,
  },
  historyItem: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  primaryButton: {
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
  primaryText: {
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