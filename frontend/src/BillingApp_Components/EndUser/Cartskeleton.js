import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import './cart.css'; // Import CSS file for custom styles

function CardSkeleton({ cart, value }) {
  const numRows = Math.ceil(cart / value);

  return (
    <div className="card-container">
      {Array(numRows)
        .fill(0)
        .map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="card-row"
          >
            {Array(value)
              .fill(0)
              .map((item, itemIndex) => (
                <div
                  key={rowIndex * value + itemIndex}
                  className="card"
                >
                  <div className="card-content">
                    <div className="card-image">
                      <Skeleton height={'100%'} />
                    </div>
                    <div className="card-details">
                      <h2 className="card-title">
                        <Skeleton width={200} />
                      </h2>
                      <p className="card-description">
                        <Skeleton count={1} />
                      </p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        ))}
    </div>
  );
}

export default CardSkeleton;
