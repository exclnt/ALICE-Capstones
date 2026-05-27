import { useState } from 'react';

type UseInputReturn = [string, (newValue: string) => void];

function useInput(defaultValue = ''): UseInputReturn {
  const [value, setValue] = useState(defaultValue);

  const onValueChangeHandler = (newValue: string) => {
    setValue(newValue);
  };

  return [value, onValueChangeHandler];
}

export default useInput;
