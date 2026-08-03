const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');
const html = fs.readFileSync(path.join(publicDir, 'index.html'), 'utf8');

const prefixMatch = html.match(/([\s\S]*?)<!-- \=\=\=\=\=\=\=\=\=\=\=\= TAB 1\: BERANDA \/ DASHBOARD \=\=\=\=\=\=\=\=\=\=\=\= -->/);
const prefix = prefixMatch[1];

const t1 = html.match(/(<!-- \=\=\=\=\=\=\=\=\=\=\=\= TAB 1: BERANDA \/ DASHBOARD \=\=\=\=\=\=\=\=\=\=\=\= -->[\s\S]*?)<!-- \=\=\=\=\=\=\=\=\=\=\=\= TAB 2: EDUKASI \=\=\=\=\=\=\=\=\=\=\=\= -->/);
const t2 = html.match(/(<!-- \=\=\=\=\=\=\=\=\=\=\=\= TAB 2: EDUKASI \=\=\=\=\=\=\=\=\=\=\=\= -->[\s\S]*?)<!-- \=\=\=\=\=\=\=\=\=\=\=\= TAB 3: PERINGATAN DINI \=\=\=\=\=\=\=\=\=\=\=\= -->/);
const t3 = html.match(/(<!-- \=\=\=\=\=\=\=\=\=\=\=\= TAB 3: PERINGATAN DINI \=\=\=\=\=\=\=\=\=\=\=\= -->[\s\S]*?)<!-- \=\=\=\=\=\=\=\=\=\=\=\= TAB 4: CCTV BANJIR \=\=\=\=\=\=\=\=\=\=\=\= -->/);
const t4 = html.match(/(<!-- \=\=\=\=\=\=\=\=\=\=\=\= TAB 4: CCTV BANJIR \=\=\=\=\=\=\=\=\=\=\=\= -->[\s\S]*?)<!-- \=\=\=\=\=\=\=\=\=\=\=\= TAB 5: BERITA BENCANA \=\=\=\=\=\=\=\=\=\=\=\= -->/);
const t5 = html.match(/(<!-- \=\=\=\=\=\=\=\=\=\=\=\= TAB 5: BERITA BENCANA \=\=\=\=\=\=\=\=\=\=\=\= -->[\s\S]*?)<\/div>\s*<!-- end #views -->/);

const suffixMatch = html.match(/(<\/div>\s*<!-- end #views -->[\s\S]*)/);
let suffixBase = suffixMatch[1];

// Convert nav buttons to anchor links
suffixBase = suffixBase.replace(/<button([^>]*)class="([^"]*nav-btn[^"]*)"([^>]*)>([\s\S]*?)<\/button>/g, (match, prefixAttr, classNames, suffixAttr, inner) => {
    let newAttr = prefixAttr + suffixAttr;
    const idMatch = newAttr.match(/id="([^"]+)"/);
    const navId = idMatch ? idMatch[1] : '';

    let newHref = 'index.html';
    if (navId === 'nav-edukasi') newHref = 'edukasi.html';
    if (navId === 'nav-peringatan') newHref = 'alerts.html';
    if (navId === 'nav-cctv') newHref = 'cctv.html';
    if (navId === 'nav-berita') newHref = 'berita.html';

    // Remove active class to make it dynamic
    let newClassNames = classNames.replace(/\s*active\s*/g, ' ').trim();

    newAttr = newAttr.replace(/\bonclick="[^"]*"/g, '');
    newAttr = newAttr.replace(/\baria-selected="[^"]*"/g, '');
    newAttr = newAttr.replace(/\brole="tab"/g, '');

    return `<a href="${newHref}" class="${newClassNames}" ${newAttr}>${inner}</a>`;
});
// Need to add role="tab" and aria-selected="true/false" if needed, but it's an anchor now so skip.
// Also remove onclick from the nav wrapping element if there's any?
suffixBase = suffixBase.replace(/<nav([^>]*)role="tablist"([^>]*)>/, '<nav$1$2>');

function generatePage(tabContentRaw, activeId, filename) {
    let tabContent = tabContentRaw[1];

    // Make only the active view have "view active".
    // Wait, since we are only dumping ONE view per file, it should always have "active", otherwise it is display:none
    if (!tabContent.includes('class="view active"')) {
        tabContent = tabContent.replace(/class="view"/, 'class="view active"');
    }

    let suffixWithActive = suffixBase.replace(new RegExp(`id="${activeId}"`), `id="${activeId}" class="nav-btn active"`);

    const output = prefix + tabContent + "\n        " + suffixWithActive;
    fs.writeFileSync(path.join(publicDir, filename), output);
}

generatePage(t1, 'nav-home', 'index.html');
generatePage(t2, 'nav-edukasi', 'edukasi.html');
generatePage(t3, 'nav-peringatan', 'alerts.html');
generatePage(t4, 'nav-cctv', 'cctv.html');
generatePage(t5, 'nav-berita', 'berita.html');

console.log('Successfully generated 5 files.');
