import React from 'react';

const Rank = ({ name = '', entries = 0 }) => {
  return (
    <div className='text-center'>
      <div className="white f3">
        {`${name}, you have logged in ${entries} ${entries === 1 ? 'time' : 'times'}`}
      </div>
    </div>
  );
}

export default Rank;
