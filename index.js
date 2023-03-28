import express from "express";
import schedule from "node-schedule";
import axios from "axios";
import "dotenv/config";

import twilio from "twilio";

// for scrapping
import { JSDOM } from "jsdom";

const app = express();

const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;

const client = twilio(accountSid, authToken);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// scrapping api gold images
const IMAGEURL = "https://unsplash.com/s/photos/gold-jewellery"


async function fetchIamge() {
  try {
    const response = await axios
      .get(IMAGEURL, {
        method: "GET",
        headers: {
          "authority": "unsplash.com",
          "User-Agent":"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
          "Accept":"*/*",
        },
      })
      const { document } = (new JSDOM(response.data)).window
      // console.log(response.data);
      let imageurls = []
      document.querySelectorAll(".MorZF").forEach(element => {
        const imageElement = element.querySelector(".a5VGX")
    
        if (imageElement) {
          imageurls.push({
            image: imageElement.srcset
          });
        }
      });

imageurls = imageurls.slice(20);
imageurls = imageurls.slice(0, -12);

      console.log(imageurls.image);
      return imageurls

  } catch (error) {
    console.log(error, "==error");
  }
}

// // fetching api gold price
const URL =
  "https://www.malabargoldanddiamonds.com/malabarprice/index/currentGoldRate/?_=1679748127686";
async function fetchData() {
  try {
    let data;
    const response = await axios
      .get(URL, {
        method: "GET",
        headers: {
          "upgrade-insecure-requests": 1,
          "User-Agent":" Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
          "Accept":"text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        },
      })
      .then((response) => {
        data = { data: response.data.data };
        data = data["data"]
          .replace(
            `<div  class="golddprice_today"><h5><b>Today's Gold Rate</b></h5><table border="0" cellpadding="0" cellspacing="0" width="155"><tr><td>22 KT(916) - </td><td>Rs.  `,
            ""
          )
          .split("/g</td></tr><tr><td>")[0];
        console.log(data);
      });

    return data;
  } catch (error) {
    console.log(error, "==error");
  }
}

// =format&fit=crop&w=200&q=60 200w

// cron job
const job = schedule.scheduleJob("* */1 * * * *", async () => {

  const gramrate = await fetchData()
  const imageUrl = await fetchIamge()

  const randomIndex = Math.floor(Math.random() * imageUrl.length);
  let mediaUrl = await imageUrl[randomIndex].image.split(' ')[8];

  console.log(mediaUrl);

  const currentDate = new Date();
  const formattedDate = `${currentDate.getDate()}-${
    currentDate.getMonth() + 1
  }-${currentDate.getFullYear()}`;
  console.log(formattedDate);
  const gramRate = gramrate;
  const pavanRate = gramrate * 8;

  const message = `ഇന്നത്തെ സ്വർണ വില\n\nപവന് ${pavanRate} ഗ്രാമിന് ${gramRate} രൂപയായി\n\n${formattedDate}\n\nഗ്രാം     :   ${gramRate}\nപവന്   :   ${pavanRate}\n\nദിവസവും സ്വർണ്ണ വില അറിയുന്നതിന് ഞങ്ങളുടെ വാട്‌സ്ആപ്പ് ഗ്രൂപ്പിൽ അംഗമാവുക\n\nhttps://chat.whatsapp.com/LiHXqYPVjh49OV4WimWz76`;
  client.messages
    .create({
      from: "whatsapp:+14155238886",
      mediaUrl: mediaUrl,
      body: message,
      to: "whatsapp:+919633016190", // whatsapp no
    })
    .then((message) => console.log(message.sid));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
