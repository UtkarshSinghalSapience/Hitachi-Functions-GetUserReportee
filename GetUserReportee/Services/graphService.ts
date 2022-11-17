const {Client} = require("@microsoft/microsoft-graph-client");
const { TokenCredentialAuthenticationProvider} = require("@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials");
const { ClientSecretCredential } = require("@azure/identity");
import 'isomorphic-fetch';
import {constants} from  '../Constants/index';

export class GraphService{
    credential : any;

    constructor(tenantId, clientId, clientSecret){
        this.credential = new ClientSecretCredential(tenantId, clientId, clientSecret);
    }

    public async GetUserReportee(emailId)
    {
        const authProvider = new TokenCredentialAuthenticationProvider(
            this.credential, {
            scopes: ["https://graph.microsoft.com/.default"]
        });
        const options = {
            authProvider,
        };
        try
        {
        //const client = Client.init(options);
        const client = Client.initWithMiddleware({
            debugLogging: true,
            authProvider: authProvider
        });
        const url = constants.GraphAPI.replace('{emailId}',emailId);
        console.log("URL: "+url);
        let directReportee = await client.api(url).get();
        if(directReportee)
            return directReportee.value;
        else
            return null;
        }
        catch(err){
            console.log(err);
        }
    }

}
