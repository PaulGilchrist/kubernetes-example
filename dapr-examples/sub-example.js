/* 
Demo application to show subscribing to an event topic using Dapr

Run this app with:
    dapr --app-id sub-example --app-port 3000 run node sub-example.js
Publish a topic with:
    dapr publish --publish-app-id sub-example --pubsub pubsub --topic topic1 --data '{'status': 'completed'}'
    or
    node pub-example.js
*/
'use strict';
const express = require('express')
const app = express()
app.use(express.urlencoded({extended: true}));
app.use(express.json({ type: 'application/*+json' })) // Dapr uses content-type of 'application/cloudevents+json'
const pubsubname =  'pubsub'; // Which pub/sub component Dapr should use
const port = 3000

// Subscribe to specific topics and tell Dapr what endpoints to forward messages for each topic to
app.get('/dapr/subscribe', (req, res) => {
    res.json([
        {
            pubsubname: pubsubname,
            topic: 'topic1', // Which topic to subscribe to
            route: 'topic1-endpoint' // Which endpoint for Dapr to call on when a message comes to that topic
        },
        {
            pubsubname: pubsubname,
            topic: 'topic2',
            route: 'topic2-endpoint'
        }
    ]);
})

// Endpoint that will receive the message
app.post('/topic1-endpoint', (req, res) => {
    console.log(req.body);
    res.sendStatus(200);
});

// Endpoint that will receive the message
app.post('/topic2-endpoint', (req, res) => {
    console.log(req.body);
    res.sendStatus(200);
});

app.listen(port, () => console.log(`consumer app listening on port ${port}!`))