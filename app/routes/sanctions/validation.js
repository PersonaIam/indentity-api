/**
 * Created by vladtomsa on 2019-03-13
 */
module.exports = {
    searchSanctions: {
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
            ssn: {
                type: 'string',
                minLength: 3,
                maxLength: 50,
            },
        },
        anyOf: [
            {
                required: ['firstName', 'lastName']
            },
            {
                required: ['ssn']
            },
        ]
    }
};