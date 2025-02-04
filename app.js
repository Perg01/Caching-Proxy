"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const index_1 = require("./index");
const program = new commander_1.Command();
program
    .option("--port <port>", "port number")
    .option("--origin <origin>", "origin url")
    .option("--clear-cache", "clear cache");
program.parse();
const options = program.opts();
(0, index_1.proxyServer)(options);
