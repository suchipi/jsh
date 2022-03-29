#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const child_process = require("child_process");
const vm = require("vm");
const { Module } = require("module");
const { formatError } = require("pretty-print-error");
const makeModuleEnv = require("make-module-env");
const cjs = require("commonjs-standalone");
const callerId = require("caller-id");

const quote = JSON.stringify.bind(JSON);

async function main() {
  let filename = process.argv[2];
  if (!filename) {
    throw new Error("Please specify a file to run.");
  }

  filename = absPath(filename, process.cwd());

  const builtins = {};
  for (const builtin of Module.builtinModules) {
    if (builtin != "sys" && !builtin.startsWith("_") && !/\//.test(builtin)) {
      builtins[builtin] = require(builtin);
    }
  }

  const globals = {
    ...makeModuleEnv(filename),
    ...builtins,

    console,

    quote,
    echo: console.log.bind(console),
    exec: (...args) => {
      const command = parseArgsToCommandLine(args);
      return doExec(command, false);
    },
    $: (...args) => {
      const command = parseArgsToCommandLine(args);
      return doExec(command, true);
    },
    absPath,
    readFile: (file) => {
      fs.readFileSync(file, "utf-8");
    },
    writeFile: (file, data) => {
      fs.writeFileSync(file, data);
    },
    cd: (somePath) => process.chdir(somePath),
    pwd: () => process.cwd(),
    objToArgs,
  };

  const context = vm.createContext(globals);

  const cjsDelegate = {
    resolve(id, fromFilePath) {
      const parent = new Module(fromFilePath, null);
      parent.filename = fromFilePath;
      return Module._resolveFilename(id, parent, false);
    },

    read(filepath) {
      let code = fs.readFileSync(filepath, "utf-8");

      if (code.charAt(0) === 0xfeff) {
        code = code.slice(1);
      }

      return code.replace(/^#![^\n]+\n/, "\n");
    },

    run(code, moduleEnv, filepath) {
      const wrapper = vm.runInContext(Module.wrap(code), context, {
        filename: filepath,
      });
      wrapper(
        moduleEnv.exports,
        moduleEnv.require,
        moduleEnv.module,
        moduleEnv.__filename,
        moduleEnv.__dirname
      );
    },
  };

  cjs.requireMain(filename, cjsDelegate);
}

function absPath(pathString, relativeTo) {
  if (pathString == null) {
    const data = callerId.getData();
    return data.filePath;
  }

  if (path.isAbsolute(pathString)) {
    return pathString;
  }

  if (relativeTo != null) {
    return path.resolve(relativeTo, pathString);
  }

  const data = callerId.getData();
  return path.resolve(path.dirname(data.filePath), pathString);
}

function parseArgsToCommandLine(args) {
  const realArgs = [];

  for (const arg of args) {
    if (typeof arg === "string") {
      realArgs.push(arg);
    } else if (Array.isArray(arg)) {
      realArgs.push(...arg.flat(Infinity));
    } else if (typeof arg === "object" && arg != null) {
      realArgs.push(...objToArgs(arg));
    } else {
      realArgs.push(String(arg));
    }
  }

  const command = realArgs.join(" ");

  return command;
}

function doExec(command, quiet) {
  const result = child_process.spawnSync("bash", ["-c", command], {
    maxBuffer: 1024 * 1024 * 1024,
    stdio: quiet ? "pipe" : "inherit",
    encoding: "utf-8",
  });

  if (result.error) {
    throw result.error;
  }

  return Object.assign(String(result.stdout || ""), result, {
    toArray: (delim = /\s+/g) => result.stdout.trim().split(delim),
  });
}

function objToArgs(obj, valueSeparator = "=") {
  const args = [];

  for (let [key, value] of Object.entries(obj)) {
    let toPush = "";

    if (key.length === 1) {
      toPush += "-" + key;
    } else {
      toPush += "--" + key;
    }

    if (value != true) {
      toPush += valueSeparator + value;
    }

    args.push(toPush);
  }

  return args;
}

main().catch((err) => {
  console.error(formatError(err));
});
