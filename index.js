const puppeteer = require("puppeteer");
function delay(time) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time)
    });
}

async function getTwitchChatUsersByStream(streamStr){
    const browser = await puppeteer.launch({
        headless: true,
    });
    const page = await browser.newPage();
    await page.setViewport({width: 1920, height:1080})
    await page.goto('https://www.twitch.tv/' + streamStr);


    await page.waitForNavigation()
    let btn = await page.$("button[data-test-selector='chat-viewer-list']")
    if (btn){
        await btn.click();
        await page.waitForSelector("div.chat-viewers-list>div:nth-child(2)");
        return await page.evaluate(() =>
            Array.from(document.querySelectorAll("div.chat-viewers-list>div:nth-child(2) button")).map(d => d.getAttribute("data-username"))
        )
    }
    return []



}


getTwitchChatUsersByStream("ogamingsc2")
    .then(r => console.log(r, r.length))
