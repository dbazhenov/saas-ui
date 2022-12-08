import { FormHelperTextProps } from '@mui/material';
import { FieldInputProps, FieldMetaState, UseFieldConfig } from 'react-final-form';

export type VResult = string | undefined;

export type Validator<T = any> = (value: T, values?: Record<string, any>, meta?: any) => VResult;

export interface TextInputFieldProps extends UseFieldConfig<string> {
  disabled?: boolean;
  label?: string;
  name?: string;
  id?: string;
  placeholder?: string;
  margin?: 'normal' | 'dense' | 'none';
  size?: 'small' | 'medium';
  fullWidth?: boolean;
  variant?: 'filled' | 'outlined' | 'standard';
  showErrorOnBlur?: boolean;
  showErrorOnRender?: boolean;
}

export interface TextFieldRenderProps {
  input: FieldInputProps<string>;
  meta: FieldMetaState<string>;
}

export interface CustomFormHelperTextProps extends FormHelperTextProps {
  'data-testid'?: string;
}
