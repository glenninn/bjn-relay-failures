# Calling BlueJeans Relay API

### A Reference Application

![BlueJeans](./media/927.png)



This repository contains sample application code showing how to make API calls to BlueJeans' Relay API.  The code provided is for *reference only* .  Use at your own risk.



### Getting Started

To run this application you will need to setup you environment accordingly:

1. You will need **Node JS** to run this application.  You can download Node from [this Node downlaod site](https://nodejs.org/en/download/)

2. Download this gihub [the Relay Reference App  github](https://github.com/glenninn/bjn-relay-failures)



### Configuring your environment

Since this reference application makes calls into the BlueJeans cloud, you will need to provide login credentials to make the necessary API calls.  **Note** the account you use must have Administrator Privileges in your BlueJeans enterprise.

In the github, there is an example configuration file, `config-example.json`.  You should copy this file into **config.json** and edit it accordingly:

```json
{
	"grant_type" : "password",
    "username"   : "myusername",
    "password"   : "mypassword"
}
```



### Running the Application

To run this reference application,  enter this command line instruction

```shell
c:\home> node index.js
```



The application will connect to BlueJeans and Relay, then produce an output similar to the following:

```shell
C:\1. temp\fanatics>node index.js
Retrieved a BlueJeans Access Token: 4d8ba69c12c34d7cab05f3d46c2220c3
Converted to Relay token: 43gkhuhciq4pon2rrp5g59vpti5ln01a
Retrieved Failures from Relay: {
  "id": "595d0d1de4b0fe8b9bdd0aeb",
  "subjectClass": "ListenerService",
  "subjectId": "58d91a2fe4b071d982e7549e",
  "errorDate": 1499270429669,
  "errorCode": 208581637,
  "errorMessage": "The Listener Service is offline.",
  "errorName": "ListenerOffline",
  "errorDetails": {
    "listenerServiceId": "58d91a2fe4b071d982e7549e"
  },
  {.... more records ...}
}
Total of 908 records.
C:\1. temp\fanatics>
```




