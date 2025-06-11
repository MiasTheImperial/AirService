import 'dotenv/config';

export default ({ config }) => ({
  ...config,
  extra: {
    apiUrl: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000'
  }
});