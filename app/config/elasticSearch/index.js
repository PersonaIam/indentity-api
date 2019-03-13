/**
 * Created by vladtomsa on 2019-03-05
 */
const ElasticSearch = require('elasticsearch');

let esClient;

const init = (app, cb) => {
    const {
        elasticSearch,
    } = app.get('config');

    esClient = new ElasticSearch.Client(elasticSearch);

    cb(null);
};

const getClient = () => {
    debugger;
    return esClient;
};

module.exports = {
    getClient,
    init,
};