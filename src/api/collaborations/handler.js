const ClientError = require("../../exceptions/ClientError")

class CollaborationsHandler {
  constructor(collaborationsService, notesService, validator){
    this._collaborationsService = collaborationsService
    this._notesService = notesService
    this._validator = validator

    this.postCollaborationHandler = this.postCollaborationHandler.bind(this)
    this.deleteCollaborationHandler = this.deleteCollaborationHandler.bind(this)
  }

  async postCollaborationHandler(request, h){
    try {
      this._validator.validateCollaborationPayload(request.payload)
      const {id: credentialId} = request.auth.credentials
      const {noteId, userId} = request.payload

      await this._notesService.verifyNoteOwner(noteId, credentialId)
      const collaborationId =  await this._collaborationsService.addCollaboration(noteId, userId)

      const response = h.response({
        status: 'success',
        message: 'kolaborasi berhasil ditambahkan',
        data: {
          collaborationId
        }
      })
      response.code(201)
      return response
    } catch (error) {
      if(error instanceof ClientError){
        const response  = h.response({
          status: 'fail',
          message: error.message
        })
        response.code(error.statusCode)
        return response
      }

      // Server Error
      const response = h.response({
        status: 'fail',
        message: 'maaf, terjadi kegagalan pada server'
      })
      response.code(500)
      console.log(error);
      return response
    }
  }

  async deleteCollaborationHandler(request, h) {
    try {
      this._validator.validateCollaborationPayload(request.payload)
      const {id: credentialId} = request.auth.credentials
      const {noteId, userId} = request.payload

      await this._notesService.verifyNoteOwner(noteId, credentialId)
      await this._collaborationsService.deleteCollaboration(noteId, userId)

      return {
        status: 'success',
        message: 'Kolaborasi berhasil dihapus'
      }
    } catch (error) {
      if(error instanceof ClientError){
        const response  = h.response({
          status: 'fail',
          message: error.message
        })
        response.code(error.statusCode)
        return response
      }

      // Server Error
      const response = h.response({
        status: 'fail',
        message: 'maaf, terjadi kegagalan pada server'
      })
      response.code(500)
      console.log(error);
      return response
    }
  }
}

module.exports = CollaborationsHandler