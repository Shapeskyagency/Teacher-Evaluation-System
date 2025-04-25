import React from 'react';
import { Steps } from 'antd';

const CommonStepper = ({ current, steps,direction }) => {
  return (
    <Steps
    size="large"
    current={current}
    items={steps}
  />
  );
};

export default CommonStepper;
