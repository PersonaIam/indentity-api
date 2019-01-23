/**
 * Created by vladtomsa on 14/01/2019
 */
const socketIO = require('socket.io');
const socketManager = require('./socketManager');

const init = (server, cb) => {
    const webSocket = socketIO(server);

    webSocket.on('connection', socketManager);

    cb(null);
};

module.exports = {
    init,
};