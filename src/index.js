const dbQuery = require("./db/query");
const puppeteer = require("puppeteer");

////////      ************  Operation successful        ********    /////////
////               *******  Successfully inserted 257698 row ***  ///////
/////                  ***  Took approximately 25min      ****   /////

(async () => {
  try {
    // fetch companies
    const selectCompanies = "SELECT trading_code FROM companies;";
    const companies = await dbQuery(selectCompanies);

    console.log(companies);

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    for (let i = 0; i < companies.length; i++) {
      await page.goto(
        `https://www.dsebd.org/day_end_archive.php?startDate=2018-11-10&endDate=2020-11-10&inst=${companies[i].trading_code}&archive=data`
      );
      const data = await page.evaluate(() => {
        const trs = Array.from(
          document.querySelectorAll(
            ".table.table-bordered.background-white tbody tr"
          )
        );

        return trs.map((tr) => {
          return tr.innerText.split("\t");
        });
      });
      console.log(data);

      if (data[0][0] !== "No Day End Data") {
        const placeholder = data.map(() => "(?,?,?,?,?,?,?,?,?,?,?)").join(",");
        const insertValue = [];
        data.map((values) =>
          values.map((value, id) => {
            if (id === 0) {
              return;
            }
            if (value.includes(",")) {
              return insertValue.push(value.split(",").join(""));
            }
            insertValue.push(value);
          })
        );
        const insertDayEndArchive = `INSERT INTO security_price (date,trading_code,last_trade_price,day_high,day_low,open_price,close_price,yesterday_close_price,tarde,value_mn,volume) VALUES ${placeholder}`;
        const DayEndArchive = await dbQuery(insertDayEndArchive, insertValue);
        console.log(DayEndArchive);
      }
    }

    await browser.close();
  } catch (error) {
    console.error(error);
  }
})();
