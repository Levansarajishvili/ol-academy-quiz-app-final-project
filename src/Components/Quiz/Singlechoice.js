import React from 'react';

const SingleChoiceQuestion = ({ question, options = [], checkAns, optionArray }) => {
  return (
    <ul>
      {options.map((option, i) => (
        <li key={i} ref={optionArray[i]} onClick={(e) => checkAns(e, i + 1)}>{option}</li>
      ))}
    </ul>
  );
};

export default SingleChoiceQuestion;

