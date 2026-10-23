import { Order, Container } from '@/types';

export interface EmailPayload {
  to: string;
  subject: string;
  html: string;
  text: string;
}

export function generateOrderConfirmationEmail(order: Order, container?: Container): EmailPayload {
  const containerLabel = container?.label || 'Next Open EU Sea Container';
  const containerStatus = container ? `${Math.round((container.used_units / container.capacity_units) * 100)}% pooled` : 'Pooling';

  const itemsListText = order.items
    .map(i => `- ${i.product_name} (Qty: ${i.qty}) — €${(i.unit_price * i.qty).toFixed(2)}`)
    .join('\n');

  const itemsListHtml = order.items
    .map(
      i => `<tr style="border-bottom: 1px solid #e5e5e5;">
        <td style="padding: 10px 0;"><strong>${i.product_name}</strong><br><span style="color:#666; font-size:12px;">Slot Units: ${i.units_per_slot * i.qty}</span></td>
        <td style="padding: 10px; text-align:center;">${i.qty}</td>
        <td style="padding: 10px; text-align:right;">€${(i.unit_price * i.qty).toFixed(2)}</td>
      </tr>`
    )
    .join('');

  return {
    to: order.email,
    subject: `Order Confirmed #${order.order_number} — Vintage Collections (Container Pooling Reserved)`,
    text: `Thank you for your order with Vintage Collections!

Order Number: ${order.order_number}
Assigned Container: ${containerLabel} (${containerStatus})
Destination: ${order.shipping_address.street_address}, ${order.shipping_address.city}, ${order.shipping_address.country}

Items:
${itemsListText}

Subtotal: €${order.subtotal.toFixed(2)}
Pooled Sea Freight: €${order.shipping_fee.toFixed(2)}
Total Paid: €${order.total.toFixed(2)}

Handmade Notice:
Each piece is woven by hand in Assam & Bengal, India. Size, weave and colour tone vary slightly (approx. ±2 cm).

Track your container slot online anytime using your order number and email.
Vintage Collections Team`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #173f34; line-height: 1.5;">
        <div style="background: #173f34; padding: 24px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: #c68a24; margin: 0; font-size: 24px; letter-spacing: 1px;">VINTAGE COLLECTIONS</h1>
          <p style="color: #e8ece8; margin: 4px 0 0; font-size: 13px;">Indian Maker-Exporter of Handwoven Bamboo Pendant Lamps</p>
        </div>
        <div style="padding: 24px; background: #ffffff; border: 1px solid #d3dbd5; border-top: none;">
          <h2 style="color: #173f34; margin-top: 0;">Order Confirmed: #${order.order_number}</h2>
          <p>Thank you for supporting traditional Indian handloom artisans. Your order has been pooled into our European sea freight schedule.</p>
          
          <div style="background: #f4f6f4; border-left: 4px solid #c68a24; padding: 14px; margin: 20px 0; border-radius: 4px;">
            <strong>🚢 Assigned Container:</strong> ${containerLabel}<br>
            <strong>📊 Current Container Pooling Status:</strong> ${containerStatus} full<br>
            <strong>🗓️ Estimated Ship Window:</strong> ${container?.estimated_ship_date || 'mid-November (to be confirmed)'}
          </div>

          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <thead>
              <tr style="border-bottom: 2px solid #173f34; text-align: left; font-size: 13px; color: #59655f;">
                <th style="padding-bottom: 8px;">Handmade Shade</th>
                <th style="padding-bottom: 8px; text-align: center;">Qty</th>
                <th style="padding-bottom: 8px; text-align: right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${itemsListHtml}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2" style="padding-top: 12px; text-align: right; color: #666;">Subtotal:</td>
                <td style="padding-top: 12px; text-align: right;">€${order.subtotal.toFixed(2)}</td>
              </tr>
              <tr>
                <td colspan="2" style="text-align: right; color: #666;">Pooled Sea Freight:</td>
                <td style="text-align: right;">€${order.shipping_fee.toFixed(2)}</td>
              </tr>
              <tr style="font-size: 16px; font-weight: bold;">
                <td colspan="2" style="padding-top: 8px; text-align: right; color: #173f34;">Total Paid:</td>
                <td style="padding-top: 8px; text-align: right; color: #c68a24;">€${order.total.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>

          <div style="background: #fafafa; border: 1px solid #eee; padding: 12px; font-size: 12px; color: #666; margin-top: 24px; border-radius: 4px;">
            <strong>Handmade Craftsmanship Notice:</strong> Each piece is woven by hand. Size, weave and colour tone vary slightly. Dimensions are approximate (±2 cm).
          </div>
        </div>
      </div>
    `,
  };
}

export function generateContainerShippedEmail(order: Order, container: Container): EmailPayload {
  return {
    to: order.email,
    subject: `🚢 Good News! Your Container ${container.label} Has Shipped to Europe`,
    text: `Your order #${order.order_number} is now sailing aboard ocean freight container ${container.label}.\n\nTracking / Vessel Note: ${container.tracking_note || 'En route to European hub port'}\nEstimated Arrival: ${container.estimated_ship_date || 'To be confirmed'}\n\nThank you for choosing Vintage Collections.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #173f34;">
        <div style="background: #173f34; padding: 24px; text-align: center;">
          <h1 style="color: #c68a24; margin: 0;">VINTAGE COLLECTIONS</h1>
        </div>
        <div style="padding: 24px; background: #fff; border: 1px solid #ddd;">
          <h2>Your Sea Container Has Shipped! 🚢</h2>
          <p>The container pooled with your order <strong>#${order.order_number}</strong> has reached full capacity and officially departed on its ocean voyage.</p>
          <div style="background: #e8ece8; padding: 16px; border-radius: 6px; margin: 20px 0;">
            <p style="margin: 0 0 8px;"><strong>Container:</strong> ${container.label}</p>
            <p style="margin: 0 0 8px;"><strong>Tracking Info:</strong> ${container.tracking_note || 'Under vessel transit'}</p>
            <p style="margin: 0;"><strong>Port Route:</strong> Nhava Sheva (INNSA) ➔ Rotterdam / Hamburg (EU)</p>
          </div>
          <p>Once customs clears at the European port, your package will be dispatched via local courier directly to your door.</p>
        </div>
      </div>
    `,
  };
}

export function generateOrderDeliveredEmail(order: Order): EmailPayload {
  return {
    to: order.email,
    subject: `Delivered: Your Handmade Bamboo Pendant Lamp Has Arrived! #${order.order_number}`,
    text: `Your Vintage Collections order #${order.order_number} has been delivered. We hope its warm natural glow enriches your home.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #173f34;">
        <div style="padding: 24px; background: #173f34; text-align: center; color: white;">
          <h1 style="color: #c68a24; margin: 0;">VINTAGE COLLECTIONS</h1>
        </div>
        <div style="padding: 24px; background: #fff; border: 1px solid #ddd;">
          <h2>Delivered to Your Door ✨</h2>
          <p>Your handmade bamboo pendant lamp shade from order <strong>#${order.order_number}</strong> has arrived.</p>
          <p>Handle with gentle care when unwrapping. Standard E27 / E26 bulb fittings attach easily inside the woven ring.</p>
        </div>
      </div>
    `,
  };
}

/**
 * sendEmail() Stub
 * 
 * TODO: Integration with Resend or SendGrid:
 * 1. Install `resend`: `npm install resend`.
 * 2. Set `RESEND_API_KEY` in environment variables.
 * 3. Replace console stub with `await resend.emails.send({ from: 'Vintage Collections <orders@vintagecollections.in>', to, subject, html })`.
 */
export async function sendEmail(payload: EmailPayload): Promise<{ success: boolean }> {
  console.log('====================================================');
  console.log(`[EMAIL STUB -> ${payload.to}]`);
  console.log(`Subject: ${payload.subject}`);
  console.log(`Body (Plain Text Preview):\n${payload.text.substring(0, 300)}...`);
  console.log('====================================================');
  return { success: true };
}
