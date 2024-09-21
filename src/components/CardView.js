// components/CardView.js
import React from 'react';
import './CardView.css';

const CardView = ({ data ,onCardClick}) => {
  return (
    <div className="card-view">
      <div className="card-container">
        {data.length > 0 ? (
          data.map((item, index) => (
            <div key={index} className="card" onClick={()=>onCardClick(item)} >
              <div className="card-header">
                <h3>{item.name}</h3>
                <p>Total: {item.blockers * 10 + item.major * 5 + item.critical * 8 + item.normal * 3 + item.minor * 1}</p>
              </div>
              <div className="card-description">
                <p>{item.description || 'No description available'}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="no-results">No users found</div>
        )}
      </div>
    </div>
  );
};

export default CardView;
