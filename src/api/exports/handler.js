const ClientError = require('../../exceptions/ClientError')

class ExportsHandler {
  constructor(service, validator){
    this._service = service
    this._validator = validator

    this.postExportNotesHandler = this.postExportNotesHandler.bind(this)
  }

  async postExportNotesHandler(request, h){
    try {
      this._validator.validateExportNotesPayload(request.payload)

      const message = {
        userId: request.auth.credentials.id,
        targetEmail: request.payload.targetEmail
      }

      await this._service.sendMessage('export:notes', JSON.stringify(message))

      const response = h.response({
        status: 'success',
        message: 'Permintaan Anda dalam antrean'
      }).code(201)

      return response
    } catch (error) {
      if(error instanceof ClientError){
        const response = h.response({
          status: 'fail',
          message: error.message
        })
        response.code(error.statusCode)
        return response
      }
      // Server Error
      const response = h.response({
        status: 'fail',
        message: 'Maaf terjadi kesalahan pada server'
      })
      response.code(500)
      console.log(error);
      return response
    }
  }
}

module.exports = ExportsHandler