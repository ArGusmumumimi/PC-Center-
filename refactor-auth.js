const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('route.ts')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk(path.join(process.cwd(), 'src/app/api'));

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;
  
  if (content.includes('ServerAuth.login')) {
    content = content.replace(/ServerAuth\.login/g, 'await ServerAuth.login');
    changed = true;
  }
  if (content.includes('ServerAuth.register')) {
    content = content.replace(/ServerAuth\.register/g, 'await ServerAuth.register');
    changed = true;
  }
  if (content.includes('ServerAuth.getSession')) {
    content = content.replace(/ServerAuth\.getSession/g, 'await ServerAuth.getSession');
    changed = true;
  }
  if (content.includes('ServerAuth.getUserByToken')) {
    content = content.replace(/ServerAuth\.getUserByToken/g, 'await ServerAuth.getUserByToken');
    changed = true;
  }
  
  if (changed) {
    fs.writeFileSync(file, content);
    console.log('Updated', file);
  }
});
