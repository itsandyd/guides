import ytdl from 'ytdl-core';
import fs from 'fs';
import path from 'path';
import AWS from 'aws-sdk';

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

export const downloadVideo = (url: string, bucketName: string, key: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        const videoStream = ytdl(url);
        const tempFilePath = path.join(__dirname, 'temp-video.mp4');
        const writeStream = fs.createWriteStream(tempFilePath);

        videoStream.pipe(writeStream);

        writeStream.on('finish', () => {
            console.log('Video downloaded to temporary file');

            const uploadParams = {
                Bucket: bucketName,
                Key: key,
                Body: fs.createReadStream(tempFilePath),
                ContentType: 'video/mp4',
            };

            s3.upload(uploadParams, (err: Error, data: AWS.S3.ManagedUpload.SendData) => {
                if (err) {
                    console.error(`Error uploading video to S3: ${err}`);
                    reject(err);
                } else {
                    console.log(`Uploaded video to S3 at ${data.Location}`);
                    fs.unlink(tempFilePath, (unlinkErr) => {
                        if (unlinkErr) {
                            console.error(`Error deleting temporary file: ${unlinkErr}`);
                        }
                        resolve(data.Location);
                    });
                }
            });
        });

        writeStream.on('error', (err) => {
            console.error(`Error downloading video: ${err}`);
            reject(err);
        });
    });
};