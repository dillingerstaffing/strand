#!/usr/bin/env node

import { init } from "./commands/init.js";
import { add } from "./commands/add.js";
import { list } from "./commands/list.js";

const HELP = `strand - CLI for adding Strand UI components to your project

Usage:
  strand <command> [options]

Commands:
  init              Set up tokens and base styles
  add <component>   Copy a component into your project
  list              List all available components
  help              Show this help message

Examples:
  strand init
  strand add button
  strand list

https://dillingerstaffing.com/labs/strand
`;

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const command = args[0];

  switch (command) {
    case "init":
      await init();
      break;
    case "add":
      await add(args[1]);
      break;
    case "list":
      await list();
      break;
    case "help":
    case "--help":
    case "-h":
    case undefined:
      console.log(HELP);
      break;
    default:
      console.error(`Unknown command: "${command}"`);
      console.log(HELP);
      process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
