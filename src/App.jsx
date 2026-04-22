import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import AddStudentForm from './components/AddStudentForm';
import StudentTable from './components/StudentTable';
import './index.css';

function App() {
  // Initialize state from localStorage or default values
  const [students, setStudents] = useState(() => {
    const savedStudents = localStorage.getItem('scoreboard_students');
    return savedStudents ? JSON.parse(savedStudents) : [
      { id: 1, name: 'Alice Johnson', score: 85 },
      { id: 2, name: 'Bob Smith', score: 32 },
      { id: 3, name: 'Charlie Davis', score: 45 }
    ];
  });

  const [searchTerm, setSearchTerm] = useState('');

  // Save to localStorage whenever students array changes
  useEffect(() => {
    localStorage.setItem('scoreboard_students', JSON.stringify(students));
  }, [students]);

  const handleAddStudent = (name, score) => {
    const newStudent = {
      id: Date.now(),
      name,
      score: parseInt(score, 10)
    };
    setStudents([...students, newStudent]);
  };

  const handleUpdateScore = (id, newScore) => {
    setStudents(students.map(student => 
      student.id === id ? { ...student, score: parseInt(newScore, 10) || 0 } : student
    ));
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="app-container">
      <Header />
      <main className="app-container">
        <AddStudentForm onAddStudent={handleAddStudent} />
        
        <div className="glass-card search-container">
          <input 
            type="text" 
            placeholder="Search students by name..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <StudentTable 
          students={filteredStudents} 
          onUpdateScore={handleUpdateScore} 
        />
      </main>
    </div>
  );
}

export default App;
