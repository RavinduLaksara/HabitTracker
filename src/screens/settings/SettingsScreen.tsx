'use client';

import type React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {useTheme} from '../../context/ThemeContext';
import {useAuth} from '../../context/AuthContext';
import {Button} from '../../components/common/Button';

export const SettingsScreen: React.FC = () => {
  const {colors, isDarkMode, toggleTheme} = useTheme();
  const {user, logout} = useAuth();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: logout,
      },
    ]);
  };

  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      <View style={[styles.header, {backgroundColor: colors.surface}]}>
        <Text style={[styles.title, {color: colors.text}]}>Settings ⚙️</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* User Info */}
        <View style={[styles.section, {backgroundColor: colors.surface}]}>
          <Text style={[styles.sectionTitle, {color: colors.text}]}>
            Account Information
          </Text>
          <View style={styles.userInfo}>
            <Text style={[styles.label, {color: colors.textSecondary}]}>
              Name:
            </Text>
            <Text style={[styles.value, {color: colors.text}]}>
              {user?.name}
            </Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={[styles.label, {color: colors.textSecondary}]}>
              Email:
            </Text>
            <Text style={[styles.value, {color: colors.text}]}>
              {user?.email}
            </Text>
          </View>
        </View>

        {/* Theme Settings */}
        <View style={[styles.section, {backgroundColor: colors.surface}]}>
          <Text style={[styles.sectionTitle, {color: colors.text}]}>
            Appearance
          </Text>
          <TouchableOpacity style={styles.themeContainer} onPress={toggleTheme}>
            <Text style={[styles.themeLabel, {color: colors.text}]}>
              {isDarkMode ? '🌙 Dark Mode' : '☀️ Light Mode'}
            </Text>
            <View
              style={[
                styles.switch,
                {
                  backgroundColor: isDarkMode ? colors.primary : colors.border,
                },
              ]}>
              <View
                style={[
                  styles.switchThumb,
                  {
                    backgroundColor: colors.surface,
                    transform: [{translateX: isDarkMode ? 20 : 2}],
                  },
                ]}
              />
            </View>
          </TouchableOpacity>
        </View>

        {/* App Info */}
        <View style={[styles.section, {backgroundColor: colors.surface}]}>
          <Text style={[styles.sectionTitle, {color: colors.text}]}>About</Text>
          <Text style={[styles.aboutText, {color: colors.textSecondary}]}>
            Habit Tracker v1.0.0{'\n'}
            Build good habits, break bad ones!{'\n'}
            Made with ❤️ using React Native
          </Text>
        </View>

        {/* Logout */}
        <View style={styles.logoutContainer}>
          <Button
            title="Logout"
            onPress={handleLogout}
            variant="outline"
            style={[styles.logoutButton, {borderColor: colors.error}]}
            textStyle={{color: colors.error}}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  userInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
  value: {
    fontSize: 16,
  },
  themeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  themeLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  switch: {
    width: 50,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  switchThumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
  },
  aboutText: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  logoutContainer: {
    marginTop: 20,
    marginBottom: 40,
  },
  logoutButton: {
    marginTop: 10,
  },
});
