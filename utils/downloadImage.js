import fs from 'fs';
import https from 'https';
import http from 'http';
import path from 'path';

export function downloadImage(url, destDir, filename) {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith('https') ? https : http;
    if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
    const dest = path.join(destDir, filename);
    const file = fs.createWriteStream(dest);
    mod.get(url, response => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to get '${url}' (${response.statusCode})`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => file.close(() => resolve(dest)));
    }).on('error', err => {
      fs.unlink(dest, () => reject(err));
    });
  });
}