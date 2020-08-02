/**************************************************
 * Notch Discord Bot
 * 
 * Created by: CZghost
 * Created for: 7biom.cz
 * 
 * Open-sourced under GNU-GPL v3.0 or later
 * Make sure to comply with source code licence
 * when redistributing, forking or linking,
 * always specify original author of this bot!
 **************************************************/

const { stripIndents } = require("common-tags");            // Format strings in code

module.exports = (err, result) => {
    if(err) throw err;  // An error occured -> terminate application
    console.log(stripIndents`
        Operation successful.
        Field count:    ${result.fieldCount}
        Affected rows:  ${result.affectedRows}
        Insert ID:      ${result.insertId}
        Server statu:   ${result.serverStatus}
        Warning count:  ${result.warningCount}
        Message:        ${result.message}
        Protocol 41:    ${result.protocol41}
        Changed rows:   ${result.changedRows}
    `);
};