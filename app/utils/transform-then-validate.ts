import { ClassConstructor, ClassTransformOptions, plainToInstance } from 'class-transformer';
import { ValidationError } from 'class-validator/types/validation/ValidationError';
import { validateSync, ValidatorOptions as ClassValidatorOptions } from 'class-validator';
import { CLASS_TRANSFORMER_OPTIONS, CLASS_VALIDATOR_OPTIONS } from '../constants';

/**
 * Converts a plain (literal) object into a class constructor object and then validates it.
 *
 * @param cls - The class constructor to transform the plain object into.
 * @param plain - The plain object that needs transformation and validation.
 * @param options - Optionally extend or override default options:
 *    - `transformer`: Custom transformer options that merge to {@link CLASS_TRANSFORMER_OPTIONS}.
 *    - `validator`: Custom validator options that merge to {@link CLASS_VALIDATOR_OPTIONS}.
 * @returns An object containing the transformed data and any validation errors.
 *
 * @example
 * // Use with default options
 * transformThenValidate(MyClass, inputData);
 *
 * // Extend or Override transformer options
 * transformThenValidate(MyClass, inputData, { transformer: { enableImplicitConversion: false } });
 *
 * // Extend or Override validator options
 * transformThenValidate(MyClass, inputData, { validator: { skipMissingProperties: true } });
 */
export function transformThenValidate<T, V>(
  cls: ClassConstructor<T>,
  plain: V,
  options: { transformer?: ClassTransformOptions; validator?: ClassValidatorOptions } = {}
): { data: T; errors: ValidationError[] } {
  const transformerOptions = { ...CLASS_TRANSFORMER_OPTIONS, ...options.transformer };
  const validatorOptions = { ...CLASS_VALIDATOR_OPTIONS, ...options.validator };

  const data = plainToInstance(cls, plain, transformerOptions);
  const errors = validateSync(data as object, validatorOptions);

  return { data, errors };
}
