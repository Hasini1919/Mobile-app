import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Text,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { RegisterCredentials } from '../types/auth';
import { authStorage } from '../storage/authStorage';
import AppLogo from '../components/AppLogo';

type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

type RegisterScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Register'>;

const registerSchema = yup.object().shape({
  username: yup
    .string()
    .required('Username is required')
    .min(3, 'Username must be at least 3 characters')
    .matches(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  email: yup.string().required('Email is required').email('Please enter a valid email'),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain uppercase, lowercase & number'),
  confirmPassword: yup.string().oneOf([yup.ref('password')], 'Passwords must match').required('Confirm your password'),
});

export default function RegisterScreen() {
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const { control, handleSubmit, formState: { errors }, reset, watch } = useForm<RegisterCredentials>({
    resolver: yupResolver(registerSchema),
    defaultValues: { username: '', email: '', password: '', confirmPassword: '' },
  });

  const watchPassword = watch('password', '');

  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 6) strength += 25;
    if (password.length >= 10) strength += 25;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25;
    if (/\d/.test(password)) strength += 25;
    return strength;
  };

  useEffect(() => {
    setPasswordStrength(calculatePasswordStrength(watchPassword));
  }, [watchPassword]);

  const getStrengthColor = () => {
    if (passwordStrength <= 25) return '#EF4444';
    if (passwordStrength <= 50) return '#F97316';
    if (passwordStrength <= 75) return '#FBBF24';
    return '#10B981';
  };

  const getStrengthText = () => {
    if (passwordStrength <= 25) return 'Weak';
    if (passwordStrength <= 50) return 'Fair';
    if (passwordStrength <= 75) return 'Good';
    return 'Strong';
  };

  const onSubmit = async (data: RegisterCredentials) => {
    setIsLoading(true);
    try {
      const user = await authStorage.registerUser(data.username, data.email, data.password);
      await authStorage.saveUser(user);
      Alert.alert('Success', 'Account created successfully!', [
        { text: 'OK', onPress: () => reset() },
      ]);
    } catch (error: any) {
      Alert.alert('Registration Failed', error.message || 'An error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <AppLogo size="large" showText />
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join CineScope today</Text>
        </View>

        <View style={styles.form}>
          {/* Username */}
          <View style={styles.inputContainer}>
            <Feather name="user" size={20} color="#c5c5c5" style={styles.icon} />
            <Controller
              control={control}
              name="username"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={styles.input}
                  placeholder="Username"
                  placeholderTextColor="#aaa"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  autoCapitalize="none"
                />
              )}
            />
          </View>
          {errors.username && <Text style={styles.errorText}>{errors.username.message}</Text>}

          {/* Email */}
          <View style={styles.inputContainer}>
            <Feather name="mail" size={20} color="#c5c5c5" style={styles.icon} />
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor="#aaa"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              )}
            />
          </View>
          {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}

          {/* Password */}
          <View style={styles.inputContainer}>
            <Feather name="lock" size={20} color="#c5c5c5" style={styles.icon} />
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor="#aaa"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
              )}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
              <Feather name={showPassword ? 'eye' : 'eye-off'} size={20} color="#c5c5c5" />
            </TouchableOpacity>
          </View>
          {watchPassword.length > 0 && (
            <View style={styles.strengthContainer}>
              <View style={styles.strengthBar}>
                <View style={[styles.strengthFill, { width: `${passwordStrength}%`, backgroundColor: getStrengthColor() }]} />
              </View>
              <Text style={{ color: getStrengthColor() }}>{getStrengthText()}</Text>
            </View>
          )}
          {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}

          {/* Confirm Password */}
          <View style={styles.inputContainer}>
            <Feather name="lock" size={20} color="#c5c5c5" style={styles.icon} />
            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={styles.input}
                  placeholder="Confirm Password"
                  placeholderTextColor="#aaa"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                />
              )}
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeBtn}>
              <Feather name={showConfirmPassword ? 'eye' : 'eye-off'} size={20} color="#c5c5c5" />
            </TouchableOpacity>
          </View>
          {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>}

          {/* Sign Up Button */}
          <TouchableOpacity style={[styles.button, isLoading && { opacity: 0.6 }]} onPress={handleSubmit(onSubmit)} disabled={isLoading}>
            {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Sign Up</Text>}
          </TouchableOpacity>

          {/* Login Link */}
          <View style={styles.registerRow}>
            <Text style={styles.registerText}>Already have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.registerLink}> Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0a0a0a" },
  scrollContent: { flexGrow: 1, justifyContent: "center", padding: 24 },
  header: { alignItems: "center", marginBottom: 40 },
  title: { color: "#fff", fontSize: 32, fontWeight: "bold", marginTop: 16, textAlign: "center" },
  subtitle: { color: "#ccc", fontSize: 15, textAlign: "center", marginBottom: 20 },
  form: { width: "100%" },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    marginBottom: 12,
  },
  icon: { marginRight: 12 },
  input: { flex: 1, height: 56, color: "#fff", fontSize: 16 },
  eyeBtn: { padding: 8 },
  strengthContainer: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  strengthBar: { flex: 1, height: 4, backgroundColor: "#2d2d44", borderRadius: 2, marginRight: 8 },
  strengthFill: { height: "100%", borderRadius: 2 },
  button: { height: 56, borderRadius: 12, backgroundColor: "#E50914", justifyContent: "center", alignItems: "center", marginTop: 16 },
  btnText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  registerRow: { flexDirection: "row", justifyContent: "center", marginTop: 20 },
  registerText: { color: "#aaa", fontSize: 14 },
  registerLink: { color: "#E50914", fontWeight: "bold" },
  errorText: { color: "#F97316", fontSize: 12, marginBottom: 12, marginLeft: 4 },
});
