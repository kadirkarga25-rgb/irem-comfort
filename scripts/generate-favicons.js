import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const svgBuffer = fs.readFileSync('public/favicon.svg');

async function generateFavicons() {
  const publicDir = 'public';
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // 1. favicon-16x16.png
  await sharp(svgBuffer)
    .resize(16, 16)
    .png()
    .toFile(path.join(publicDir, 'favicon-16x16.png'));
  console.log('Generated favicon-16x16.png');

  // 2. favicon-32x32.png
  const png32Buffer = await sharp(svgBuffer)
    .resize(32, 32)
    .png()
    .toBuffer();
  fs.writeFileSync(path.join(publicDir, 'favicon-32x32.png'), png32Buffer);
  console.log('Generated favicon-32x32.png');

  // 3. apple-touch-icon.png (180x180)
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));
  console.log('Generated apple-touch-icon.png');

  // 4. android-chrome-192x192.png
  await sharp(svgBuffer)
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'android-chrome-192x192.png'));
  console.log('Generated android-chrome-192x192.png');

  // 5. android-chrome-512x512.png
  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'android-chrome-512x512.png'));
  console.log('Generated android-chrome-512x512.png');

  // 6. favicon.ico (wrap 32x32 PNG in standard ICO header)
  const icoHeader = Buffer.from([
    0x00, 0x00,             // Reserved
    0x01, 0x00,             // Type 1 (ICO)
    0x01, 0x00,             // 1 image
    32,                     // Width (32px)
    32,                     // Height (32px)
    0,                      // Palette count
    0,                      // Reserved
    1, 0,                   // Color planes
    32, 0,                  // Bits per pixel
    png32Buffer.length & 0xff,
    (png32Buffer.length >> 8) & 0xff,
    (png32Buffer.length >> 16) & 0xff,
    (png32Buffer.length >> 24) & 0xff,
    22, 0, 0, 0             // Offset (6 + 16 = 22)
  ]);

  const icoBuffer = Buffer.concat([icoHeader, png32Buffer]);
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuffer);
  console.log('Generated favicon.ico');

  // 7. site.webmanifest
  const manifest = {
    name: "İrem Comfort Ayakkabıcılık",
    short_name: "İrem Comfort",
    icons: [
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png"
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png"
      }
    ],
    theme_color: "#082C6C",
    background_color: "#FFFFFF",
    display: "standalone"
  };
  fs.writeFileSync(path.join(publicDir, 'site.webmanifest'), JSON.stringify(manifest, null, 2));
  console.log('Generated site.webmanifest');
}

generateFavicons().catch(err => {
  console.error(err);
  process.exit(1);
});
