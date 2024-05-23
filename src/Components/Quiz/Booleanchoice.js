import React from 'react';

const BooleanQuestion = ({ question, checkAns, optionArray }) => {
  return (
    <ul>
      <li ref={optionArray[0]} onClick={(e) => checkAns(e, 'true')}>True</li>
      <li ref={optionArray[1]} onClick={(e) => checkAns(e, 'false')}>False</li>
    </ul>
  );
};

export default BooleanQuestion;
