import React, { useLayoutEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function WelcomeScreen({ navigation }) {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return (
    <LinearGradient colors={['#1554D9', '#4338CA']} style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1554D9" />

      <View style={styles.content}>
        <View style={styles.iconWrapper}>
          <View style={styles.iconCard}>
            <Ionicons name="barbell-outline" size={54} color="#ffffff" />
          </View>

          <View style={styles.badge}>
            <Ionicons name="flash" size={17} color="#000000" />
          </View>
        </View>

        <Text style={styles.title}>Welcome to GymPro</Text>

        <Text style={styles.subtitle}>
          Track your fitness. Book classes.{'\n'}
          Manage your membership.
        </Text>

        <View style={styles.dots}>
          <View style={styles.dot} />
          <View style={styles.activeDot} />
          <View style={styles.dot} />
        </View>
      </View>

      <View style={styles.bottom}>
        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.primaryButton}
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={styles.primaryText}>Get Started</Text>
          <Ionicons name="arrow-forward" size={24} color="#1554D9" />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.secondaryText}>
            Already have an account? <Text style={styles.link}>Login</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingBottom: 120,
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 34,
  },
  iconCard: {
    width: 118,
    height: 118,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.10)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  badge: {
    position: 'absolute',
    right: -16,
    bottom: 10,
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#4ADE80',
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ rotate: '-8deg' }],
  },
  title: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 18,
    letterSpacing: -0.5,
  },
  subtitle: {
    color: '#DDE6FF',
    fontSize: 17,
    textAlign: 'center',
    lineHeight: 27,
    fontWeight: '500',
  },
  dots: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 36,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.45)',
    marginHorizontal: 6,
  },
  activeDot: {
    width: 34,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.75)',
    marginHorizontal: 6,
  },
  bottom: {
    position: 'absolute',
    left: 24,
    right: 24,
    bottom: 34,
  },
  primaryButton: {
    height: 64,
    borderRadius: 22,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    marginBottom: 26,
  },
  primaryText: {
    color: '#1554D9',
    fontSize: 19,
    fontWeight: '900',
  },
  secondaryText: {
    color: '#E0E7FF',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  link: {
    color: '#ffffff',
    fontWeight: '900',
    textDecorationLine: 'underline',
  },
});