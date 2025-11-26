import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Polygon } from 'react-native-svg';
import CustomText from './CustomText';
import { useTheme } from '../context/ThemeContext';

interface AppLogoProps {
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
}

export default function AppLogo({ size = 'medium', showText = true }: AppLogoProps) {
  const { theme: colors } = useTheme();

  const dimensions = {
    small: { container: 45, icon: 22, text: 16, gradient: 35 },
    medium: { container: 70, icon: 32, text: 22, gradient: 55 },
    large: { container: 95, icon: 44, text: 28, gradient: 75 },
  };

  const dims = dimensions[size];

  // Glow Animation
  const glowAnim = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, { toValue: 1.1, duration: 1200, useNativeDriver: true }),
        Animated.timing(glowAnim, { toValue: 1, duration: 1200, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.container}>
      {/* Wrapper for glow + logo */}
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>

        {/* ✨ Glow Ring */}
        <Animated.View
          style={[
            styles.glowRing,
            {
              width: dims.container + 25,
              height: dims.container + 25,
              transform: [{ scale: glowAnim }],
            },
          ]}
        />

        {/* ✨ Soft Gradient Background Circle */}
        <LinearGradient
          colors={['rgba(255,215,0,0.25)', 'rgba(229,9,20,0.25)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.gradientCircle,
            { width: dims.gradient, height: dims.gradient },
          ]}
        />

        {/* 🔥 Main Circular Logo */}
        <LinearGradient
          colors={[colors.primary, '#8B0000']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.logoContainer,
            {
              width: dims.container,
              height: dims.container,
            },
          ]}
        >
          {/* Inner Light Accent */}
          <View
            style={[
              styles.innerAccent,
              { width: dims.container * 0.35, height: dims.container * 0.35 },
            ]}
          />

          {/* SVG Play Button */}
          <Svg width={dims.icon} height={dims.icon} viewBox="0 0 24 24">
            <Circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" fill="none" />
            <Polygon points="10,8 16,12 10,16" fill="white" />
          </Svg>
        </LinearGradient>
      </View>

      {/* 🔤 Text below logo */}
      {showText && (
        <View style={{ alignItems: 'center', marginTop: 12 }}>
          <CustomText style={[styles.logoText, { fontSize: dims.text, color: colors.text }]}>
            Cine
            <CustomText style={{ color: colors.primary, fontWeight: '900' }}>
              Scope
            </CustomText>
          </CustomText>

          {/* 🔥 Underline */}
          <View style={[styles.underline, { width: dims.container * 0.7 }]} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 10,
  },

  glowRing: {
    position: 'absolute',
    borderRadius: 200,
    backgroundColor: 'rgba(184, 125, 128, 0.25)',
  },

  gradientCircle: {
    position: 'absolute',
    borderRadius: 200,
    filter: 'blur(6px)',
  },

  logoContainer: {
    borderRadius: 200,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(165, 88, 88, 0.2)',
    shadowColor: 'rgb(203, 93, 99)',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 10,
  },

  innerAccent: {
    position: 'absolute',
    top: '12%',
    left: '15%',
    borderRadius: 200,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },

  logoText: {
    fontWeight: '700',
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },

  underline: {
    height: 3,
    marginTop: 4,
    borderRadius: 2,
    backgroundColor: '#E50914',
    opacity: 0.7,
  },
});
