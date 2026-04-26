import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";
import { env } from "~/env.mjs";

cloudinary.config({
  cloud_name: env.CLOUDINARY_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

export const bufferUpload = async (buffer: Buffer) => {
  return new Promise((resolve, reject) => {
    const writeStream = cloudinary.uploader.upload_stream((err, result) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(result);
    });
    
    const readStream = new Readable({
      read() {
        this.push(buffer);
        this.push(null);
      },
    });
    readStream.pipe(writeStream);
  });
};

// async function getBrowserInstance() {
//   const executablePath = await chromium.executablePath;

//   // if (!executablePath) {
//   //   // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-var-requires
//   //   const puppeteer = require('puppeteer');

//   //   // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
//   //   return puppeteer.launch({
//   //     args: chromium.args,
//   //     headless: true,
//   //     defaultViewport: {
//   //       width: 1280,
//   //       height: 720,
//   //     },
//   //     ignoreHTTPSErrors: true,
//   //   });
//   // }

//   return chromium.puppeteer.launch({
//     args: chromium.args,
//     defaultViewport: {
//       width: 1280,
//       height: 720,
//     },
//     executablePath,
//     headless: chromium.headless,
//     ignoreHTTPSErrors: true,
//   });
// }
