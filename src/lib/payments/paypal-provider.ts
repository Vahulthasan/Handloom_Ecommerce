import { PaymentProvider, PaymentResult, Order } from '@/types';

/**
 * PayPal International Payment Provider Stub
 * 
 * TODO: Integration Steps for Production:
 * 1. Install `@paypal/paypal-js` or `@paypal/checkout-server-sdk`.
 * 2. Configure environment variables:
 *    - `NEXT_PUBLIC_PAYPAL_CLIENT_ID`
 *    - `PAYPAL_CLIENT_SECRET`
 * 3. In `processPayment`:
 *    - Call PayPal Orders v2 API (`/v2/checkout/orders`) to create an order with currency 'EUR'.
 *    - Render the PayPal button in UI or redirect customer to PayPal approval URL.
 *    - On capture approval webhook or client redirect, capture order and verify transaction status.
 * 4. NEVER store credit card or sensitive credentials on the server.
 */
export class PayPalProvider implements PaymentProvider {
  name = 'PayPal (European Express Checkout)';

  async processPayment(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _order: Omit<Order, 'id' | 'created_at' | 'order_number'>
  ): Promise<PaymentResult> {
    // Stub implementation
    return {
      success: false,
      error: 'PayPal integration is pending production client credentials. Use Instant Test Payment for testing.',
    };
  }
}
