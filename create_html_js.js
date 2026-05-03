import fs from 'fs';
const html = fs.readFileSync('src/constants/genealogy.html', 'utf8');
const js = `export const genealogyHtml = ${JSON.stringify(html)};`;
fs.writeFileSync('src/constants/genealogyHtml.js', js);
console.log('Successfully generated genealogyHtml.js');
