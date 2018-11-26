/**
 * Created by vladtomsa on 27/09/2018
 */
module.exports = {
    createSubscription: {
        type: 'object',
        properties: {
            firstName: {
                type: 'string',
                minLength: 3,
                maxLength: 50,
            },
            lastName: {
                type: 'string',
                minLength: 3,
                maxLength: 50,
            },
            email: {
                type: 'string',
                minLength: 3,
                maxLength: 50,
            },
        },
        required: ['firstName', 'lastName', 'email'],
    }
};