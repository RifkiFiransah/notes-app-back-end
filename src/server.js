require('dotenv').config()

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt')
const Inert = require('@hapi/inert') 
const path = require('path')

// Notes
const notes = require('./api/notes');
const NotesService = require('./services/postgres/NotesService');
const NotesValidator = require('./validator/notes');

// Users
const users = require('./api/users')
const UsersService = require('./services/postgres/UsersService')
const UsersValidator = require('./validator/users')

// Authentication
const authentications = require('./api/authentications')
const AuthenticationsService = require('./services/postgres/AuthenticationsService')
const AuthenticationsValidator = require('./validator/authentications')
const TokenManager= require('./tokenize/TokenManager')

// Collaboration
const collaborations = require('./api/collaborations')
const CollaborationsService = require('./services/postgres/CollaborationsService')
const CollaborationsValidator = require('./validator/collaborations')

// Exports
const _exports = require('./api/exports')
const ProducerService = require('./services/rabbitmq/ProducerService')
const ExportsValidator = require('./validator/exports')

// Uploads
const uploads = require('./api/uploads')
const StorageService = require('./services/storage/StorageService')
const UploadsValidator= require('./validator/uploads')

const ClientError = require('./exceptions/ClientError');
const inert = require('@hapi/inert');

const init = async () => {
  const collaborationsService = new CollaborationsService()
  const notesService = new NotesService(collaborationsService)
  const usersService = new UsersService()
  const authenticationsService = new AuthenticationsService()
  const storageService = new StorageService(path.resolve(__dirname, 'api/uploads/file/images'))

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  // Registrasi plugin eksternal
  await server.register([
    {
      plugin: Jwt
    },
    {
      plugin: Inert
    }
  ])

  // Mendefinisikan strategy authentikasi JWT
  server.auth.strategy('notesapp_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id
      }
    })
  })

  await server.register([
    {
      plugin: notes,
      options: {
        service: notesService,
        validator: NotesValidator
      },
    },
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator
      }
    },
    {
      plugin: authentications,
      options: {
        authenticationsService,
        usersService,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator
      }
    },
    {
      plugin: collaborations,
      options: {
        collaborationsService,
        notesService,
        validator: CollaborationsValidator
      }
    },
    {
      plugin: _exports,
      options: {
        service: ProducerService,
        validator: ExportsValidator
      }
    },
    {
      plugin: uploads,
      options: {
        service: storageService,
        validator: UploadsValidator
      }
    }
  ]);

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