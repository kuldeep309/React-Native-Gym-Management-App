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

export default function ClassScheduleScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [classes, setClasses] = useState(defaultClasses);
  const [selectedClass, setSelectedClass] = useState(null);

  const [className, setClassName] = useState('');
  const [classTime, setClassTime] = useState('');
  const [classTrainer, setClassTrainer] = useState('');
  const [classDescription, setClassDescription] = useState('');
  const [editingClassId, setEditingClassId] = useState(null);

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
          setClasses(JSON.parse(storedClasses));
        } else {
          await AsyncStorage.setItem('classSchedules', JSON.stringify(defaultClasses));
          setClasses(defaultClasses);
        }

        const storedSelectedClass = await AsyncStorage.getItem(`selectedClass_${userId}`);
        setSelectedClass(storedSelectedClass ? JSON.parse(storedSelectedClass) : null);
      } catch (error) {
        Alert.alert('Error', 'Unable to load class schedules.');
      }
    };

    const unsubscribe = navigation.addListener('focus', loadData);
    return unsubscribe;
  }, [navigation]);

  const saveClasses = async (updatedClasses) => {
    setClasses(updatedClasses);
    await AsyncStorage.setItem('classSchedules', JSON.stringify(updatedClasses));
  };

  const clearForm = () => {
    setClassName('');
    setClassTime('');
    setClassTrainer('');
    setClassDescription('');
    setEditingClassId(null);
  };

  const handleAddOrUpdateClass = async () => {
    if (!className.trim() || !classTime.trim() || !classTrainer.trim() || !classDescription.trim()) {
      Alert.alert('Missing Details', 'Please fill in all class schedule fields.');
      return;
    }

    try {
      if (editingClassId) {
        const updatedClasses = classes.map((gymClass) =>
          gymClass.id === editingClassId
            ? {
                ...gymClass,
                name: className.trim(),
                time: classTime.trim(),
                trainer: classTrainer.trim(),
                description: classDescription.trim(),
              }
            : gymClass
        );

        await saveClasses(updatedClasses);

        if (selectedClass?.id === editingClassId && user) {
          const userId = getUserId(user);
          const updatedSelectedClass = updatedClasses.find(
            (gymClass) => gymClass.id === editingClassId
          );

          const updatedSelectedClassData = {
            ...updatedSelectedClass,
            status: 'Registered',
          };

          setSelectedClass(updatedSelectedClassData);

          await AsyncStorage.setItem(
            `selectedClass_${userId}`,
            JSON.stringify(updatedSelectedClassData)
          );
        }

        Alert.alert('Updated', 'Class schedule updated successfully.');
      } else {
        const newClass = {
          id: Date.now(),
          name: className.trim(),
          time: classTime.trim(),
          trainer: classTrainer.trim(),
          description: classDescription.trim(),
        };

        const updatedClasses = [...classes, newClass];

        await saveClasses(updatedClasses);
        Alert.alert('Success', 'New class schedule added successfully.');
      }

      clearForm();
    } catch (error) {
      Alert.alert('Error', 'Unable to save class schedule.');
    }
  };

  const handleEditClass = (gymClass) => {
    setEditingClassId(gymClass.id);
    setClassName(gymClass.name);
    setClassTime(gymClass.time);
    setClassTrainer(gymClass.trainer);
    setClassDescription(gymClass.description);
  };

  const handleDeleteClass = async (classId) => {
    try {
      const updatedClasses = classes.filter((gymClass) => gymClass.id !== classId);
      await saveClasses(updatedClasses);

      if (selectedClass?.id === classId && user) {
        const userId = getUserId(user);
        setSelectedClass(null);
        await AsyncStorage.removeItem(`selectedClass_${userId}`);
      }

      if (editingClassId === classId) {
        clearForm();
      }

      Alert.alert('Deleted', 'Class schedule removed successfully.');
    } catch (error) {
      Alert.alert('Error', 'Unable to delete class schedule.');
    }
  };

  const handleRegisterClass = async () => {
    if (!selectedClass) {
      Alert.alert('Select a Class', 'Please choose a class before registering.');
      return;
    }

    if (!user) {
      Alert.alert('Error', 'No logged-in user found.');
      return;
    }

    const userId = getUserId(user);

    const classData = {
      ...selectedClass,
      status: 'Registered',
      registeredAt: new Date().toISOString(),
    };

    try {
      await AsyncStorage.setItem(`selectedClass_${userId}`, JSON.stringify(classData));
      Alert.alert('Success', `You registered for ${selectedClass.name}.`);
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert('Error', 'Unable to save selected class.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#1554D9" />

      <ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>
        <LinearGradient colors={['#1554D9', '#4338CA']} style={styles.header}>
          <Text style={styles.headerLabel}>
            {isStaff ? 'STAFF CLASS MANAGEMENT' : 'CLASS ACTIVITY'}
          </Text>

          <Text style={styles.headerTitle}>
            {isStaff ? 'Manage Classes' : 'Book Your Session'}
          </Text>

          <Text style={styles.headerSub}>
            {isStaff
              ? 'Add, edit and delete class schedules for gym members.'
              : 'View available classes and book your preferred session.'}
          </Text>
        </LinearGradient>

        <View style={styles.content}>
          {isStaff && (
            <View style={styles.manageCard}>
              <View style={styles.formHeader}>
                <View style={styles.formIcon}>
                  <Ionicons
                    name={editingClassId ? 'create-outline' : 'add-circle-outline'}
                    size={24}
                    color="#1554D9"
                  />
                </View>

                <View style={styles.formTextBox}>
                  <Text style={styles.formTitle}>
                    {editingClassId ? 'Edit Class Schedule' : 'Add Class Schedule'}
                  </Text>
                  <Text style={styles.formSub}>
                    {editingClassId
                      ? 'Update the selected class details.'
                      : 'Staff can add new class activities here.'}
                  </Text>
                </View>
              </View>

              <TextInput
                style={styles.input}
                placeholder="Class name"
                placeholderTextColor="#94A3B8"
                value={className}
                onChangeText={setClassName}
              />

              <TextInput
                style={styles.input}
                placeholder="Time e.g. 9:00 AM - 10:00 AM"
                placeholderTextColor="#94A3B8"
                value={classTime}
                onChangeText={setClassTime}
              />

              <TextInput
                style={styles.input}
                placeholder="Trainer name"
                placeholderTextColor="#94A3B8"
                value={classTrainer}
                onChangeText={setClassTrainer}
              />

              <TextInput
                style={[styles.input, styles.descriptionInput]}
                placeholder="Class description"
                placeholderTextColor="#94A3B8"
                value={classDescription}
                onChangeText={setClassDescription}
                multiline
              />

              <TouchableOpacity style={styles.addButton} onPress={handleAddOrUpdateClass}>
                <Text style={styles.addButtonText}>
                  {editingClassId ? 'Update Class' : 'Add Class'}
                </Text>
              </TouchableOpacity>

              {editingClassId && (
                <TouchableOpacity style={styles.cancelButton} onPress={clearForm}>
                  <Text style={styles.cancelButtonText}>Cancel Edit</Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          <Text style={styles.sectionTitle}>
            {isStaff ? 'Manage Available Classes' : 'Available Classes'}
          </Text>

          {classes.map((gymClass) => {
            const isSelected = selectedClass?.id === gymClass.id;

            return (
              <TouchableOpacity
                key={gymClass.id}
                activeOpacity={0.9}
                style={[styles.classCard, isSelected && !isStaff && styles.selectedClassCard]}
                onPress={() => {
                  if (!isStaff) {
                    setSelectedClass(gymClass);
                  }
                }}
              >
                <View style={styles.classTop}>
                  <View style={styles.iconCircle}>
                    <MaterialCommunityIcons name="calendar-clock" size={23} color="#1554D9" />
                  </View>

                  <View style={styles.classInfo}>
                    <Text style={styles.className}>{gymClass.name}</Text>
                    <Text style={styles.time}>{gymClass.time}</Text>
                  </View>

                  {!isStaff && (
                    <View style={[styles.selectBadge, isSelected && styles.selectBadgeActive]}>
                      <Text style={[styles.selectText, isSelected && styles.selectTextActive]}>
                        {isSelected ? 'Selected' : 'Select'}
                      </Text>
                    </View>
                  )}
                </View>

                <View style={styles.detailRow}>
                  <Ionicons name="person-outline" size={18} color="#64748B" />
                  <Text style={styles.trainer}>Trainer: {gymClass.trainer}</Text>
                </View>

                <Text style={styles.description}>{gymClass.description}</Text>

                {isStaff && (
                  <View style={styles.staffActionsRow}>
                    <TouchableOpacity
                      style={styles.editButton}
                      onPress={() => handleEditClass(gymClass)}
                    >
                      <Ionicons name="create-outline" size={18} color="#1554D9" />
                      <Text style={styles.editText}>Edit</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => handleDeleteClass(gymClass.id)}
                    >
                      <Ionicons name="trash-outline" size={18} color="#DC2626" />
                      <Text style={styles.deleteText}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}

          {!isStaff && (
            <TouchableOpacity style={styles.primaryButton} onPress={handleRegisterClass}>
              <Text style={styles.primaryText}>Confirm Class Booking</Text>
            </TouchableOpacity>
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

        <TouchableOpacity style={[styles.footerItem, styles.footerActive]}>
          <MaterialCommunityIcons name="calendar-clock" size={23} color="#1554D9" />
          <Text style={styles.footerActiveText}>Classes</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.footerItem} onPress={() => navigation.navigate('Trainer')}>
          <MaterialCommunityIcons name="dumbbell" size={23} color="#94A3B8" />
          <Text style={styles.footerText}>Trainers</Text>
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
  manageCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 20,
    marginBottom: 18,
    shadowColor: '#0F172A',
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  formHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  formIcon: {
    width: 46,
    height: 46,
    borderRadius: 15,
    backgroundColor: '#EEF4FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  formTextBox: {
    flex: 1,
  },
  formTitle: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '900',
  },
  formSub: {
    color: '#64748B',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 3,
  },
  input: {
    height: 54,
    backgroundColor: '#F1F5F9',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 15,
    color: '#111827',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 12,
  },
  descriptionInput: {
    height: 82,
    textAlignVertical: 'top',
    paddingTop: 14,
  },
  addButton: {
    backgroundColor: '#1554D9',
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '900',
  },
  cancelButton: {
    height: 48,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#1554D9',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  cancelButtonText: {
    color: '#1554D9',
    fontSize: 15,
    fontWeight: '900',
  },
  sectionTitle: {
    color: '#111827',
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 14,
    marginLeft: 2,
  },
  classCard: {
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
  selectedClassCard: {
    borderColor: '#1554D9',
    backgroundColor: '#F8FBFF',
  },
  classTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#EEF4FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  classInfo: {
    flex: 1,
  },
  className: {
    color: '#111827',
    fontSize: 19,
    fontWeight: '900',
  },
  time: {
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
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  trainer: {
    color: '#334155',
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 6,
  },
  description: {
    color: '#64748B',
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '600',
  },
  staffActionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  editButton: {
    flex: 1,
    height: 42,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    backgroundColor: '#EFF6FF',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editText: {
    color: '#1554D9',
    fontSize: 13,
    fontWeight: '900',
    marginLeft: 6,
  },
  deleteButton: {
    flex: 1,
    height: 42,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FCA5A5',
    backgroundColor: '#FFF1F2',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteText: {
    color: '#DC2626',
    fontSize: 13,
    fontWeight: '900',
    marginLeft: 6,
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