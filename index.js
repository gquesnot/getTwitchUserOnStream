const puppeteer = require("puppeteer");


var result = []
async function getTwitchChatUsersByStream(streamStr){
    const browser = await puppeteer.launch({
        headless: true,
    });

    const page = await browser.newPage();
    await page.setViewport({width: 1920, height:1080})
    page.on('response', async response => {

        if (response.url() === "https://gql.twitch.tv/gql" && response.request().initiator().type !== "preflight") {
            let text = await response.text()
            if (text.includes("moderators")){
                let body = JSON.parse(text)
                for (let user of body[0].data.channel.chatters.viewers){
                    result.push(user.login)
                }
            }
        }
    })
    await page.goto('https://www.twitch.tv/' + streamStr);


    await page.waitForNavigation()
    let btn = await page.$("button[data-test-selector='chat-viewer-list']")
    if (btn){
        await btn.click();
        await page.waitForSelector("div.chat-viewers-list>div:nth-child(2)");
        // return await page.evaluate(() =>
        //     Array.from(document.querySelectorAll("div.chat-viewers-list>div:nth-child(2) button")).map(d => d.getAttribute("data-username"))
        // )
    }
}

var start = new Date().getTime();
getTwitchChatUsersByStream("blastpremier")
    .then(()=> {


        console.log(result)
        var end = new Date().getTime();
        var time = end - start;
        console.log('Execution time: ' + time);
    })


