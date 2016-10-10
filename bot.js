var botBuilder = require('claudia-bot-builder'),
    excuse = require('huh');

var sendPromiseResolve = null;

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
var WIT_TOKEN = "SO4FIOF2DE67TXHJO73XGNGNE76IQK64";

var actions = {
  send: function send(request, response) {

    console.log('in sending');

    var sessionId = request.sessionId;
    var context = request.context;
    var entities = request.entities;
    var text = response.text;
    var quickreplies = response.quickreplies;

    // console.log('user said...\n', request.text);
    // console.log('\n\nsending...\n', response.text);

    return new Promise(function (resolve, reject) {
      console.log('user said...\n', request.text);
      console.log('\n\nsending...\n', response.text);
      sendPromiseResolve(response.text);
      console.log('resolved sending');
      resolve();
    });

    // return new Promise(function (resolve, reject) {
    //   console.log('user said...\n', request.text);
    //   console.log('\n\nsending...\n', response.text);
    //   return resolve();
    // });
  },
  getNow: function getNow(_ref) {
    var context = _ref.context;
    var entities = _ref.entities;

    return new Promise(function (resolve, reject) {
      // console.log('user said...', request.text);
      // console.log('sending...', JSON.stringify(response));
      context.now = new Date();
      context.now = context.now.toString();
      return resolve(context);
    });
  },
  getLastTrain: function getLastTrain(_ref2) {
    var context = _ref2.context;
    var entities = _ref2.entities;

    return new Promise(function (resolve, reject) {
      console.log('in get last train');
      // console.log(JSON.stringify(context));
      // console.log(JSON.stringify(entities));
      var departures_string = "";
      departures_string = "23:05 (to Shibuya) and 23:10 (to Ginza)";
      if (entities['station_name'] && entities['station_name'].length == 1) {
        var station_name = entities['station_name'][0]['value'];
        departures_string += ' from ' + station_name;
        context['last_train_departures'] = departures_string;
        delete context['missing_station_name'];
      } else {
        context.missing_station_name = true;
      }
      console.log(JSON.stringify(context));
      return resolve(context);
    });
  },
  getNextTrain: function getNextTrain(_ref3) {
    var context = _ref3.context;
    var entities = _ref3.entities;

    return new Promise(function (resolve, reject) {
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
var wit = new Wit({
  accessToken: WIT_TOKEN,
  actions: actions,
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
  console.log(JSON.stringify(request));
  originalApiRequest.lambdaContext.callbackWaitsForEmptyEventLoop = false;

  var sessionId = 2;
  var messageText = request.text;
  var sessionContext = {};

  return new Promise(function(resolve, reject) {
    sendPromiseResolve = resolve;
    wit.runActions(
      sessionId,
      messageText,
      sessionContext
    ).then(function(context) {

      console.log('FINISHED WIT ACTIONS');
      console.log(JSON.stringify(context));

      

      // return 'Thanks for sending ' + request.text  + 
      //   '. Your message is very important to us, but ' + 
      //   excuse.get() + '. ' + JSON.stringify(context);

    }).catch(function (err) {
      console.error('Oops! Got an error from Wit: ', err.stack || err);
      return reject('Oops! Got an error from Wit');
    });
  }).then(function(result) {
    console.log('in final promise');
    console.log(result);
    return result;
  });

  

  // return 'Thanks for sending ' + request.text  + 
  //     '. Your message is very important to us, but ' + 
  //     excuse.get();
});
