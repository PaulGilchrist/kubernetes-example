/* 
Demo application to show publishing to an event topic using the dapr client
If running locally, first run the Dapr local sidecar with an app-id that is part of the pubsub "scope"
    dapr run --app-id contacts-api --app-port 3000 --dapr-http-port 3500
If this was a subscribe example you would need to use dapr to launch the application so it can bind to the subscription
    dapr --app-id contacts-api --app-port 3000 run node dapr-client-example.js
Since this is only a publish example, you can call it as normal
    node dapr-client-example.js
*/

const { DaprServer, DaprClient, CommunicationProtocolEnum } = require('dapr-client'); 
const daprHost = "127.0.0.1"; 

var main = function() {
    for(var i=0;i<10;i++) {
        sleep(5000);
        var orderId = Math.floor(Math.random() * (1000 - 1) + 1);
        start(orderId).catch((e) => {
            console.error(e);
            process.exit(1);
        });
    }
}

async function start(orderId) {
    const PUBSUB_NAME = "dapr-pubsub-rabbitmq"
    const TOPIC_NAME  = "contacts"
    const client = new DaprClient(daprHost, process.env.DAPR_HTTP_PORT, CommunicationProtocolEnum.HTTP);
    console.log("Published data:" + orderId)
    //Using Dapr SDK to publish a topic
    await client.pubsub.publish(PUBSUB_NAME, TOPIC_NAME, orderId);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

main();