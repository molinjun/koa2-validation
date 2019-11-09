/* eslint-disable no-console  */
const http = require("http");
const Koa = require("koa");
const bodyParser = require("koa-bodyparser");
const router = require("koa-router")();

const validate = require("../../lib");

const user = require("./user");

router.post("/users", validate(user.v.addUser), user.addUser);
router.get("/users/:id", validate(user.v.getUserInfo), user.getUserInfo);
router.get("/users", validate(user.v.getUserList), user.getUserList);

const app = new Koa();
app.on("error", console.log);
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || err.code;
    ctx.body = {
      success: false,
      message: err.message
    };
  }
});
app.use(bodyParser());
app.use(router.routes());

const server = http.createServer(app.callback());
if (!module.parent) {
  server.listen(process.env.PORT || 3000);
  server.on("listening", () => {
    console.info(
      "Server listening on http://localhost:%d",
      server.address().port
    );
  });
}
module.exports = server;
