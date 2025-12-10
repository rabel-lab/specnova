import crypto from 'crypto';
import { createReadStream } from 'fs';

export type Sha256String = string;

export async function digestFile(filePath: string): Promise<Sha256String> {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha256');
    const stream = createReadStream(filePath);
    stream.on('data', (chunk) => hash.update(chunk));
    stream.on('end', () => resolve(hash.digest('hex')));
    stream.on('error', reject);
  });
}

export async function digestString(text: string): Promise<Sha256String> {
  try {
    const hash = crypto.createHash('sha256');
    hash.update(text);
    return Promise.resolve(hash.digest('hex'));
  } catch (e) {
    return Promise.reject(e);
  }
}

/**
 * Compare two sha256 strings.
 * @param digests - Promise<[Sha256String, Sha256String]>
 * @returns - Resolve -> true if identical
 *            Reject -> Failed
 */
export async function compareSha256(
  digests: [Promise<Sha256String> | Sha256String, Promise<Sha256String> | Sha256String],
): Promise<boolean> {
  try {
    const [hash1, hash2] = await Promise.race(digests);
    if (hash1 === hash2) {
      Promise.resolve(true);
    } else {
      Promise.reject();
    }
  } catch (error) {
    Promise.reject(error);
  }
  return false;
}
