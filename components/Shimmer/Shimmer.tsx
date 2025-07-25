import React from 'react';
import './Shimmer.css'; 

const ShimmerCard = () => {
  return (
    <div className="p-4 w-full max-w-xs mx-auto">
      <div className="shimmer-wrapper">
        <div className="shimmer h-40 rounded-md mb-4"></div> {/* Image placeholder shimmer */}
      </div>
      <div className="shimmer-wrapper">
        <div className="shimmer h-6 rounded-md mb-2"></div> {/* Text placeholder shimmer */}
      </div>
      <div className="shimmer-wrapper">
        <div className="shimmer h-6 w-3/4 rounded-md"></div> {/* Another text shimmer */}
      </div>
    </div>
  );
};

export default ShimmerCard;
