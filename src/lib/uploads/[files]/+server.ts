import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { error } from '@sveltejs/kit';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOAD_DIR = path.join(__dirname, '../../../../lib/uploads');

export async function GET({ params }) {

   const [files] = params.file;
  const filePath = path.join(UPLOAD_DIR, files);
  try {
    const stats = await stat(filePath);
    if (!stats.isFile()) throw new Error('Not a file');
    return new Response(createReadStream(filePath), {
      headers: {
        'content-type': 'image/webp', // or sniff from extension
        'content-length': stats.size.toString()
      }
    });
  } catch {
    error(404, 'File not found');
  }
}