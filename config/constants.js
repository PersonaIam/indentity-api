/**
 * Created by vladtomsa on 01/10/2018
 */
module.exports = {
    DATE_FORMAT: 'YYYY-MM-DD',
    DATE_TIME_FORMAT: 'YYYY-MM-DD HH:mm',
    USER_REGISTRATION_EMAIL_TAKS_INTERVAL: 10, //seconds,
    RETRIVE_ADDRESS_GEOLOCATION_TAKS_INTERVAL: 5, //seconds,
    REGENERATE_REFERRAL_CODES_INTERVAL_HOURS: 3600, // seconds
    REGISTRATION_LINK_EXPIRES_IN_HOURS: 48,
    REGISTRATION_LINK_JWT_KEY: 'PerSoNA-IdenTITY_S3CR3T>KEY',
    PASSWORD_GENERATOR_OPTIONS: {
        length: 12,
        numbers: true,
        symbols: true,
        uppercase: true,
        strict: true,
    },
    SANCTION_SOURCE_TYPES: {
        US_TREASURY: {
            name: 'US Treasury sanction list',
            urls: [
                'https://www.treasury.gov/ofac/downloads/sanctions/1.0/cons_advanced.xml',
                'https://www.treasury.gov/ofac/downloads/sanctions/1.0/sdn_advanced.xml'
            ],
        },
        EU_TREASURY: {
            name: 'EU Financial Sanctions',
            urls: [
                'https://webgate.ec.europa.eu/europeaid/fsd/fsf/public/files/xmlFullSanctionsList/content?token=n002hisy'
            ],
        },
    },
    SANCTIONS_ESEARCH: {
        index: 'sanction-list',
        type: 'sanction-entity',
    },
    SOCKET_EVENTS: {
        GET_CONVERSATION: 'get-conversation',
        GET_USERS_CONVERSATIONS: 'get-users-conversation',
        CREATE_CONVERSATION: 'create-conversation',
        CONVERSATION_CREATED: 'conversation-created',
        SEND_MESSAGE: 'send-message',
        MESSAGE_SENT: 'message-sent',
        DISCONNECT: 'disconnect',
        RECONNECT: 'reconnect',
        REGISTER: 'register',
        LOGOUT: 'logout',
        UPDATE_LAST_SEEN_ON: 'update-last-seen-on',
        ERROR: 'socket-error',
    },
    USER_ROLES: {
        IDENTITY_USER: 'IDENTITY_USER',
        NOTARY: 'NOTARY',
        PROVIDER: 'PROVIDER',
        SYS_ADMIN: 'SYS_ADMIN',
    },
    CREDIT_SERVER: {
        HOST: 'http://5.135.75.72',
        PORT: '8080',
        PATH: '/api/testnet',
    },
};