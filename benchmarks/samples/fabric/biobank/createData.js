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

'use strict';

const { WorkloadModuleBase } = require('@hyperledger/caliper-core');

/**
 * Workload module for the benchmark round.
 */
class CreateDataWorkload extends WorkloadModuleBase {
    /**
     * Initializes the workload module instance.
     */
    constructor() {
        super();
        this.txIndex = 0;
    }

    async initializeWorkloadModule(workerIndex, totalWorkers, roundIndex, roundArguments, sutAdapter, sutContext) {
        await super.initializeWorkloadModule(workerIndex, totalWorkers, roundIndex, roundArguments, sutAdapter, sutContext);

        
    }

    /**
     * Assemble TXs for the round.
     * @return {Promise<TxStatus[]>}
     */
    async submitTransaction() {
        const dnaJson = { 
            "created_at": "Fri Aug 07 2020",
            "metadata": {
                "title": "My DNA data",
                "magnet_link": "magnet:?xt=urn:btih:cd04721d0f1251306c30812bc943193d9c5de79f",
                "description": "My DNA data description",
            }
        }

        this.txIndex++;
        let dataId = 'Client' + this.workerIndex + '_DATA' + this.txIndex.toString() + Math.random();
        // let dataId = 'Client' + this.workerIndex + '_DATA' + this.txIndex.toString();
        let dataAttributes = JSON.stringify(dnaJson)

        const { targetPeers, invokerMspId } = setInvokerMspId(this.txIndex)

        let args = {
            contractId: 'biobank',
            contractVersion: '1',
            contractFunction: 'DataContract:uploadRawData',
            contractArguments: [dataId, dataAttributes],
            timeout: 30,
            targetPeers: [targetPeers],
            invokerMspId: invokerMspId
        };

        await this.sutAdapter.sendRequests(args);
    }
}

/**
 * Create a new instance of the workload module.
 * @return {WorkloadModuleInterface}
 */
function createWorkloadModule() {
    return new CreateDataWorkload();
}

function setInvokerMspId(txIndex) {
    let invokerMspId, targetPeers
    if(txIndex%2 == 0){
        invokerMspId = 'Org1MSP'
        if(txIndex%8 == 0){
            targetPeers = "peer0.org1.amazonbiobank.mooo.com"
        } else if(txIndex%8 == 2){
            targetPeers = "peer1.org1.amazonbiobank.mooo.com"
        } else if(txIndex%8 == 4){
            targetPeers = "peer2.org1.amazonbiobank.mooo.com"
        } else if(txIndex%8 == 6){
            targetPeers = "peer3.org1.amazonbiobank.mooo.com"
        } 
    } 
    else if(txIndex%2 == 1){ 
        invokerMspId = 'Org2MSP'
        if(txIndex%8 == 1){
            targetPeers = "peer0.org2.amazonbiobank.mooo.com"
        } else if(txIndex%8 == 3){
            targetPeers = "peer1.org2.amazonbiobank.mooo.com"
        } else if(txIndex%8 == 5){
            targetPeers = "peer2.org2.amazonbiobank.mooo.com"
        } else if(txIndex%8 == 7){
            targetPeers = "peer3.org2.amazonbiobank.mooo.com"
        } 
    }
    return { invokerMspId, targetPeers }
}

module.exports.createWorkloadModule = createWorkloadModule;
