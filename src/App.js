
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Quiz from '../src/Components/Quiz/Quiz';
// import AttemptsHistory from '../src/Components/Quiz/AttemptsHistory';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Quiz />} />
        {/* <Route path="/AttemptsHistory" element={<AttemptsHistory />} /> */}
      </Routes>
    </Router>
  );
};

export default App;

