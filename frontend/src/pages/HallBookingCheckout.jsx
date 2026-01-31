import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { hallBookingAPI } from '../services/api';
import { loadRazorpayScript, openRazorpayCheckout } from '../utils/razorpay';
import { Loader2, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const HallBookingCheckout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);

  const { bookingId, amount, formData } = location.state || {};

  useEffect(() => {
    if (!bookingId || !amount) {
      toast.error('Invalid booking data');
      navigate('/hall-booking');
      return;
    }
    loadRazorpayScript();
  }, [bookingId, amount, navigate]);

  const handlePayment = async () => {
    setProcessing(true);

    try {
      // Create Razorpay payment order
      const paymentResponse = await hallBookingAPI.createPaymentOrder({
        bookingId,
        amount
      });

      const { razorpayOrderId, amount: razorpayAmount, currency, key } = paymentResponse.data;

      // Open Razorpay checkout
      const paymentResult = await openRazorpayCheckout({
        key,
        amount: razorpayAmount,
        currency,
        razorpayOrderId,
        orderId: bookingId
      });

      // Verify payment
      const verifyResponse = await hallBookingAPI.verifyPayment({
        razorpayOrderId: paymentResult.razorpay_order_id,
        razorpayPaymentId: paymentResult.razorpay_payment_id,
        razorpaySignature: paymentResult.razorpay_signature,
        bookingId
      });

      console.log('Payment verification response:', verifyResponse);

      // Check if verification was successful
      if (verifyResponse.data && verifyResponse.data.success) {
        toast.success('Payment successful! Booking confirmed.');
        navigate('/hall-booking/success', {
          state: { bookingId, formData }
        });
      } else {
        throw new Error(verifyResponse.data?.error || 'Payment verification failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      if (error.message === 'Payment cancelled') {
        // User cancelled, don't show error
        return;
      }
      
      // Show specific error message if available
      const errorMessage = error.response?.data?.error || error.message || 'Payment failed. Please try again.';
      toast.error(errorMessage);
    } finally {
      setProcessing(false);
    }
  };

  if (!bookingId || !amount) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/hall-booking')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Booking
        </button>

        <div className="card">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Complete Payment</h1>
          <p className="text-gray-600 mb-8">Secure payment via Razorpay</p>

          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="font-semibold text-gray-800 mb-4">Booking Summary</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-semibold">
                    {formData?.bookingDate ? new Date(formData.bookingDate).toLocaleDateString('en-IN', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    }) : ''}
                  </span>
                </div>
                {formData?.selectedSlots && formData.selectedSlots.length > 0 ? (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Time Slots:</span>
                      <span className="font-semibold text-right">
                        {formData.selectedSlots.map(hour => `${hour}:00 - ${hour + 1}:00`).join(', ')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Hours:</span>
                      <span className="font-semibold">{formData.totalHours || formData.selectedSlots.length} hour{formData.selectedSlots.length > 1 ? 's' : ''}</span>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time Slot:</span>
                    <span className="font-semibold">{formData?.timeSlot?.toUpperCase().replace('_', ' ') || 'N/A'}</span>
                  </div>
                )}
                {formData?.occasion && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Occasion:</span>
                    <span className="font-semibold">{formData.occasion}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="border-t pt-6 space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-gray-700">Total Amount:</span>
                  <span className="font-bold text-gray-800">₹{parseFloat(location.state?.totalAmount || amount * 2).toLocaleString('en-IN')}</span>
                </div>
                <div className="text-xs text-gray-500 mb-4">
                  {location.state?.formData?.totalHours || 0} hour{(location.state?.formData?.totalHours || 0) > 1 ? 's' : ''} × ₹500
                </div>
                
                <div className="border-t pt-3 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">Advance Payable Now:</span>
                    <span className="font-bold text-green-600 text-lg">₹{parseFloat(amount).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">Balance at Café:</span>
                    <span className="font-bold text-orange-600 text-lg">
                      ₹{parseFloat(location.state?.remainingAmount || amount).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Pay 50% advance now to confirm your booking. Remaining 50% to be paid at the café.
              </p>
            </div>

            <button
              onClick={handlePayment}
              disabled={processing || loading}
              className="w-full btn-primary py-4 text-lg flex items-center justify-center gap-2"
            >
              {processing ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Processing Payment...
                </>
              ) : (
                `Pay Advance ₹${parseFloat(amount).toLocaleString('en-IN')}`
              )}
            </button>

            <p className="text-xs text-center text-gray-500">
              Secure payment powered by Razorpay
            </p>
          </div>
        </div>
      </div>

      {processing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 text-center">
            <Loader2 className="w-12 h-12 animate-spin text-primary-600 mx-auto mb-4" />
            <p className="text-lg font-semibold">Processing payment...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default HallBookingCheckout;

