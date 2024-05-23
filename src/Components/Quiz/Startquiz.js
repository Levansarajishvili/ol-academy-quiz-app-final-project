import React from 'react';

const StartScreen = ({ startQuiz, loading, error }) => (
  <div className='start-screen'>
    <h2>Welcome to the Quiz</h2>
    {loading ? (
      <p>Loading questions...</p>
    ) : (
      <button onClick={startQuiz}>Start Quiz</button>
    )}
    {error && <p className='error'>{error}</p>}
  </div>
);

export default StartScreen;
