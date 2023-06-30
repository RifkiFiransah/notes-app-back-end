const InvariantError = require("../../exceptions/InvariantError");
const { UserPayloadSchema } = require("./schema");

const UsersValidator = {
  validateUserPayload: (payload) => {
    const ValidationResult = UserPayloadSchema.validate(payload)
    if(ValidationResult.error){
      throw new InvariantError(ValidationResult.error.message)
    }
  }
}

module.exports = UsersValidator