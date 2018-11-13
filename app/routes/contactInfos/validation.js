/**
 * Created by vladtomsa on 07/11/2018
 */
module.exports = {
    createContactInfo: {
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
            phoneNumber: {
                type: 'string',
                minLength: 6,
                maxLength: 50,
            },
            address: {
                type: 'string',
                minLength: 3,
                maxLength: 500,
            },
            city: {
                type: 'string',
                minLength: 2,
                maxLength: 100,
            },
            zipCode: {
                type: 'string',
                minLength: 3,
                maxLength: 50,
            },
            countryId: {
                type: 'number',
            },
        },
        required: ['email'],
    },
};