/**
 * Created by vladtomsa on 27/09/2018
 */
const { createContactInfo } = require('../contactInfos/validation');

module.exports = {
    createUser: {
        type: 'object',
        properties: {
            username: {
                type: 'string',
                minLength: 3,
                maxLength: 50,
            },
            userRoleId: {
                type: 'number',
                enum: [1, 2, 3]
            },
            contactInfo: createContactInfo,
        },
        required: ['username', 'userRoleId'],
    },
    confirmUser: {
        type: 'object',
        properties: {
            token: {
                type: 'string'
            },
            password: {
                type: 'string'
            },
            address: {
                type: 'string',
            }
        },
        required: ['token', 'password', 'address'],
    }
};