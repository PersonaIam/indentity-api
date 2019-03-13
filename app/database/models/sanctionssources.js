'use strict';
module.exports = (sequelize, DataTypes) => {
  const SanctionsSources = sequelize.define('SanctionsSources', {
    type: DataTypes.STRING,
    url: DataTypes.STRING,
    lastDateOfIssue: DataTypes.STRING
  }, {});
  SanctionsSources.associate = function(models) {
    // associations can be defined here
  };
  return SanctionsSources;
};