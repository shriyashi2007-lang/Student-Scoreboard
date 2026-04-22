import React from 'react';
import StudentRow from './StudentRow';

const StudentTable = ({ students, onUpdateScore }) => {
  if (students.length === 0) {
    return (
      <div className="glass-card table-container">
        <div className="empty-state">No students found. Add one above!</div>
      </div>
    );
  }

  return (
    <div className="glass-card table-container">
      <table className="student-table">
        <thead>
          <tr>
            <th>Student Name</th>
            <th>Score</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <StudentRow 
              key={student.id} 
              student={student} 
              onUpdateScore={onUpdateScore} 
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentTable;
