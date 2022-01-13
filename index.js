import pkg from 'axios';
import fs from 'fs';
import https from 'https';
import request from 'request';

const regex = /src="https([^"]+)"/gi;
const { get } = pkg;
let arrayUrlImages = [];
let arrayOfTenImages = [];
let arrayConvertObjToString = [];
let i = 0;

//request data from URL
get('https://memegen-link-examples-upleveled.netlify.app/').then((response) => {
  if (response.status === 200) {
    const html = response.data;

    // extraxt URL images from server respond
    arrayUrlImages = html.match(regex);
    arrayOfTenImages = Object.values(arrayUrlImages);
  } else {
    console.log(error);
  }

  // looping over first 10 imgs, remove src= && "", save URL in new array
  for (let i = 1; i < 10; i++) {
    arrayConvertObjToString[i] = arrayOfTenImages[i].substring(
      5,
      arrayOfTenImages[i].length - 1,
    );

    // url string to a img
    const url = arrayConvertObjToString[i];

    //create a writable stream and save the received data stream to path
    https.get(url, (res) => {
      const path = `./meme/0${i}.jpg`; //save file
      const writeStream = fs.createWriteStream(path);
      res.pipe(writeStream);

      writeStream.on('finish', () => {
        writeStream.close();
        console.log('Download Completed');
      });
    });
  }
});
