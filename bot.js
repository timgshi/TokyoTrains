var botBuilder = require('claudia-bot-builder'),
    excuse = require('huh');


var Wit = null;
var log = null;
// let interactive = null;
// let = interactive = require('node-wit').interactive;
try {
  // if running from repo
  Wit = require('../').Wit;
  log = require('../').log;
  // interactive = require('../').interactive;
} catch (e) {
  Wit = require('node-wit').Wit;
  log = require('node-wit').log;
  // interactive = require('node-wit').interactive;
}

// Wit.ai parameters
const WIT_TOKEN = "SO4FIOF2DE67TXHJO73XGNGNE76IQK64";

const actions = {
  send(request, response) {
    const {sessionId, context, entities} = request;
    const {text, quickreplies} = response;
    return new Promise(function(resolve, reject) {
      console.log('user said...\n', request.text);
      console.log('\n\nsending...\n', response.text);
      return resolve();
    });
  },
  getNow({context, entities}) {
    return new Promise(function(resolve, reject) {
      // console.log('user said...', request.text);
      // console.log('sending...', JSON.stringify(response));
      context.now = new Date();
      context.now = context.now.toString();
      return resolve(context);
    });
  },
  getLastTrain({context, entities}) {
    return new Promise(function(resolve, reject) {
      console.log(JSON.stringify(context));
      console.log(JSON.stringify(entities));
      var departures_string = "";
      departures_string = "23:05 (to Shibuya) and 23:10 (to Ginza)";
      if (entities['station_name'] && entities['station_name'].length == 1) {
        var station_name = entities['station_name'][0]['value'];
        departures_string += ' from ' + station_name;
        context.last_train_departures = departures_string;
      } else {
        context.missing_station_name = true;
      }
      return resolve(context);
    });
  }, getNextTrain({context, entities}) {
    return new Promise(function(resolve, reject) {
      console.log(JSON.stringify(context));
      console.log(JSON.stringify(entities));
      var departures_string = "";
      departures_string = "23:05 (to Shibuya) and 23:10 (to Ginza)";
      if (entities['station_name'] && entities['station_name'].length == 1) {
        var station_name = entities['station_name'][0]['value'];
        departures_string += ' from ' + station_name;
        context.next_train_departures = departures_string;
      } else {
        context.missing_station_name = true;
      }
      return resolve(context);
    });
  }
};

// Setting up our bot
const wit = new Wit({
  accessToken: WIT_TOKEN,
  actions,
  logger: new log.Logger(log.INFO)
});
// interactive(wit);


// const api = botBuilder((request, originalApiRequest) => {
//   originalApiRequest.lambdaContext.callbackWaitsForEmptyEventLoop = false;
//   return new Promise(function(resolve, reject) {
//     return 'Thanks for sending ' + request.text  + 
//         '. Your message is very important to us, but ' + 
//         excuse.get();
//   });
// });

// module.exports = api;

module.exports = botBuilder(function (request, originalApiRequest) {
  console.log('got message');
  return 'Thanks for sending ' + request.text  + 
      '. Your message is very important to us, but ' + 
      excuse.get();
  // return new Promise(function(resolve, reject) {
  //   var message = 'Thanks for sending ' + request.text  + 
  //       '. Your message is very important to us, but ' + 
  //       excuse.get();
  //   return resolve(message);
  // });
});
