import { Command } from "commander";
import { proxyServer } from "./index";

const program = new Command();

program
  .option("--port <port>", "port number")
  .option("--origin <origin>", "origin url")
  .option("--clear-cache", "clear cache");

program.parse();

const options = program.opts();
proxyServer(options);
