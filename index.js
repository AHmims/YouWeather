// const Discord = require('discord.js');
const request = require('request-promise');
var AsciiTable = require('ascii-table');
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
    emojis: {
        sunCloud: ":white_sun_cloud:"
    }
};
// 
// 
client.on('message', async msg => {
    if (msg.content === '*weather') {
        // msg.reply('Pong!');
        let data = await requestData(OpenWeatherMap_APIcalls.list);
        // msg.reply(data.base);
        // msg.channel.send(data.base);
        // 
        const DataToGet = ["temp", "humidity", "weather", "rain", "wind"];
        let table = new AsciiTable();
        table
            .setBorder('║', '═', '╔', '╝')
            .setHeading('', 'Temp', 'Humi', 'Sky', 'Rain', 'Wind')
        // 
        let forcast = [];
        for (let i = 0; i < 5; i++) {
            forcast.push(getForcastByDT(data.list, data.list[i].dt))
        }
        table.addRowMatrix(forcast);
        // 
        msg.channel.send(new RichEmbed({
            title: `${resources.emojis.sunCloud} Weather Forcast For Safi :`,
            client: "3li",
            description: `Showing Data for : ${getDate()}`,
            color: "35583",
            thumbnail: {
                url: resources.forcastLogo,
                width: 100
            },

            fields: [{
                    name: "This bot Uses the OpenWeatherMap forcast data.",
                    value: "This services runs periodically every 3 hours !",
                    inline: false
                },
                {
                    name: "Forcast :",
                    value: "```" + `${table.toString()}` + "```"
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
//         const DataToGet = ["temp", "humidity", "weather", "rain", "wind"];

function getForcastByDT(list, id) {
    let res = [null, null, null, null, "null", null];
    // 
    list.forEach(element => {
        if (element.dt == id) {
            res[0] = convertFromUnix(element.dt, "time");
            res[1] = `${convertFromKelvin(element.main.temp)}°C`;
            res[2] = `${element.main.humidity}%`;
            res[3] = element.weather[0].main;
            if (element.weather[0].main == "Rain")
                res[4] = element.rain["3h"];
            res[5] = `${element.wind.speed}m/s`;
        }
    });
    // 
    return res;
}
// 
function getDate() {
    var res = new Date();
    // 
    var month = res.getMonth();
    if (month < 12) month += 1;
    // 
    res = `${res.getHours()}:${res.getMinutes()} - ${res.getDate()}/${month}/${res.getFullYear()}`;
    // 
    return res;
}

function convertFromUnix(timeStamp, retValue) {
    let ret = new Date(timeStamp * 1000);
    // 
    let month = ret.getMonth();
    if (month < 12) month += 1;
    // 
    switch (retValue) {
        case "full":
            ret = `${ret.getHours()}:${ret.getMinutes()} - ${ret.getDate()}/${month}/${ret.getFullYear()}`;
            break;
        case "date":
            ret = `${ret.getDate()}/${month}/${ret.getFullYear()}`;
            break;
        case "time":
            ret = `${ret.getHours()}:${ret.getMinutes()}`;
            break;
    }
    // 
    return ret;
}

function convertFromKelvin(degree) {
    const FormulaValue = 272.15;
    // 
    return Math.floor(degree - FormulaValue);
}