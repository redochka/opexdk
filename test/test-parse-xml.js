var assert = require('assert');

describe('Parse XML', function () {
    it("should return the xml", function () {
        let serverConfigLoader = require('../my-helpers/load-server-config-from-filezilla-format');

        // let xmlAsJson = serverConfigLoader.loadServerConfig("test.offerz.ftp.xml");
        let xmlAsJson = serverConfigLoader.getFtpConfigUsingPixlXml("test.offerz.ftp.xml");

        let expected = {
            host     : 'test.offerz.ch',
            user     : 'redatest',
            pass     : 'w0Tgu41#',
            port     : '21',
            remoteDir: ''
        };

        assert.deepStrictEqual(JSON.stringify(xmlAsJson), JSON.stringify(expected));
    })
})
