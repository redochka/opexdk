const notifier = require('node-notifier');
const path     = require('path');

module.exports.notify = function (message) {

    notifier.notify({
        title  : 'OPEXDK',
        message: message,
        'icon' : path.join(__dirname, 'notifier-icon.png'),
    });

}
