import React from 'react';
import { Link } from 'react-router-dom';

export const PaymentTerms = () => (
  <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
    <div className="bg-white rounded-3xl border border-beige-200 shadow-subtle p-6 sm:p-10 space-y-8">
      <header>
        <span className="text-xs uppercase tracking-[0.25em] text-gold-700 font-semibold">Payment information</span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal-900 mt-2">Online Payment Terms</h1>
        <p className="text-sm text-charcoal-600 mt-3">Please read these terms before choosing online payment for an appointment.</p>
      </header>

      <section className="space-y-5 text-sm text-charcoal-700 leading-relaxed">
        <div>
          <h2 className="font-serif text-xl font-bold text-charcoal-900">1. Payment provider</h2>
          <p className="mt-2">Online payments are processed by Razorpay. Payment card, UPI, and banking details are entered into Razorpay Checkout and are not stored by Her Glow Home Salon.</p>
        </div>
        <div>
          <h2 className="font-serif text-xl font-bold text-charcoal-900">2. Payment and booking confirmation</h2>
          <p className="mt-2">The appointment is created only after the server verifies the Razorpay order, payment signature, amount, currency, and captured status. A failed, cancelled, or unverified payment does not create an online-paid appointment.</p>
        </div>
        <div>
          <h2 className="font-serif text-xl font-bold text-charcoal-900">3. Prices and currency</h2>
          <p className="mt-2">Prices are shown in Indian Rupees (INR). The payable amount is calculated from the active service catalog on the server. The amount shown at checkout may include any charges displayed by Razorpay before payment confirmation.</p>
        </div>
        <div>
          <h2 className="font-serif text-xl font-bold text-charcoal-900">4. Cancellation and refunds</h2>
          <p className="mt-2">Booking cancellation and refund requests are handled by the salon according to the appointment circumstances and applicable law. Contact the salon with the appointment reference and payment ID. Razorpay processing or convenience charges, if any, may be treated according to the provider’s rules and the salon’s disclosed policy.</p>
        </div>
        <div>
          <h2 className="font-serif text-xl font-bold text-charcoal-900">5. Payment problems</h2>
          <p className="mt-2">If money appears to be debited but the appointment is not confirmed, do not pay again immediately. Keep the Razorpay payment details and contact the salon so the payment status can be checked.</p>
        </div>
        <div>
          <h2 className="font-serif text-xl font-bold text-charcoal-900">6. Security</h2>
          <p className="mt-2">Never share your OTP, card PIN, CVV, UPI PIN, or Razorpay credentials with anyone claiming to represent the salon. Her Glow Home Salon will not request those secrets by phone, email, or chat.</p>
        </div>
      </section>

      <div className="border-t border-beige-200 pt-6 flex flex-wrap gap-3">
        <Link to="/book-appointment" className="text-sm font-semibold text-gold-700 hover:text-gold-900">Return to booking</Link>
        <Link to="/contact" className="text-sm font-semibold text-gold-700 hover:text-gold-900">Contact the salon</Link>
      </div>
    </div>
  </main>
);
