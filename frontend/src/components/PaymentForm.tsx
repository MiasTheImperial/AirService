import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text, useTheme } from 'react-native-paper';
import { PaymentMethod } from '../types';
import { useTranslation } from 'react-i18next';
import { formatPrice } from '../utils/currency';

interface PaymentFormProps {
  onPaymentComplete: (paymentMethod: PaymentMethod) => void;
  onCancel: () => void;
  amount: number;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ 
  onPaymentComplete, 
  onCancel, 
  amount 
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateCardNumber = (number: string) => {
    // Basic validation - should be 16 digits
    return /^\d{16}$/.test(number.replace(/\s/g, ''));
  };

  const validateExpiryDate = (date: string) => {
    // Format should be MM/YY
    if (!/^\d{2}\/\d{2}$/.test(date)) return false;

    const [month, year] = date.split('/').map(Number);
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;

    // Check if the expiry date is in the future
    return (
      month >= 1 && 
      month <= 12 && 
      (year > currentYear || (year === currentYear && month >= currentMonth))
    );
  };

  const validateCvv = (cvvCode: string) => {
    // CVV should be 3 or 4 digits
    return /^\d{3,4}$/.test(cvvCode);
  };

  const formatCardNumber = (text: string) => {
    // Remove all non-digit characters
    const cleaned = text.replace(/\D/g, '');
    // Add space after every 4 digits
    const formatted = cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
    return formatted.substring(0, 19); // Limit to 16 digits + 3 spaces
  };

  const handleCardNumberChange = (text: string) => {
    setCardNumber(formatCardNumber(text));
  };

  const handleExpiryDateChange = (text: string) => {
    // Format as MM/YY
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length <= 2) {
      setExpiryDate(cleaned);
    } else {
      setExpiryDate(`${cleaned.substring(0, 2)}/${cleaned.substring(2, 4)}`);
    }
  };

  const handleSubmit = async () => {
    setError(null);

    // Validate inputs
    if (!cardholderName) {
      setError(t('payment.cardholderNameRequired'));
      return;
    }

    if (!validateCardNumber(cardNumber)) {
      setError(t('payment.invalidCardNumber'));
      return;
    }

    if (!validateExpiryDate(expiryDate)) {
      setError(t('payment.invalidExpiryDate'));
      return;
    }

    if (!validateCvv(cvv)) {
      setError(t('payment.invalidCvv'));
      return;
    }

    setLoading(true);

    try {
      // In a real app, you would process the payment with a payment gateway
      // This is a mock implementation
      await new Promise(resolve => setTimeout(resolve, 1500));

      const paymentMethod: PaymentMethod = {
        id: `pm_${Date.now()}`,
        type: 'card',
        cardNumber: cardNumber.replace(/\d(?=\d{4})/g, '*'), // Mask card number
        expiryDate,
        cardholderName,
        isDefault: true,
      };

      onPaymentComplete(paymentMethod);
    } catch (err: any) {
      setError(err.message || t('payment.paymentFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.colors.onSurface }]}>{t('payment.title')}</Text>
      <Text style={[styles.amount, { color: theme.colors.primary }]}>{t('common.total')}: {formatPrice(amount)}</Text>

      <TextInput
        label={t('payment.cardholderName')}
        value={cardholderName}
        onChangeText={setCardholderName}
        style={styles.input}
        autoCapitalize="words"
        mode="outlined"
        outlineColor={theme.colors.outline}
        activeOutlineColor={theme.colors.primary}
        textColor={theme.colors.onSurface}
      />

      <TextInput
        label={t('payment.cardNumber')}
        value={cardNumber}
        onChangeText={handleCardNumberChange}
        style={styles.input}
        keyboardType="numeric"
        maxLength={19} // 16 digits + 3 spaces
        mode="outlined"
        outlineColor={theme.colors.outline}
        activeOutlineColor={theme.colors.primary}
        textColor={theme.colors.onSurface}
      />

      <View style={styles.row}>
        <TextInput
          label={t('payment.expiryDate')}
          value={expiryDate}
          onChangeText={handleExpiryDateChange}
          style={[styles.input, styles.halfInput]}
          keyboardType="numeric"
          maxLength={5} // MM/YY
          mode="outlined"
          outlineColor={theme.colors.outline}
          activeOutlineColor={theme.colors.primary}
          textColor={theme.colors.onSurface}
          placeholder="MM/YY"
        />

        <TextInput
          label={t('payment.cvv')}
          value={cvv}
          onChangeText={setCvv}
          style={[styles.input, styles.halfInput]}
          keyboardType="numeric"
          maxLength={4}
          secureTextEntry
          mode="outlined"
          outlineColor={theme.colors.outline}
          activeOutlineColor={theme.colors.primary}
          textColor={theme.colors.onSurface}
        />
      </View>

      {error && <Text style={[styles.error, { color: theme.colors.error }]}>{error}</Text>}

      <View style={styles.buttonContainer}>
        <Button
          mode="outlined"
          onPress={onCancel}
          style={styles.button}
          disabled={loading}
          textColor={theme.colors.primary}
          buttonColor="transparent"
        >
          {t('common.cancel')}
        </Button>
        <Button
          mode="contained"
          onPress={handleSubmit}
          style={styles.button}
          loading={loading}
          buttonColor={theme.colors.primary}
          textColor={theme.colors.onPrimary}
        >
          {t('payment.payNow')}
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  amount: {
    fontSize: 18,
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  error: {
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  button: {
    width: '48%',
  },
});

export default PaymentForm; 