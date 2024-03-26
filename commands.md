# Vector Dev

## TypeScript

TypeScript is a superset of JavaScript that adds static typing, enabling developers to catch errors early, enhance code quality, and improve maintainability in large-scale applications.

Install TypeScript

```bash
npm install --save-dev typescript

npm install --save-dev @types/react @types/react-native
```

Check your TypeScript files compile without errors

```bash
npx tsc
```

## Eslint

ESLint is a static code analysis tool for JavaScript and TypeScript that helps developers identify and fix code quality issues, enforce coding standards, and ensure consistent coding practices within a project.

Installing ESLint

```bash
npm install eslint --save-dev
```

Lint all files in current directory. This will give you all the errors but not actually fix anything.

```bash
npx eslint .
```

Fix all linting errors in current directory.

```bash
npx eslint --fix .
```

## Prettier

Run prettier on src directory

```bash
npx prettier src --write
```

## Jest

Jest is a JavaScript testing framework developed by Facebook, designed for simplicity and speed, enabling developers to write unit and integration tests for their applications.

Install Jest

```bash
npm install --save-dev jest

npm install --save-dev jest ts-jest @types/jest
```

Run tests

```bash
npm test
```

## React Devtools

React DevTools is a browser extension and standalone tool that enables developers to inspect, debug, and profile React applications by providing insights into the component tree, state, and props.

Install React Devtools

```bash
npm install -g react-devtools
```

Start react devtools

```bash
react-devtools
```

Open debugger in ios

```bash
CMD + D
```

Open Debugger in Android

```bash
CMD + M
```

## Other

If everything goes to shit..

Delete these folders/files

```bash
rm -rf node_modules;
rm -rf ios/Pods;
rm ios/Podfile.lock;
rm -rf ~/Library/Developer/Xcode/DerivedData;
pod cache clean --all;
```

Re-install

```bash
yarn install
cd ios; pod install; cd ..;
```

## Swagger To Typescript

[Docs](https://www.npmjs.com/package/swagger-typescript-api)

Transform your swagger.json to typescript

```bash
npx swagger-typescript-api -p ../grau/docs/swagger.json -o ./src/services/api/swagger --sort-types --sort-routes  --enum-names-as-values --responses  --axios --modular --single-http-client  --debug
```

## sqlLite

Returns queries to delete all tables

```sql
SELECT 'DROP TABLE IF EXISTS ' || name || ';'
FROM sqlite_master
WHERE type = 'table' AND name != 'android_metadata';
```

## GRAU Migrations

To move all necessary changes to swagger and DB migrations from GRAU repo run the following command

```shell
bash ./excute_migrations.sh
```
