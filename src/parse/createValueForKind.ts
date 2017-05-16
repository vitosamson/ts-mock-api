// import * as ts from 'typescript';
// import * as faker from 'faker';
// import { get, random } from 'lodash';

// export default function createValueForKind(kind: ts.SyntaxKind, member: ts.PropertySignature, modifiers: any) {
//   switch (kind) {
//     case ts.SyntaxKind.StringKeyword: {
//       let generator: (length: number) => string;
//       if (modifiers.type && get(faker, modifiers.type)) {
//         generator = get(faker, modifiers.type) as typeof generator;
//       } else {
//         generator = faker.lorem.words;
//       }

//       const length = modifiers.length ?
//         parseInt(modifiers.length, 10) :
//         random(
//           modifiers.minLength ? parseInt(modifiers.minLength, 10) : 5,
//           modifiers.maxLength ? parseInt(modifiers.maxLength, 10): 20
//         );

//       return generator(length);
//     }

//     case ts.SyntaxKind.NumberKeyword: {
//       return random(
//         modifiers.min ? parseInt(modifiers.min, 10): 0,
//         modifiers.max ? parseInt(modifiers.max, 10) : 20000
//       );
//     }

//     case ts.SyntaxKind.LiteralType: {
//       const literal = (member.type as ts.LiteralTypeNode).literal as ts.LiteralExpression;
//       switch (literal.kind) {
//         case ts.SyntaxKind.NumericLiteral:
//           return parseFloat(literal.text);
//         default:
//           return literal.text.trim();
//       }
//     }

//     // case ts.SyntaxKind.InterfaceDeclaration:


//     // case ts.SyntaxKind.TypeLiteral: // object
//     //   break;

//     // case ts.SyntaxKind.TypeReference:
//     //   break;
//   }
// }
