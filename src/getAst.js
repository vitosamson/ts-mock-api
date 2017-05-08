// this is just used for quickly getting the ts ast into the node repl
// > var ast = require('./src/getAst)

const fs = require('fs');
const path = require('path');
const ts = require('typescript');

module.exports = ts.createSourceFile('types.ts', fs.readFileSync(path.resolve('types.ts')).toString(), ts.ScriptTarget.Latest, true);
