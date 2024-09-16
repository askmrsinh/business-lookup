import Router from 'express-promise-router';
import { Request, Response } from 'express';
import { DiscoveryQueryDto } from '../dtos';
import { BusinessEntity } from '../entities';
import { QueryOrder } from '@mikro-orm/better-sqlite';
import { transformThenValidate, transformValidationErrors } from '../utils';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  const { data, errors } = transformThenValidate(DiscoveryQueryDto, req.query);

  return errors.length > 0
    ? res
        .status(400)
        .json({ message: 'Invalid request.', error: transformValidationErrors(errors) })
    : req.em
        .getRepository(BusinessEntity)
        .addSelectDistance(data.lat, data.long)
        .addSelect(['name', 'latitude', 'longitude', 'distance'])
        .orderBy({ distance: QueryOrder.ASC })
        .limit(data.limit)
        .where(data.type != null ? { type: data.type } : {})
        .execute()
        .then((r) => res.json(r))
        .catch((err) => res.status(400).json({ error: err.message }));
});

export const DiscoveryController = router;
