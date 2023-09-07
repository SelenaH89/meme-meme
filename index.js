import fs from 'node:fs';
import https from 'node:https';

try {
  if (!fs.existsSync('./memes')) {
    fs.mkdirSync('./memes');
  }
} catch (err) {
  console.error(err);
}

const url = 'https://memegen-link-examples-upleveled.netlify.app/';
const numberOfImages = 10;

const request = https.get(url, (response) => {
  if (response.statusCode !== 200) {
    console.error('Can not reach web site:', response.statusCode);
    return;
  }

  let data = '';

  response.on('data', (chunkData) => {
    data += chunkData;
  });

  response.on('end', () => {
    const imageUrls = extractImageUrl(data);

    if (imageUrls.length === 0) {
      console.log('Have no images.');
    } else {
      console.log('First 10 images:');
      imageUrls.slice(0, numberOfImages).forEach((imageUrl, index) => {
        //
        console.log(`${index + 1}: ${imageUrl}`);
      });
    }
  });
});

request.on('error', (error) => {
  console.error('Error:', error.message);
});

function extractImageUrl(html) {
  const imageUrlRegex = /<img[^>]+src=["']([^"']+)["']/gi;

  const matchesImages = [];
  let match;

  while ((match = imageUrlRegex.exec(html))) {
    matchesImages.push(match[1]);
  }

  return matchesImages;
}
