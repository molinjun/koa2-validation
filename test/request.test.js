import test from 'ava';

const helper = require('./lib/helper');

const urls = {
  addUser: '/users',
  getUserInfo: '/users/{id}', // hard code now
  getUserList: '/users',
};

// about body
test('addUser: should failed when request body is lack of id', async (t) => {
  const { body, statusCode } = await helper.request({
    url: urls.addUser,
    method: 'post',
    data: {
      name: 'dennis3',
      age: 30,
    },
    qs: {},
  });

  t.is(statusCode, 400);
  t.false(body.success);
  t.is(body.message, 'id is required');
});

test('addUser: should be ok  when body is valid', async (t) => {
  const { body, statusCode } = await helper.request({
    url: urls.addUser,
    method: 'post',
    data: {
      id: '003',
      name: 'dennis3',
      age: 30,
    },
    qs: {},
  });
  t.is(statusCode, 200);
  t.true(body.success);
});

// about params
test('getUserInfo: should failed when invalid params', async (t) => {
  const id = null;
  const url = urls.getUserInfo.replace('{id}', id);
  const { body, statusCode } = await helper.request({
    url,
    method: 'get',
    data: {},
    qs: {},
  });
  t.is(statusCode, 400);
  t.false(body.success);
  t.is(body.message, 'id must be one of [001, 002]');
});

test('getUserInfo: should return the user when params is valid', async (t) => {
  const id = '001';
  const url = urls.getUserInfo.replace('{id}', id);
  const { body, statusCode } = await helper.request({
    url,
    method: 'get',
    data: {},
    qs: {},
  });

  t.is(statusCode, 200);
  t.true(body.success);
  t.is(body.data.id, id);
});

// about query
test('getUserList: should failed when invalid age in query', async (t) => {
  const { body, statusCode } = await helper.request({
    url: urls.getUserList,
    method: 'get',
    qs: { age: 'dd' },
  });
  t.is(statusCode, 400);
  t.false(body.success);
  t.is(body.message, 'age must be a number');
});

test('getUserList: should return users whose age are greater than 10', async (t) => {
  const { body, statusCode } = await helper.request({
    url: urls.getUserList,
    method: 'get',
    qs: { age: 10 },
  });

  t.is(statusCode, 200);
  t.true(body.success);
});
