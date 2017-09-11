'use strict';

const AdapterPostgres = require('./dist/commonjs/index').AdapterPostgres;

function registerInContainer(container) {

  container.register('HttpClient', HttpClient)
    .singleton();

}

module.exports.registerInContainer = registerInContainer;
