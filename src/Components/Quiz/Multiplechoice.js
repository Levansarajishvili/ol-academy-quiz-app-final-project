import React, { useRef } from 'react';

const MultipleChoiceQuestion = ({ question, options, checkAns, selectedAnswers, setSelectedAnswers, optionArray }) => {
  const handleSelection = (e, ans) => {
    if (selectedAnswers.includes(ans)) {
      setSelectedAnswers(selectedAnswers.filter(a => a !== ans));
      e.target.classList.remove('selected');
    } else {
      setSelectedAnswers([...selectedAnswers, ans]);
      e.target.classList.add('selected');
    }
  };

  return (
    <>
      <ul>
        {options.map((option, i) => (
          <li key={i} ref={optionArray[i]} onClick={(e) => handleSelection(e, i + 1)}>{option}</li>
        ))}
      </ul>
      <button onClick={checkAns}>Submit</button>
    </>
  );
};

export default MultipleChoiceQuestion;
