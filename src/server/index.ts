import 'dotenv/config';
import next from 'next';
import http from 'http';
import cors from 'cors';
import {ip} from './ip';
import * as fs from 'fs';
import {parse} from 'url';
import * as path from 'path';

import sequelize from '../lib/db/connection';
import express, {Express, Request, Response} from 'express';

const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

export const checkForTLS = (): {
  hasSupportForTLS: boolean;
  tlsOptions: {key: string | Buffer; cert: string | Buffer};
} => {
  let hasSupportForTLS = false;
  const tlsOptions: {key: string | Buffer; cert: string | Buffer} = {
    key: '',
    cert: ''
  };

  const keyPath: string = path.join(process.cwd(), 'cert', 'private_key.pem');
  const certPath: string = path.join(process.cwd(), 'cert', 'certificate.pem');

  if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
    tlsOptions.key = fs.readFileSync(keyPath);
    tlsOptions.cert = fs.readFileSync(certPath);
    hasSupportForTLS = true;
  }

  return {hasSupportForTLS, tlsOptions};
};

const nextExpress = async (expressApp: Express) => {
  const dev = !IS_PRODUCTION;
  const nextApp = next({dev, hostname: 'localhost', port: PORT});
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

  // allow next to handle all requests
  expressApp.all('*', async (req: Request, res: Response) => {
    return await handle(req, res);
  });
};

export const startServer = async () => {
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
  await sequelize.sync({force: false});
  // start the next functionality and bootstrap it to the express server
  await nextExpress(app);

  // start the http server
  await new Promise<void>(resolve => httpServer.listen({port: PORT}, resolve));
  console.log(`\n🚀 LocalHost Server ready at http://localhost:${PORT}\n`); //NOSONAR

  // check for TLS support
  const {hasSupportForTLS, tlsOptions} = checkForTLS();

  if (hasSupportForTLS) {
    const hostIP = ip;
    const TLS_PORT = PORT + 5;
    const https = require('https');
    const httpsServer = https.createServer(tlsOptions, app);
    await new Promise<void>(resolve => httpsServer.listen({port: TLS_PORT}, resolve));
    console.log(`🔒 Local Network Server ready at https://${hostIP}:${TLS_PORT}\n`); //NOSONAR
  }
};

if (require.main === module) startServer();
