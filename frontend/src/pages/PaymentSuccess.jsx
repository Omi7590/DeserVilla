import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, Home } from 'lucide-react';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to menu after 5 seconds
    const timer = setTimeout(() => {
      navigate('/menu');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full card text-center">
        <div className="mb-6">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Payment Successful!
        </h1>
        <p className="text-gray-600 mb-2">
          Your order has been placed successfully.
        </p>
        {orderId && (
          <p className="text-sm text-gray-500 mb-6">
            Order ID: #{orderId}
          </p>
        )}
        <p className="text-gray-600 mb-8">
          We'll prepare your order and serve it shortly.
        </p>
        <button
          onClick={() => navigate('/menu')}
          className="btn-primary flex items-center gap-2 mx-auto"
        >
          <Home className="w-5 h-5" />
          Back to Menu
        </button>
        <p className="text-xs text-gray-500 mt-4">
          Redirecting automatically in 5 seconds...
        </p>
      </div>
    </div>
  );
};

export default PaymentSuccess;

