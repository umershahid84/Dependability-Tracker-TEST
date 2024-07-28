"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startServer = exports.checkForTLS = void 0;
require("dotenv/config");
const next_1 = __importDefault(require("next"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const ip_1 = require("./ip");
const fs = __importStar(require("fs"));
const url_1 = require("url");
const path = __importStar(require("path"));
const connection_1 = __importDefault(require("../lib/db/connection"));
const express_1 = __importDefault(require("express"));
const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const checkForTLS = () => {
    let hasSupportForTLS = false;
    const tlsOptions = {
        key: '',
        cert: ''
    };
    const keyPath = path.join(process.cwd(), 'cert', 'private_key.pem');
    const certPath = path.join(process.cwd(), 'cert', 'certificate.pem');
    if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
        tlsOptions.key = fs.readFileSync(keyPath);
        tlsOptions.cert = fs.readFileSync(certPath);
        hasSupportForTLS = true;
    }
    return { hasSupportForTLS, tlsOptions };
};
exports.checkForTLS = checkForTLS;
const nextExpress = async (expressApp) => {
    const dev = !IS_PRODUCTION;
    const nextApp = (0, next_1.default)({ dev, hostname: 'localhost', port: PORT });
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
    // start the next functionality and bootstrap it to the express server
    await nextExpress(app);
    // start the http server
    await new Promise(resolve => httpServer.listen({ port: PORT }, resolve));
    console.log(`\n🚀 LocalHost Server ready at http://localhost:${PORT}\n`); //NOSONAR
    // check for TLS support
    const { hasSupportForTLS, tlsOptions } = (0, exports.checkForTLS)();
    if (hasSupportForTLS) {
        const hostIP = ip_1.ip;
        const TLS_PORT = PORT + 5;
        const https = require('https');
        const httpsServer = https.createServer(tlsOptions, app);
        await new Promise(resolve => httpsServer.listen({ port: TLS_PORT }, resolve));
        console.log(`🔒 Local Network Server ready at https://${hostIP}:${TLS_PORT}\n`); //NOSONAR
    }
};
exports.startServer = startServer;
if (require.main === module)
    (0, exports.startServer)();
