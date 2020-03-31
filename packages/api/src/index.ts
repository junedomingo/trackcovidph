import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import http from 'http';
import { buildSchema } from 'type-graphql';
import * as dotenv from 'dotenv';
dotenv.config();

import { ArcGISApi } from './datasources/ArcGISApi';
import {
  ConfirmedByHealthFacilityResolver,
  ConfirmedByResidenceResolver,
  ConfirmedForeignNationalsResolver,
  ConfirmedLocalsResolver,
  ConfirmedOFWsResolver,
  CountResolver,
  PUIsByHealthFacilityResolver,
} from './resolvers';

(async () => {
  const port = process.env.PORT || 8001;
  const app = express();
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [
        ConfirmedLocalsResolver,
        CountResolver,
        ConfirmedByHealthFacilityResolver,
        PUIsByHealthFacilityResolver,
        ConfirmedByResidenceResolver,
        ConfirmedOFWsResolver,
        ConfirmedForeignNationalsResolver,
      ],
      validate: true,
    }),
    dataSources: () => ({ ArcGISApi: new ArcGISApi() }),
    playground: true,
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
    console.log(`Server started at http://localhost:${port}${apolloServer.graphqlPath}`)
  );
})();