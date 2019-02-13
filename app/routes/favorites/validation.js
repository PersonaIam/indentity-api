/**
 * Created by vladtomsa on 2019-02-13
 */
module.exports = {
    createFavNotaryInfo: {
        type: 'object',
        properties: {
            notaryId: {
                type: 'number',
            },
        },
        required: ['notaryId'],
    },
    removeFavNotaryInfo: {
        type: 'object',
        // properties: {
        //     id: {
        //         type: 'number' || 'string',
        //     },
        // },
        required: ['id'],
    },
};