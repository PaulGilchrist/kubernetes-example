/* 
Demo application to show publishing to an event topic using Dapr
If running locally, first run the Dapr local sidecar
    dapr run --app-id local-sidecar --dapr-http-port 3500
Next run 'sub-example.js' from its working directory using command:
    dapr --app-id sub-example --app-port 3000 run node sub-example.js
*/
'use strict';
const axios = require('axios');
const daprPort = process.env.DAPR_HTTP_PORT || 3500;
const daprUrl = `http://localhost:${daprPort}/v1.0`;
const pubsubname =  'pubsub'; // Which pub/sub component Dapr should use
const topic = 'topic1'; // Which topic to publish to

// Publish a message to a specific topic using Dapr
const main = async () => {
    const data = {
        status: 'completed'
    }
    const message = JSON.stringify(data);
    let response = await postMessage(message);
    console.log(`Message published successfully`);
}

const postMessage = async (message) => {
    const publishUrl = `${daprUrl}/publish/${pubsubname}/${topic}`;
    return axios.post(publishUrl, message, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(result => result.data)
        .catch(err => {
            console.log(err);
            throw (err);
        });
}

main();