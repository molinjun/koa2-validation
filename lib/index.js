const _ = require('lodash');
const Joi = require('joi');

module.exports = (schema = {}) => {
  const { opt = {} } = schema;

  const options = _.defaultsDeep(opt, {
    allowUnknown: true,
  });
  return async (ctx, next) => {
    const defaultValidateKeys = ['body', 'query', 'params'];
    const needValidateKeys = _.intersection(defaultValidateKeys, Object.keys(schema));

    const errors = [];
    needValidateKeys.find((item) => {
      const toValidateObj = item === 'body' ? ctx.request.body : ctx[item];
      const result = Joi.validate(toValidateObj, schema[item], options);
      if (result.error) {
        errors.push(result.error.details[0]);
        return true;
      }
      _.assignIn(toValidateObj, result.value);
      return false;
    });

    if (errors.length !== 0) {
      const msg = errors[0].message.replace(/"/g, '');
      const error = new Error(msg);
      error.status = 400;
      throw error;
    }
    await next();
  };
};
