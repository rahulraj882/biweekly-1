import React from 'react';
import './Table.css'; 

const Table = ({ data, onRowClick }) => {
  const calculateTotalScore = (item) => {
    return (
      item.blockers * 10 +
      item.major * 5 +
      item.critical * 8 +
      item.normal * 3 +
      item.minor * 1
    );
  };

  if (data.length === 0) {
    return <div className="no-results">
      
      No such user found
    
    </div>;
  }

  return (
    <table>
      <thead style={{position:'sticky',top:'-1px'}}>
        <tr>
          <th>S.No.</th>
          <th>Name</th>
          <th>Blockers</th>
          <th>Major</th>
          <th>Critical</th>
          <th>Normal</th>
          <th>Minor</th>
          <th>Bug Score</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={index}>
            <td>{index + 1}</td>
            <td onClick={() => onRowClick(item)} className="clickable-name">{item.name}</td>
            <td>{item.blockers}</td>
            <td>{item.major}</td>
            <td>{item.critical}</td>
            <td>{item.normal}</td>
            <td>{item.minor}</td>
            <td>{calculateTotalScore(item)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
