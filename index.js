var bjnApiLib = require("./auth.js");
var fs        = require("fs");

//
// The bjnApiLib is a library that abstracts the BlueJeans API syntax along
// with Authorization tokens...
//
var callRelayAPI = bjnApiLib();
var callBjnAPI   = bjnApiLib();


// This is a file authorization credential information for BlueJeans is
// kept.
//
var configFile = "config.json";


// Here are the pertinent Relay API parameters
//

var relayApiHost   = "relay.bluejeans.com";
var apiFailures    = "/api/failures/";
var apiToken2Token = "/api/auth/accesstokens";

// and here are the BlueJeans API's that are needed
//
var bjnApiHost = "api.bluejeans.com";
var apiOauth   = "/oauth2/token?Password";



// This is the Relay token from the BlueJeans Token
var relayToken = "";


// Tell library that we are not passing the access token in the Query Parameter,
// and that this instance is interfacing with Relay
// NOTE:
//   For Relay, the authorization is passed in a header parameter called:  "X-Access-Token"
//   example:   X-Access-Token: ti6t2...flqh6dovlj12gl
//
callRelayAPI.setTokenQueryName("");
callRelayAPI.apiHostIsRelay(true);

function jss(obj){
	return JSON.stringify(obj,null,2);
}

// Read the user's credentials from the config.json file.
//
function readBjnCredentials(){
	var p = new Promise( (resolve,reject)=>{
		fs.readFile(configFile,  (err,data)=>{
			if(err){
				var msg = "Error reading " + configFile + " file";
				console.log(msg);
				reject(msg);
			}
			
			try{
				config = JSON.parse(data);
				resolve(config);
			}
			catch(e)
			{
				var msg = "Error parsing BlueJeans Credential info in: " + configFile + " file";
				console.log(msg);
				reject(msg);
			}
		});
	});
	return p;
}


//*************************************************
// 2/5/2019, g1,  Reference application demonstrating how to call the Relay API's
//  Main program flow starts here
// 1) Retrieve BlueJeans credentials to generate an *Enterprise Admin* Access Token
// 2) Use Relay API to create a Relay Access token from the BlueJeans token
// 3) Request the Failures' list from Relay
//
//*************************************************


// 1) Retrieve BlueJeans credentials to generate an *Enterprise Admin* Access Token
readBjnCredentials().then(
	(oauth)=>{
		callBjnAPI.post( bjnApiHost, apiOauth, oauth).then(
			(bjnToken)=>{
				console.log("Retrieved a BlueJeans Access Token: " + bjnToken.access_token);
				
				// 2) Use Relay API to create a Relay Access token from the BlueJeans token		
				// https://relay.bluejeans.com/api/auth/accesstokens?seamaccesstoken=<bluejeans access token>
				//
				callRelayAPI.post(relayApiHost,apiToken2Token+"?seamaccesstoken=" + bjnToken.access_token,{}).then(
					(relayTokenResults)=>{
						relayToken = relayTokenResults.accessToken;
						console.log("Converted to Relay token: " + relayToken);
						callRelayAPI.authorize(relayToken);
						
						// 3) Request the Failures' list from Relay
						callRelayAPI.get(relayApiHost,apiFailures).then(
							(failures)=>{
								console.log("Retrieved Failures from Relay: " + jss(failures));
								console.log("Total of " + failures.length + " records.");
							},
							(error)=>{
								console.log("Error: " + error);
							});				
					},
					(error)=>{
						console.log("Error converting: " + error);
					});
			},
			(error)=>{
				console.log("Error trying to get BlueJeans Access Token: " + error);
			});
	},
	(error)=>{
		console.log("There was an error retrieving the BlueJeans credentials:\n" + error);
	});
