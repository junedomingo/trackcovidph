import { ArcGISApi } from '../../datasources';
import { Redis } from 'ioredis';
import { Request, Response } from 'express';

export interface AppContext {
  dataSources: {
    ArcGISApi: ArcGISApi;
  };
  req: Request;
  res: Response;
  redis: Redis;
}
