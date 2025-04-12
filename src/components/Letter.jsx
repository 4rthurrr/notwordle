import React from 'react';
import './Letter.css';

function Letter({ letter, status, revealed, position }) {
  const getClassName = () => {
    let className = 'letter';
    
    if (letter !== ' ' && !revealed) {
      className += ' filled';
    }
    
    if (revealed) {
      className += ' revealed';
      className += ` ${status || 'absent'}`;
    }
    
    return className;
  };
  
  return (
    <div className={getClassName()} style={{ animationDelay: `${position * 0.2}s` }}>
      {letter !== ' ' ? letter.toUpperCase() : ''}
    </div>
  );
}

export default Letter;
