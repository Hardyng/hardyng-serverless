var AWS = require('aws-sdk');

AWS.config.update({region: 'eu-west-1'});
export const handler = (event, context, callback) => {
  var params = {
    Message: 'TEXT_MESSAGE', /* required */
    PhoneNumber: 'PHONE_NUMBER',
  };
  var publishTextPromise = new AWS.SNS({apiVersion: '2010-03-31'}).publish(params).promise();

// Handle promise's fulfilled/rejected states
  publishTextPromise.then(
    function(data) {
      callback(data);
    }).catch(
    function(err) {
      callback(err);
    });
};
