import CONSTANTS from '../constants.js'
import * as nakamajs from '@heroiclabs/nakama-js';

const TEST_ID = "test_id"

// return a login provider on success
const nakamaInitSdk = async (options) => {

    // initialize sdk    
     let client = new nakamajs.Client(
        options.key,
        options.url,
        options.port
    )

    // do a test authenticate
    let session = await client.authenticateCustom({
        id: TEST_ID,
        create: true
    });

    if (session != null) {

        let lp = new NakamaProvider(client);

        console.log('%c%s',
        'color: blue; background: white;',
        "Nakama client SDK initialized: --- " 
        + options.url + ":" + options.port + " ---"
        )
        
        return lp;
    }

    console.error("unable to initialize SDK")
    return null;
}

class NakamaProvider {

    client = null;
    session = null;
    
    constructor(client) {
        this.client = client;
    }

    login = async (loginObject) => {

        try {
            this.session = await this.client.authenticateEmail(
                {
                email: loginObject.username,
                password: loginObject.password,
                create: true   
                }
            )

            return this.session
            
        } catch (e) {
            console.error("Login failed [" + e.status + ":" + e.statusText + "]"); 
         }
    
         return null;
    }    

    logout = () => {
        this.session = null;
    }

    getTourney = async (options) => {

        try {
            if (this.session == null)
            {
                this.session = await this.client.authenticateCustom({
                    id: TEST_ID,
                    create: true
                }); 
            }

            let tourneyInfo = await this.client.listLeaderboardRecords(
                this.session,
                options.tourney_id);

            return tourneyInfo;

        } catch (e) {
            console.error("getTourney failed [" + e.status + ":" + e.statusText + "]"); 
            return(e);
         }
    }    
}

export {
    nakamaInitSdk
};