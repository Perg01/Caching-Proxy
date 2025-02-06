import express from "express";
import { Request, Response } from "express";
import dotenv from "dotenv";
import axios from "axios";
import { LRUCache } from "lru-cache";

dotenv.config();
const PORT = process.env.PORT;

export function proxyServer(options: {
  origin: string;
  port: number;
  clearCache: boolean;
}) {
  console.log("OPTIONS inside proxyServer: ", options);
  const app = express();
  const cache = new LRUCache({
    max: 100,
    ttl: 1000 * 60 * 5,
  });

  app.get("*", async (req: Request, res: Response) => {
    const cachedKey = req.url;
    const cachedResponse = cache.get(cachedKey); // getting the extension

    if (cachedResponse) {
      console.log(`Cache HIT for: ${cachedKey}`);
      res.send(cachedResponse);
      return;
    }

    try {
      const baseUrl = new URL(options.origin);
      const url = new URL(req.baseUrl, baseUrl.href);
      // console.log(`Request URL: ${req.url}`);
      // console.log(`Base Origin: ${options.origin}`);
      // console.log(`Final URL requested from origin: ${url.href}`);

      const response = await axios.get(url.href, {
        headers: {
          ...req.headers,
          host: new URL(options.origin).host,
        },
      });

      console.log(`Cache MISS for: ${cachedKey}`);
      console.log(`Forwarding request to: ${url}`);

      cache.set(cachedKey, {
        headers: response.headers,
        data: response.data,
        status: response.status,
      });

      res.status(response.status).send(response.data);
    } catch (error: any) {
      console.error("Error fetching from origin:", error.message);
      if (error.response) {
        res.status(error.response.status).send(error.response.data);
      } else {
        res.status(500).send("Internal Server Error");
      }
    }
  });

  app.get("/clear-cache", (req: Request, res: Response) => {
    console.log("Clearing cache...");
    cache.clear();
    res.send("Cache cleared!");
  });

  app.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`);
  });
}
