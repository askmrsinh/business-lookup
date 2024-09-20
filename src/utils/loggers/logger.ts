import pino from 'pino';

export const logger = pino({
  name: 'app',
  customLevels: { information: pino.levels.values['info'], warning: pino.levels.values['warn'] }
});
