import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ES-Modul Workaround für __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDir = path.join(__dirname, 'src');
const outputDir = __dirname;
// Wie viele Dateien sollen in eine Textdatei gepackt werden?
const filesPerChunk = 7; 

// Welche Dateitypen sollen ausgelesen werden? (Bilder etc. ignorieren wir)
const allowedExtensions = ['.js', '.jsx', '.css'];

function getFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            getFiles(filePath, fileList);
        } else {
            if (allowedExtensions.includes(path.extname(file))) {
                fileList.push(filePath);
            }
        }
    }
    return fileList;
}

const allFiles = getFiles(srcDir);
let chunkIndex = 1;

for (let i = 0; i < allFiles.length; i += filesPerChunk) {
    const chunk = allFiles.slice(i, i + filesPerChunk);
    let outputContent = `--- CPR ASSIST - CODE TEIL ${chunkIndex} ---\n\n`;

    for (const file of chunk) {
        const relativePath = path.relative(__dirname, file);
        const content = fs.readFileSync(file, 'utf-8');
        outputContent += `\n// ==========================================\n`;
        outputContent += `// DATEI: ${relativePath}\n`;
        outputContent += `// ==========================================\n\n`;
        outputContent += content;
        outputContent += `\n\n`;
    }

    const outputFileName = `projekt_teil_${chunkIndex}.txt`;
    fs.writeFileSync(path.join(outputDir, outputFileName), outputContent);
    console.log(`✅ Erstellt: ${outputFileName} (${chunk.length} Dateien)`);
    chunkIndex++;
}

console.log('\n🚀 Fertig! Dein Code wurde erfolgreich portioniert.');