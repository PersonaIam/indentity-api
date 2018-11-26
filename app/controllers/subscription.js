/**
 * Created by vladtomsa on 26/11/2018
 */
/**
 * Created by vladtomsa on 27/09/2018
 */
const Subscriptions = require('../database/models').Subscriptions;
const {extractSubscriptionInfoInfo} = require('../helpers/extractEncryptedInfo');

const isAllowed = async (req) => {
    const {body: {userRoleId}, userInfo} = req;

    const userRoles = await UserRole.findAll();

    let providerInfo = null, sysAdminInfo = null;

    userRoles.forEach((role) => {
        if (role.name === USER_ROLES.PROVIDER) providerInfo = role;
        if (role.name === USER_ROLES.SYS_ADMIN) sysAdminInfo = role;
    });

    const isSysAdminPerformingAction = () => {
        return userInfo && userInfo.userRoleId === sysAdminInfo.id;
    };

    /**
     * Providers can be created only by sys admin's
     * */
    if (
        userRoleId === providerInfo.id
        && !isSysAdminPerformingAction()
    ) {
        throw ('UNAUTHORIZED: Only administrators can create providers');
    }

    /**
     * Providers can be created only by sys admin's
     * */
    if (
        userRoleId === sysAdminInfo.id
        && !isSysAdminPerformingAction()
    ) {
        throw ('UNAUTHORIZED: Only administrators can create administrators');
    }
};


const list = ({contactInfo = {}, userRoleInfo = {}, pageNumber = 0, pageSize = 10, ...params}) => {
    return Subscriptions
        .findAndCountAll({
            where: {...params},
            offset: pageNumber * pageSize,
            limit: pageSize,
        })
        .then((result) => {
            return {
                count: result.count,
                subscriptionInfoList: result.rows.map((s) => {
                    return extractSubscriptionInfoInfo(s.dataValues);
                }),
            };
        })
};

const create = async (req) => {
    try {
        const {firstName, lastName, email} = req.body;

        const subscriptionsInfo = await Subscriptions.create({firstName, lastName, email});

        return subscriptionsInfo;
    } catch (error) {
        throw error;
    }
};

const update = async (subscriptionInfo, id) => {
    try {
        // public static update(values: Object, options: Object): Promise<Array<affectedCount, affectedRows>>
        const updatedResult = await Subscriptions.update(subscriptionInfo, {where: {id: id}, individualHooks: true});

        return updatedResult;
    } catch (error) {
        throw error;
    }
};


const getNewSubscriptions = () => {
    const params = {
        isSubscriptionEmailSent: null,
    };

    return list(params);
};

module.exports = {
    create,
    getNewSubscriptions,
    list,
    update,
};