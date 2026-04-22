import React, { useState } from 'react';
import Header from './components/Header';
import AddStudentForm from './components/AddStudentForm';
import StudentTable from './components/StudentTable';
import './index.css';

function App() {
  const [students, setStudents] = useState([
    { id: 1, name: 'Alice Johnson', score: 85 },
    { id: 2, name: 'Bob Smith', score: 32 },
    { id: 3, name: 'Charlie Davis', score: 45 }
  ]);

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

  return (
    <div className="app-container">
      <Header />
      <main className="app-container">
        <AddStudentForm onAddStudent={handleAddStudent} />
        <StudentTable students={students} onUpdateScore={handleUpdateScore} />
      </main>
    </div>
  );
}

export default App;
