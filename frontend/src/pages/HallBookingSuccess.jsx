import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, Calendar, Clock, Users, Home } from 'lucide-react';

const HallBookingSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { bookingId, formData } = location.state || {};

  useEffect(() => {
    if (!bookingId) {
      navigate('/hall-booking');
    }
  }, [bookingId, navigate]);

  if (!bookingId) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full card text-center">
        <div className="mb-6">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Booking Confirmed!
        </h1>
        
        <p className="text-gray-600 mb-8">
          Your café hall booking has been confirmed. We're excited to host your event!
        </p>

        {formData && (
          <div className="bg-gray-50 p-6 rounded-lg mb-8 text-left">
            <h2 className="font-semibold text-gray-800 mb-4">Booking Details</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-primary-600 mt-0.5" />
                <div>
                  <div className="text-sm text-gray-600">Date</div>
                  <div className="font-semibold">
                    {new Date(formData.bookingDate).toLocaleDateString('en-IN', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </div>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-primary-600 mt-0.5" />
                <div>
                  <div className="text-sm text-gray-600">Time Slot</div>
                  <div className="font-semibold">
                    {formData.timeSlot?.toUpperCase().replace('_', ' ')}
                  </div>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-primary-600 mt-0.5" />
                <div>
                  <div className="text-sm text-gray-600">Number of People</div>
                  <div className="font-semibold">{formData.peopleCount}</div>
                </div>
              </div>
              
              {formData.occasion && (
                <div>
                  <div className="text-sm text-gray-600">Occasion</div>
                  <div className="font-semibold">{formData.occasion}</div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-8">
          <p className="text-sm text-blue-800">
            <strong>Booking ID:</strong> #{bookingId}
          </p>
          <p className="text-sm text-blue-800 mt-2">
            We'll send you a confirmation SMS shortly. Please arrive on time for your booking.
          </p>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => navigate('/hall-booking')}
            className="flex-1 btn-secondary py-3"
          >
            Book Another
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex-1 btn-primary py-3 flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default HallBookingSuccess;

