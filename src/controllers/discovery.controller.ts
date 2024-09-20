import type { Request, Response } from 'express';
import Router from 'express-promise-router';
import { DiscoveryQueryDto } from '../dtos';
import { transformThenValidate, transformValidationErrors } from '../utils';
import { DiscoveryService } from '../services';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  const { data, errors } = transformThenValidate(DiscoveryQueryDto, req.query);

  return errors.length > 0
    ? res
        .status(400)
        .json({ message: 'Invalid request.', error: transformValidationErrors(errors) })
    : await DiscoveryService.getNearbyBusinesses(data, req.orm.em)
        .then((r) => res.json(r))
        .catch((err) => res.status(400).json({ error: err.message }));
});

export const DiscoveryController = router;
