/*
The default Dapr tracing container is Zepkin with its dashboard accessable at http://127.0.0.1:9411/
Requires using darp run:
    dapr --app-id tracing-example --app-port 3000 run node tracing-example.js
*/
'use strict';
const {Tracer, ExplicitContext, BatchRecorder, jsonEncoder: {JSON_V2}} = require('zipkin');
const {HttpLogger} = require('zipkin-transport-http');
// Create the tracer
const ctxImpl = new ExplicitContext();
const recorder = new BatchRecorder({
    logger: new HttpLogger({
      endpoint: 'http://localhost:9411/api/v2/spans',
      jsonEncoder: JSON_V2
    })
});
const localServiceName = 'tracing-example'; // name of this application
const tracer = new Tracer({ctxImpl, recorder, localServiceName});

const main = async () => {
  // tracer.setId(tracer.createRootId());
  // tracer.recordMessage('This is a test');
  // tracer.recordBinary('message', 'This is a test');
  // await tracer.local('This is a test', (res) => {});
}

main();
