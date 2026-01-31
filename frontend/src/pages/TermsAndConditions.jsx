import { FileText, Shield, CreditCard, AlertCircle } from 'lucide-react';

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block p-4 bg-primary-100 rounded-2xl mb-4">
            <FileText className="w-12 h-12 text-primary-600" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent mb-4">
            Terms and Conditions
          </h1>
          <p className="text-gray-600">Last Updated: January 28, 2026</p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100 space-y-8">
          
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
            <p className="text-gray-700 leading-relaxed">
              Welcome to Desert Villa. These Terms and Conditions govern your use of our website and services. 
              By accessing or using our services, you agree to be bound by these terms. If you do not agree with 
              any part of these terms, please do not use our services.
            </p>
          </section>

          {/* Services */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Services</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              Desert Villa provides the following services:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Online food ordering and delivery</li>
              <li>Dine-in table reservations</li>
              <li>Hall booking for events and functions</li>
              <li>Online payment processing</li>
            </ul>
          </section>

          {/* User Accounts */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Accounts</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              When creating an account with us, you must:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Provide accurate and complete information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Notify us immediately of any unauthorized access</li>
              <li>Be responsible for all activities under your account</li>
            </ul>
          </section>

          {/* Orders and Payments */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <CreditCard className="w-6 h-6 text-primary-600" />
              <h2 className="text-2xl font-bold text-gray-900">4. Orders and Payments</h2>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2">4.1 Order Placement</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              All orders placed through our platform are subject to acceptance and availability. 
              We reserve the right to refuse or cancel any order for any reason.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">4.2 Pricing</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              All prices are listed in Indian Rupees (INR) and include applicable taxes. 
              Prices are subject to change without notice.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">4.3 Payment Methods</h3>
            <p className="text-gray-700 leading-relaxed mb-3">
              We accept the following payment methods:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4 mb-4">
              <li>Credit/Debit Cards (Visa, Mastercard, RuPay, Amex)</li>
              <li>UPI (Google Pay, PhonePe, Paytm, etc.)</li>
              <li>Net Banking</li>
              <li>Digital Wallets</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">4.4 Payment Processing</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              All payments are processed securely through Razorpay, our payment gateway partner. 
              We do not store your complete card details on our servers.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">4.5 Payment Confirmation</h3>
            <p className="text-gray-700 leading-relaxed">
              You will receive a payment confirmation via email and SMS once your payment is successfully processed.
            </p>
          </section>

          {/* Delivery */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Delivery</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              For delivery orders:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Estimated delivery time is 30-45 minutes</li>
              <li>Delivery charges may apply based on distance</li>
              <li>We are not responsible for delays due to weather or traffic</li>
              <li>Please ensure someone is available to receive the order</li>
            </ul>
          </section>

          {/* User Conduct */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-primary-600" />
              <h2 className="text-2xl font-bold text-gray-900">6. User Conduct</h2>
            </div>
            <p className="text-gray-700 leading-relaxed mb-3">
              You agree not to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Use our services for any illegal purpose</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Interfere with the proper functioning of our services</li>
              <li>Submit false or misleading information</li>
              <li>Harass or abuse our staff or other users</li>
            </ul>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Intellectual Property</h2>
            <p className="text-gray-700 leading-relaxed">
              All content on our website, including text, graphics, logos, images, and software, 
              is the property of Desert Villa and is protected by copyright and trademark laws. 
              You may not reproduce, distribute, or create derivative works without our written permission.
            </p>
          </section>

          {/* Limitation of Liability */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-orange-600" />
              <h2 className="text-2xl font-bold text-gray-900">8. Limitation of Liability</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Desert Villa shall not be liable for any indirect, incidental, special, consequential, 
              or punitive damages resulting from your use of our services. Our total liability shall 
              not exceed the amount paid by you for the specific service in question.
            </p>
          </section>

          {/* Privacy */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Privacy</h2>
            <p className="text-gray-700 leading-relaxed">
              Your use of our services is also governed by our Privacy Policy. Please review our 
              Privacy Policy to understand our practices regarding your personal information.
            </p>
          </section>

          {/* Changes to Terms */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Changes to Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to modify these Terms and Conditions at any time. Changes will 
              be effective immediately upon posting on our website. Your continued use of our services 
              after changes constitutes acceptance of the modified terms.
            </p>
          </section>

          {/* Governing Law */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Governing Law</h2>
            <p className="text-gray-700 leading-relaxed">
              These Terms and Conditions shall be governed by and construed in accordance with the 
              laws of India. Any disputes shall be subject to the exclusive jurisdiction of the 
              courts in [Your City], India.
            </p>
          </section>

          {/* Contact Information */}
          <section className="bg-primary-50 rounded-xl p-6 border-2 border-primary-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Contact Us</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you have any questions about these Terms and Conditions, please contact us:
            </p>
            <div className="space-y-2 text-gray-700">
              <p><strong>Email:</strong> omsable55@gmail.com</p>
              <p><strong>Phone:</strong> +91 93595 95924</p>
              <p><strong>Address:</strong> Infront of Amrutwahini College, Sangamner - 422608, India</p>
            </div>
          </section>

          {/* Acceptance */}
          <section className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
            <p className="text-gray-700 leading-relaxed font-medium">
              By using Desert Villa's services, you acknowledge that you have read, understood, 
              and agree to be bound by these Terms and Conditions.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
