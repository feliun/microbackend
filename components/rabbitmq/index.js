const System = require('systemic');
const rabbitmq = require('systemic-rabbitmq');

module.exports = new System({ name: 'rabbit' })
  .add('rabbitmq', rabbitmq()).dependsOn('config', 'logger');

