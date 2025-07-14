import { generateAccessToken } from "../lib/paypal";

describe('PayPal Integration', () => {
  test('generates a paypal access token', async () => {
    // Check if environment variables are loaded
    console.log('PAYPAL_CLIENT_ID:', process.env.PAYPAL_CLIENT_ID ? 'Set' : 'Not set');
    console.log('PAYPAL_SECRET:', process.env.PAYPAL_SECRET ? 'Set' : 'Not set');
    
    try {
      const accessToken = await generateAccessToken();
      expect(accessToken).toBeDefined();
      expect(typeof accessToken).toBe('string');
      expect(accessToken.length).toBeGreaterThan(0);
      console.log('Access token generated successfully');
    } catch (error) {
      console.error('PayPal API Error:', error);
      throw error;
    }
  });
});