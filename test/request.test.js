const app = require("./lib/server");
const Helper = require("./lib/helper");

const helper = new Helper(app);
const urls = {
  addUser: "/users",
  getUserInfo: "/users/{id}", // hard code now
  getUserList: "/users"
};

// about body
test("addUser: should failed when request body is lack of id", async () => {
  const { body, statusCode } = await helper.request({
    url: urls.addUser,
    method: "post",
    data: {
      name: "dennis3",
      age: 30
    },
    qs: {}
  });
  expect(statusCode).toBe(400);
  expect(body.success).toBe(false);
  expect(body.message).toBe("id is required");
});

test("addUser: should be ok  when body is valid", async () => {
  const { body, statusCode } = await helper.request({
    url: urls.addUser,
    method: "post",
    data: {
      id: "003",
      name: "dennis3",
      age: 30
    },
    qs: {}
  });
  expect(statusCode).toBe(200);
  expect(body.success).toBe(true);
});

// about params
test("getUserInfo: should failed when invalid params", async () => {
  const id = null;
  const url = urls.getUserInfo.replace("{id}", id);
  const { body, statusCode } = await helper.request({
    url,
    method: "get",
    data: {},
    qs: {}
  });
  expect(statusCode).toBe(400);
  expect(body.success).toBe(false);
  expect(body.message).toBe("id must be one of [001, 002]");
});

test("getUserInfo: should return the user when params is valid", async () => {
  const id = "001";
  const url = urls.getUserInfo.replace("{id}", id);
  const { body, statusCode } = await helper.request({
    url,
    method: "get",
    data: {},
    qs: {}
  });

  expect(statusCode).toBe(200);
  expect(body.success).toBe(true);
  expect(body.data.id).toBe(id);
});

// about query
test("getUserList: should failed when invalid age in query", async () => {
  const { body, statusCode } = await helper.request({
    url: urls.getUserList,
    method: "get",
    qs: { age: "dd" }
  });
  expect(statusCode).toBe(400);
  expect(body.success).toBe(false);
  expect(body.message).toBe("age must be a number");
});

test("getUserList: should return users whose age are greater than 10", async () => {
  const { body, statusCode } = await helper.request({
    url: urls.getUserList,
    method: "get",
    qs: { age: 10 }
  });

  expect(statusCode).toBe(200);
  expect(body.success).toBe(true);
});
