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
    console.log("OPTIONS inside proxyServer: ", options);
    const app = (0, express_1.default)();
    const cache = new lru_cache_1.LRUCache({
        max: 100,
        ttl: 1000 * 60 * 5,
    });
    app.get("/clear-cache", (req, res) => {
        console.log("Clearing cache...");
        cache.clear();
        res.send("Cache cleared!");
    });
    app.get("*", (req, res) => __awaiter(this, void 0, void 0, function* () {
        const cachedKey = req.url;
        const cachedResponse = cache.get(cachedKey);
        if (cachedResponse) {
            console.log(`Cache HIT for: ${cachedKey}`);
            res.send(cachedResponse);
            return;
        }
        try {
            const baseUrl = new URL(options.origin);
            const url = new URL(req.baseUrl, baseUrl.href);
            const response = yield axios_1.default.get(url.href, {
                headers: Object.assign(Object.assign({}, req.headers), { host: new URL(options.origin).host }),
            });
            console.log(`Cache MISS for: ${cachedKey}`);
            console.log(`Forwarding request to: ${url}`);
            cache.set(cachedKey, {
                headers: response.headers,
                data: response.data,
                status: response.status,
            });
            res.status(response.status).send(response.data);
        }
        catch (error) {
            console.error("Error fetching from origin:", error.message);
            if (error.response) {
                res.status(error.response.status).send(error.response.data);
            }
            else {
                res.status(500).send("Internal Server Error");
            }
        }
    }));
    app.listen(PORT, () => {
        console.log(`Listening on http://localhost:${PORT}`);
    });
}
