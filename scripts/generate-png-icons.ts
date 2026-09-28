import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

// Simple CRC32 implementation for PNG chunks
function makeCrcTable() {
  const cTable = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      if (c & 1) {
        c = 0xedb88320 ^ (c >>> 1);
      } else {
        c = c >>> 1;
      }
    }
    cTable[n] = c;
  }
  return cTable;
}

const crcTable = makeCrcTable();

function crc32(buf: Buffer): number {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function createChunk(type: string, data: Buffer): Buffer {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);

  const typeBuf = Buffer.from(type, 'ascii');
  const typeAndData = Buffer.concat([typeBuf, data]);

  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(typeAndData), 0);

  return Buffer.concat([len, typeAndData, crc]);
}

function generatePngBuffer(width: number, height: number, isMaskable: boolean = false): Buffer {
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // 8 bits per channel
  ihdr[9] = 6; // RGBA
  ihdr[10] = 0; // Deflate
  ihdr[11] = 0; // Filter
  ihdr[12] = 0; // Non-interlaced

  const ihdrChunk = createChunk('IHDR', ihdr);

  // Generate pixels (RGBA)
  // Each row has 1 filter byte (0) + width * 4 bytes
  const rowLength = 1 + width * 4;
  const rawData = Buffer.alloc(rowLength * height);

  const cx = width / 2;
  const cy = height / 2;
  const maxRadius = Math.min(width, height) / 2;
  const safeZone = isMaskable ? maxRadius * 0.75 : maxRadius * 0.9;

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowLength;
    rawData[rowOffset] = 0; // Filter: None

    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Default background: #0f172a (dark slate)
      let r = 15;
      let g = 23;
      let b = 42;
      let a = 255;

      // Isometric diamond / pipeline core
      const diamondDist = (Math.abs(dx) / (safeZone * 0.9)) + (Math.abs(dy) / (safeZone * 0.65));

      if (diamondDist < 0.85) {
        // Emerald gradient: #10b981 to #059669
        const factor = (y / height);
        r = Math.round(16 + factor * 20);
        g = Math.round(185 - factor * 40);
        b = Math.round(129 - factor * 30);
      } else if (diamondDist < 0.98) {
        // Cyan / Emerald border
        r = 56;
        g = 189;
        b = 248;
      } else if (dist < safeZone && Math.abs(dy) < safeZone * 0.75 && Math.abs(dx) < safeZone * 0.75) {
        // Ambient glow
        r = 20;
        g = 35;
        b = 55;
      }

      rawData[pxOffset] = r;
      rawData[pxOffset + 1] = g;
      rawData[pxOffset + 2] = b;
      rawData[pxOffset + 3] = a;
    }
  }

  const deflated = zlib.deflateSync(rawData);
  const idatChunk = createChunk('IDAT', deflated);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

const publicDir = path.resolve(process.cwd(), 'public');

// 1. pwa-192x192.png
const pwa192 = generatePngBuffer(192, 192, false);
fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), pwa192);

// 2. pwa-512x512.png
const pwa512 = generatePngBuffer(512, 512, false);
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), pwa512);

// 3. pwa-maskable-512x512.png (with 20% safe zone padding)
const pwaMaskable = generatePngBuffer(512, 512, true);
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), pwaMaskable);

// 4. apple-touch-icon.png (180x180 for iOS)
const appleIcon = generatePngBuffer(180, 180, false);
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), appleIcon);

// 5. favicon-32x32.png
const fav32 = generatePngBuffer(32, 32, false);
fs.writeFileSync(path.join(publicDir, 'favicon-32x32.png'), fav32);

// 6. favicon-16x16.png
const fav16 = generatePngBuffer(16, 16, false);
fs.writeFileSync(path.join(publicDir, 'favicon-16x16.png'), fav16);

// 7. favicon.ico containing 16x16 and 32x32 images
function createIcoFile(images: Array<{ width: number; height: number; buffer: Buffer }>): Buffer {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // Reserved
  header.writeUInt16LE(1, 2); // Type 1: Icon
  header.writeUInt16LE(images.length, 4); // Number of images

  let currentOffset = 6 + images.length * 16;
  const entries: Buffer[] = [];
  const imageBuffers: Buffer[] = [];

  for (const img of images) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(img.width >= 256 ? 0 : img.width, 0);
    entry.writeUInt8(img.height >= 256 ? 0 : img.height, 1);
    entry.writeUInt8(0, 2); // Color palette
    entry.writeUInt8(0, 3); // Reserved
    entry.writeUInt16LE(1, 4); // Color planes
    entry.writeUInt16LE(32, 6); // Bits per pixel
    entry.writeUInt32LE(img.buffer.length, 8); // Size of image data
    entry.writeUInt32LE(currentOffset, 12); // Offset of image data
    entries.push(entry);
    imageBuffers.push(img.buffer);
    currentOffset += img.buffer.length;
  }

  return Buffer.concat([header, ...entries, ...imageBuffers]);
}

const icoBuffer = createIcoFile([
  { width: 16, height: 16, buffer: fav16 },
  { width: 32, height: 32, buffer: fav32 },
]);
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuffer);

console.log('✅ Generated PWA Icons & Favicons successfully:');
console.log(' - public/pwa-192x192.png');
console.log(' - public/pwa-512x512.png');
console.log(' - public/pwa-maskable-512x512.png');
console.log(' - public/apple-touch-icon.png');
console.log(' - public/favicon-32x32.png');
console.log(' - public/favicon-16x16.png');
console.log(' - public/favicon.ico');

console.log(' - public/pwa-512x512.png');
console.log(' - public/pwa-maskable-512x512.png');
console.log(' - public/apple-touch-icon.png');
