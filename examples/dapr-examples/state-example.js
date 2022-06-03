// Demo application to show setting and getting state using Dapr
'use strict';
const axios = require('axios');
const daprPort = process.env.DAPR_HTTP_PORT || 3500;
const daprUrl = `http://localhost:${daprPort}/v1.0`;
const stateUrl = `${daprUrl}/state/statestore`;

const main = async () => {
    const state = [{ 'key': 'name', 'value': 'Bruce Wayne' }];
    let response = await postState(state);
    console.log(`State persisted successfully`);
    response = await getState('name');
    console.log(response);
}

const getState = async (key) => {
    return axios.get(stateUrl + `/${key}`, {
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

const postState = async (state) => {
    return axios.post(stateUrl, JSON.stringify(state), {
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