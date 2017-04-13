http = require('http');
var endpoint;
var body;

exports.handler = (event, context) => {
    
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
                                             buildSpeechletResponse(`wellcome weather-API`, true)
                                             )
                            );
            break;
            
            // Intent Request
        case "IntentRequest":
            console.log(`INTENT REQUEST`);
            
            switch(event.request.intent.name){
                case "GetSeoul":
                    endpoint = "http://api.openweathermap.org/data/2.5/weather?q=seoul&appid=a729d0014f37f6f6d2606d4df9de53bf";
                    body ="";
                    http.get(endpoint, (response) => {
                             response.on('data', (chunk) => {body += chunk})
                             response.on('end', () => {
                                         var data = JSON.parse(body)
                                         var seoulWeather = data.weather[0].description
                                         context.succeed(
                                                         generateResponse(
                                                                          {},
                                                                          buildSpeechletResponse(`hyeon-jae seoul nal-ssi-nun ${seoulWeather}-ham-ni-da,`, true)
                                                                          )
                                                         )
                                         })
                             })
                    break;
                    
                case "GetBusan":
                    endpoint = "http://api.openweathermap.org/data/2.5/weather?q=busan&appid=a729d0014f37f6f6d2606d4df9de53bf"
                    body =""
                    http.get(endpoint, (response) => {
                             response.on('data', (chunk) => {body += chunk})
                             response.on('end', () => {
                                         var data = JSON.parse(body)
                                         var busanWeather = data.weather[0].description
                                         context.succeed(
                                                         generateResponse(
                                                                          {},
                                                                          buildSpeechletResponse(`hyeon-jae busan nal-ssi-nun ${busanWeather}-ham-ni-da,`, true)
                                                                          )
                                                         )
                                         })
                             })
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
