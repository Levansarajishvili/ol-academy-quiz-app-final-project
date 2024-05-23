import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AttemptsHistory';


const ATTEMPTS_HISTORY_KEY = 'attemptsHistory';

const AttemptsHistory = () => {
  const [attempts, setAttempts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedAttempts = JSON.parse(localStorage.getItem(ATTEMPTS_HISTORY_KEY)) || [];
    setAttempts(storedAttempts);
  }, []);

  return (
    <div className='container1'>
      <h1>Attempts History</h1>
      <button onClick={() => navigate('/')}>Back to Quiz</button>
      <ul>
        {attempts.map((attempt, index) => (
          <li key={index}>
            {attempt.score} | {new Date(attempt.timestamp).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AttemptsHistory;
