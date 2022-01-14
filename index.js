import fs from 'node:fs';
import https from 'node:https';
import axios from 'axios';

const regex = /src="https([^"]+)"/gi;
// const regex = /src=['|"](https:.*?)['|"]/gi;
const { get } = axios;
let dataFromServer;
let arrayUrlImages = [];
const arrayConvertObjToString = [];

// request data from server
get('https://memegen-link-examples-upleveled.netlify.app/')
  .then((response) => {
    if (response.status === 200) {
      dataFromServer = response.data;
      console.log(typeof dataFromServer);

      // extraxt url-images from server respond
      arrayUrlImages = dataFromServer.match(regex);
      console.log(typeof arrayUrlImages);
      // arrayOfTenImages = Object.values(arrayUrlImages);
    }

    // looping over array, get first 10 imgs, remove src= && "", save url in new array
    for (let i = 0; i < 10; i++) {
      arrayConvertObjToString[i] = arrayUrlImages[i].slice(
        5,
        arrayUrlImages[i].length - 1,
      );

      const url = arrayConvertObjToString[i];

      // create a writable stream and save the received data stream to path
      https.get(url, (res) => {
        let path;

        i !== 9
          ? (path = `./meme/0${i + 1}.jpg`)
          : (path = `./meme/${i + 1}.jpg`);

        const writeStream = fs.createWriteStream(path);
        res.pipe(writeStream);

        writeStream.on('finish', () => {
          writeStream.close();
          console.log('Download Completed');
        });
      });
    }
  })
  .catch((err) => console.error(err));
