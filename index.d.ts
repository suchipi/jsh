/**
 * The value returned from `exec` or `$`.
 *
 * the `String &` part is the same as `stdout`.
 */
declare type ExecResult = String & {
  pid: number;
  output: Array<string | null>;
  stdout: string;
  stderr: string;
  status: number | null;
  signal: NodeJS.Signals | null;
  toArray: () => Array<string>;
};

/**
 * Write the string plus a newline to stdout.
 *
 * Same as console.log.
 *
 * To not write a newline, use process.stdout.write.
 */
declare var echo: (...args: any) => void;

/**
 * Runs the passed command via `bash -c`. Returns stdout as a string. If the command writes to stdout/stderr, it will be printed.
 *
 * To run a command without printing stdout from the command, use {@link $}.
 */
declare var exec: (...args: any) => ExecResult;

/**
 * Like {@link exec}, but doesn't print stdout (still prints stderr, though).
 */
declare var $: (...args: any) => ExecResult;

/**
 * Resolves a relative path into an absolute path.
 *
 * If `pathString` isn't passed, absPath returns the absolute path to the file that called absPath.
 *
 * If `relativeTo` isn't passed, `pathString` will be resolved relative to the path containing the file where absPath was called (as if __dirname had been passed as `relativeTo`).
 */
declare var absPath: (pathString?: string, relativeTo?: string) => string;

/**
 * Read a file's contents into a string.
 *
 * Wrapper around fs.readFileSync. Reads the file as utf-8.
 */
declare var readFile: (file: string) => string;

/**
 * Writes a string or Buffer into a file.
 *
 * Wrapper around fs.writeFileSync.
 */
declare var writeFile: (file: string, data: string | Buffer) => void;

/**
 * Wraps a string in double-quotes, escaping any double-quotes within
 */
declare var quote: (input: string) => string;

/**
 * Removes one or more files or folders.
 *
 * Each string in `args` should be either "-rf", "-r", "-f", "-fr", or a
 * filesystem path. Glob strings are *not* supported; use `exec` to run your
 * OS's native `rm` command if you need those (or use a globbing library).
 *
 * Example:
 * ```ts
 * rm("-rf", "build", "dist");
 * ```
 */
declare var rm: (...args: Array<string>) => void;

/**
 * Changes the current working directory for all commands.
 */
declare var cd: (somePath: string) => void;

/**
 * Returns the current working directory as a string.
 */
declare var pwd: () => string;

/**
 * Converts an object into an array of command-line argument strings.
 *
 * For example, objToArgs({ color: "auto" }) becomes ["--color=auto"].
 *
 * valueSeparator defaults to "=".
 */
declare var objToArgs: (
  obj: {
    [key: string]: string | number | boolean | null | undefined;
  },
  valueSeparator?: string
) => Array<string>;

/**
 * Resolves a glob string (or set of glob strings) into an array of filesystem paths.
 *
 * Example:
 *
 * ```ts
 * const files = glob("./dist/**\/*");
 * echo(files);
 * ```
 *
 * `glob` is an alias for [globby](https://www.npmjs.com/package/globby) 11's "sync" function.
 */
declare var glob: typeof import("globby")["sync"];

declare var assert: typeof import("assert");
declare var async_hooks: typeof import("async_hooks");
declare var buffer: typeof import("buffer");
declare var child_process: typeof import("child_process");
declare var cluster: typeof import("cluster");
// This one gets overridden with the normal console
// declare var console: typeof import("console");
declare var constants: typeof import("constants");
// This is here, but typescript doesn't like it
// declare var crypto: typeof import("crypto");
declare var dgram: typeof import("dgram");
declare var diagnostics_channel: typeof import("diagnostics_channel");
declare var dns: typeof import("dns");
declare var domain: typeof import("domain");
declare var events: typeof import("events");
declare var fs: typeof import("fs");
declare var http: typeof import("http");
declare var http2: typeof import("http2");
declare var https: typeof import("https");
declare var inspector: typeof import("inspector");
// This is here, but typescript doesn't like it
// declare var module: typeof import("module");
declare var net: typeof import("net");
declare var os: typeof import("os");
declare var path: typeof import("path");
declare var perf_hooks: typeof import("perf_hooks");
declare var process: typeof import("process");
declare var punycode: typeof import("punycode");
declare var querystring: typeof import("querystring");
declare var readline: typeof import("readline");
declare var repl: typeof import("repl");
declare var stream: typeof import("stream");
declare var string_decoder: typeof import("string_decoder");
declare var timers: typeof import("timers");
declare var tls: typeof import("tls");
declare var trace_events: typeof import("trace_events");
declare var tty: typeof import("tty");
declare var url: typeof import("url");
declare var util: typeof import("util");
declare var v8: typeof import("v8");
declare var vm: typeof import("vm");
declare var worker_threads: typeof import("worker_threads");
declare var zlib: typeof import("zlib");
