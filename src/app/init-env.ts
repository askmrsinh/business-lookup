import { CLASS_TRANSFORMER_OPTIONS, CLASS_VALIDATOR_OPTIONS } from '../constants';
import { Environment } from '../config/environment';
import { logger } from '../utils/loggers';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

export async function initEnv() {
  try {
    const env = plainToInstance(Environment, process.env, CLASS_TRANSFORMER_OPTIONS);
    await validate(env, CLASS_VALIDATOR_OPTIONS);
    return env;
  } catch (e) {
    logger.error(e, 'failed to initialize ENV');
    throw e;
  }
}
