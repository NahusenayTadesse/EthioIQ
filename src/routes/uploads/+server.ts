// src/routes/api/upload/+server.ts
import { json } from '@sveltejs/kit';
import { createWriteStream } from 'node:fs';
import { mkdir } from 'node:fs/promises';
import { pipeline } from 'node:stream/promises';
import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const UPLOAD_DIR = path.join(__dirname, '../../lib/uploads'); // <-- here
await mkdir(UPLOAD_DIR, { recursive: true });

export async function POST({ request }) {
  const form = await request.formData();
  const file = form.get('file');
  if (!file || !file.name) throw new Error('missing file');

  const safeName = `${randomUUID()}-${file.name}`;
  const dest = path.join(UPLOAD_DIR, safeName);

  await pipeline(file.stream(), createWriteStream(dest));
  return json({ ok: true, name: safeName });
}