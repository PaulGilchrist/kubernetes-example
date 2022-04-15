/* 
Demo application to show publishing to an event topic using Dapr without a client (http://localhost)
If running locally, first run the Dapr local sidecar with an app-id that is part of the pubsub "scope"
    dapr run --app-id contacts-api --app-port 3000 --dapr-http-port 3500

If this was a subscribe example you would need to use dapr to launch the application so it can bind to the subscription
    dapr --app-id contacts-api --app-port 3000 run node dapr-http-example.js
Since this is only a publish example, you can call it as normal
    node dapr-http-example.js
*/
'use strict';
const axios = require('axios');
const daprPort = process.env.DAPR_HTTP_PORT || 3500;
const daprUrl = `http://localhost:${daprPort}/v1.0`;
const pubsubname =  'dapr-pubsub-rabbitmq'; // Which pub/sub component Dapr should use
const topic = 'contacts'; // Which topic to publish to

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