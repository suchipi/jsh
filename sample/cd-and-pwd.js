#!/usr/bin/env jsh
/// <reference types="@suchipi/jsh" />

echo(pwd());
cd(__dirname);
echo(pwd());
cd("../..");
echo(pwd());
