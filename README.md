# Code Check Schematic

[![wercker status](https://app.wercker.com/status/d4569308a8ef68641442270e1f4935f6/m/master "wercker status")](https://app.wercker.com/project/byKey/d4569308a8ef68641442270e1f4935f6)

Schematic of auto code check settings in angular workspace. This schematics set these OSS.
 
* Prettier: code formatter
* StyleLint: Stylesheet code check (CSS or SCSS)
* TSLint: only prettier extends
* hasky & lint-staged: auto run before code commit

## ng add

```shell script
$ ng new <your ng ws name>
$ cd <your ng ws>
$ ng add @kfn-modern-dx/code-check-schematic
```

## option

|option|value|default|description|
|---|---|---|---|
|project|project name|workspace root name|The name of the project to which settings are added.|
|style|`css`&#124;`scss`|`css`|style sheet type. Use setting .stylelintrc.json 

## npm script

This schematics add these npm scripts.

* `lint:ts`: Lint ts files with TSLint, same as default `lint` command.
* `lint:style`: Lint stylesheet with StyleLint. 
* `format`: Code format with prettier.

and change the `lint` command so that tslint and style lint are executed. 

All file format example.
```shell script
$  npm run format -- src/**/*.{ts,scss,css}
```
 
## Auto code check

Prettier and Lint execute before `git commit`. Developer can't commit if d'not pass code check. 
This helps keep the repository clean.

## Feature

* Auto detect project stylesheet type.
* Add stylelint settings other than CSS and SCSS.
