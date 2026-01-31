import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { hallBookingAPI } from '../services/api';
import { Calendar, Clock, Users, Gift, MessageSquare, Loader2, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const HOUR_PRICE = 500; // ₹500 per hour

const HallBookingPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [slots, setSlots] = useState([]);
  const [selectedSlots, setSelectedSlots] = useState([]); // Array of hour numbers [10, 11, 12]

  // Form data
  const [formData, setFormData] = useState({
    bookingDate: '',
    customerName: '',
    mobile: '',
    occasion: '',
    specialRequest: ''
  });

  // Fetch availability when date changes
  useEffect(() => {
    if (formData.bookingDate) {
      fetchAvailability();
    } else {
      setSlots([]);
      setSelectedSlots([]);
    }
  }, [formData.bookingDate]);

  const fetchAvailability = async () => {
    if (!formData.bookingDate) return;

    setCheckingAvailability(true);
    try {
      const response = await hallBookingAPI.checkHourlyAvailability({
        bookingDate: formData.bookingDate
      });

      if (response.data && response.data.slots) {
        setSlots(response.data.slots);
        setSelectedSlots([]); // Reset selection when date changes
      }
    } catch (error) {
      console.error('Availability check error:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Failed to check availability. Please try again.';
      toast.error(errorMessage);
      setSlots([]);
    } finally {
      setCheckingAvailability(false);
    }
  };

  const handleSlotClick = (hour) => {
    if (!slots.find(s => s.hour === hour)?.available) {
      return; // Can't select unavailable slots
    }

    setSelectedSlots(prev => {
      const sorted = [...prev].sort((a, b) => a - b);
      const index = sorted.indexOf(hour);

      if (index === -1) {
        // Add slot - but only if it's consecutive
        if (sorted.length === 0) {
          return [hour];
        }
        
        // Check if it's consecutive to existing selection
        const min = Math.min(...sorted);
        const max = Math.max(...sorted);
        
        if (hour === min - 1 || hour === max + 1) {
          // Consecutive, add it
          sorted.push(hour);
          return sorted.sort((a, b) => a - b);
        } else {
          // Not consecutive, replace selection
          toast.error('Please select consecutive time slots');
          return [hour];
        }
      } else {
        // Remove slot
        sorted.splice(index, 1);
        return sorted;
      }
    });
  };

  const clearSelection = () => {
    setSelectedSlots([]);
  };

  const calculateTotal = () => {
    return selectedSlots.length * HOUR_PRICE;
  };

  const calculateAdvance = () => {
    return Math.round((calculateTotal() / 2) * 100) / 100;
  };

  const calculateRemaining = () => {
    return calculateTotal() - calculateAdvance();
  };

  const formatSlotDisplay = (hour) => {
    return `${hour}:00 - ${hour + 1}:00`;
  };

  const handleBooking = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.bookingDate) {
      toast.error('Please select a booking date');
      return;
    }

    if (selectedSlots.length === 0) {
      toast.error('Please select at least one time slot');
      return;
    }

    if (!formData.customerName || !formData.mobile) {
      toast.error('Please fill all required fields');
      return;
    }

    // Mobile validation
    const mobileRegex = /^[6-9]\d{9}$/;
    if (!mobileRegex.test(formData.mobile)) {
      toast.error('Please enter a valid 10-digit mobile number');
      return;
    }

    setLoading(true);
    try {
      // Create booking
      const bookingResponse = await hallBookingAPI.createHourlyBooking({
        customerName: formData.customerName,
        mobile: formData.mobile,
        bookingDate: formData.bookingDate,
        selectedSlots: selectedSlots,
        occasion: formData.occasion || null,
        specialRequest: formData.specialRequest || null
      });

      if (bookingResponse.data && bookingResponse.data.success) {
        const { bookingId, totalAmount, advanceAmount, remainingAmount } = bookingResponse.data;
        
        // Navigate to checkout
        navigate('/hall-booking/checkout', {
          state: {
            bookingId,
            amount: advanceAmount, // Pass advance amount for payment
            totalAmount: totalAmount,
            advanceAmount: advanceAmount,
            remainingAmount: remainingAmount,
            formData: {
              ...formData,
              selectedSlots: selectedSlots,
              totalHours: selectedSlots.length,
              totalAmount: totalAmount,
              advanceAmount: advanceAmount,
              remainingAmount: remainingAmount
            }
          }
        });
      }
    } catch (error) {
      console.error('Booking error:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Failed to create booking. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const isSlotSelected = (hour) => {
    return selectedSlots.includes(hour);
  };

  const getSlotState = (slot) => {
    if (slot.past) return 'past';
    if (slot.booked) return 'booked';
    if (isSlotSelected(slot.hour)) return 'selected';
    if (slot.available) return 'available';
    return 'unavailable';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Book Our Hall</h1>
          <p className="text-gray-600">Select your preferred date and time slots</p>
          <p className="text-sm text-gray-500 mt-2">₹{HOUR_PRICE} per hour • Minimum 1 hour</p>
        </div>

        <form onSubmit={handleBooking} className="space-y-8">
          {/* Step 1: Date Selection */}
          <div className="card">
            <div className="flex items-center gap-3 mb-6">
              <Calendar className="w-6 h-6 text-primary-600" />
              <h2 className="text-2xl font-semibold text-gray-800">Select Date</h2>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Booking Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.bookingDate}
                onChange={(e) => setFormData({ ...formData, bookingDate: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                required
              />
            </div>

            {checkingAvailability && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary-600" />
                <span className="ml-2 text-gray-600">Checking availability...</span>
              </div>
            )}
          </div>

          {/* Step 2: Hourly Slot Selection */}
          {formData.bookingDate && slots.length > 0 && (
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Clock className="w-6 h-6 text-primary-600" />
                  <h2 className="text-2xl font-semibold text-gray-800">Select Time Slots</h2>
                </div>
                {selectedSlots.length > 0 && (
                  <button
                    type="button"
                    onClick={clearSelection}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    Clear Selection
                  </button>
                )}
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-4">
                  Select consecutive hourly slots (10:00 AM - 8:00 PM)
                </p>
                
                {/* Slot Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {slots.map((slot) => {
                    const state = getSlotState(slot);
                    const isSelected = state === 'selected';
                    
                    return (
                      <button
                        key={slot.hour}
                        type="button"
                        onClick={() => handleSlotClick(slot.hour)}
                        disabled={!slot.available || slot.past || slot.booked}
                        className={`
                          relative px-4 py-3 rounded-lg border-2 transition-all
                          ${state === 'selected' 
                            ? 'bg-primary-600 text-white border-primary-600 shadow-lg scale-105' 
                            : state === 'booked' || state === 'past'
                            ? 'bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed'
                            : state === 'available'
                            ? 'bg-white text-gray-700 border-gray-300 hover:border-primary-600 hover:shadow-md'
                            : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                          }
                        `}
                      >
                        <div className="flex flex-col items-center">
                          <span className="text-sm font-medium">{slot.display}</span>
                          {isSelected && (
                            <CheckCircle className="w-4 h-4 mt-1" />
                          )}
                          {state === 'booked' && (
                            <XCircle className="w-4 h-4 mt-1" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Legend */}
                <div className="flex flex-wrap gap-4 mt-6 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-white border-2 border-gray-300 rounded"></div>
                    <span className="text-gray-600">Available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-primary-600 border-2 border-primary-600 rounded"></div>
                    <span className="text-gray-600">Selected</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-200 border-2 border-gray-300 rounded"></div>
                    <span className="text-gray-600">Booked</span>
                  </div>
                </div>
              </div>

              {/* Selected Slots Summary */}
              {selectedSlots.length > 0 && (
                <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 mb-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Selected Slots:</p>
                        <p className="text-sm text-gray-600">
                          {selectedSlots.map(hour => formatSlotDisplay(hour)).join(', ')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-700 mb-1">Total Amount:</p>
                        <p className="text-2xl font-bold text-primary-600">
                          ₹{calculateTotal().toLocaleString('en-IN')}
                        </p>
                        <p className="text-xs text-gray-500">
                          {selectedSlots.length} hour{selectedSlots.length > 1 ? 's' : ''} × ₹{HOUR_PRICE}
                        </p>
                      </div>
                    </div>
                    
                    <div className="border-t border-primary-200 pt-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white rounded-lg p-3">
                          <p className="text-xs text-gray-500 mb-1">Advance Payable Now</p>
                          <p className="text-lg font-bold text-green-600">
                            ₹{calculateAdvance().toLocaleString('en-IN')}
                          </p>
                          <p className="text-xs text-gray-500">(50% of total)</p>
                        </div>
                        <div className="bg-white rounded-lg p-3">
                          <p className="text-xs text-gray-500 mb-1">Balance at Café</p>
                          <p className="text-lg font-bold text-orange-600">
                            ₹{calculateRemaining().toLocaleString('en-IN')}
                          </p>
                          <p className="text-xs text-gray-500">(50% of total)</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Customer Details */}
          {selectedSlots.length > 0 && (
            <div className="card">
              <div className="flex items-center gap-3 mb-6">
                <Users className="w-6 h-6 text-primary-600" />
                <h2 className="text-2xl font-semibold text-gray-800">Your Details</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                    placeholder="10-digit mobile number"
                    maxLength="10"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Gift className="w-4 h-4 inline mr-1" />
                    Occasion
                  </label>
                  <input
                    type="text"
                    value={formData.occasion}
                    onChange={(e) => setFormData({ ...formData, occasion: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                    placeholder="e.g., Birthday, Anniversary, Meeting"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MessageSquare className="w-4 h-4 inline mr-1" />
                    Special Requests (Optional)
                  </label>
                  <textarea
                    value={formData.specialRequest}
                    onChange={(e) => setFormData({ ...formData, specialRequest: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                    rows="3"
                    placeholder="Any special arrangements or requirements..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          {selectedSlots.length > 0 && (
            <div className="card bg-gradient-to-r from-primary-600 to-orange-600 text-white">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90 mb-1">Total Amount</p>
                    <p className="text-3xl font-bold">₹{calculateTotal().toLocaleString('en-IN')}</p>
                    <p className="text-sm opacity-75 mt-1">
                      {selectedSlots.length} hour{selectedSlots.length > 1 ? 's' : ''} × ₹{HOUR_PRICE}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm opacity-90 mb-1">Advance to Pay</p>
                    <p className="text-2xl font-bold">₹{calculateAdvance().toLocaleString('en-IN')}</p>
                    <p className="text-xs opacity-75 mt-1">
                      Remaining: ₹{calculateRemaining().toLocaleString('en-IN')} at café
                    </p>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading || !formData.customerName || !formData.mobile}
                  className="w-full px-8 py-4 bg-white text-primary-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    `Pay Advance ₹${calculateAdvance().toLocaleString('en-IN')}`
                  )}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default HallBookingPage;
