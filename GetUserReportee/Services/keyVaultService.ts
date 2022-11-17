const { DefaultAzureCredential } = require("@azure/identity");
const { SecretClient } = require("@azure/keyvault-secrets");
import { SrvRecord } from 'dns';
import {constants} from  '../Constants/index';

export class KeyVaultService{
    vaultName : string;
    keyVaultURL : string;
    client: any;
    constructor(vaultName){
        this.vaultName = vaultName;
        this.keyVaultURL = constants.KeyVaultURL.replace('{vaultName}',this.vaultName);
        const credential = new DefaultAzureCredential();
        this.client = new SecretClient(this.keyVaultURL, credential);
    }

public async GetAllSecretValue(listOfSecretsName) {
        let listOfSecretsValue = {};
        for(let a in listOfSecretsName){
            console.log(listOfSecretsName[a]);
                const latestSecret = await this.client.getSecret(listOfSecretsName[a]); 
                console.log("Secret Name :" + listOfSecretsName[a] +" Secret Value :"+latestSecret.value);
                listOfSecretsValue = {...listOfSecretsValue , [listOfSecretsName[a]]:latestSecret.value}
        }
            return listOfSecretsValue;
    } 

}