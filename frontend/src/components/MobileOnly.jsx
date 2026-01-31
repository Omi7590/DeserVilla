import { useEffect, useState } from 'react';
import { Monitor, Smartphone } from 'lucide-react';

const MobileOnly = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      {/* Mobile Frame Container */}
      <div className="w-full max-w-[430px] min-h-screen bg-white shadow-2xl relative">
        {/* Mobile Content */}
        {children}
      </div>
    </div>
  );
};

export default MobileOnly;
