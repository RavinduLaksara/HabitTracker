'use client';

import type React from 'react';
import {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {useAuth} from '../../context/AuthContext';
import {useTheme} from '../../context/ThemeContext';
import {Button} from '../../components/common/Button';

interface RegisterScreenProps {
  navigation: any;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({navigation}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const {register} = useAuth();
  const {colors} = useTheme();

  const handleRegister = async () => {
    console.log('🚀 Register button pressed');

    // Validation
    if (
      !name.trim() ||
      !email.trim() ||
      !password.trim() ||
      !confirmPassword.trim()
    ) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    console.log('📝 Starting registration for:', email);

    try {
      const success = await register(name.trim(), email.trim(), password);
      console.log('✅ Registration result:', success);

      if (success) {
        console.log('🎉 Registration successful! Navigating to login...');

        // Clear form first
        setName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');

        // Navigate to login screen
        navigation.navigate('Login');
        console.log('🔄 Navigation to Login completed');

        // Optional: Show success message after navigation
        setTimeout(() => {
          Alert.alert(
            'Success! 🎉',
            'Account created successfully! Please log in.',
          );
        }, 500);
      } else {
        console.log('❌ Registration failed - user exists');
        Alert.alert('Error', 'User with this email already exists');
      }
    } catch (error) {
      console.error('💥 Registration error:', error);
      Alert.alert('Error', 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
      console.log('🏁 Registration process completed');
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, {backgroundColor: colors.background}]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={[styles.title, {color: colors.text}]}>Join Us! 🎉</Text>
          <Text style={[styles.subtitle, {color: colors.textSecondary}]}>
            Create your account to start building habits
          </Text>
        </View>

        <View style={[styles.form, {backgroundColor: colors.surface}]}>
          <View style={styles.inputContainer}>
            <Text style={[styles.label, {color: colors.text}]}>Full Name</Text>
            <TextInput
              style={[
                styles.input,
                {
                  borderColor: colors.border,
                  backgroundColor: colors.background,
                  color: colors.text,
                },
              ]}
              value={name}
              onChangeText={setName}
              placeholder="Enter your full name"
              placeholderTextColor={colors.textSecondary}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, {color: colors.text}]}>Email</Text>
            <TextInput
              style={[
                styles.input,
                {
                  borderColor: colors.border,
                  backgroundColor: colors.background,
                  color: colors.text,
                },
              ]}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              placeholderTextColor={colors.textSecondary}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, {color: colors.text}]}>Password</Text>
            <TextInput
              style={[
                styles.input,
                {
                  borderColor: colors.border,
                  backgroundColor: colors.background,
                  color: colors.text,
                },
              ]}
              value={password}
              onChangeText={setPassword}
              placeholder="Create a password"
              placeholderTextColor={colors.textSecondary}
              secureTextEntry
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, {color: colors.text}]}>
              Confirm Password
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  borderColor: colors.border,
                  backgroundColor: colors.background,
                  color: colors.text,
                },
              ]}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm your password"
              placeholderTextColor={colors.textSecondary}
              secureTextEntry
            />
          </View>

          <Button
            title="Create Account"
            onPress={handleRegister}
            loading={loading}
            style={styles.registerButton}
          />

          <View style={styles.loginContainer}>
            <Text style={[styles.loginText, {color: colors.textSecondary}]}>
              Already have an account?{' '}
            </Text>
            <Button
              title="Sign In"
              onPress={() => {
                console.log('🔄 Sign In button pressed - navigating to Login');
                navigation.navigate('Login');
              }}
              variant="secondary"
              style={styles.loginButton}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  form: {
    borderRadius: 20,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 2,
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
  },
  registerButton: {
    marginTop: 10,
    marginBottom: 20,
  },
  loginContainer: {
    alignItems: 'center',
  },
  loginText: {
    fontSize: 14,
    marginBottom: 10,
  },
  loginButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
});
