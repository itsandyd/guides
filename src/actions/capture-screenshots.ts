import ffmpeg from 'fluent-ffmpeg';

export const captureScreenshots = (videoUrl: string, outputDir: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        ffmpeg(videoUrl)
            .on('end', () => {
                console.log('Screenshots captured');
                resolve();
            })
            .on('error', reject)
            .screenshots({
                count: 50,
                folder: outputDir,
                size: '1920x1080',
                filename: 'screenshot-%i.png'
            });
    });
};