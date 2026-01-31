import { Shield, Lock, Eye, Database, UserCheck, AlertTriangle } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block p-4 bg-green-100 rounded-2xl mb-4">
            <Shield className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent mb-4">
            Privacy Policy
          </h1>
          <p className="text-gray-600">Last Updated: January 28, 2026</p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100 space-y-8">
          
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
            <p className="text-gray-700 leading-relaxed">
              At Desert Villa, we are committed to protecting your privacy and ensuring the security 
              of your personal information. This Privacy Policy explains how we collect, use, disclose, 
              and safeguard your information when you use our services.
            </p>
          </section>

          {/* Information We Collect */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Database className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">2. Information We Collect</h2>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2">2.1 Personal Information</h3>
            <p className="text-gray-700 leading-relaxed mb-3">
              We collect the following personal information:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4 mb-4">
              <li>Name and contact information (email, phone number)</li>
              <li>Delivery address</li>
              <li>Payment information (processed securely through Razorpay)</li>
              <li>Order history and preferences</li>
              <li>Account credentials</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">2.2 Automatically Collected Information</h3>
            <p className="text-gray-700 leading-relaxed mb-3">
              We automatically collect certain information when you use our services:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4 mb-4">
              <li>IP address and device information</li>
              <li>Browser type and version</li>
              <li>Pages visited and time spent</li>
              <li>Referring website</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">2.3 Payment Information</h3>
            <p className="text-gray-700 leading-relaxed">
              Payment information is collected and processed by our payment gateway partner, Razorpay. 
              We do not store complete credit/debit card details on our servers. Only the last 4 digits 
              and card type are stored for reference purposes.
            </p>
          </section>

          {/* How We Use Your Information */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Eye className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-900">3. How We Use Your Information</h2>
            </div>
            <p className="text-gray-700 leading-relaxed mb-3">
              We use your information for the following purposes:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Processing and fulfilling your orders</li>
              <li>Managing your account and providing customer support</li>
              <li>Processing payments and preventing fraud</li>
              <li>Sending order confirmations and updates</li>
              <li>Improving our services and user experience</li>
              <li>Sending promotional offers (with your consent)</li>
              <li>Complying with legal obligations</li>
              <li>Analyzing usage patterns and trends</li>
            </ul>
          </section>

          {/* Information Sharing */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Information Sharing and Disclosure</h2>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2">4.1 Service Providers</h3>
            <p className="text-gray-700 leading-relaxed mb-3">
              We share your information with trusted third-party service providers:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4 mb-4">
              <li><strong>Razorpay:</strong> Payment processing</li>
              <li><strong>SMS/Email Services:</strong> Order notifications</li>
              <li><strong>Delivery Partners:</strong> Order fulfillment (if applicable)</li>
              <li><strong>Analytics Providers:</strong> Service improvement</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">4.2 Legal Requirements</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              We may disclose your information if required by law, court order, or government request, 
              or to protect our rights, property, or safety.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">4.3 Business Transfers</h3>
            <p className="text-gray-700 leading-relaxed">
              In the event of a merger, acquisition, or sale of assets, your information may be 
              transferred to the acquiring entity.
            </p>
          </section>

          {/* Data Security */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Lock className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-900">5. Data Security</h2>
            </div>
            <p className="text-gray-700 leading-relaxed mb-3">
              We implement appropriate security measures to protect your information:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>SSL/TLS encryption for data transmission</li>
              <li>Secure payment processing through PCI-DSS compliant Razorpay</li>
              <li>Regular security audits and updates</li>
              <li>Access controls and authentication</li>
              <li>Encrypted database storage</li>
              <li>Regular backups and disaster recovery plans</li>
            </ul>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Cookies and Tracking Technologies</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              We use cookies and similar technologies to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4 mb-4">
              <li>Remember your preferences and settings</li>
              <li>Maintain your session and keep you logged in</li>
              <li>Analyze site traffic and usage patterns</li>
              <li>Personalize content and advertisements</li>
            </ul>
            <p className="text-gray-700 leading-relaxed">
              You can control cookies through your browser settings. However, disabling cookies 
              may affect the functionality of our services.
            </p>
          </section>

          {/* Your Rights */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <UserCheck className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">7. Your Rights and Choices</h2>
            </div>
            <p className="text-gray-700 leading-relaxed mb-3">
              You have the following rights regarding your personal information:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li><strong>Access:</strong> Request a copy of your personal information</li>
              <li><strong>Correction:</strong> Update or correct inaccurate information</li>
              <li><strong>Deletion:</strong> Request deletion of your account and data</li>
              <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
              <li><strong>Data Portability:</strong> Request your data in a portable format</li>
              <li><strong>Withdraw Consent:</strong> Withdraw consent for data processing</li>
            </ul>
          </section>

          {/* Data Retention */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Data Retention</h2>
            <p className="text-gray-700 leading-relaxed">
              We retain your personal information for as long as necessary to provide our services 
              and comply with legal obligations. Order history and transaction records are retained 
              for 7 years as required by law. You can request deletion of your account at any time, 
              subject to legal retention requirements.
            </p>
          </section>

          {/* Children's Privacy */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
              <h2 className="text-2xl font-bold text-gray-900">9. Children's Privacy</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Our services are not intended for children under 18 years of age. We do not knowingly 
              collect personal information from children. If you believe we have collected information 
              from a child, please contact us immediately.
            </p>
          </section>

          {/* Third-Party Links */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Third-Party Links</h2>
            <p className="text-gray-700 leading-relaxed">
              Our website may contain links to third-party websites. We are not responsible for the 
              privacy practices of these websites. We encourage you to read their privacy policies 
              before providing any personal information.
            </p>
          </section>

          {/* International Transfers */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. International Data Transfers</h2>
            <p className="text-gray-700 leading-relaxed">
              Your information is primarily stored and processed in India. If we transfer data 
              internationally, we ensure appropriate safeguards are in place to protect your information.
            </p>
          </section>

          {/* Changes to Privacy Policy */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Changes to This Privacy Policy</h2>
            <p className="text-gray-700 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any material 
              changes by posting the new policy on our website and updating the "Last Updated" date. 
              Your continued use of our services after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          {/* Contact Information */}
          <section className="bg-green-50 rounded-xl p-6 border-2 border-green-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Contact Us</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you have any questions, concerns, or requests regarding this Privacy Policy or 
              your personal information, please contact us:
            </p>
            <div className="space-y-2 text-gray-700">
              <p><strong>Email:</strong> omsable55@gmail.com</p>
              <p><strong>Phone:</strong> +91 93595 95924</p>
              <p><strong>Address:</strong> Infront of Amrutwahini College, Sangamner - 422608, India</p>
            </div>
          </section>

          {/* Consent */}
          <section className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
            <p className="text-gray-700 leading-relaxed font-medium">
              By using Desert Villa's services, you acknowledge that you have read and understood 
              this Privacy Policy and consent to the collection, use, and disclosure of your 
              information as described herein.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
