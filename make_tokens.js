const entities = require("entities");
const stopwords = require('nltk-stopwords')
var english = stopwords.load('english');

function RemovePunctuation(rawString)
{
  var punctuation = '!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~ –';
  var rawLetters = rawString.split('');
  var cleanLetters = rawLetters.filter(function(letter) {
    return punctuation.indexOf(letter) === -1;
  });
  var cleanString = cleanLetters.join('');
  return(cleanString);
}

function RemoveNumber(rawString)
{
  var number = '0123456789';
  var rawLetters = rawString.split('');
  var cleanLetters = rawLetters.filter(function(letter) {
    return number.indexOf(letter) === -1;
  });
  var cleanString = cleanLetters.join('');
  return(cleanString);
}

function preprocess_content(text)
{
  text = entities.decodeHTML(text);
  text = RemovePunctuation(text);
  text = RemoveNumber(text);
  text = stopwords.remove(text, english);
  return(text);
}


/*
 *
 */
const fs = require('fs');
//console.log("cwd: %s", process.cwd());
//console.log("path: %s", process.argv[2]);

var file = fs.readFileSync(process.cwd()+"/"+process.argv[2], 'utf-8');
var json = JSON.parse(file);
var text = preprocess_content(json.text);

var map = new Map();
var id2token = [];
var id2parag = [];
var paragraphs = text.split('\n');
for (var i = 0, n = 0; i < paragraphs.length; i++) {
  var tokens = paragraphs[i].split(' ');
  var paragr = [];
  for (var j = 0; j < tokens.length; j++, n++) {
    //console.log("%d: %s", n, tokens[j]);
    var id;
    if (map.has(tokens[j])) {
      id = map.get(tokens[j]);
    } else {
      id = id2token.length;
      map.set(tokens[j], id);
      id2token.push(tokens[j]);
    }
    paragr.push(id);
  }
  id2parag.push(paragr);
}

var token2id = {};
map.forEach(function(v, k){
  //console.log("k: %s, v: %d", k, v);
  token2id[k] = v;
});
//console.log(JSON.stringify(token2id, undefined, 2));
//console.log(JSON.stringify(id2token, undefined, 2));

fs.writeFile("wikipedia-tokens.json",
	     JSON.stringify(token2id, undefined, 2), 
	     function(err, result) {
	       if (err) console.log('error', err);
	     });
fs.writeFile("wikipedia-papers.json",
	     JSON.stringify(id2parag, undefined, 2), 
	     function(err, result) {
	       if (err) console.log('error', err);
	     });

