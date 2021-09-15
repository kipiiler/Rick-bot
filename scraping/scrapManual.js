const fs = require("fs");
const re = /(?<name>^(?!\[)(?!Read more).+): (?<message>.+)$/gm;

const createCsvWriter = require("csv-writer").createObjectCsvWriter;

const csvWriter = createCsvWriter({
  path: "./file.csv",
  header: [
    { id: "index", title: "index" },
    { id: "name", title: "name" },
    { id: "line", title: "line" },
  ],
});

function escape(value) {
  if (!['"', "\r", "\n", ","].some((e) => value.indexOf(e) !== -1)) {
    return value;
  }
  return '"' + value.replace(/"/g, '""') + '"';
}

try {
  const data = fs.readFileSync(
    "./script/Something_Ricked_This_Way_Comes.txt",
    "utf8"
  );
  const matches = data.match(re);
  let arr = [];
  for (const match of matches) {
    let detailArr = match.split(": ");
    detailArr.unshift(arr.length);
    obj = {
      index: detailArr[0],
      name: detailArr[1],
      line: detailArr[2],
    };

    arr.push(obj);
  }

  csvWriter
    .writeRecords(arr) // returns a promise
    .then(() => {
      console.log("...Done");
    });
} catch (err) {
  console.error(err);
}
