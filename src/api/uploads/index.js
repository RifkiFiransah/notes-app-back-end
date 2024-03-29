const Uploadshandler = require("./handler")
const routes = require("./routes")

module.exports = {
  name: 'uploads',
  version: '1.0.0',
  register: async (server, {service, validator}) => {
    const uploadsHandler = new Uploadshandler(service, validator)
    server.route(routes(uploadsHandler))
  }
}