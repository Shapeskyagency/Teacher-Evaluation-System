import React, { createContext, useState, useContext } from 'react';

// Create context
const ScoreContext = createContext();

// Provider component
export const ScoreContextProvider = ({ children }) => {
  const [scores, setScores] = useState({
    TeacherForm: {}, // Store form as an object
    ObserverForm: {}, // Store form as an object
  });

  const updateScores = (formName, scoreData) => {
    setScores((prevScores) => ({
      ...prevScores,
      [formName]: scoreData, // Update specific form data
    }));
  };


  return (
    <ScoreContext.Provider value={{ scores, updateScores }}>
      {children}
    </ScoreContext.Provider>
  );
};

// Custom hook to use the ScoreContext
export const useTeacherScores = () => {
  return useContext(ScoreContext);
};
