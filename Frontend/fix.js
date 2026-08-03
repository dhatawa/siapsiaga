const fs = require('fs');
const files = ['public/index.html', 'public/edukasi.html', 'public/alerts.html', 'public/cctv.html', 'public/berita.html'];

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  
  // Clean double classes for nav links
  // E.g. <a href="berita.html" class="nav-btn" \n \n id="nav-berita" class="nav-btn active"
  content = content.replace(/<a([^>]*)class=\"([^\"]*)\"([^>]*)class=\"([^\"]*)\"([^>]*)>/g, (m, before1, class1, between, class2, after) => {
     let c1 = class1.includes('active') || class2.includes('active') ? 'nav-btn active' : 'nav-btn';
     return `<a ${before1}${between} class="${c1}" ${after}>`;
  });
  
  fs.writeFileSync(f, content);
});

console.log('Fixed Double Classes');
