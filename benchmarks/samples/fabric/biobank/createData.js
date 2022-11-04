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

        let args = {
            contractId: 'biobank',
            contractVersion: '1',
            contractFunction: 'DataContract:uploadRawData',
            contractArguments: [dataId, dataAttributes],
            timeout: 30
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

module.exports.createWorkloadModule = createWorkloadModule;
