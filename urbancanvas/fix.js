const fs = require('fs');

const bgSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80">
  <rect width="80" height="80" fill="#202226"/>
  <g fill="none">
    <g transform="translate(20,20) rotate(45)">
      <rect x="-4" y="-15" width="10" height="30" rx="4" fill="#141517"/>
      <rect x="-5" y="-16" width="10" height="30" rx="4" fill="#2d3036"/>
      <path d="M-3,-14 L-3,14" stroke="#3b4047" stroke-width="1.5" stroke-linecap="round"/>
    </g>
    <g transform="translate(60,60) rotate(45)">
      <rect x="-4" y="-15" width="10" height="30" rx="4" fill="#141517"/>
      <rect x="-5" y="-16" width="10" height="30" rx="4" fill="#2d3036"/>
      <path d="M-3,-14 L-3,14" stroke="#3b4047" stroke-width="1.5" stroke-linecap="round"/>
    </g>
    <g transform="translate(60,20) rotate(-45)">
      <rect x="-4" y="-15" width="10" height="30" rx="4" fill="#141517"/>
      <rect x="-5" y="-16" width="10" height="30" rx="4" fill="#2d3036"/>
      <path d="M-3,-14 L-3,14" stroke="#3b4047" stroke-width="1.5" stroke-linecap="round"/>
    </g>
    <g transform="translate(20,60) rotate(-45)">
      <rect x="-4" y="-15" width="10" height="30" rx="4" fill="#141517"/>
      <rect x="-5" y="-16" width="10" height="30" rx="4" fill="#2d3036"/>
      <path d="M-3,-14 L-3,14" stroke="#3b4047" stroke-width="1.5" stroke-linecap="round"/>
    </g>
  </g>
</svg>`;

const b64 = Buffer.from(bgSvg).toString('base64');
const dataUri = `url("data:image/svg+xml;base64,${b64}")`;

let css = fs.readFileSync('src/app/globals.css', 'utf8');

css = css.replace(/body\s*\{[\s\S]*?background-attachment:\s*fixed;\n\}/m, `body {
  background-color: #202226;
  color: var(--color-metal-text);
  font-family: var(--font-sans);
  background-image: 
    radial-gradient(circle at 50% 0%, rgba(255, 255, 255, 0.08) 0%, rgba(0, 0, 0, 0.7) 100%),
    repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.01) 0px, rgba(255, 255, 255, 0.01) 1px, transparent 1px, transparent 4px),
    ${dataUri};
  background-attachment: fixed;
}`);

css = css.replace(/\.metallic-title\s*\{[\s\S]*?z-index:\s*10;/m, `.metallic-title {
  position: relative;
  display: inline-block;
  color: transparent;
  background-image: linear-gradient(to bottom, #ffffff 0%, #d4d4d4 30%, #a3a3a3 48%, #e5e5e5 52%, #8c8c8c 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-stroke: 1px rgba(0, 0, 0, 0.4);
  -webkit-text-fill-color: transparent;
  z-index: 10;`);

fs.writeFileSync('src/app/globals.css', css);
console.log('Fixed CSS');
