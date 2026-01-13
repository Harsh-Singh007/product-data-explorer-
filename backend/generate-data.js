const fs = require('fs');
const path = require('path');

try {
    // Read using simple relative path first
    const dumpPath = './cat-dump.json';
    const targetPath = './src/navigation/navigation.data.ts';

    if (!fs.existsSync(dumpPath)) {
        console.log('cat-dump.json not found in CWD');
        process.exit(1);
    }

    const rawData = fs.readFileSync(dumpPath, 'utf8');
    // Simple regex to check valid JSON end
    if (!rawData.trim().endsWith(']')) {
        console.log('JSON file looks truncated');
    }

    const data = JSON.parse(rawData);

    const tsContent = `export const STATIC_NAVIGATION_DATA = ${JSON.stringify(data, null, 2)};`;

    fs.writeFileSync(targetPath, tsContent);
    console.log(`Successfully generated ${targetPath} with ${data.length} items`);
} catch (e) {
    console.error('Error:', e);
}
