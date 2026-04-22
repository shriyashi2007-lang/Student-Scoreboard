import React, { useState } from 'react';

const AddStudentForm = ({ onAddStudent }) => {
  const [name, setName] = useState('');
  const [score, setScore] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || score === '') return;
    
    onAddStudent(name, score);
    setName('');
    setScore('');
  };

  return (
    <div className="glass-card form-container">
      <h2>Add New Student</h2>
      <form onSubmit={handleSubmit} className="add-student-form">
        <div className="input-group">
          <label htmlFor="name">Student Name</label>
          <input
            id="name"
            type="text"
            placeholder="Enter name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="score">Score</label>
          <input
            id="score"
            type="number"
            min="0"
            max="100"
            placeholder="0-100"
            value={score}
            onChange={(e) => setScore(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn-submit">Add Student</button>
      </form>
    </div>
  );
};

export default AddStudentForm;
