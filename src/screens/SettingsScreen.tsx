import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import CustomText from '../components/CustomText';
import { useTheme } from '../context/ThemeContext';

export default function SettingsScreen() {
  const navigation = useNavigation();
  const { theme, themeMode, toggleTheme } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [autoplayEnabled, setAutoplayEnabled] = useState(false);

  const handleClearCache = () => {
    Alert.alert(
      'Clear Cache',
      'Are you sure you want to clear app cache?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Success', 'Cache cleared successfully');
          },
        },
      ]
    );
  };

  const styles = getStyles(theme);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={theme.text} />
        </TouchableOpacity>
        <CustomText style={styles.headerTitle}>Settings</CustomText>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Appearance Section */}
        <View style={styles.section}>
          <CustomText style={styles.sectionTitle}>APPEARANCE</CustomText>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={[styles.iconContainer, { backgroundColor: theme.primary }]}>
                <Feather name="moon" size={20} color="#fff" />
              </View>
              <View style={styles.settingTextContainer}>
                <CustomText style={styles.settingTitle}>Dark Mode</CustomText>
                <CustomText style={styles.settingDescription}>
                  {themeMode === 'dark' ? 'Dark theme enabled' : 'Light theme enabled'}
                </CustomText>
              </View>
            </View>
            <Switch
              value={themeMode === 'dark'}
              onValueChange={toggleTheme}
              trackColor={{ false: theme.border, true: theme.primary }}
              thumbColor={themeMode === 'dark' ? theme.accent : '#f4f3f4'}
            />
          </View>
        </View>

        {/* Notifications Section */}
        <View style={styles.section}>
          <CustomText style={styles.sectionTitle}>NOTIFICATIONS</CustomText>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={[styles.iconContainer, { backgroundColor: theme.accent }]}>
                <Feather name="bell" size={20} color="#fff" />
              </View>
              <View style={styles.settingTextContainer}>
                <CustomText style={styles.settingTitle}>Push Notifications</CustomText>
                <CustomText style={styles.settingDescription}>
                  Receive updates and alerts
                </CustomText>
              </View>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: theme.border, true: theme.primary }}
              thumbColor={notificationsEnabled ? theme.accent : '#f4f3f4'}
            />
          </View>
        </View>

        {/* Playback Section */}
        <View style={styles.section}>
          <CustomText style={styles.sectionTitle}>PLAYBACK</CustomText>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={[styles.iconContainer, { backgroundColor: theme.success }]}>
                <Feather name="play-circle" size={20} color="#fff" />
              </View>
              <View style={styles.settingTextContainer}>
                <CustomText style={styles.settingTitle}>Autoplay</CustomText>
                <CustomText style={styles.settingDescription}>
                  Automatically play next video
                </CustomText>
              </View>
            </View>
            <Switch
              value={autoplayEnabled}
              onValueChange={setAutoplayEnabled}
              trackColor={{ false: theme.border, true: theme.primary }}
              thumbColor={autoplayEnabled ? theme.accent : '#f4f3f4'}
            />
          </View>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={[styles.iconContainer, { backgroundColor: theme.secondary }]}>
                <Feather name="video" size={20} color="#fff" />
              </View>
              <View style={styles.settingTextContainer}>
                <CustomText style={styles.settingTitle}>Video Quality</CustomText>
                <CustomText style={styles.settingDescription}>Auto</CustomText>
              </View>
            </View>
            <Feather name="chevron-right" size={20} color={theme.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Data Section */}
        <View style={styles.section}>
          <CustomText style={styles.sectionTitle}>DATA & STORAGE</CustomText>

          <TouchableOpacity style={styles.settingItem} onPress={handleClearCache}>
            <View style={styles.settingLeft}>
              <View style={[styles.iconContainer, { backgroundColor: '#FFB142' }]}>
                <Feather name="trash-2" size={20} color="#fff" />
              </View>
              <View style={styles.settingTextContainer}>
                <CustomText style={styles.settingTitle}>Clear Cache</CustomText>
                <CustomText style={styles.settingDescription}>
                  Free up storage space
                </CustomText>
              </View>
            </View>
            <Feather name="chevron-right" size={20} color={theme.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={[styles.iconContainer, { backgroundColor: '#00D2A0' }]}>
                <Feather name="download" size={20} color="#fff" />
              </View>
              <View style={styles.settingTextContainer}>
                <CustomText style={styles.settingTitle}>Download Quality</CustomText>
                <CustomText style={styles.settingDescription}>High</CustomText>
              </View>
            </View>
            <Feather name="chevron-right" size={20} color={theme.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <CustomText style={styles.sectionTitle}>ABOUT</CustomText>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={[styles.iconContainer, { backgroundColor: theme.primary }]}>
                <Feather name="info" size={20} color="#fff" />
              </View>
              <View style={styles.settingTextContainer}>
                <CustomText style={styles.settingTitle}>App Version</CustomText>
                <CustomText style={styles.settingDescription}>1.0.0</CustomText>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={[styles.iconContainer, { backgroundColor: '#74B9FF' }]}>
                <Feather name="file-text" size={20} color="#fff" />
              </View>
              <View style={styles.settingTextContainer}>
                <CustomText style={styles.settingTitle}>Terms & Privacy</CustomText>
                <CustomText style={styles.settingDescription}>
                  Legal information
                </CustomText>
              </View>
            </View>
            <Feather name="chevron-right" size={20} color={theme.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const getStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: theme.background,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.text,
  },
  content: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.textSecondary,
    marginBottom: 12,
    letterSpacing: 1.2,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.card,
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: theme.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.text,
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 13,
    color: theme.textSecondary,
  },
});
