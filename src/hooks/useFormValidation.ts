/**
 * Enhanced Form Validation Hook
 * Provides comprehensive validation with debouncing, async validation, and error recovery
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { useDebounce } from '@/hooks/useDebounce';

export interface ValidationRule<T = any> {
  required?: boolean;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: T, allValues?: Record<string, any>) => string | null;
  asyncValidator?: (value: T) => Promise<string | null>;
}

export interface FormField<T = any> {
  value: T;
  error: string | null;
  touched: boolean;
  validating: boolean;
}

export interface UseFormValidationOptions {
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  debounceMs?: number;
  showErrorsOnSubmit?: boolean;
}

export function useFormValidation<T extends Record<string, any>>(
  initialValues: T,
  validationRules: Partial<Record<keyof T, ValidationRule>>,
  options: UseFormValidationOptions = {}
) {
  const {
    validateOnChange = true,
    validateOnBlur = true,
    debounceMs = 300,
    showErrorsOnSubmit = true
  } = options;

  // Form state
  const [fields, setFields] = useState<Record<keyof T, FormField>>(() => {
    const initialFields: Record<keyof T, FormField> = {} as any;
    for (const key in initialValues) {
      initialFields[key] = {
        value: initialValues[key],
        error: null,
        touched: false,
        validating: false
      };
    }
    return initialFields;
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitCount, setSubmitCount] = useState(0);
  const validationTimeouts = useRef<Record<string, NodeJS.Timeout>>({});

  // Debounced validation values
  const debouncedFields = useDebounce(fields, debounceMs);

  // Get current values
  const values = Object.keys(fields).reduce((acc, key) => {
    acc[key as keyof T] = fields[key as keyof T].value;
    return acc;
  }, {} as T);

  // Get validation state
  const errors = Object.keys(fields).reduce((acc, key) => {
    const field = fields[key as keyof T];
    if (field.error && (field.touched || submitCount > 0)) {
      acc[key as keyof T] = field.error;
    }
    return acc;
  }, {} as Partial<Record<keyof T, string>>);

  const isValid = Object.values(fields).every(field => !field.error);
  const hasErrors = Object.values(errors).some(error => !!error);
  const isValidating = Object.values(fields).some(field => field.validating);

  // Validation function
  const validateField = useCallback(async (
    name: keyof T, 
    value: any, 
    allValues: T
  ): Promise<string | null> => {
    const rules = validationRules[name];
    if (!rules) return null;

    // Required validation
    if (rules.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
      return `${String(name)} is required`;
    }

    // Skip other validations if value is empty and not required
    if (!value && !rules.required) return null;

    // Type-specific validations
    if (typeof value === 'string') {
      if (rules.minLength && value.length < rules.minLength) {
        return `${String(name)} must be at least ${rules.minLength} characters`;
      }
      if (rules.maxLength && value.length > rules.maxLength) {
        return `${String(name)} must be no more than ${rules.maxLength} characters`;
      }
      if (rules.pattern && !rules.pattern.test(value)) {
        return `${String(name)} format is invalid`;
      }
    }

    if (typeof value === 'number') {
      if (rules.min !== undefined && value < rules.min) {
        return `${String(name)} must be at least ${rules.min}`;
      }
      if (rules.max !== undefined && value > rules.max) {
        return `${String(name)} must be no more than ${rules.max}`;
      }
    }

    // Custom validation
    if (rules.custom) {
      const customError = rules.custom(value, allValues);
      if (customError) return customError;
    }

    // Async validation
    if (rules.asyncValidator) {
      try {
        const asyncError = await rules.asyncValidator(value);
        if (asyncError) return asyncError;
      } catch (error) {
        return 'Validation failed';
      }
    }

    return null;
  }, [validationRules]);

  // Set field value
  const setValue = useCallback((name: keyof T, value: any) => {
    setFields(prev => ({
      ...prev,
      [name]: {
        ...prev[name],
        value,
        error: prev[name].error // Keep existing error until validation
      }
    }));
  }, []);

  // Set field error
  const setError = useCallback((name: keyof T, error: string | null) => {
    setFields(prev => ({
      ...prev,
      [name]: {
        ...prev[name],
        error
      }
    }));
  }, []);

  // Touch field
  const setTouched = useCallback((name: keyof T, touched: boolean = true) => {
    setFields(prev => ({
      ...prev,
      [name]: {
        ...prev[name],
        touched
      }
    }));
  }, []);

  // Validate single field
  const validateSingleField = useCallback(async (name: keyof T) => {
    const field = fields[name];
    if (!field) return;

    // Clear existing timeout
    if (validationTimeouts.current[String(name)]) {
      clearTimeout(validationTimeouts.current[String(name)]);
    }

    // Set validating state for async validators
    const hasAsyncValidator = validationRules[name]?.asyncValidator;
    if (hasAsyncValidator) {
      setFields(prev => ({
        ...prev,
        [name]: {
          ...prev[name],
          validating: true
        }
      }));
    }

    try {
      const error = await validateField(name, field.value, values);
      setFields(prev => ({
        ...prev,
        [name]: {
          ...prev[name],
          error,
          validating: false
        }
      }));
    } catch (validationError) {
      setFields(prev => ({
        ...prev,
        [name]: {
          ...prev[name],
          error: 'Validation error occurred',
          validating: false
        }
      }));
    }
  }, [fields, validationRules, validateField, values]);

  // Validate all fields
  const validateAll = useCallback(async (): Promise<boolean> => {
    const validationPromises = Object.keys(fields).map(async (key) => {
      const name = key as keyof T;
      const field = fields[name];
      const error = await validateField(name, field.value, values);
      return { name, error };
    });

    const results = await Promise.allSettled(validationPromises);
    const validationResults: Array<{ name: keyof T; error: string | null }> = [];

    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        validationResults.push(result.value);
      } else {
        const name = Object.keys(fields)[index] as keyof T;
        validationResults.push({ name, error: 'Validation failed' });
      }
    });

    // Update all fields
    setFields(prev => {
      const newFields = { ...prev };
      validationResults.forEach(({ name, error }) => {
        newFields[name] = {
          ...newFields[name],
          error,
          touched: true
        };
      });
      return newFields;
    });

    return validationResults.every(({ error }) => !error);
  }, [fields, validateField, values]);

  // Handle form submission
  const handleSubmit = useCallback(async (
    onSubmit: (values: T) => Promise<void> | void
  ) => {
    setIsSubmitting(true);
    setSubmitCount(prev => prev + 1);

    try {
      const isFormValid = await validateAll();
      
      if (isFormValid) {
        await onSubmit(values);
        return { success: true };
      } else {
        return { success: false, error: 'Please fix the errors above' };
      }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Submission failed' 
      };
    } finally {
      setIsSubmitting(false);
    }
  }, [validateAll, values]);

  // Reset form
  const reset = useCallback((newInitialValues?: Partial<T>) => {
    const resetValues = newInitialValues || initialValues;
    setFields(() => {
      const resetFields: Record<keyof T, FormField> = {} as any;
      for (const key in resetValues) {
        resetFields[key] = {
          value: resetValues[key],
          error: null,
          touched: false,
          validating: false
        };
      }
      return resetFields;
    });
    setSubmitCount(0);
  }, [initialValues]);

  // Auto-validation on change
  useEffect(() => {
    if (!validateOnChange) return;

    Object.keys(debouncedFields).forEach((key) => {
      const name = key as keyof T;
      const field = debouncedFields[name];
      
      if (field.touched && field.value !== initialValues[name]) {
        validateSingleField(name);
      }
    });
  }, [debouncedFields, validateOnChange, validateSingleField, initialValues]);

  return {
    // State
    fields,
    values,
    errors,
    isValid,
    hasErrors,
    isValidating,
    isSubmitting,
    submitCount,

    // Actions
    setValue,
    setError,
    setTouched,
    validateSingleField,
    validateAll,
    handleSubmit,
    reset,

    // Helper functions
    getFieldProps: (name: keyof T) => ({
      value: fields[name]?.value ?? '',
      onChange: (value: any) => setValue(name, value),
      onBlur: () => {
        setTouched(name);
        if (validateOnBlur) {
          validateSingleField(name);
        }
      },
      error: (fields[name]?.touched || submitCount > 0) ? fields[name]?.error : null,
      validating: fields[name]?.validating ?? false
    })
  };
}