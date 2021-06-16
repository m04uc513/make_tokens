const fs = require('fs');

var tokenp = process.argv[2];
var paperp = process.argv[3];

var tokenf = fs.readFileSync(tokenp, 'utf-8');
var tokens = JSON.parse(tokenf);

var id2token = [];

var keys = Object.keys(tokens);
for (const key of keys) {
  //console.log("key: %s, id: %d", key, tokens[key]);
  id2token[tokens[key]] = key;
}
/*
for (var i = 0; i < id2token.length; i++) {
  console.log("%d: %s", i, id2token[i]);
}
*/
var paperf = fs.readFileSync(paperp, 'utf-8');
var papers = JSON.parse(paperf);

for (var i = 0; i < papers.length; i++) {
  //console.log("# %d: %d", i, papers[i].length);
  for (var j = 0; j < papers[i].length; j++) {
    var str;
    if (j == 0) {
      str = String(id2token[papers[i][j]]);
    } else {
      str = " "+id2token[papers[i][j]];
    }
    process.stdout.write(str);
  }
  console.log('');
}
