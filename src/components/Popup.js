import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import './Popup.css';

const Popup = ({ data, onClose }) => {
  if (!data) return null;

  const { name, blockers, major, critical, normal, minor, numberOfActivities, activities, numberOfCourses, courses } = data;

  const totalBugScore = blockers * 10 + major * 5 + critical * 8 + normal * 3 + minor * 1;
  const totalBug = blockers+critical+major+normal+minor;

  const bugData = [
    { name: 'Blockers', value: blockers },
    { name: 'Major', value: major },
    { name: 'Critical', value: critical },
    { name: 'Normal', value: normal },
    { name: 'Minor', value: minor }
  ].filter(bug => bug.value > 0);

  const COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#FF6347', '#4BC0C0'];

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        className="insidecircle"
      >
        {
        // ${bugData[index].name}:
         `${bugData[index].value}`}
      </text>
    );
  };

  return (
    <div className="popup">
      <div className="popup-inner">
        <button className="close-btn" onClick={onClose}>×</button>
        <h2>{name}</h2>
        <div className="popup-content">
          <div className="left-section">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={bugData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {bugData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="color-legend">
              {bugData.map((entry, index) => (
                <div key={`legend-${index}`} className="color-legend-item">
                  <span className="color-box" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                  <span>{entry.name}</span>
                </div>
              ))}
            </div>
            <div className="total-bug-score">
              Total Bug Score: {totalBugScore}
            </div>
          </div>
          <div className="right-section">
            <table>
              <tbody>
                <tr><td>Total Bugs</td> <td >{totalBug}</td> </tr>
                <tr><td>Number of Activities</td><td>{numberOfActivities}</td></tr>
                <tr><td>Activities</td><td>{activities.join(", ")}</td></tr>
                <tr><td>Number of Courses</td><td>{numberOfCourses}</td></tr>
                <tr><td>Courses</td><td>{courses.join(", ")}</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Popup;
