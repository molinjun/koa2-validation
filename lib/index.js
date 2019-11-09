const _ = require("lodash");
const Joi = require("@hapi/joi");

class ValidationError extends Error {
  constructor(errors) {
    const message = errors
      .map(e => e.message)
      .join(", ")
      .replace(/"/g, "");
    super(message);
    this.status = 400;
    this.errors = errors;
  }
}

class Validation {
  constructor(joi) {
    this.Joi = joi || Joi;
  }

  validate(schema = {}, opt = {}) {
    const options = _.defaultsDeep(opt, {
      allowUnknown: true
    });

    return async (ctx, next) => {
      const defaultValidateKeys = ["body", "query", "params"];
      const needValidateKeys = _.intersection(
        defaultValidateKeys,
        Object.keys(schema)
      );
      const errors = [];
      needValidateKeys.find(item => {
        const toValidateObj = item === "body" ? ctx.request.body : ctx[item];
        const result = this.Joi.validate(toValidateObj, schema[item], options);
        if (result.error) {
          errors.push(result.error.details[0]);
          return true;
        }
        _.assignIn(toValidateObj, result.value);
        return false;
      });
      if (errors.length !== 0) {
        throw new ValidationError(errors);
      }
      await next();
    };
  }
}

const defaultValidation = new Validation();
module.exports = defaultValidation.validate.bind(defaultValidation);

module.exports.ValidationError = ValidationError;
module.exports.Validation = Validation;
