"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.proxyServer = proxyServer;
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const axios_1 = __importDefault(require("axios"));
const lru_cache_1 = require("lru-cache");
dotenv_1.default.config();
const PORT = process.env.PORT;
function proxyServer(options) {
    const app = (0, express_1.default)();
    const cache = new lru_cache_1.LRUCache({ max: 100 });
    app.get("*", (req, res) => __awaiter(this, void 0, void 0, function* () {
        const originalUrl = new URL(options.origin);
        const url = new URL(req.originalUrl, originalUrl.href);
        const cachedResponse = cache.get(url);
        if (cachedResponse) {
            console.log(`Serving from cache: ${url}`);
            res.send(cachedResponse);
        }
        else {
            try {
                console.log(`Forwarding request to: ${url.href}`);
                const response = yield axios_1.default.get(url.href);
                cache.set(url, response.data);
                res.send(response.data);
            }
            catch (error) {
                console.error(error);
                res.status(500).send("Internal Server Error");
            }
        }
    }));
    app.listen(PORT, () => {
        console.log(`Listening on http://localhost:${PORT}`);
    });
}
