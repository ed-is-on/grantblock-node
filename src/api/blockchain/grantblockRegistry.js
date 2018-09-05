/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// This is a simple sample that will demonstrate how to use the
// API connecting to a HyperLedger Blockchain Fabric
//
// The scenario here is using a simple model of a participant of 'Student'
// and a 'Test' and 'Result'  assets.

'use strict';

const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
const Table = require('cli-table');
const winston = require('winston');
const prettyjson = require('prettyjson');

// these are the credentials to use to connect to the Hyperledger Fabric
let cardname = 'admin@grantblock';

const LOG = winston.loggers.get('application');


/** Class for the land registry*/
class GrantblockRegistry {
    /**
    * Need to have the mapping from bizNetwork name to the URLs to connect to.
    * bizNetwork nawme will be able to be used by Composer to get the suitable model files.
    *
    */
   constructor() {
    this.bizNetworkConnection = new BusinessNetworkConnection();
}

/** 
* @description Initalizes the LandRegsitry by making a connection to the Composer runtime
* @return {Promise} A promise whose fullfillment means the initialization has completed
*/
async init() {
    this.businessNetworkDefinition = await this.bizNetworkConnection.connect(cardname);
    LOG.info('Grantblock:<init>', 'businessNetworkDefinition obtained', this.businessNetworkDefinition.getIdentifier());
}

/** 
* Listen for the sale transaction events
*/
listen() {
    this.bizNetworkConnection.on('event', (evt) => {
        console.log(chalk.blue.bold('New Event'));
        console.log(evt);

        let options = {
            properties: { key:'value'}
        };
    });
}
    /**
     * Gets a participant from the current registry and issues them an identity
     * @param {Object} args this will be the information for the participant already in the registry
     * @return {Promise} resolved when the issued identity pings the network
     */

    async issueGranteeIdentity(args){
        const METHOD = 'issueGranteeIdentity';
        LOG.info(METHOD, 'issuing an identity to a given grantee');

        try{

        }catch(error){
            console.log(error);
            this.log.error(METHOD, 'Danger Will Robinson!', error);
        }
    }
    async identityIssue() {
        let businessNetworkConnection = new BusinessNetworkConnection();

        try {
            await businessNetworkConnection.connect('admin@digitalPropertyNetwork');
            let result = await businessNetworkConnection.issueIdentity('net.biz.digitalPropertyNetwork.Person#mae@biznet.org', 'maeid1')
            console.log(`userID = ${result.userID}`);
            console.log(`userSecret = ${result.userSecret}`);
            await businessNetworkConnection.disconnect();
        } catch(error) {
            console.log(error);
            process.exit(1);
        }
    }
    
    // identityIssue();


}

module.exports = GrantblockRegistry;