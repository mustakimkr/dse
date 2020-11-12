const dbQuery = require("./db/query");
const puppeteer = require("puppeteer");

/////////// insert companisss   ///////////////////////////
(async () => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto("https://www.dsebd.org/mkt_depth_3.php");
    const data = await page.evaluate(() => {
      const trs = Array.from(
        document.querySelectorAll(".inst.selectBox.text-center")
      );

      return trs.map((tr) => {
        return tr.innerText.split("\n");
      });
    });
    console.log(data);
    await browser.close();

    const placeholder = data[0].map(() => "(?)").join(",");

    const insertValue = [];
    data.map((values) =>
      values.map((value) => {
        insertValue.push(value);
      })
    );

    const insertDayEndArchive = `INSERT INTO companies (trading_code) VALUES ${placeholder}`;
    const DayEndArchive = await dbQuery(insertDayEndArchive, insertValue);

    console.log(DayEndArchive);
  } catch (error) {
    console.error(error);
  }
})();
