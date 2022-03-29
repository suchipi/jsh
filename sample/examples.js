#!/usr/bin/env jsh
/// <reference types="@suchipi/jsh" />

// that <reference> comment is optional.
// it gives you typescript autocomplete/awareness for jsh's globals

// echo is the same as console.log
echo("hi");

// exec runs the command via bash -c
exec(`bc <<< "2 + 2"`); // prints 4

// $ is like exec but doesn't print stdout
const result = $(`bc <<< "2 + 2"`);
echo(result);
// [String: '4\n'] {
//   status: 0,
//   signal: null,
//   output: [ null, '4\n', '' ],
//   pid: 17510,
//   stdout: '4\n',
//   stderr: '',
//   toArray: [Function: toArray]
// }

// toArray trims output and splits on whitespace
const files = $(`ls`).toArray();

// since echo is just console.log, it can print non-strings, too
echo(files);
// [
//   'index.d.ts',
//   'index.js',
//   'node_modules',
//   'package.json',
//   'package-lock.json',
//   'sample'
// ]

// all node builtins are available as globals
assert(typeof require === "function");

// you have __filename and __dirname like in node.
echo(__filename);

// cd and pwd do what you'd expect
echo(pwd());
cd("sample");
echo(pwd());

// absPath resolves a relative path into an absolute one.
// absPath always resolves relative to the file it was
// called from (ie. your script), regardless of pwd.
echo(absPath(".."));

// You can mix objects and arrays in `exec` and `$` args.
// Arrays get flattened in, and object get converted to "--flags"
exec("ls", { a: true }, ["-l"], { color: "auto" });
// runs ls -a -l --color=auto
