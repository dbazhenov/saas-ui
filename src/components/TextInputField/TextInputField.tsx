import React, { FC } from 'react';
import { Field } from 'react-final-form';
import { TextField } from '@mui/material';
import { TextFieldRenderProps, TextInputFieldProps, CustomFormHelperTextProps } from './TextInputField.types';

/**
 * Note: the validation error message will be displayed once the the input has been modified.
 * To show the error message on blur you have to pass `showErrorOnBlur`.
 */

export const TextInputField: FC<TextInputFieldProps> = React.memo(
  ({
    disabled = false,
    label,
    name = '',
    id = `input-${name}-id`,
    placeholder,
    showErrorOnBlur = false,
    showErrorOnRender = false,
    margin = 'none',
    size = 'medium',
    fullWidth = false,
    variant = 'outlined',
    ...fieldConfig
  }) => (
    <Field {...fieldConfig} type="text" name={name}>
      {({ input, meta }: TextFieldRenderProps) => {
        const validationError =
          (((!showErrorOnBlur && meta.modified) || meta.touched) && meta.error) ||
          (showErrorOnRender && meta.error);

        return (
          <TextField
            onChange={input.onChange}
            label={label}
            name={name}
            margin={margin}
            value={input.value}
            id={id}
            error={!!validationError}
            helperText={validationError}
            size={size}
            placeholder={placeholder}
            disabled={disabled}
            fullWidth
            variant={variant}
            InputLabelProps={{
              'data-testid': `${name}-field-label`,
            }}
            inputProps={{
              'data-testid': `${name}-text-input`,
            }}
            FormHelperTextProps={
              {
                'data-testid': `${name}-field-error-message`,
              } as CustomFormHelperTextProps
            }
          />
        );
      }}
    </Field>
  ),
);
