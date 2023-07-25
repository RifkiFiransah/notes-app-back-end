const ExportNotesPayloadSchema = require("./schema");
const InvariantError = require('../../exceptions/InvariantError')

const ExportValidator = {
  validateExportNotesPayload: (payload) => {
    const validatorResult = ExportNotesPayloadSchema.validate(payload)

    if(validatorResult.error){
      throw new InvariantError(validatorResult.error.message)
    }
  }
}

module.exports = ExportValidator