"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const index_1 = require("./index");
const program = new commander_1.Command();
program
    .command("start")
    .requiredOption("--port <port>", "port number")
    .requiredOption("--origin <origin>", "origin url")
    .action((options) => {
    (0, index_1.proxyServer)(options);
});
program.parse(process.argv);
