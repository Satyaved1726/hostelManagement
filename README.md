# HostelManagement

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 12.2.10.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.



## Getting Started
    git clone
    npm i
    cp .env.sample .env

## Run (development)

On Windows PowerShell, Angular 12 + older webpack may fail on recent Node versions with an OpenSSL error. Two options:

- Quick workaround (use OpenSSL legacy provider for current Node):

```powershell
$env:NODE_OPTIONS = '--openssl-legacy-provider'
npm run server    # starts the API (nodemon)
npm start         # in a second terminal to run Angular dev server
```

- Easier (script) — the repo includes scripts that set this automatically:

```powershell
npm run server    # starts API with the flag
npm run ng-serve-legacy  # starts Angular dev server with the flag
# or run both together:
npm run dev
```

Recommendation: For the smoothest experience, install Node 16.x LTS (which this Angular version targets). Use nvm or nvm-windows to manage Node versions. Using Node 16 removes the need for the OpenSSL legacy workaround.
