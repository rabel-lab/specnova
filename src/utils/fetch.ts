import { readFileSync } from 'fs';
import { resolve as path, extname as pathExtname } from 'path';
import fetch from 'node-fetch';
import { OpenApiSource } from '../types/type';
import { parseSource } from '@/core';

/**
 * Extract an OpenAPI spec from a URL or local file path.
 * @param {string} input - URL or local file path
 * @returns An object with `text`, `pathname` and `extension` properties.
 */
export async function fetchOpenApiSource(input: string): Promise<OpenApiSource> {
  parseSource(input);
  console.log('🔨 Extracting OpenAPI spec from:', input);
  let text;
  if (input.startsWith('http://') || input.startsWith('https://')) {
    const res = await fetch(input);
    if (!res.ok) throw new Error('❌ Failed to fetch spec: ' + res.statusText);
    text = await res.text();
  } else {
    text = readFileSync(path(process.cwd(), input), 'utf8');
  }

  const pathname =
    input.startsWith('http://') || input.startsWith('https://') ? new URL(input).pathname : input;

  const extension = pathExtname(pathname).toLowerCase();

  return { text, pathname, extension };
}
