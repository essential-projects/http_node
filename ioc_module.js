'use strict';

const AdapterPostgres = require('./dist/commonjs/index').AdapterPostgres;

function registerInContainer(container) {
  console.log('ABC')
  container.register('HttpClient', HttpClient);

}

module.exports.registerInContainer = registerInContainer;
