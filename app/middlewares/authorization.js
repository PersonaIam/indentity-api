/**
 * Created by vladtomsa on 08/10/2018
 */
const ContactInfo = require('../database/models').ContactInfo;
const Countries = require('../database/models').Countries;
const User = require('../database/models').User;
const UserRole = require('../database/models').UserRole;
const { Base64: { encode, decode } } = require('js-base64');

const BASIC_AUTH_HEADER_PREFIX = 'Basic';

const UNAUTHORISED_PATHS = [
    { url: '/api/users', method: 'POST' },
    { url: '/api/users/confirm', method: 'PUT' },
    { url: '/api/countries', method: 'GET' },
];

const cancelRequest = (res) => {
    res.status(401);
    res.json({ message: 'Unauthorised request'});
};

const verifyUser = async (userInfo) => {
    const { username, password } = userInfo;

    const user = await User.find({
        where: { username },
        include: [
            {
                model: UserRole,
                as: 'userRoleInfo',
            },
            {
                model: ContactInfo,
                as: 'contactInfo',
                include: [
                    {
                        model: Countries,
                        as: 'country',
                    },
                ]
            }
        ]
    });

    return user && user.password === password ? user : null;
};

const authorization = async (req, res, next) => {
    const { url, headers: { authorization }, method } = req;

    const isAuthRequired = UNAUTHORISED_PATHS.findIndex(path => path.url === url && path.method === method) === -1;

    if (!isAuthRequired || method === 'OPTIONS') {
        next();
    }
    else {
        try {
            const authHeaderInfo = authorization.split(' ');

            if (
                authHeaderInfo
                && authHeaderInfo[0] === BASIC_AUTH_HEADER_PREFIX
                && authHeaderInfo[1]
            ) {
                const encryptedCredentials = authHeaderInfo[1];
                const usernamePasswordPair = decode(encryptedCredentials);
                const credentials = usernamePasswordPair.split(':');
                const verifiedUser = await verifyUser({
                    username: encode(credentials[0]),
                    password: encode(credentials[1]),
                });

                if (verifiedUser) {
                    req.userInfo = { ...verifiedUser.dataValues, password: undefined };
                    next();
                }
                else {
                    cancelRequest(res);
                }
            }
            else {
                cancelRequest(res);
            }
        }
        catch (e) {
            cancelRequest(res);
        }

    }
};

module.exports = authorization;