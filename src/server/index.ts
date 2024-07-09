import 'dotenv/config';
import {parse} from 'url';
import next from 'next';
import http from 'http';
import cors from 'cors';
// import * as fs from 'fs';
// import * as path from 'path';

import bodyParser from 'body-parser';
import {getSequelize} from '../lib/db';
import express, {Express, Request, Response} from 'express';

const PORT = process.env.PORT ?? 3001;
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

const nextExpress = async (expressApp: Express) => {
  const dev = !IS_PRODUCTION;
  const nextApp = next({dev});
  await nextApp.prepare();

  const handle = nextApp.getRequestHandler();
  // @ts-ignore
  expressApp.get('*', async (req: Request, res: Response) => {
    const parsedUrl = parse(req.url, true);
    const {pathname, query} = parsedUrl;
    if (pathname === '/a') {
      await nextApp.render(req, res, '/a', query);
    } else if (pathname === '/b') {
      await nextApp.render(req, res, '/b', query);
    } else {
      await handle(req, res, parsedUrl);
    }
  });
};

const startServer = async () => {
  // http and express server
  const app = express();
  const httpServer = http.createServer(app);

  app.set('port', PORT);
  app.disable('x-powered-by');
  app.disable('etag');
  app.use(cors());
  app.use(express.urlencoded({limit: '50mb', extended: true, parameterLimit: 50000}));
  app.use(express.json({limit: '50mb'}));
  // await successful connection to the database
  await getSequelize().sync({force: false});
  await nextExpress(app);
  // start the http server
  await new Promise<void>(resolve => httpServer.listen({port: PORT}, resolve));
  !IS_PRODUCTION && console.log(`🚀 Development Server ready at http://localhost:${PORT}\n`); //NOSONAR
};

startServer();
