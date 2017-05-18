'use strict';

const AdapterPostgres = require('./dist/commonjs/index').AdapterPostgres;

function registerInContainer(container) {

  container.register('HttpClient', HttpClient);

}

module.exports.registerInContainer = registerInContainer;
