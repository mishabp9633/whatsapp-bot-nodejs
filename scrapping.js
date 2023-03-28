// const jsdom = require("jsdom");
// const { JSDOM } = jsdom;
// const axios = require("axios");
// const app = express();
// app.set("view engine", "ejs");

// const URL = "https://www.malabargoldanddiamonds.com/malabarprice/index/currentGoldRate/";

// async function fetchData() {
//   try {
//     const response = await axios.get(URL, {
//       method: "GET",
//       headers: {
//         "upgrade-insecure-requests": 1,
//         "User-Agent":" Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
//         "Accept":"text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
//       },
//     });

//     const { document } = (new JSDOM(response.data.data)).window;
//     console.log(response.data.data);
//     let data = document.querySelector(".golddprice_today table tr:first-child td:last-child").textContent
//       console.log("data:",data);
      
//       let price = data.match(/\d+/g).join('');
      
//       return price;

//   } catch (error) {
//     console.log(error, "==error");
//   }
// }