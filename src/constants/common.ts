import type { ClassTransformOptions as ClassTransformerOptions } from 'class-transformer/types/interfaces';
import type { ValidatorOptions as ClassValidatorOptions } from 'class-validator/types/validation/ValidatorOptions';

export const CLASS_TRANSFORMER_OPTIONS: Readonly<ClassTransformerOptions> = {
  excludeExtraneousValues: true,
  enableImplicitConversion: true,
  exposeDefaultValues: true
};
export const CLASS_VALIDATOR_OPTIONS: Readonly<ClassValidatorOptions> = {
  validationError: { target: false }
};

export const EARTHS_RADIUS_IN_KM = 6371;
