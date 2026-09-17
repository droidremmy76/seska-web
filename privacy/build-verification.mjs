import { readFile, writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// Account-issued public verification values only. Empty config writes no files.
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const config = JSON.parse(await readFile(process.argv[2] || new URL('./verification.example.json', import.meta.url), 'utf8'));
if (config.googleHtmlFile && !/^google[a-zA-Z0-9]+\.html$/.test(config.googleHtmlFile)) throw new Error('Use the exact Google-issued verification filename.');
if (config.bingVerificationCode && !/^[a-fA-F0-9]{32}$/.test(config.bingVerificationCode)) throw new Error('Use the 32-character Bing verification code.');
// Validate every value before writing anything; never overwrite existing proof files.
if (config.googleHtmlFile) {
  await writeFile(resolve(root, config.googleHtmlFile), `google-site-verification: ${config.googleHtmlFile}`, { flag: 'wx' });
  console.log(`Created ${config.googleHtmlFile}`);
}
if (config.bingVerificationCode) {
  await writeFile(resolve(root, 'BingSiteAuth.xml'), `<?xml version="1.0"?>\n<users>\n  <user>${config.bingVerificationCode}</user>\n</users>\n`, { flag: 'wx' });
  console.log('Created BingSiteAuth.xml');
}
if (!config.googleHtmlFile && !config.bingVerificationCode) console.log('No verification values supplied; no proof files generated.');
