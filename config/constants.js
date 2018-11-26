/**
 * Created by vladtomsa on 01/10/2018
 */
module.exports = {
    DATE_FORMAT: 'YYYY-MM-DD',
    DATE_TIME_FORMAT: 'YYYY-MM-DD HH:mm',
    USER_REGISTRATION_EMAIL_TAKS_INTERVAL: 10, //seconds,
    RETRIVE_ADDRESS_GEOLOCATION_TAKS_INTERVAL: 5, //seconds,
    REGISTRATION_LINK_EXPIRES_IN_HOURS: 48,
    REGISTRATION_LINK_JWT_KEY: 'PerSoNA-IdenTITY_S3CR3T>KEY',
    PASSWORD_GENERATOR_OPTIONS: {
        length: 12,
        numbers: true,
        symbols: true,
        uppercase: true,
        strict: true,
    },
    USER_ROLES: {
        IDENTITY_USER: 'IDENTITY_USER',
        NOTARY: 'NOTARY',
        PROVIDER: 'PROVIDER',
        SYS_ADMIN: 'SYS_ADMIN',
    }
};