// Used for displaying messages in the queue as the website updates contact data
var amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost/', (error0, connection) => {
    if (error0) {
        throw error0;
    }
    connection.createChannel((error1, channel) => {
        if (error1) {
            throw error1;
        }
        var queue = 'api';
        channel.assertQueue(queue, {
            durable: true
        });
        console.log(`Waiting for messages in ${queue}. To exit press CTRL+C`);
        channel.consume(queue, (msg) => {
            console.log(``);
            console.log(`Received ${msg.content.toString()}`);
        }, {
            noAck: true
        });
    });
});