/**
 * Stripe Payment Gateway Integration
 * Supports both Test (Sandbox) and Production environments
 */

import Stripe from 'stripe';

// Initialize Stripe client based on environment
const getStripeClient = () => {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  
  if (!secretKey) {
    throw new Error('STRIPE_SECRET_KEY environment variable is not set');
  }

  return new Stripe(secretKey, {
    apiVersion: '2024-11-20.acacia',
  });
};

/**
 * Create a payment intent for deposit
 */
export async function createPaymentIntent(
  amount: number,
  currency: string,
  metadata: {
    user_id: string;
    transaction_id: string;
    environment?: 'test' | 'production';
  }
) {
  const stripe = getStripeClient();
  const isTest = process.env.NODE_ENV === 'development' || process.env.STRIPE_SECRET_KEY?.startsWith('sk_test_');

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency.toLowerCase(),
      metadata: {
        ...metadata,
        environment: isTest ? 'test' : 'production',
      },
      // For test mode, use test cards
      ...(isTest && {
        payment_method_types: ['card'],
      }),
    });

    return {
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    };
  } catch (error: any) {
    console.error('Stripe payment intent creation error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Confirm a payment intent
 */
export async function confirmPaymentIntent(paymentIntentId: string) {
  const stripe = getStripeClient();

  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      return {
        success: true,
        status: 'succeeded',
        amount: paymentIntent.amount / 100, // Convert from cents
      };
    }

    return {
      success: false,
      error: `Payment status: ${paymentIntent.status}`,
    };
  } catch (error: any) {
    console.error('Stripe payment confirmation error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Get Stripe test card numbers for testing
 */
export const STRIPE_TEST_CARDS = {
  // Successful payments
  success: {
    number: '4242424242424242',
    cvc: '123',
    expiry: '12/34',
  },
  // Requires authentication
  requiresAuth: {
    number: '4000002500003155',
    cvc: '123',
    expiry: '12/34',
  },
  // Declined
  declined: {
    number: '4000000000000002',
    cvc: '123',
    expiry: '12/34',
  },
  // Insufficient funds
  insufficientFunds: {
    number: '4000000000009995',
    cvc: '123',
    expiry: '12/34',
  },
} as const;

/**
 * Check if we're in test mode
 */
export function isTestMode(): boolean {
  return (
    process.env.NODE_ENV === 'development' ||
    process.env.STRIPE_SECRET_KEY?.startsWith('sk_test_') ||
    process.env.PAYMENT_ENVIRONMENT === 'test'
  );
}

