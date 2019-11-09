## koa2-validation
[![npm](https://img.shields.io/npm/dt/koa2-validation.svg)](https://www.npmjs.com/package/koa2-validation)
[![Build Status](https://api.travis-ci.org/gedennis/koa2-validation.svg?branch=master&name=dennis)](https://travis-ci.org/gedennis/koa2-validation) 
[![Coverage Status](https://coveralls.io/repos/github/gedennis/koa2-validation/badge.svg?branch=master)](https://coveralls.io/github/gedennis/koa2-validation?branch=master) [![Greenkeeper badge](https://badges.greenkeeper.io/gedennis/koa2-validation.svg)](https://greenkeeper.io/)  

<a href="https://communityinviter.com/apps/koa-js/koajs" rel="KoaJs Slack Community">![KoaJs Slack](https://img.shields.io/badge/Koa.Js-Slack%20Channel-Slack.svg?longCache=true&style=for-the-badge)</a>
 
koa2-validation is a koa2 middleware to validate the request with Joi. Support `body`, `params`, `query` for Now.  
Inspired by [express-validation](https://github.com/andrewkeig/express-validation).

## Version Tips
As new version [Joi](https://hapi.dev/family/joi/?v=16.1.7) has some breaking changes, some old schema is not workable. To avoid the big change for using legacy koa2-validation version, you need to update your code as follows, if you want to use new version Joi.

```
// default
const validate = require('koa2-validation');

// with specific Joi 
const joi = require("@hapi/joi");
const Validation = require("koa2-validation").Validation;
const validator = new Validation(joi);
const validate = validator.validate.bind(validator);
```
> Please use the same Joi version when define your joi schema!!!

## Usage
Install with npm:
```sh
npm i -S koa2-validation
```
Then, you can use koa2-valition to configure the validation schemas in routes. The example below is to 
define three validations about user.  
**file**: [`test/lib/server.js`](test/lib/server.js)
```js
const http = require('http');
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const router = require('koa-router')();
const validate = require('koa2-validation'); // 1. import the koa2-validation

const user = require('./user');


router.post('/users', validate(user.v.addUser), user.addUser);  // 3. setup the validate middleware
router.get('/users/:id', validate(user.v.getUserInfo), user.getUserInfo);
router.get('/users', validate(user.v.getUserList), user.getUserList);

const app = new Koa();

// error handler
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || err.code;
    ctx.body = {
      success: false,
      message: err.message,
    };
  }
});
app.use(bodyParser()); // bodyParser should be before the routers
app.use(router.routes());

const server = http.createServer(app.callback());
module.exports = server;
```
You still need to define the validation schema in your controllers, as follows:  
**file**: [`test/lib/user.js`](test/lib/user.js)
```js
const _ = require('lodash');
const Joi = require('joi');

const v = {};
exports.v = v;

const users = [{
  id: '001',
  name: 'dennis1',
  age: 18,
}, {
  id: '002',
  name: 'dennis2',
  age: 20,
}];

// 2. define the validation schema
v.addUser = {
  body: {
    id: Joi.string().required(),
    name: Joi.string(),
    age: Joi.number(),
  },
};
exports.addUser = async (ctx) => {
  const user = ctx.request.body;
  users.push(user);
  ctx.body = { success: true, data: users };
};
```
The validation schema is followed by [Joi](https://github.com/hapijs/joi). You can define more effective schemas 
based on joi docs.

## Error handler
When bad request, koa2-validation has catched the error, and throw a standard Error instance, which has an attr **status** 400.
```js
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || err.code;
    ctx.body = {
      success: false,
      message: err.message,
    };
  }
});
```
## Example
In the test foler, I made a demo about user management. You can get how to use koa2-validation from it.
If you have some questions, you can post an issue.

