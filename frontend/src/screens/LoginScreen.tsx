import React, { useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { TextInput, Button, Text, Surface, useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { login } from '../api/api';

interface LoginScreenProps {
  navigation: any;
  route: {
    params: {
      onLogin: (isAdmin: boolean, seatNumber: string) => void;
    };
  };
}

const LoginScreen = ({ navigation, route }: LoginScreenProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [seatNumber, setSeatNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isGuestMode, setIsGuestMode] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError('');

      if (!isGuestMode) {
        if (!email) {
          setError(t('auth.emailRequired'));
          setLoading(false);
          return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          setError(t('auth.invalidEmail'));
          setLoading(false);
          return;
        }

        if (!password) {
          setError(t('auth.passwordRequired'));
          setLoading(false);
          return;
        }

        const res = await login(email, password);
        route.params.onLogin(res.is_admin, res.seat);
      } else {
        if (!seatNumber) {
          setError(t('auth.seatRequired'));
          setLoading(false);
          return;
        }
        
        // Simulate request delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        route.params.onLogin(false, seatNumber);
      }
    } catch (err: any) {
      if (err.status === 401) {
        setError(t('auth.invalidCredentials'));
      } else if (err.status === 400) {
        setError(t('auth.invalidEmail'));
      } else {
        setError(err.message || t('auth.invalidCredentials'));
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsGuestMode(!isGuestMode);
    setError('');
  };

  return (
    <Surface style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.logoContainer}>
        <Image
          source={{ uri: require('../assets/air_service.jpg') }}
          style={styles.logo}
        />
        <Text style={[styles.title, { color: theme.colors.onBackground }]}>
          {t('common.appName')}
        </Text>
      </View>
      
      {!isGuestMode ? (
        <View>
          <TextInput
            label={t('auth.email')}
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            autoCapitalize="none"
            keyboardType="email-address"
            mode="outlined"
            outlineColor={theme.colors.outline}
            activeOutlineColor={theme.colors.primary}
            textColor={theme.colors.onSurface}
          />
          <TextInput
            label={t('auth.password')}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
            mode="outlined"
            outlineColor={theme.colors.outline}
            activeOutlineColor={theme.colors.primary}
            textColor={theme.colors.onSurface}
          />
        </View>
      ) : (
        <TextInput
          label={t('auth.seatNumber')}
          value={seatNumber}
          onChangeText={setSeatNumber}
          style={styles.input}
          keyboardType="default"
          mode="outlined"
          outlineColor={theme.colors.outline}
          activeOutlineColor={theme.colors.primary}
          textColor={theme.colors.onSurface}
        />
      )}
      
      {error ? <Text style={styles.error}>{error}</Text> : null}
      
      <Button
        mode="contained"
        onPress={handleLogin}
        loading={loading}
        style={styles.button}
        buttonColor={theme.colors.primary}
        textColor={theme.colors.onPrimary}
      >
        {isGuestMode ? t('auth.signInAsGuest') : t('auth.signIn')}
      </Button>
      
      <Button
        mode="text"
        onPress={toggleMode}
        style={styles.switchButton}
        textColor={theme.colors.primary}
      >
        {isGuestMode ? t('auth.login') : t('auth.signInAsGuest')}
      </Button>
      
      <View style={[styles.demoCredentials, { backgroundColor: theme.colors.surfaceVariant }]}>
        <Text style={[styles.demoTitle, { color: theme.colors.onSurfaceVariant }]}>Демо учетные данные:</Text>
        <Text style={{ color: theme.colors.onSurfaceVariant }}>Обычный пользователь: user@example.com / password</Text>
        <Text style={{ color: theme.colors.onSurfaceVariant }}>Администратор: admin@example.com / password</Text>
      </View>
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    elevation: 0,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    marginBottom: 15,
    backgroundColor: 'transparent',
  },
  button: {
    marginTop: 10,
    paddingVertical: 8,
  },
  switchButton: {
    marginTop: 10,
  },
  error: {
    color: '#FF5757',
    textAlign: 'center',
    marginBottom: 10,
  },
  demoCredentials: {
    marginTop: 40,
    padding: 15,
    borderRadius: 8,
  },
  demoTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
  }
});

export default LoginScreen; 