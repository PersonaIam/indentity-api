/**
 * Created by vladtomsa on 2019-03-05
 */
const SanctionsSources = require('../database/models').SanctionsSources;
const {getClient} = require('../config/elasticSearch');
const logger = require('../config/logger');
const {SANCTIONS_ESEARCH} = require('../../config/constants');

const getSearchQueryCondition = (params) => {
    const queryCondition = [];

    const availableFieds = {
        'firstName': 'aliases.value',
        'lastName': 'aliases.value',
        'ssn': 'idDocument.idNo',
    };

    if (params.firstName && params.lastName) {
        queryCondition.push(
            {
                bool: {
                    should: [
                        {
                            match: {
                                [availableFieds.firstName]: params.firstName,
                            },
                        },
                        {
                            match: {
                                [availableFieds.lastName]: params.lastName,
                            },
                        },
                    ],
                    'minimum_should_match': 2,
                },
            },
        );
    }

    if (params.ssn) {
        queryCondition.push({
            match: {
                [availableFieds.ssn]: params.ssn,
            },
        });
    }

    return queryCondition;
};

const deleteBySource = async ({source}) => {
    const esClient = getClient();

    return esClient.deleteByQuery({
        index: SANCTIONS_ESEARCH.index,
        body: {
            query: {
                bool: {
                    "must": [
                        {
                            "match_phrase": {
                                "source": {
                                    "query": source,
                                },
                            },
                        },
                    ],
                },
            },
        },
    });
};

const search = function search(index, body) {
    const esClient = getClient();

    return esClient.search({index: index, body: body});
};

const find = async (params) => {
    const condition = getSearchQueryCondition(params);

    const searchBody = {
        query: {
            bool: {
                should: condition,
            },
        },
    };

    return search(SANCTIONS_ESEARCH.index, searchBody);
};

const list = (params) => {
    return SanctionsSources
        .findAll({
            where: {...params},
        });
};

const update = (sanctionInfo, id) => {
    return SanctionsSources.update(sanctionInfo, {where: {id: id}});
};

const updateDateOfIssue = (dateOfIssue, sanctionSourceId) => {
    return update({lastDateOfIssue: dateOfIssue}, sanctionSourceId);
};

const saveSanctionEntitities = (source, sanctionEntities) => {
    const esClient = getClient();

    let bulkBody = [];

    sanctionEntities.forEach((item) => {
        item.source = source;

        bulkBody.push({
            index: {
                _index: SANCTIONS_ESEARCH.index,
                _type: SANCTIONS_ESEARCH.type,
                _id: item.id,
            }
        });

        bulkBody.push(item);
    });

    esClient.bulk({body: bulkBody})
        .then(response => {
            let errorCount = 0;

            response.items.forEach(item => {
                if (item.index && item.index.error) {
                    logger.error(item.index.error);
                }
            });

            logger.info(
                `Successfully indexed ${sanctionEntities.length - errorCount} out of ${sanctionEntities.length} sanction entities`
            );
        })
        .catch(logger.error);
};


module.exports = {
    saveSanctionEntitities,
    deleteBySource,
    find,
    list,
    updateDateOfIssue,
};