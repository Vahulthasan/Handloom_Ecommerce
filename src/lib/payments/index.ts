import { PaymentProvider } from '@/types';
import { MockPaymentProvider } from './mock-provider';
import { PayPalProvider } from './paypal-provider';
import { RazorpayInternationalProvider } from './razorpay-provider';

export * from './mock-provider';
export * from './paypal-provider';
export * from './razorpay-provider';

export const availablePaymentProviders: PaymentProvider[] = [
  new MockPaymentProvider(),
  new PayPalProvider(),
  new RazorpayInternationalProvider(),
];

export function getPaymentProvider(providerName: string): PaymentProvider {
  const match = availablePaymentProviders.find(p => p.name === providerName);
  return match || new MockPaymentProvider();
}
