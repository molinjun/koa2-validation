const _ = require('lodash');
const request = require('supertest');

const app = require('./server');

exports.request = (options, query) => {
  const opts = _.isString(options) ? { url: options, query } : options;
  const method = opts.method || 'get';
  let req = request(app)[method](opts.url);
  if (opts.data) {
    req = req.send(opts.data);
  }

  if (opts.header && _.isObject(opts.header)) {
    _.each(opts.header, (val, key) => req.set(key, val));
  }

  return req
    .query(opts.query || opts.qs || {})
    .set('Accept', 'application/json');
};
