import axios from 'axios';
import fs from 'fs';
import https from 'https';
import request from 'request';

const regex = /src="https([^"]+)"/gi;
const { get } = axios;
let arrayUrlImages;
let arrayOfTenImages = [];
let arrayConvertObjToString = [];
let dataFromServer;
let i = 0;

//request data from server
get('https://memegen-link-examples-upleveled.netlify.app/').then((response) => {
  if (response.status === 200) {
    dataFromServer = response.data;

    // extraxt url-images from server respond
    arrayUrlImages = dataFromServer.match(regex);
    arrayOfTenImages = Object.values(arrayUrlImages);
  } else {
    console.log(error);
  }

  // looping over array, get first 10 imgs, remove src= && "", save url in new array
  for (let i = 0; i < 10; i++) {
    arrayConvertObjToString[i] = arrayOfTenImages[i].substring(
      5,
      arrayOfTenImages[i].length - 1,
    );

    const url = arrayConvertObjToString[i];

    //create a writable stream and save the received data stream to path
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
});
