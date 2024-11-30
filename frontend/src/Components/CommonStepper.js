import React from 'react';
import { Steps } from 'antd';

const CommonStepper = ({ currentStep, steps,direction }) => {
  return (
    <Steps  current={currentStep} direction={direction}>
      {steps.map((step, index) => (
        <Steps.Step
          key={index}
          title={step.title}
          description={step.description}
          subTitle={step.subTitle}
        />
      ))}
    </Steps>
  );
};

export default CommonStepper;
