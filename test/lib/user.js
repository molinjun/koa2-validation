const _ = require("lodash");
const Joi = require("@hapi/joi");
const v = {};
exports.v = v;

const users = [
  {
    id: "001",
    name: "dennis1",
    age: 18
  },
  {
    id: "002",
    name: "dennis2",
    age: 20
  }
];

v.addUser = {
  body: {
    id: Joi.string().required(),
    name: Joi.string(),
    age: Joi.number()
  }
};
exports.addUser = async ctx => {
  const user = ctx.request.body;
  users.push(user);
  ctx.body = { success: true, data: users };
};

v.getUserInfo = {
  params: {
    id: Joi.string()
      .valid(["001", "002"])
      .required()
  }
};
exports.getUserInfo = async ctx => {
  const { id } = ctx.params;
  const user = _.find(users, u => u.id === id);
  ctx.body = { success: true, data: user };
};

v.getUserList = {
  query: {
    age: Joi.number()
  }
};
exports.getUserList = async ctx => {
  const { age } = ctx.query;
  const userList = _.filter(users, u => u.age >= age);
  ctx.body = { success: true, data: userList };
};
