const InvariantError = require('../../exceptions/InvariantError')
const {NotePayloadSchema} = require('./schema')

const NotesValidator = {
  validateNotePayload: (payload) => {
    const validatorResult = NotePayloadSchema.validate(payload)

    if(validatorResult.error){
      throw new InvariantError(validatorResult.error.message)
    }
  }
}

module.exports = NotesValidator