/**
 * Created by vladtomsa on 2019-02-19
 */
const axions = require('axios');
const logger = require('../config/logger');
const xml2js = require('xml2js');
const {
    extractUsTreasuryInfo,
    extractEuSanctionsInfo,
    getDateOfIssue,
} = require('../helpers/sanctionsHelpers');
const {SANCTION_SOURCE_TYPES} = require('../../config/constants');
const sanctionsController = require('../controllers').sanctionsController;

const xmlParser = new xml2js.Parser();

const getUSSanctionsList = async (source) => {
    const {
        id,
        url,
        lastDateOfIssue,
    } = source;

    try {
        const {data} = await axions.get(url);

        xmlParser.parseString(data, async (error, result) => {
            if (error) {
                logger.error(error);
            }

            const dateOfIssue = getDateOfIssue(result);

            if (lastDateOfIssue !== dateOfIssue) {
                // extract sanctions info
                const {
                    sanctionEntries,
                } = extractUsTreasuryInfo(result);

                // remove previous entries
                await sanctionsController.deleteBySource({ source: url });

                // update new entries
                await sanctionsController.saveSanctionEntitities(url, sanctionEntries);

                // update sanction sources
                await sanctionsController.updateDateOfIssue(dateOfIssue, id);

                logger.info(`New sanctions added from source: ${url} [${dateOfIssue}]`);
            }
            else {
                logger.info(`No new sanctions available from source: ${url} [${dateOfIssue}]`);
            }
        });
    }
    catch (e) {
        logger.error(`Failed to extract sanctions from ${url}`);
    }
};

const getEUSanctionsList = async (source) => {
    const {
        id,
        url,
        lastDateOfIssue,
    } = source;

    try {
        const {data} = await axions.get(url);

        xmlParser.parseString(data, async (error, result) => {
            if (error) {
                logger.error(error);
            }

            const {
                export: {
                    $: { generationDate },
                    sanctionEntity,
                },
            } = result;

            if (lastDateOfIssue !== generationDate) {
                // extract sanctions info
                const { sanctionEntries }  = extractEuSanctionsInfo(sanctionEntity, url);

                // remove previous entries
                await sanctionsController.deleteBySource({ source: url });

                // update new entries
                await sanctionsController.saveSanctionEntitities(url, sanctionEntries);

                // update sanction sources
                await sanctionsController.updateDateOfIssue(generationDate, id);

                logger.info(`New sanctions added from source: ${url} [${generationDate}]`);
            }
            else {
                logger.info(`No new sanctions available from source: ${url} [${generationDate}]`);
            }
        });
    }
    catch (e) {
        logger.error(`Failed to extract sanctions from ${url}`);
    }
};

const checkSanctionSources = async () => {
    const sanctionSources = await sanctionsController.list();

    for (let i = 0; i < sanctionSources.length; i++) {
        const source = sanctionSources[i];

        switch (source.type) {
            case (SANCTION_SOURCE_TYPES.US_TREASURY.name):
                await getUSSanctionsList(source);
                break;
            case (SANCTION_SOURCE_TYPES.EU_TREASURY.name):
                await getEUSanctionsList(source);
                break;
        }
    }
};

const checkSanctionSourcesJob = () => {
    return {
        interval: {
            seconds: '00',
            minutes: '00',
            hour: '02'
        },
        task: async () => {
            try {
                await checkSanctionSources();

                logger.info('CHECKED_FOR_UPDATED_SANCTIONS_LIST');
            }
            catch (error) {
                logger.error('FAILED_TO_REMOVE_UNCONFIRMED_USERS');
                logger.error(error);
            }
        }
    };
};

module.exports = checkSanctionSourcesJob;
