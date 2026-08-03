const fs = require('fs');
let code = fs.readFileSync('public/js/app.js', 'utf8');

// replace document.getElementById('XYZ').innerHTML =  with safe assignment
code = code.replace(/document\.getElementById\((['\"])(.*?)\1\)\.innerHTML\s*=\s*([^;]+);/g, "const el_$2 = document.getElementById('$2'); if(el_$2) el_$2.innerHTML = $3;");

code = code.replace(/document\.getElementById\((['\"])(.*?)\1\)\.textContent\s*=\s*([^;]+);/g, "const elTxt_$2 = document.getElementById('$2'); if(elTxt_$2) elTxt_$2.textContent = $3;");

// Also fix some multi-line innerHTML assignments that end with semicolon
// Actually JS regex is limited, let's just make a simple safe getter function block at the top
if(!code.includes('function safeSet')) {
   code = `
function safeSet(id, prop, val) {
  const el = document.getElementById(id);
  if(el) el[prop] = val;
}
` + code;
}

// Just replace basic ones
code = code.replace(/document\.getElementById\((['\"])([^'\"]+)\1\)\.innerHTML\s*=\s*([^;]+);/g, "safeSet('$2', 'innerHTML', $3);");
code = code.replace(/document\.getElementById\((['\"])([^'\"]+)\1\)\.textContent\s*=\s*([^;]+);/g, "safeSet('$2', 'textContent', $3);");

fs.writeFileSync('public/js/app.js', code);
console.log('Patched app.js');
