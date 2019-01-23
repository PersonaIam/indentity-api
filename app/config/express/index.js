/**
 * Created by vladtomsa on 27/09/2018
 */
const bodyParser = require('body-parser');
// const cookieParser = require('cookie-parser');
const cors = require('cors');
const logger = require('express-bunyan-logger');
const expressip = require('express-ip');
const routesConfig = require('../../routes');
//const session = require('express-session');

const {
    authorizationMiddleware,
    reqBodyValidatorMiddleware,
} = require('../../middlewares');

const { getInstance } = require('../sequelize');

// const SequelizeStore = require('connect-session-sequelize')(session.Store);

const init = (app, cb) => {
    const sequelizeInstance = getInstance();
    // const sessionStore = new SequelizeStore({
    //     db: sequelizeInstance
    // });

    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());
    app.use(cors());
    app.use(logger());
    app.use(expressip().getIpInfoMiddleware);
    // app.use(cookieParser());
    // app.use(session({
    //     secret: 'keyboard cat',
    //     store: sessionStore,
    //     resave: false, // we support the touch method so per the express-session docs this should be set to false
    //     // proxy: true // if you do SSL outside of node.
    // }));

    app.use(authorizationMiddleware);

    // Add app routes
    routesConfig.forEach((route) => {
        app.use(`/api${route.path}`, route.router);
    });

    // sessionStore.sync();

    // Error handler for validation errors
    app.use(reqBodyValidatorMiddleware);

    cb(null);
};

module.exports = {
    init,
};