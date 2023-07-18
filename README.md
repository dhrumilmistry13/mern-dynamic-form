
# Welcome to Dynamic Form Create with MERN!

This repository provides a full stack boilerplate with React, Redux, Express, Mongoose and JWT. It aims to provide a starting point with preconfigured project structure, common libraries, and best practices to kickstart your MERN development process.

## Table of Contents
* [Getting Started](#getting-started)
* [Softwares and Version Install](#software-and-version-install)
* [Clone Project](#clone-project)
* [Features](#features)
* [Folder Structure](#folder-structure)
* [Dependencies](#dependencies)
* [LICENSE](#license)

## Getting Started

This project is a starting point for a Web application.

A few resources to get you started if this is your first MERN Project :

- [MongoDB Documentation](https://www.mongodb.com/docs/)
- [Express JS Documentation](https://expressjs.com/en/starter/installing.html)
- [React JS Developer Documentation](https://react.dev/learn/start-a-new-react-project)
- [Node JS Documentation](https://nodejs.org/en/docs/guides)

For help getting started with React js development, refer to the [official React JS documentation](https://react.dev/learn/start-a-new-react-project), which provides samples, guidance on web development, and a comprehensive API reference.

# Softwares and Version Install:

- [Install Node JS](https://nodejs.org/en/download/current)
- [Install MongoDB](https://www.mongodb.com/docs/manual/installation/)

# Clone Project :

git clone https://github.com/TechnourceOfficial/Technource-Mern-Boiler

To clone the project, simply run:

```bash
git clone https://github.com/TechnourceOfficial/Technource-Mern-Boiler

cd Technource-Mern-Boiler
```

To install React Js dependencies

```bash
cd admin

npm install
```
To install Node Js dependencies

```bash
cd new-server

npm install

```

# Folder Structure:
```commandline
.
├── admin                    - Folder which react js example
│   ├── public
|       ├── index.html
│   |── src   
|       ├── api
|       ├── assets
|       ├── common
|       ├── config
|       ├── helpers
|       ├── hooks
|       ├── libs
|       ├── locales
|       ├── pages
|       ├── routes
|       ├── store
|       ├── index.js
│   ├── jsconfig.json
|   ├── package-lock.json
|   ├── package.json
├── server                  - Folder which node-express example 
|   ├── app
|       ├── controllers
|       ├── models
|       ├── routes
|   ├── config
|   ├── schema
|   ├── api.js
|   ├── package-lock.json
|   ├── package.json
|   ├── server.js 
├── .gitignore
├── README.md      - File for gradle configuration
```
## Features

- **NoSQL database**: [MongoDB](https://www.mongodb.com) object data modeling using [Mongoose](https://mongoosejs.com)
- **Authentication and authorization**: using [JWT](https://jwt.io/)
- **Validation**: request data validation using [Joi](https://github.com/hapijs/joi)
- **Error handling**: centralized error handling mechanism
- **Dependency management**: with [NPM](https://www.npmjs.com/)
- **Environment variables**: using [dotenv](https://github.com/motdotla/dotenv)
- **Security**: set security HTTP headers using [helmet](https://helmetjs.github.io)
- **CORS**: Cross-Origin Resource-Sharing enabled using [cors](https://github.com/expressjs/cors)
- **Git hooks**: with [husky](https://github.com/typicode/husky) and [lint-staged](https://github.com/okonet/lint-staged)
- **Linting**: with [ESLint](https://eslint.org) and [Prettier](https://prettier.io)
- **Editor config**: consistent editor configuration using [EditorConfig](https://editorconfig.org)

## Commands

Run React project:

```bash
cd admin

npm run start
```
Run server APIs

```bash
cd server

npm run start
```

## License

- This project is licensed under the [MIT License](LICENSE)