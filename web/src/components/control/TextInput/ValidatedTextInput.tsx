import { ChangeEvent, ReactElement, useState } from 'react';
import classNames from 'classnames';
import { InputValidator } from '../../../validators/types';
import TextInput, { TextInputProps } from './TextInput';
import './ValidatedTextInput.scss';

interface ValidatedTextInputProps extends TextInputProps {
  validator: InputValidator;
}

export default function ValidatedTextInput(props: ValidatedTextInputProps): ReactElement {
  const { validator, onChange, className, ...restProps } = props;
  const [error, setError] = useState('');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const error = validator(e);
    if (error) setError(error);
    else setError('');

    if (onChange) onChange(e);
  };

  return (
    <>
      <TextInput className={classNames(className, { error })} {...restProps} onChange={handleChange} />
      {error && (
        <span className="input-error" role="alert">
          {error}
        </span>
      )}
    </>
  );
}
