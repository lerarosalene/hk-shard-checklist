const fs = require('node:fs/promises');
const path = require('node:path');
const YAML = require('yaml');
const esbuild = require('esbuild');

async function data() {
  const contents = await fs.readFile(path.join('src', 'data.yaml'), 'utf-8');
  const data = YAML.parse(contents);
  await fs.writeFile(path.join('dist', 'data.json'), JSON.stringify(data));
}

async function ts() {
  await esbuild.build({
    entryPoints: [path.join('src', 'index.tsx')],
    bundle: true,
    minify: true,
    outfile: path.join('dist', 'index.js'),
    define: {
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV ?? "production")
    }
  });
}

async function static() {
  await Promise.all([
    fs.copyFile(path.join('src', 'index.html'), path.join('dist', 'index.html')),
    fs.copyFile(path.join('src', 'index.css'), path.join('dist', 'index.css')),
    fs.copyFile(path.join('src', 'favicon.ico'), path.join('dist', 'favicon.ico')),
  ]);
}

async function main() {
  await fs.mkdir('dist', { recursive: true });
  await Promise.all([
    data(),
    ts(),
    static(),
  ]);
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
