import { PaymentProvider, PaymentResult, Order } from '@/types';

/**
 * Razorpay International Payment Provider Stub
 * 
 * TODO: Integration Steps for Production:
 * 1. Install `razorpay` server package: `npm install razorpay`.
 * 2. Configure environment variables:
 *    - `NEXT_PUBLIC_RAZORPAY_KEY_ID`
 *    - `RAZORPAY_KEY_SECRET`
 * 3. Enable International Payments & Multi-Currency support (EUR) in Razorpay Dashboard.
 * 4. In `processPayment`:
 *    - Create Razorpay Order with currency: 'EUR', amount in euro cents (`Math.round(total * 100)`).
 *    - Launch Razorpay checkout modal via `window.Razorpay` on the client.
 *    - Verify signature server-side using HMAC SHA256 of `order_id + "|" + payment_id` with secret.
 * 5. Ensure compliance with RBI Purpose Code for Export of Goods (P0102 - Export of goods).
 * 6. Never store card data locally.
 */
export class RazorpayInternationalProvider implements PaymentProvider {
  name = 'Razorpay International (Cards / Bancontact / iDEAL / Sofort)';

  async processPayment(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _order: Omit<Order, 'id' | 'created_at' | 'order_number'>
  ): Promise<PaymentResult> {
    // Stub implementation
    return {
      success: false,
      error: 'Razorpay International integration is pending API credentials. Use Instant Test Payment for testing.',
    };
  }
}
