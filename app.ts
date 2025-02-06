import { Command } from "commander";
import { proxyServer } from "./index";

const program = new Command();
program
  .command("start")
  .requiredOption("--port <port>", "port number")
  .requiredOption("--origin <origin>", "origin url")
  .option("--clear-cache <clearcache>", "clear cache")
  .action((options) => {
    proxyServer(options);
  });
program.parse(process.argv);

// // const options = program.opts();
// console.log("Option: ", options);
