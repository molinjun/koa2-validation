const _ = require("lodash");
const request = require("supertest");

class Helper {
  constructor(app) {
    this.app = app;
  }

  request(options, query) {
    const opts = _.isString(options) ? { url: options, query } : options;
    const method = opts.method || "get";
    let req = request(this.app)[method](opts.url);
    if (opts.data) {
      req = req.send(opts.data);
    }

    if (opts.header && _.isObject(opts.header)) {
      _.each(opts.header, (val, key) => req.set(key, val));
    }

    return req
      .query(opts.query || opts.qs || {})
      .set("Accept", "application/json");
  }
}

module.exports = Helper;
