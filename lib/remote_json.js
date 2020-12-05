/****************************************
 * Notch Discord Bot - created by CZghost
 * 
 * File: remote_json.js (remote JSON getter)
 ****************************************/

const { default: fetch } = require("node-fetch")

module.exports = async (object, property, url) => {
    let injection = new Object();
    injection[property] = await fetch(url, {method: "get"}).then(res => res.json()).catch(e => {console.error(e)});

    let new_object = Object.assign({}, object, injection);

    return new_object;
}