const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient({region: "eu-west-1"});

var nameTable = {
    TableName: 'currentUserTable',
    Limit: 1
};

var username;
var bloodsugar;
var bloodpressure;

exports.handler = (event, context) => {
    docClient.scan(nameTable,function(err, data){
                   if(err){
                        console.log(err);
                   }
                   else{
                       var params = {
                            TableName: 'healthDataTable',
                            Key: {
                                "username": data.Items[0].username
                            }
                        }
                   
                        docClient.get(params, function(err, data){
                                 if(err){
                                    console.log(err);
                                 }
                                 else{
                                     username = data.Item.username;
                                     bloodsugar = data.Item.bloodsugar;
                                     bloodpressure = data.Item.bloodpressure;
                                     
                                     console.log(data);
                                     
                                     
                                     //New Session
                                     if (event.session.new){
                                        console.log("NEW SESSION");
                                     }
                                     
                                     // Launch Request
                                     switch(event.request.type){
                                     case "LaunchRequest":
                                     console.log(`LAUNCH REQUEST`);
                                     context.succeed(
                                                     generateResponse(
                                                                      {},
                                                                      buildSpeechletResponse(`wellcome ${username}-nim`, true)
                                                                      )
                                                     );
                                     break;
                                     
                                     // Intent Request
                                     case "IntentRequest":
                                     console.log(`INTENT REQUEST`);
                                     
                                     switch(event.request.intent.name){
                                     case "GetName":
                                     context.succeed(
                                                     generateResponse(
                                                                      {},
                                                                      buildSpeechletResponse(`an-nyeong-ha-sae-yo ${username}-nim`, true)
                                                                      )
                                                     )
                                     break;
                                     case "GetBloodSugar":
                                     context.succeed(
                                                     generateResponse(
                                                                      {},
                                                                      buildSpeechletResponse(`${username}-nim, your current blood sugar is ${bloodsugar}`, true)
                                                                      )
                                                     )
                                     break;
                                     case "GetBloodPressure":
                                     context.succeed(
                                                     generateResponse(
                                                                      {},
                                                                      buildSpeechletResponse(`${username}-nim, your current blood pressure is ${bloodpressure}`, true)
                                                                      )
                                                     )
                                     break;
                                     case "GetDetails":
                                     context.succeed(
                                                     generateResponse(
                                                                      {},
                                                                      buildSpeechletResponse(`${username}-nim, your blood sugar is ${bloodsugar} ,blood pressure is ${bloodpressure}`, true)
                                                                      )
                                                     )
                                     break;
                                     
                                     default:
                                     context.fail(`INVALID REQUEST TYPE: ${event.request.type}`);
                                     }
                                     break;
                                     
                                     // Session Ened Request
                                     case "SessionEndedRequest":
                                     console.log(`SESSION ENDED REQUEST`);
                                     break;
                                     
                                     default:
                                     context.fail(`INVALID REQUEST TYPE: ${event.request.type}`);
                                     }
                                     }
                                     });
                    }
                   });
}

buildSpeechletResponse = (outputText, shouldEndSession) => {
    return {
    outputSpeech: {
        type: "PlainText",
        text: outputText
    },
        shouldEndSession: shouldEndSession
    }
}

generateResponse = (sessionAttributes, speechletResponse) => {
    return{
        version: "1.0",
        sessionAttributes: sessionAttributes,
        response: speechletResponse
    }
}
