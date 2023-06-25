// const { addNoteHandler, getAllNotesHandler, getNoteByIdHandler, editNoteByIdHandler, deleteNoteByIdHandler } = require("./handler")

const routes = (handler) => [
  {
    method: 'POST',
    path: '/notes',
    handler: (request, h) => handler.postNoteHandler(request, h),
    options: {
      cors: {
        origin: ['*']
      }
    }
  },
  {
    method: 'GET',
    path: '/notes',
    handler: () => handler.getNotesHandler()
  },
  {
    method: 'GET',
    path: '/notes/{id}',
    handler: (request, h) => handler.getNoteByIdHandler(request, h)
  },
  {
    method: 'PUT',
    path: '/notes/{id}',
    handler: (request, h) => handler.putNoteByIdHandler(request, h)
  },
  {
    method: 'DELETE',
    path: '/notes/{id}',
    handler: (request, h) => handler.deleteNoteByIdHandler(request, h)
  }
]

module.exports = routes
