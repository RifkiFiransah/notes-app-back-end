require('dotenv').config()

const Hapi = require('@hapi/hapi');
const notes = require('./api/notes');
const NotesService = require('./services/postgres/NotesService');
const NotesValidator = require('./validator/notes');
const ClientError = require('./exceptions/ClientError');

const init = async () => {
  const notesService = new NotesService();
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register({
    plugin: notes,
    options: {
      service: notesService,
      validator: NotesValidator
    },
  });

  server.ext('onPreResponse', (request, h) => {
    // Mendapatkan konteks response dari request
    const { response } = request
    if(response instanceof Error){
      // penangan client error secara internal
      if(response instanceof ClientError){
        const newResponse = h.response({
          status: 'fail',
          message: response.message
        })
        newResponse.code(response.statusCode)
        return newResponse
      }
      // mempertahankan penanganan client error oleh hapi secara native, seperti 404, etc.
      if(!response.isServer){
        return h.continue
      }

      // Penanganan server error sesuai kebutuhan 
      const newResponse = h.response({
        status: 'error',
        message: 'terjadi kegagalan pada server'
      })
      newResponse.code(500)
      return response
    }
    // jika bukan error, lanjutkan dengan response sebelumnya (tanpa terintervensi)
    return h.continue
  })

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();