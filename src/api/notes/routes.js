// const { addNoteHandler, getAllNotesHandler, getNoteByIdHandler, editNoteByIdHandler, deleteNoteByIdHandler } = require("./handler")

const routes = (handler) => [
  {
    method: 'POST',
    path: '/notes',
    handler: (request, h) => handler.postNoteHandler(request, h),
    options: {
      auth: 'notesapp_jwt',
      cors: {
        origin: ['*']
      }
    }
  },
  {
    method: 'GET',
    path: '/notes',
    handler: (request, h) => handler.getNotesHandler(request, h),
    options: {
      auth: 'notesapp_jwt',
    }
  },
  {
    method: 'GET',
    path: '/notes/{id}',
    handler: (request, h) => handler.getNoteByIdHandler(request, h),
    options: {
      auth: 'notesapp_jwt',
    }
  },
  {
    method: 'PUT',
    path: '/notes/{id}',
    handler: (request, h) => handler.putNoteByIdHandler(request, h),
    options: {
      auth: 'notesapp_jwt',
    }
  },
  {
    method: 'DELETE',
    path: '/notes/{id}',
    handler: (request, h) => handler.deleteNoteByIdHandler(request, h),
    options: {
      auth: 'notesapp_jwt',
    }
  }
]

module.exports = routes
