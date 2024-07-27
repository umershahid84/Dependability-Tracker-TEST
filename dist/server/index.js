"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startServer = void 0;
require("dotenv/config");
const next_1 = __importDefault(require("next"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const url_1 = require("url");
const connection_1 = __importDefault(require("../lib/db/connection"));
const express_1 = __importDefault(require("express"));
// import * as fs from 'fs';
// import * as path from 'path';
const PORT = process.env.PORT ?? 3001;
const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const nextExpress = async (expressApp) => {
    const dev = !IS_PRODUCTION;
    const nextApp = (0, next_1.default)({ dev, hostname: 'localhost', port: parseInt(PORT, 10) });
    await nextApp.prepare();
    const handle = nextApp.getRequestHandler();
    // @ts-ignore
    expressApp.get('*', async (req, res) => {
        const parsedUrl = (0, url_1.parse)(req.url, true);
        const { pathname, query } = parsedUrl;
        if (pathname === '/a') {
            await nextApp.render(req, res, '/a', query);
        }
        else if (pathname === '/b') {
            await nextApp.render(req, res, '/b', query);
        }
        else {
            await handle(req, res, parsedUrl);
        }
    });
    // allow next to handle all requests
    expressApp.all('*', async (req, res) => {
        return await handle(req, res);
    });
};
const startServer = async () => {
    // http and express server
    const app = (0, express_1.default)();
    const httpServer = http_1.default.createServer(app);
    app.set('port', PORT);
    app.disable('x-powered-by');
    app.disable('etag');
    app.use((0, cors_1.default)());
    app.use(express_1.default.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));
    app.use(express_1.default.json({ limit: '50mb' }));
    // await successful connection to the database
    await connection_1.default.sync({ force: false });
    await nextExpress(app);
    // start the http server
    await new Promise(resolve => httpServer.listen({ port: PORT }, resolve));
    !IS_PRODUCTION && console.log(`🚀 Development Server ready at http://localhost:${PORT}\n`); //NOSONAR
};
exports.startServer = startServer;
if (require.main === module)
    (0, exports.startServer)();
