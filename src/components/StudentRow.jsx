import React from 'react';

const StudentRow = ({ student, onUpdateScore }) => {
  const isPass = student.score >= 40;

  const handleScoreChange = (e) => {
    let value = e.target.value;
    if (value === '') {
        onUpdateScore(student.id, 0);
    } else {
        onUpdateScore(student.id, value);
    }
  };

  return (
    <tr>
      <td className="student-name">{student.name}</td>
      <td>
        <input
          type="number"
          className="score-edit-input"
          min="0"
          max="100"
          value={student.score}
          onChange={handleScoreChange}
        />
      </td>
      <td>
        <span className={`status-badge ${isPass ? 'status-pass' : 'status-fail'}`}>
          {isPass ? 'Pass' : 'Fail'}
        </span>
      </td>
    </tr>
  );
};

export default StudentRow;
