const ClientError = require("../../exceptions/ClientError")

class Uploadshandler {
  constructor(service, validator){
    this._service = service
    this._validator = validator

    this.postUploadImageHandler = this.postUploadImageHandler.bind(this)
  }

  async postUploadImageHandler(request, h){
    try {
      const {data} = request.payload
      this._validator.validateImageHeaders(data.hapi.headers)

      const filename = await this._service.writeFile(data, data.hapi)
      // Jika menggunakan AWS S3 pakai yang ini
      // const fileLocation = await this._service.writeFile(data, data.hapi)

      const response = h.response({
        status: 'success',
        data: {
          fileLocation: `http://${process.env.HOST}:${process.env.PORT}/upload/images/${filename}`
          // Jika menggunakan AWS S3 pakai yang ini
          // fileLocation: filename
          // OR
          // fileLocation
        }
      })
      response.code(201)
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
        message: 'Maaf terjadi kegagalan pada server'
      }).code(500)
      console.log(error);
      return response
    }
  }
}

module.exports = Uploadshandler