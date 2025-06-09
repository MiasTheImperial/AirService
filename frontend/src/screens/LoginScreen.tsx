import React, { useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { TextInput, Button, Text, Surface, useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

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
  const [loadingType, setLoadingType] = useState<'guest' | 'user' | null>(null);
  const [error, setError] = useState('');

  const handleGuestLogin = async () => {
    try {
      setLoadingType('guest');
      setError('');

      if (!seatNumber) {
        setError(t('auth.seatRequired'));
        setLoadingType(null);
        return;
      }

      await new Promise(resolve => setTimeout(resolve, 1000));

      route.params.onLogin(false, seatNumber);
    } catch (err: any) {
      setError(err.message || t('auth.invalidCredentials'));
    } finally {
      setLoadingType(null);
    }
  };

  const handleUserLogin = async () => {
    try {
      setLoadingType('user');
      setError('');

      if (!email) {
        setError(t('auth.emailRequired'));
        setLoadingType(null);
        return;
      }

      if (!password) {
        setError(t('auth.passwordRequired'));
        setLoadingType(null);
        return;
      }

      const isAdmin = email === 'admin@example.com';

      if (!isAdmin && !seatNumber) {
        setError(t('auth.seatRequired'));
        setLoadingType(null);
        return;
      }

      await new Promise(resolve => setTimeout(resolve, 1000));

      route.params.onLogin(isAdmin, seatNumber);
    } catch (err: any) {
      setError(err.message || t('auth.invalidCredentials'));
    } finally {
      setLoadingType(null);
    }
  };

  return (
    <Surface style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.logoContainer}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=300' }}
          style={styles.logo}
        />
        <Text style={[styles.title, { color: theme.colors.onBackground }]}>Авиа-Сервис</Text>
      </View>
      
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
        <TextInput
          label={t('auth.seatNumber')}
          value={seatNumber}
          onChangeText={setSeatNumber}
          style={styles.input}
          keyboardType="number-pad"
          mode="outlined"
          outlineColor={theme.colors.outline}
          activeOutlineColor={theme.colors.primary}
          textColor={theme.colors.onSurface}
        />
      </View>
      
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Button
        mode="contained"
        onPress={handleGuestLogin}
        loading={loadingType === 'guest'}
        disabled={!seatNumber}
        style={styles.button}
        buttonColor={theme.colors.primary}
        textColor={theme.colors.onPrimary}
      >
        {t('auth.signInAsGuest')}
      </Button>

      <Button
        mode="contained"
        onPress={handleUserLogin}
        loading={loadingType === 'user'}
        disabled={!email || !password || (!seatNumber && email !== 'admin@example.com')}
        style={styles.button}
        buttonColor={theme.colors.primary}
        textColor={theme.colors.onPrimary}
      >
        {t('auth.signIn')}
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