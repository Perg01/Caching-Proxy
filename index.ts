import express from "express";
import { Request, Response } from "express";
import dotenv from "dotenv";
import axios from "axios";
import { LRUCache } from "lru-cache";

dotenv.config();
const PORT = process.env.PORT;

export function proxyServer(options: any) {
  const app = express();
  const cache = new LRUCache({ max: 100 });

  app.get("*", async (req: Request, res: Response) => {
    const originalUrl = new URL(options.origin);
    const url = new URL(req.originalUrl, originalUrl.href);
    const cachedResponse = cache.get(url);

    if (cachedResponse) {
      console.log(`Serving from cache: ${url}`);
      res.send(cachedResponse);
    } else {
      try {
        console.log(`Forwarding request to: ${url.href}`);
        const response = await axios.get(url.href);
        cache.set(url, response.data);
        res.send(response.data);
      } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
      }
    }
  });

  app.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`);
  });
}
