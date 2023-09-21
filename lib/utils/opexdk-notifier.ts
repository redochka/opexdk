import notifier from "node-notifier";
import * as path from "path";

export const notify = function (message: any) {
  notifier.notify({
    title  : 'OPEXDK',
    message: message,
    timeout: false,  //quit the app immediately. Otherwise, it remains active 5 seconds.
    'icon' : path.join(__dirname, 'notifier-icon.png'),
    //on MacOS, the terminal icon shows, because the script is run in the terminal
    //https://github.com/mikaelbr/node-notifier/issues/71
  });
}
module.exports.notify = notify;
