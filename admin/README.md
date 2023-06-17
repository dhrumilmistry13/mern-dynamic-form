# Telepath Admin

Clone down this repository. You will need `node` and `npm` installed globally on your machine.

## Requirements

- Node with minimum version **v16.15.0**

- Npm with minimum version **8.5.5**

## Installation:

Install all packages:
​

    npm  install

To create build:
​

    npm  run  build

​
To start the server:
​

    npm  start

To Visit App:​

    http://localhost:3002/

create **index.js** file in path **./src/config/**
add below code in that file

    export  const  API_URL  =  'http://localhost:3001/api/v1/';

    export  const  WEB_URL  =  'http://127.0.0.1:3002';

    export  const  USER_STAGE  =  {

        AUTH:  'AUTH',

    	DASHBOARD:  'DASHBOARD',

    };

**API_URL** will be as per your Node server API URL
