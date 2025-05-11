const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(__dirname, '.env.local') });

module.exports = {
  name: "NOWS",
  plugins: [
    'react-native-video/expo-plugin'
  ],
  extra: {
    PEXELS_API_KEY: process.env.PEXELS_API_KEY,
  },
};