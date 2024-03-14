const csv = require('csvtojson');
const fs = require('fs');

csv()
  .fromStream(fs.createReadStream('csv/data.csv', { autoClose: true }))
  .subscribe((row) => {
    fs.appendFile('csv/data.txt', JSON.stringify(row) + '\n', (error) => {
      if (error) {
        console.log(`File write error: ${error}`);
      }
    });
  });
