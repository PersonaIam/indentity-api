/**
 * Created by vladtomsa on 27/09/2018
 */
module.exports = {
    getUserReferralInfo: {
        type: 'object',
        properties: {
            referralCode: {
                type: 'string',
            },
        },
        required: ['referralCode'],
    }
};