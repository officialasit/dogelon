require('dotenv').config();
const twit = require('./twit');
const binance = require('./binance');
const fs = require('fs');
const path = require('path');
const paramsPath = path.join(__dirname, 'params.json');

function writeParams(data) {
    return fs.writeFileSync(paramsPath, JSON.stringify(data));
}

function readParams(){
    const data = fs.readFileSync(paramsPath);
    return JSON.parse(data.toString());
}

function getTweets() {
    return new Promise((resolve, reject) =>{
        let params = {
            screen_name: 'Satoshi46277339',
            count: 1,
        };

        twit.get('statuses/user_timeline', params, (err, data) => {
            if(err){
                return reject(err);
            }
            return resolve(data);
        });
    });
}

async function buyLong() {
    console.info( await binance.futuresLeverage( 'DOGEUSDT', 5 ) );
    console.info( await binance.futuresMarketBuy( 'DOGEUSDT', 50 ) );
}

async function main() {
    try{
        // Get Previous since_id
        const params = readParams();

        // Get Latest Tweet
        const data = await getTweets();
        console.log("Latest Tweet Fetched: " + JSON.stringify(data[0].text));

        // Check if Latest Tweet was previously executed or not
        if((data[0].id !== params.since_id) && (((data[0].text).toLowerCase()).includes('doge') == true)){
            console.log("\n--------------\nLONGING DOGE NOW !!!\n--------------\n");
            var newParams = {
                "since_id": data[0].id
            }
            writeParams(newParams);
            await buyLong();
        }
        else{
            console.log("\nTweet does NOT qualify to be traded...\n");
        }
        
    }
    catch(e){
        console.log("Error: " + e);
    }
}

console.log("Starting the Dogelon Bot ...");

setInterval(main, 30000);