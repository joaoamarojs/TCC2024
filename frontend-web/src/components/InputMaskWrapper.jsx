import React, { forwardRef } from 'react';
import InputMask from 'react-input-mask';

// Create a wrapper component
const InputMaskWrapper = forwardRef((props, ref) => (
  <InputMask {...props} inputRef={ref} />
));

export default InputMaskWrapper;