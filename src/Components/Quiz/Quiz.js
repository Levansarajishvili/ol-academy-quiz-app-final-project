import React, { useState, useRef, useEffect } from 'react';
import './Quiz.css';
import MultipleChoiceQuestion from './Multiplechoice';
import SingleChoiceQuestion from './Singlechoice';
import BooleanQuestion from './Booleanchoice';
import StartScreen from './Startquiz';
import Popup from './Popup';

const QUIZ_STORAGE_KEY = 'quizData';
const QUIZ_STORAGE_TIME_KEY = 'quizDataTime';
const ATTEMPTS_HISTORY_KEY = 'attemptsHistory';
const QUIZ_EXPIRY_TIME = 10 * 60 * 1000; // 10 minutes in milliseconds

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [index, setIndex] = useState(0);
  const [lock, setLock] = useState(false);
  const [score, setScore] = useState(0);
  const [result, setResult] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [showAttempts, setShowAttempts] = useState(false);
  const [attempts, setAttempts] = useState([]);

  const option1 = useRef(null);
  const option2 = useRef(null);
  const option3 = useRef(null);
  const option4 = useRef(null);

  const optionArray = [option1, option2, option3, option4];

  const saveQuizDataToLocalStorage = (questions, answers) => {
    const timestamp = Date.now();
    localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify({ questions, answers }));
    localStorage.setItem(QUIZ_STORAGE_TIME_KEY, timestamp);
  };

  const loadQuizDataFromLocalStorage = () => {
    const quizData = localStorage.getItem(QUIZ_STORAGE_KEY);
    const quizDataTime = localStorage.getItem(QUIZ_STORAGE_TIME_KEY);

    if (quizData && quizDataTime) {
      const now = Date.now();
      const timeDifference = now - parseInt(quizDataTime);

      if (timeDifference <= QUIZ_EXPIRY_TIME) {
        const { questions, answers } = JSON.parse(quizData);
        setQuestions(questions);
        setAnswers(answers);
        setQuizStarted(true);
        return true;
      } else {
        localStorage.removeItem(QUIZ_STORAGE_KEY);
        localStorage.removeItem(QUIZ_STORAGE_TIME_KEY);
      }
    }
    return false;
  };

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://my-json-server.typicode.com/DanielBarbakadze/Advanced-JS-and-React-Basics/db');
      const data = await response.json();
      setQuestions(data.questions);
      setAnswers(data.answers);
      saveQuizDataToLocalStorage(data.questions, data.answers);
      setLoading(false);
      setQuizStarted(true);
    } catch (error) {
      setError('Failed to fetch questions');
      setLoading(false);
    }
  };

  useEffect(() => {
    const dataLoaded = loadQuizDataFromLocalStorage();
    if (!dataLoaded) {
      setQuizStarted(false);
    }
    const storedAttempts = JSON.parse(localStorage.getItem(ATTEMPTS_HISTORY_KEY)) || [];
    setAttempts(storedAttempts);
  }, []);

  const checkAns = (e, ans) => {
    if (!lock) {
      const correctAnswer = answers[index].answer;
      if (Array.isArray(correctAnswer)) {
        // Multiple choice question
        submitMultipleChoice();
      } else if (typeof correctAnswer === 'boolean') {
        // Boolean question
        const isCorrect = (ans === 'true') === correctAnswer;
        if (isCorrect) {
          e.target.classList.add('correct');
          setScore(prev => prev + 1);
        } else {
          e.target.classList.add('wrong');
        }
        setLock(true);
      } else {
        // Single choice question
        if (correctAnswer === ans) {
          e.target.classList.add('correct');
          setScore(prev => prev + 1);
        } else {
          e.target.classList.add('wrong');
          const correctOption = optionArray[correctAnswer - 1];
          if (correctOption && correctOption.current) {
            correctOption.current.classList.add('correct');
          }
        }
        setLock(true);
      }
    }
  };

  const submitMultipleChoice = () => {
    const correctAnswer = answers[index].answer;
    if (selectedAnswers.sort().join(',') === correctAnswer.sort().join(',')) {
      setScore(prev => prev + 1);
      selectedAnswers.forEach(ans => optionArray[ans - 1].current.classList.add('correct'));
    } else {
      selectedAnswers.forEach(ans => {
        if (correctAnswer.includes(ans)) {
          optionArray[ans - 1].current.classList.add('correct');
        } else {
          optionArray[ans - 1].current.classList.add('wrong');
        }
      });
      correctAnswer.forEach(ans => optionArray[ans - 1].current.classList.add('correct'));
    }
    setLock(true);
  };

  const next = () => {
    if (lock) {
      if (index === questions.length - 1) {
        setResult(true);
        saveAttempt();
      } else {
        setIndex(prevIndex => prevIndex + 1);
        setLock(false);
        setSelectedAnswers([]);
        optionArray.forEach(option => {
          if (option.current) {
            option.current.classList.remove('wrong');
            option.current.classList.remove('correct');
            option.current.classList.remove('selected');
          }
        });
      }
    }
  };

  const saveAttempt = () => {
    const newAttempt = { score, total: questions.length, timestamp: new Date() };
    const updatedAttempts = [...attempts, newAttempt];
    setAttempts(updatedAttempts);
    localStorage.setItem(ATTEMPTS_HISTORY_KEY, JSON.stringify(updatedAttempts));
  };

  const reset = () => {
    setShowPopup(true);
  };

  const handlePopupYes = () => {
    saveQuizDataToLocalStorage(questions, answers);
    setShowPopup(false);
    setQuizStarted(false);
    setQuestions([]);
    setAnswers([]);
    setIndex(0);
    setScore(0);
    setResult(false);
  };

  const handlePopupNo = () => {
    setShowPopup(false);
    setQuizStarted(false);
    setQuestions([]);
    setAnswers([]);
    setIndex(0);
    setScore(0);
    setResult(false);
  };

  const startQuiz = () => {
    fetchQuestions();
  };

  const showAttemptsHistory = () => {
    setShowAttempts(true);
  };

  const closeAttemptsHistory = () => {
    setShowAttempts(false);
  };

  const deleteHistory = () => {
    localStorage.removeItem(ATTEMPTS_HISTORY_KEY);
    setAttempts([]);
  };

  const progress = questions.length ? ((index + 1) / questions.length) * 100 : 0;

  return (
    <div className='container'>
      <h1>Quiz App</h1>
      <hr />
      {!quizStarted ? (
        <StartScreen startQuiz={startQuiz} loading={loading} error={error} />
      ) : result ? (
        <>
          <h2>You Scored {score} out of {questions.length}</h2>
          <button onClick={reset}>Try again</button>
          <button onClick={showAttemptsHistory}>See Attempts History</button>
        </>
      ) : (
        <>
          <h2>{index + 1}. {questions[index]?.question}</h2>
          {questions[index]?.type === 'boolean' ? (
            <BooleanQuestion 
              question={questions[index]?.question} 
              checkAns={checkAns} 
              optionArray={optionArray} 
            />
          ) : questions[index]?.type === 'multiple' ? (
            <MultipleChoiceQuestion 
              question={questions[index]?.question} 
              options={questions[index]?.options} 
              checkAns={submitMultipleChoice} 
              selectedAnswers={selectedAnswers} 
              setSelectedAnswers={setSelectedAnswers} 
              optionArray={optionArray} 
            />
          ) : (
            <SingleChoiceQuestion 
              question={questions[index]?.question} 
              options={questions[index]?.options} 
              checkAns={checkAns} 
              optionArray={optionArray} 
            />
          )}
          <button onClick={next}>Next</button>
          <div className='index'>{index + 1} of {questions.length} questions</div>
          <div className='progress-bar'>
            <div className='progress' style={{ width: `${progress}%` }}></div>
          </div>
        </>
      )}
      {showPopup && (
        <Popup
          message="Do you want to save this attempt?"
          onYes={handlePopupYes}
          onNo={handlePopupNo}
        />
      )}
      {showAttempts && (
        <div className='attempts-history'>
          <h2>Attempts History</h2>
          <button onClick={closeAttemptsHistory}>Close</button>
          <button onClick={deleteHistory}>Delete History</button>
          <ul>
            {attempts.map((attempt, index) => (
              <li key={index}>
                {attempt.score} | {new Date(attempt.timestamp).toLocaleString()}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Quiz;
