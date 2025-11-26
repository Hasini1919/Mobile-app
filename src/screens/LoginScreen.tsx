import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Feather } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import CustomText from '../components/CustomText';
import AppLogo from '../components/AppLogo';
import { authApi } from '../api/authApi';
import { authStorage } from '../storage/authStorage';
import { LoginCredentials, User } from '../types/auth';

type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

type LoginScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

const loginSchema = yup.object().shape({
  username: yup.string().required("Username is required").min(3, "Must be at least 3 characters"),
  password: yup.string().required("Password is required").min(6, "Must be at least 6 characters"),
});

export default function LoginScreen() {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>({
    resolver: yupResolver(loginSchema),
    defaultValues: { username: "", password: "" },
  });

  const onSubmit = async (data: LoginCredentials) => {
    setLoading(true);
    try {
      const localUser = await authStorage.loginWithCredentials(data.username, data.password);

      if (localUser) {
        await authStorage.saveUser(localUser);
        Alert.alert("Success", `Welcome back, ${localUser.firstName}!`);
        return;
      }

      const response = await authApi.login(data);
      const token = response.accessToken || response.token;

      if (!token) throw new Error("Missing token");

      const user: User = {
        id: response.id,
        username: response.username,
        email: response.email,
        firstName: response.firstName,
        lastName: response.lastName,
        gender: response.gender,
        image: response.image,
        token,
      };

      await authStorage.saveUser(user);

      Alert.alert("Success", `Welcome back, ${user.firstName}!`);
    } catch (e) {
      Alert.alert("Login Failed", "Invalid username or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* Background Pattern */}
      <View style={styles.backgroundPattern} />

      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <AppLogo size="large" showText />
          <CustomText style={styles.subtitle}>Sign in to continue</CustomText>
        </View>

        <View style={styles.form}>
          {/* Username */}
          <View style={styles.inputContainer}>
            <Feather name="user" size={20} color="#c5c5c5" style={styles.icon} />
            <Controller
              control={control}
              name="username"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={styles.input}
                  placeholder="Username"
                  placeholderTextColor="#aaa"
                  onChangeText={onChange}
                  value={value}
                  autoCapitalize="none"
                />
              )}
            />
          </View>
          {errors.username && (
            <CustomText style={styles.errorText}>{errors.username.message}</CustomText>
          )}

          {/* Password */}
          <View style={styles.inputContainer}>
            <Feather name="lock" size={20} color="#c5c5c5" style={styles.icon} />
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor="#aaa"
                  secureTextEntry={!showPassword}
                  onChangeText={onChange}
                  value={value}
                  autoCapitalize="none"
                />
              )}
            />

            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
              <Feather name={showPassword ? "eye" : "eye-off"} size={20} color="#c5c5c5" />
            </TouchableOpacity>
          </View>

          {errors.password && (
            <CustomText style={styles.errorText}>{errors.password.message}</CustomText>
          )}

          {/* Button */}
          <TouchableOpacity
            style={[styles.button, loading && { opacity: 0.6 }]}
            disabled={loading}
            onPress={handleSubmit(onSubmit)}
          >
            {loading ? <ActivityIndicator color="#fff" /> : <CustomText style={styles.btnText}>Sign In</CustomText>}
          </TouchableOpacity>

          {/* Register */}
          <View style={styles.registerRow}>
            <CustomText style={styles.registerText}>Don't have an account?</CustomText>
            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
              <CustomText style={styles.registerLink}> Sign Up</CustomText>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0a0a0a" },

  backgroundPattern: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#0a0a0a",
    opacity: 0.3,
  },

  scroll: { flexGrow: 1, justifyContent: "center", padding: 24 },

  header: { alignItems: "center", marginBottom: 40 },

  subtitle: {
    color: "#ccc",
    fontSize: 15,
    marginTop: 10,
  },

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

  errorText: {
    color: "#F97316",
    fontSize: 12,
    marginBottom: 6,
    marginLeft: 4,
  },

  button: {
    height: 56,
    borderRadius: 12,
    backgroundColor: "#E50914",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },

  btnText: { color: "#fff", fontSize: 18, fontWeight: "bold" },

  registerRow: { flexDirection: "row", justifyContent: "center", marginTop: 20 },

  registerText: { color: "#aaa", fontSize: 14 },

  registerLink: { color: "#E50914", fontWeight: "bold" },
});
