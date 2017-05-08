require('source-map-support').install();

import { readFileSync } from 'fs';
import * as ts from 'typescript';
import * as express from 'express';
import { range } from 'lodash';
import createObjectFactory from './createObjectFactory';
import factories from './factoryStore';

const app = express();

const fileName = process.argv[2];
const file = readFileSync(fileName).toString();
const source = ts.createSourceFile(fileName, file, ts.ScriptTarget.Latest, true);

ts.forEachChild(source, node => {
  if (node.kind === ts.SyntaxKind.InterfaceDeclaration) {
    const interfaceDeclaration = node as ts.InterfaceDeclaration;
    const isExported = !!interfaceDeclaration.modifiers && interfaceDeclaration.modifiers.some(m => m.kind === ts.SyntaxKind.ExportKeyword);

    // if (isExported) {
      // factories.set(name, createObjectFactory(interfaceDeclaration));
    const { route, factory } = createObjectFactory(interfaceDeclaration);
    factories.set(route, { factory, isExported });
    // }
  }
});

for (const [name, { factory, isExported }] of factories.entries()) {
  if (!isExported) continue;

  console.log(`creating route /${name}`);
  app.get(`/${name}`, (req, res) => {
    res.json(range(5).map(() => factory()));
  });

  console.log(`creating route /${name}/:id`);
  app.get(`/${name}/:id`, (req, res) => {
    res.json(factory());
  });
}

// ts.forEachChild(source, node => {
//   if (node.kind === ts.SyntaxKind.InterfaceDeclaration) {
//     const interfaceDeclaration = node as ts.InterfaceDeclaration;
//     const name = interfaceDeclaration.name.text;
//     const isExported = interfaceDeclaration.modifiers &&
//       interfaceDeclaration.modifiers.some(m => m.kind === ts.SyntaxKind.ExportKeyword);

//     if (!isExported) return;

//     const obj: {[key: string]: any} = {};

//     ts.forEachChild(interfaceDeclaration, member => {
//       if (member.kind !== ts.SyntaxKind.PropertySignature) return;
//       const field = member as ts.PropertySignature;

//       if (!field.type) return;

//       const fieldName = (field.name as ts.Identifier).text;
//       let fieldValue;

//       switch (field.type.kind) {
//         case ts.SyntaxKind.StringKeyword:
//           fieldValue = 'mock string';
//           break;
//         case ts.SyntaxKind.LiteralType:
//           const type = (field.type as ts.LiteralTypeNode);
//           switch (type.literal.kind) {
//             case ts.SyntaxKind.NumericLiteral:
//               fieldValue = parseFloat((type.literal as any).text);
//               break;
//             default:
//               fieldValue = (type.literal as any).text;
//           }
//           break;
//       }

//       obj[fieldName] = fieldValue;
//     });

//     console.log('adding route for', name);
//     app.get(`/${name}`, (req, res) => {
//       res.json(obj);
//     });
//   }
// });

app.listen(8900, () => {
  console.log('listening at localhost:8900');
});
