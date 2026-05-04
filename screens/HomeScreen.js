import React, { useEffect, useState, useLayoutEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function HomeScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [membershipPlan, setMembershipPlan] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [assignedTrainer, setAssignedTrainer] = useState(null);

  const userRole = user?.role || 'Member';
  const isStaff = userRole === 'Staff';

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedCurrentUser = await AsyncStorage.getItem('currentUser');

        if (!storedCurrentUser) {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
          return;
        }

        const currentUser = JSON.parse(storedCurrentUser);
        setUser(currentUser);

        const userId = currentUser.id || currentUser.email;

        const storedPlan = await AsyncStorage.getItem(`membershipPlan_${userId}`);
        const storedClass = await AsyncStorage.getItem(`selectedClass_${userId}`);
        const storedTrainer = await AsyncStorage.getItem(`assignedTrainer_${userId}`);

        setMembershipPlan(storedPlan ? JSON.parse(storedPlan) : null);
        setSelectedClass(storedClass ? JSON.parse(storedClass) : null);
        setAssignedTrainer(storedTrainer ? JSON.parse(storedTrainer) : null);
      } catch (error) {
        console.log('Error loading home data:', error);
      }
    };

    const unsubscribe = navigation.addListener('focus', loadData);
    return unsubscribe;
  }, [navigation]);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('currentUser');

    navigation.reset({
      index: 0,
      routes: [{ name: 'Welcome' }],
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#1554D9" />

      <ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>
        <LinearGradient colors={['#1554D9', '#4338CA']} style={styles.header}>
          <View style={styles.headerTextBox}>
            <Text style={styles.greeting}>Welcome back</Text>
            <Text style={styles.userName}>{user ? user.name : 'Gym User'}</Text>
            <Text style={styles.userEmail}>{user ? user.email : 'user@gympro.com'}</Text>

            <View style={styles.roleBadge}>
              <Text style={styles.roleBadgeText}>
                {isStaff ? 'STAFF ACCOUNT' : 'MEMBER ACCOUNT'}
              </Text>
            </View>
          </View>

          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.headerIcon}
              onPress={() => navigation.navigate('Profile')}
            >
              <Ionicons name="person-outline" size={22} color="#ffffff" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.headerIcon} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={22} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <View style={styles.overviewCard}>
          <View style={styles.overviewTop}>
            <View>
              <Text style={styles.overviewTitle}>
                {isStaff ? 'Staff Dashboard' : 'Member Dashboard'}
              </Text>
              <Text style={styles.overviewSub}>
                {isStaff
                  ? 'Manage class schedules, trainer assignments and working hours.'
                  : 'Manage your membership, class booking and trainer details.'}
              </Text>
            </View>

            <View style={styles.memberBadge}>
              <Text style={styles.memberBadgeText}>
                {isStaff ? 'STAFF' : membershipPlan ? 'ACTIVE' : 'NEW'}
              </Text>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Ionicons
                name={isStaff ? 'calendar-outline' : 'card-outline'}
                size={24}
                color="#1554D9"
              />
              <Text style={styles.statLabel}>
                {isStaff ? 'Classes' : 'Plan'}
              </Text>
              <Text numberOfLines={1} style={styles.statValue}>
                {isStaff ? 'Manage' : membershipPlan ? membershipPlan.name : 'None'}
              </Text>
            </View>

            <View style={styles.statBox}>
              <MaterialCommunityIcons
                name={isStaff ? 'account-tie-outline' : 'calendar-clock'}
                size={24}
                color="#1554D9"
              />
              <Text style={styles.statLabel}>
                {isStaff ? 'Trainer' : 'Class'}
              </Text>
              <Text numberOfLines={1} style={styles.statValue}>
                {isStaff
                  ? assignedTrainer
                    ? assignedTrainer.name
                    : 'None'
                  : selectedClass
                    ? selectedClass.name
                    : 'None'}
              </Text>
            </View>

            <View style={styles.statBox}>
              <Ionicons
                name={isStaff ? 'time-outline' : 'person-outline'}
                size={24}
                color="#1554D9"
              />
              <Text style={styles.statLabel}>
                {isStaff ? 'Hours' : 'Trainer'}
              </Text>
              <Text numberOfLines={1} style={styles.statValue}>
                {isStaff
                  ? assignedTrainer?.hours || 'None'
                  : assignedTrainer
                    ? assignedTrainer.name
                    : 'None'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.iconCircle}>
              <Ionicons name="person-outline" size={22} color="#1554D9" />
            </View>
            <Text style={styles.sectionTitle}>
              {isStaff ? 'Staff Profile' : 'Member Profile'}
            </Text>
          </View>

          <Text style={styles.sectionText}>
            {user ? `${user.name} • ${user.email}` : 'No profile details found.'}
          </Text>

          <Text style={styles.mutedText}>Role: {userRole}</Text>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('Profile')}
          >
            <Text style={styles.actionText}>Manage Profile</Text>
          </TouchableOpacity>
        </View>

        {!isStaff && (
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <View style={styles.iconCircle}>
                <Ionicons name="card-outline" size={22} color="#1554D9" />
              </View>
              <Text style={styles.sectionTitle}>Membership & Billing</Text>
            </View>

            <Text style={styles.sectionText}>
              {membershipPlan
                ? `${membershipPlan.name} plan • ${membershipPlan.price} • ${membershipPlan.status}`
                : 'No membership plan selected yet.'}
            </Text>

            {membershipPlan?.billingDate ? (
              <Text style={styles.mutedText}>
                Billing date: {membershipPlan.billingDate}
              </Text>
            ) : null}

            {membershipPlan?.expiryDate ? (
              <Text style={styles.mutedText}>
                Expiry date: {membershipPlan.expiryDate}
              </Text>
            ) : null}

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('Membership')}
            >
              <Text style={styles.actionText}>
                {membershipPlan ? 'Change Membership' : 'Choose Membership'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.iconCircle}>
              <MaterialCommunityIcons name="calendar-clock" size={22} color="#1554D9" />
            </View>
            <Text style={styles.sectionTitle}>
              {isStaff ? 'Class Schedule Management' : 'Class Activity'}
            </Text>
          </View>

          <Text style={styles.sectionText}>
            {isStaff
              ? 'Add, update or delete class schedules for gym members.'
              : selectedClass
                ? `${selectedClass.name} • ${selectedClass.time}`
                : 'No class selected yet.'}
          </Text>

          {!isStaff && selectedClass?.trainer ? (
            <Text style={styles.mutedText}>Class trainer: {selectedClass.trainer}</Text>
          ) : null}

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('Classes')}
          >
            <Text style={styles.actionText}>
              {isStaff ? 'Manage Class Schedules' : 'Book / View Classes'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.iconCircle}>
              <MaterialCommunityIcons name="dumbbell" size={22} color="#1554D9" />
            </View>
            <Text style={styles.sectionTitle}>
              {isStaff ? 'Trainer & Hours Management' : 'Trainer Assignment'}
            </Text>
          </View>

          <Text style={styles.sectionText}>
            {assignedTrainer
              ? `${assignedTrainer.name} • ${assignedTrainer.specialization}`
              : isStaff
                ? 'No trainer assigned to a class yet.'
                : 'No trainer assigned yet.'}
          </Text>

          {assignedTrainer?.assignedClass ? (
            <Text style={styles.mutedText}>
              Assigned class: {assignedTrainer.assignedClass}
            </Text>
          ) : null}

          {assignedTrainer?.assignedClassTime ? (
            <Text style={styles.mutedText}>
              Class time: {assignedTrainer.assignedClassTime}
            </Text>
          ) : null}

          {assignedTrainer?.hours ? (
            <Text style={styles.mutedText}>Working hours: {assignedTrainer.hours}</Text>
          ) : null}

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('Trainer')}
          >
            <Text style={styles.actionText}>
              {isStaff ? 'Assign Trainer / Track Hours' : 'View Trainer'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={[styles.footerItem, styles.footerActive]}>
          <Ionicons name="grid-outline" size={23} color="#1554D9" />
          <Text style={styles.footerActiveText}>Home</Text>
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

        <TouchableOpacity
          style={styles.footerItem}
          onPress={() => navigation.navigate('Classes')}
        >
          <MaterialCommunityIcons name="calendar-clock" size={23} color="#94A3B8" />
          <Text style={styles.footerText}>Classes</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.footerItem}
          onPress={() => navigation.navigate('Trainer')}
        >
          <MaterialCommunityIcons name="dumbbell" size={23} color="#94A3B8" />
          <Text style={styles.footerText}>Trainers</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.footerItem}
          onPress={() => navigation.navigate('Profile')}
        >
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
    paddingTop: 58,
    paddingHorizontal: 22,
    paddingBottom: 68,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerTextBox: {
    flex: 1,
    paddingRight: 12,
  },
  greeting: {
    color: '#DDE6FF',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 6,
  },
  userName: {
    color: '#ffffff',
    fontSize: 31,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  userEmail: {
    color: '#E0E7FF',
    fontSize: 14,
    marginTop: 6,
    fontWeight: '600',
  },
  roleBadge: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 13,
    alignSelf: 'flex-start',
    marginTop: 12,
  },
  roleBadgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '900',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 10,
  },
  headerIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.16)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overviewCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 18,
    marginTop: -42,
    borderRadius: 26,
    padding: 20,
    shadowColor: '#0F172A',
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 5,
  },
  overviewTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 18,
  },
  overviewTitle: {
    color: '#111827',
    fontSize: 22,
    fontWeight: '900',
  },
  overviewSub: {
    color: '#64748B',
    fontSize: 14,
    lineHeight: 21,
    marginTop: 6,
    maxWidth: 230,
  },
  memberBadge: {
    backgroundColor: '#EEF4FF',
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 13,
    alignSelf: 'flex-start',
  },
  memberBadgeText: {
    color: '#1554D9',
    fontSize: 12,
    fontWeight: '900',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#F1F5FF',
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 8,
    alignItems: 'center',
    minHeight: 112,
  },
  statLabel: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 8,
  },
  statValue: {
    color: '#111827',
    fontSize: 13,
    fontWeight: '900',
    marginTop: 5,
    textAlign: 'center',
  },
  sectionCard: {
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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#EEF4FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sectionTitle: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '900',
  },
  sectionText: {
    color: '#334155',
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 22,
  },
  mutedText: {
    color: '#64748B',
    fontSize: 13,
    marginTop: 6,
    fontWeight: '600',
  },
  actionButton: {
    backgroundColor: '#1554D9',
    height: 50,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 18,
  },
  actionText: {
    color: '#ffffff',
    fontSize: 15,
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