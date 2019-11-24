// const Discord = require('discord.js');
const request = require('request-promise');
const {
    Client,
    RichEmbed
} = require('discord.js');
const {
    config
} = require("dotenv");
config({
    path: __dirname + "/.env"
});
const client = new Client();
client.login(process.env.D_TOKEN);

// 
// 
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    // 
    client.user.setPresence({
        game: {
            name: "The Development",
            type: "WATCHING",
            timestamps: {
                start: new Date("2019-11-23"),
                end: new Date("2021-06-15")
            }
        },
        status: "idle"
    });
});
// 
const resources = {
    forcastLogo: "https://raw.githubusercontent.com/AHmims/YouWeather/master/res/img/weather-logo.png",
    normalWeather: "https://raw.githubusercontent.com/AHmims/YouWeather/master/res/icons/icon-1.png"
};
//  
client.on('message', async msg => {
    if (msg.content === '*ping') {
        // msg.reply('Pong!');
        var data = await requestData(OpenWeatherMap_APIcalls.current);
        // msg.reply(data.base);
        // msg.channel.send(data.base);
        msg.channel.send(new RichEmbed({
            image: resources.normalWeather,
            title: "Weather Forcast For Safi :",
            client: "3li",
            // description: "gg",
            color: "35583",
            thumbnail: {
                url: resources.forcastLogo,
                width: 100
            },

            fields: [{
                    name: "A",
                    value: "AAA",
                    inline: false,
                },
                {
                    name: "B",
                    value: "BBB",
                    inline: true
                },
                {
                    name: "C",
                    value: "CCC",
                    inline: true
                }
            ],
            footer: {
                text: "test",
                icon_url: "https://cdn3.iconfinder.com/data/icons/social-icons-5/606/Twitter.png"
            }
        }));
    }
});
//
// 
// 
//
const cityID = "2537878";
const cityCords = {
    lat: 32.1667,
    lon: -8.8334
}
// ALL CALLS ARE MADE BY CITY ID
const OpenWeatherMap_APIcalls = {
    current: `https://api.openweathermap.org/data/2.5/weather?id=${cityID}&appid=${process.env.OpenWheather_TOKEN}`,
    list: `http://api.openweathermap.org/data/2.5/forecast?id=${cityID}&appid=${process.env.OpenWheather_TOKEN}`,
    uvIndex: `https://api.openweathermap.org/data/2.5/uvi?lat=${cityCords.lat}&lon=${cityCords.lon}&appid=${process.env.OpenWheather_TOKEN}`
}
// 
const interval = 1000;
// 
/*setInterval(async () => {
    var data = await requestData(OpenWeatherMap_APIcalls.current);
    console.log(data.base);
}, interval);*/
// 
async function requestData(url) {
    let data = null;
    var options = {
        method: 'GET',
        uri: url,
        resolveWithFullResponse: true
    };
    // 
    const result = await request(options);
    if (result.statusCode == 200)
        data = JSON.parse(result.body);
    // 
    return data;
}