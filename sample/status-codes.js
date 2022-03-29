#!/usr/bin/env jsh
/// <reference types="@suchipi/jsh" />

const result = exec("false");
console.log(result.status);

const result2 = exec("true");
console.log(result2.status);
