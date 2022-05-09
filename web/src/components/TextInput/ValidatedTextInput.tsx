import { ChangeEvent, ReactElement, useState } from 'react';
import { InputValidator } from '../../validators/types';
import TextInput, { TextInputProps } from './TextInput';

interface ValidatedTextInputProps extends TextInputProps {
  validator: InputValidator;
}

export default function ValidatedTextInput(props: ValidatedTextInputProps): ReactElement {
  const { validator, onChange, ...restProps } = props;
  const [error, setError] = useState('');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const error = validator(e);
    if (error) setError(error);
    else setError('');

    if (onChange) onChange(e);
  };

  return (
    <>
      <TextInput {...restProps} onChange={handleChange} />
      {error && <span role="alert">{error}</span>}
    </>
  );
}
