import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import http from 'http';
import { buildSchema } from 'type-graphql';
import * as dotenv from 'dotenv';
import { redis } from './config';
import { Context } from 'apollo-server-core';
import { DataSources } from 'apollo-server-core/dist/graphqlOptions';

dotenv.config();
import { ArcGISApi } from './datasources/ArcGISApi';
import {
  ConfirmedPerHealthFacilityResolver,
  ConfirmedPerResidenceResolver,
  ConfirmedForeignNationalResolver,
  ConfirmedLocalResolver,
  ConfirmedOFWResolver,
  CountResolver,
  PUIsByHealthFacilityResolver,
} from './resolvers';
import { confirmedLocals, counts } from './utils/defaultQuery';
import { isProdEnv } from './utils';

(async (): Promise<void> => {
  const port = process.env.PORT || 8001;
  const baseUrl = `${process.env.BASE_URL}${!isProdEnv() ? `:${port}` : ''}`;

  const app = express();
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [
        ConfirmedLocalResolver,
        CountResolver,
        ConfirmedPerHealthFacilityResolver,
        PUIsByHealthFacilityResolver,
        ConfirmedPerResidenceResolver,
        ConfirmedOFWResolver,
        ConfirmedForeignNationalResolver,
      ],
      validate: true,
    }),
    context: ({ req, res }): Context => ({ req, res, redis }),
    dataSources: (): DataSources<Context> => ({ ArcGISApi: new ArcGISApi() }),
    cacheControl: {
      defaultMaxAge: 60 * 10, // 10mins
    },
    playground: {
      title: 'TrackCovidPH GraphQL API',
      tabs: [
        {
          endpoint: `${baseUrl}/graphql`,
          query: confirmedLocals,
        },
        {
          endpoint: `${baseUrl}/graphql`,
          query: counts,
        },
      ],
    },
  });

  apolloServer.applyMiddleware({
    app,
    cors: {
      origin: '*',
      optionsSuccessStatus: 200,
    },
  });

  const httpServer = http.createServer(app);

  apolloServer.installSubscriptionHandlers(httpServer);

  httpServer.listen(port, () =>
    console.log(`Server started at ${baseUrl}${apolloServer.graphqlPath}`)
  );
})();
