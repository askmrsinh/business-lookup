import type { ValidationError } from 'class-validator';

/**
 * Converts an array of ValidationError objects into a more user-friendly format.
 *
 * @param errors - An array of {@link ValidationError} objects returned from class-validator,
 * typically after validating a class instance.
 * @returns An object where each key is the name of a property
 * that failed validation, and the value is an array of error messages associated with that property.
 *
 * @example
 * const errors = [
 *   {
 *     value: 200,
 *     property: 'lat',
 *     children: [],
 *     constraints: {
 *       isLatitude: 'lat must be a valid earth latitude',
 *       max: 'lat must not be greater than 90'
 *     }
 *   },
 *   {
 *     value: NaN,
 *     property: 'long',
 *     children: [],
 *     constraints: {
 *       isNumber: 'long must be a number',
 *       isLongitude: 'long must be a valid earth longitude',
 *       min: 'long must not be less than -180',
 *       max: 'long must not be greater than 180'
 *     }
 *   }
 * ];
 *
 * transformValidationErrors(errors);
 * // {
 * //   lat: [
 * //     'lat must be a valid earth latitude',
 * //     'lat must not be greater than 90'
 * //   ],
 * //   long: [
 * //     'long must be a number',
 * //     'long must be a valid earth longitude',
 * //     'long must not be less than -180',
 * //     'long must not be greater than 180'
 * //   ]
 * // }
 */
export function transformValidationErrors(errors: ValidationError[]): Record<string, string[]> {
  return errors.reduce(
    (acc, error) => {
      const property = error.property;
      acc[property] = error.constraints ? Object.values(error.constraints) : [];
      return acc;
    },
    {} as Record<string, string[]>
  );
}
