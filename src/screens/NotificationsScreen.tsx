import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import CustomText from '../components/CustomText';
import { useTheme } from '../context/ThemeContext';

interface Notification {
  id: string;
  type: 'movie' | 'system' | 'favorite' | 'trending';
  title: string;
  message: string;
  time: string;
  read: boolean;
  icon: string;
}

export default function NotificationsScreen() {
  const { theme: colors } = useTheme();
  const navigation = useNavigation();
  
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'trending',
      title: 'New Trending Movies',
      message: 'Check out the latest trending movies this week!',
      time: '2 hours ago',
      read: false,
      icon: 'trending-up',
    },
    {
      id: '2',
      type: 'favorite',
      title: 'Movie Added to Favorites',
      message: 'You added "Inception" to your favorites',
      time: '5 hours ago',
      read: false,
      icon: 'heart',
    },
    {
      id: '3',
      type: 'movie',
      title: 'New Movies Available',
      message: '10 new movies have been added to the collection',
      time: '1 day ago',
      read: false,
      icon: 'film',
    },
    {
      id: '4',
      type: 'system',
      title: 'Welcome to StreamBox!',
      message: 'Explore thousands of movies and create your watchlist',
      time: '2 days ago',
      read: true,
      icon: 'star',
    },
    {
      id: '5',
      type: 'trending',
      title: 'Popular This Week',
      message: 'The Dark Knight is trending in your region',
      time: '3 days ago',
      read: true,
      icon: 'trending-up',
    },
  ]);

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const handleClearAll = () => {
    Alert.alert(
      'Clear All Notifications',
      'Are you sure you want to clear all notifications?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => setNotifications([]),
        },
      ]
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'trending':
        return colors.primary;
      case 'favorite':
        return colors.error;
      case 'movie':
        return colors.accent;
      case 'system':
        return colors.success;
      default:
        return colors.textSecondary;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      paddingTop: 50,
      paddingHorizontal: 20,
      paddingBottom: 20,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    backButton: {
      padding: 4,
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: 'bold',
      color: colors.text,
    },
    badge: {
      backgroundColor: colors.primary,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
      minWidth: 28,
      alignItems: 'center',
    },
    badgeText: {
      color: '#fff',
      fontSize: 12,
      fontWeight: 'bold',
    },
    actions: {
      flexDirection: 'row',
      paddingHorizontal: 20,
      marginBottom: 16,
      gap: 12,
    },
    actionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: 14,
      paddingVertical: 8,
      backgroundColor: colors.card,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.border,
    },
    actionButtonText: {
      fontSize: 13,
      color: colors.text,
      fontWeight: '600',
    },
    notificationsList: {
      paddingHorizontal: 20,
    },
    notificationItem: {
      flexDirection: 'row',
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    notificationItemUnread: {
      backgroundColor: colors.surface,
      borderColor: colors.primary,
      borderWidth: 2,
    },
    iconContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: colors.surface,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    notificationContent: {
      flex: 1,
    },
    notificationTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 4,
    },
    notificationMessage: {
      fontSize: 14,
      color: colors.textSecondary,
      lineHeight: 20,
      marginBottom: 6,
    },
    notificationTime: {
      fontSize: 12,
      color: colors.textSecondary,
    },
    unreadDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.primary,
      marginLeft: 8,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 40,
      marginTop: 100,
    },
    emptyText: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.text,
      marginTop: 16,
    },
    emptySubtext: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: 'center',
      marginTop: 8,
    },
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()} 
            style={styles.backButton}
          >
            <Feather name="arrow-left" size={24} color={colors.text} />
          </TouchableOpacity>
          <CustomText style={styles.headerTitle}>Notifications</CustomText>
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <CustomText style={styles.badgeText}>{unreadCount}</CustomText>
            </View>
          )}
        </View>
      </View>

      {/* Actions */}
      {notifications.length > 0 && (
        <View style={styles.actions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleMarkAllAsRead}
          >
            <Feather name="check-circle" size={16} color={colors.primary} />
            <CustomText style={styles.actionButtonText}>Mark all read</CustomText>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleClearAll}
          >
            <Feather name="trash-2" size={16} color={colors.error} />
            <CustomText style={styles.actionButtonText}>Clear all</CustomText>
          </TouchableOpacity>
        </View>
      )}

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Feather name="bell-off" size={64} color={colors.border} />
          <CustomText style={styles.emptyText}>No notifications</CustomText>
          <CustomText style={styles.emptySubtext}>
            You're all caught up! Check back later for updates
          </CustomText>
        </View>
      ) : (
        <ScrollView 
          style={styles.notificationsList}
          showsVerticalScrollIndicator={false}
        >
          {notifications.map((notification) => (
            <TouchableOpacity
              key={notification.id}
              style={[
                styles.notificationItem,
                !notification.read && styles.notificationItemUnread,
              ]}
              onPress={() => handleMarkAsRead(notification.id)}
            >
              <View style={styles.iconContainer}>
                <Feather 
                  name={notification.icon as any} 
                  size={24} 
                  color={getIconColor(notification.type)} 
                />
              </View>
              <View style={styles.notificationContent}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <CustomText style={styles.notificationTitle}>
                    {notification.title}
                  </CustomText>
                  {!notification.read && <View style={styles.unreadDot} />}
                </View>
                <CustomText style={styles.notificationMessage}>
                  {notification.message}
                </CustomText>
                <CustomText style={styles.notificationTime}>
                  {notification.time}
                </CustomText>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
}
