const puppeteer = require("puppeteer");
const fs = require("fs");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const prettify = require("html-prettify");

const regex = /(^(?!\[)(?!Read more).+): (.+)$/gm;

async function splitName(url) {
  replaceuni = url.replace(":", "");
  const arr = replaceuni.split("/");
  return arr[arr.length - 2];
}

async function createTxtFile(url, content) {
  if (content) fs.writeFileSync(`${splitName(url)}.txt`, content);
}

function createDataCsv(matches, url) {
  if (!matches || !matches.length) {
    console.log("Error with regex: " + splitName(url));
    createTxtFile(url, "Regex can't match");
    return;
  }
  let arr = [];
  matches.map((match) => {
    let detailArr = match.split(": ");
    detailArr.unshift(arr.length + 1);
    obj = {
      index: detailArr[0],
      name: detailArr[1],
      line: detailArr[2],
    };
    // console.log(obj);
    arr.push(obj);
  });
  return arr;
}

async function createCsvFile(url, data) {
  if (data) {
    const csvWriter = createCsvWriter({
      path: `./data/${splitName(url)}.csv`,
      header: [
        { id: "index", title: "index" },
        { id: "name", title: "name" },
        { id: "line", title: "line" },
      ],
    });
    console.log(`Creating: ${splitName(url)}`);
    csvWriter
      .writeRecords(data) // returns a promise
      .then(() => {
        console.log("Done");
      });
  } else return false;
}

async function renderCSVfromURL(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url, { timeout: 0 });

  const targetHTML = await page.$$eval(
    ".mw-parser-output > :not(table) ",
    async (els) => {
      if (!els.length) {
        return null;
      }
      let reduced = els.reduce(
        (prev, current) => prev + "\n" + current.innerHTML
      );

      return { arr: reduced, length: els.length };
    }
  );
  if (!targetHTML) {
    console.log("Error with current item: " + splitName(url));
    await createTxtFile(url, "Query return null");
    browser.close();
    return;
  }

  const strippedScript = targetHTML.arr.replace(/<[^>]*>?/gm, "");
  const matches = strippedScript.match(regex);
  const arrOfObjectifyScript = createDataCsv(matches, url);
  await createCsvFile(url, arrOfObjectifyScript);

  browser.close();
}

async function getAllEpisodeName(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url, { timeout: 0 });

  const texts = await page.$eval(
    "#mw-content-text > div > table.infobox-interior.mw-collapsible.mw-made-collapsible",
    async (e) => {
      return e.innerHTML.toString().replace(/<[^>]*>?/gm, "");
    }
  );
  createTxtFile(url, texts.replace(" • ", "\n"));
  browser.close();
}

async function generateAllCSVFile() {
  const arr = [
    "Pilot",
    "Lawnmower_Dog",
    "Anatomy_Park",
    "M._Night_Shaym-Aliens!",
    "Meeseeks_and_Destroy",
    "Rick_Potion_9",
    "Raising_Gazorpazorp",
    "Rixty_Minutes",
    "Something_Ricked_This_Way_Comes",
    "Close_Rick-Counters_of_the_Rick_Kind",
    "Ricksy_Business",
    "A_Rickle_in_Time",
    "Mortynight_Run",
    "Auto_Erotic_Assimilation",
    "Total_Rickall",
    "Get_Schwifty",
    "The_Ricks_Must_Be_Crazy",
    "Big_Trouble_In_Little_Sanchez",
    "Interdimensional_Cable_2:_Tempting_Fate",
    "Look_Who's_Purging_Now",
    "The_Wedding_Squanchers",
    "The_Rickshank_Rickdemption",
    "Rickmancing_the_Stone",
    "Pickle_Rick",
    "Vindicators_3:_The_Return_of_Worldender",
    "The_Whirly_Dirly_Conspiracy",
    "Rest_and_Ricklaxation",
    "Tales_From_the_Citadel",
    "Morty's_Mind_Blowers",
    "The_ABC's_of_Beth",
    "The_Rickchurian_Mortydate",
  ];
  const url = (name) =>
    `https://rickandmorty.fandom.com/wiki/${name}/Transcript`;

  for (let i in arr) {
    console.log("Progress: " + ((i + 1) / arr.length) * 10 + "%");
    await renderCSVfromURL(url(arr[i]));
  }
}

generateAllCSVFile();
