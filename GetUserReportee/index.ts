import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import {KeyVaultService} from  './Services/keyVaultService'
import {constants} from  './Constants/index'
import {GraphService} from  './Services/graphService'


const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    
    context.log('HTTP trigger function processed a request.');

    let keyvaultService = new KeyVaultService(process.env["KeyVaultName"]);

    const secretValues = await GetSecretValueFromKeyVault(context,keyvaultService,constants.listOfSecretsName)
     
    
    const emailId = req.body.emailId;

    let graphService = new GraphService(secretValues.TenantId,secretValues.MicrosoftAPPId,secretValues.MicrosoftAPPPassword);

    let listreportee = await graphService.GetUserReportee(emailId);
    let isUserValid = false;
    if(listreportee && listreportee.length > 0)
      isUserValid = true;

    console.log(listreportee);
    context.res = {
        status: 200, /* Defaults to 200 */
        body: {listreportee,isUserValid},
        headers: {
            'Content-Type': 'application/json'
        }
    };

};

async function GetSecretValueFromKeyVault(context, keyvaultService,listOfSecrets){

    //Get Secret Value from key vault
    var listOfSecretsValue= await keyvaultService.GetAllSecretValue(listOfSecrets);

    console.log(JSON.stringify(listOfSecretsValue));
    context.log(JSON.stringify(listOfSecretsValue))

    return listOfSecretsValue;
}

export default httpTrigger;