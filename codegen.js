const fs = require('node:fs/promises');
const path = require('node:path');
const YAML = require('yaml');

async function main() {
  const yaml = await fs.readFile(path.join('src', 'data.yaml'), 'utf-8');
  const data = YAML.parse(yaml);
  const json = JSON.stringify(data, null, 2);

  const header = `import type { JsonData } from "modules/list/slice"\n\nconst data: JsonData = `;
  const footer = `\n\nexport default data;\n`

  const ts = [header, json, footer].join('');
  await fs.writeFile(path.join('src', 'data.ts'), ts);
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
