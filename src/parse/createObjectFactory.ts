import * as ts from 'typescript';
import { random, times, get } from 'lodash';
import * as faker from 'faker';
import factoryStore, { FactoryMap } from '../factoryStore';

export default function createObjectFactory(node: ts.InterfaceDeclaration): () => any {
  const factory = () => {
    const obj: {[key: string]: any} = {};

    ts.forEachChild(node, (member: ts.PropertySignature) => {
      if (member.kind === ts.SyntaxKind.PropertySignature) {
        const fieldName = (member.name as ts.Identifier).text;
        obj[fieldName] = createValue(member);
      }
    });

    return obj;
  };

  return factory;
}

function createValue(member: ts.PropertySignature) {
  const modifiers = parseMemberComments(member);

  if (member.type && member.type.kind) {
    switch (member.type.kind) {
      case ts.SyntaxKind.ArrayType: {
        const arr: any[] = [];
        const arrNode = member.getChildren().find(c => c.kind === ts.SyntaxKind.ArrayType) as ts.ArrayTypeNode;

        if (!arrNode) return arr;

        const length = modifiers.length ?
          parseInt(modifiers.length, 10) :
          random(
            modifiers.minLength ? parseInt(modifiers.minLength, 10) : 2,
            modifiers.maxLength ? parseInt(modifiers.maxLength, 10) : 10,
          );

        const propSig = ts.createPropertySignature(
          '',
          undefined,
          arrNode.elementType,
          undefined,
        );

        times(length, () => arr.push(createValue(propSig)));

        return arr;
      }

      case ts.SyntaxKind.TypeLiteral: {
        const obj: any = {};
        const literal = member.getChildren().find(c => c.kind === ts.SyntaxKind.TypeLiteral);

        if (!literal) return obj;

        ts.forEachChild(literal, (child: ts.PropertySignature) => {
          obj[(child.name as ts.Identifier).text] = createValue(child);
        });

        return obj;
      }

      case ts.SyntaxKind.TypeReference: {
        const name = ((member.type as ts.TypeReferenceNode).typeName as ts.Identifier).text;
        if (factoryStore.has(name)) {
          return (factoryStore.get(name) as FactoryMap).factory();
        }

        const typeArguments = (member.type as ts.TypeReferenceNode).typeArguments;
        // const propSig: ts.PropertySignature = Object.assign({}, ...typeArguments.map(ta => createValue(ts.createPropertySignature(
        //   '',
        //   undefined,
        //   ta,
        //   undefined,
        // ))));

        const propSig: ts.PropertySignature = ts.createPropertySignature(
          '',
          undefined,
          Object.assign({}, ...typeArguments.map(ta => createValue(
            { type: ta } as ts.PropertySignature
          ))),
          undefined
        );

        return createValue(propSig);
      }

      case ts.SyntaxKind.StringKeyword: {
        let generator: (length: number) => string;
        if (modifiers.type && get(faker, modifiers.type)) {
          generator = get(faker, modifiers.type) as typeof generator;
        } else {
          generator = faker.lorem.words;
        }

        const length = modifiers.length ?
          parseInt(modifiers.length, 10) :
          random(
            modifiers.minLength ? parseInt(modifiers.minLength, 10) : 5,
            modifiers.maxLength ? parseInt(modifiers.maxLength, 10): 20
          );

        return generator(length);
      }

      case ts.SyntaxKind.NumberKeyword: {
        return random(
          modifiers.min ? parseInt(modifiers.min, 10): 0,
          modifiers.max ? parseInt(modifiers.max, 10) : 20000
        );
      }

      case ts.SyntaxKind.LiteralType: {
        const literal = (member.type as ts.LiteralTypeNode).literal as ts.LiteralExpression;
        switch (literal.kind) {
          case ts.SyntaxKind.NumericLiteral:
            return parseFloat(literal.text);
          default:
            return literal.text.trim();
        }
      }
    }
  }
}

interface ParsedInterfaceComment {
  resource?: string;
}

interface ParsedMemberComment {
  max?: string;
  min?: string;
  length?: string;
  maxLength?: string;
  minLength?: string;
  type?: string;
}

export function parseInterfaceComments(node: ts.InterfaceDeclaration) {
  const source = node.getSourceFile();
  const pos = node.pos;
  try {
    const comments = ts.getLeadingCommentRanges(source.text, pos);
    return parseComments(source, comments) as ParsedInterfaceComment;
  } catch (e) {
    return {};
  }
}

function parseMemberComments(member: ts.PropertySignature) {
  const source = member.getSourceFile();
  const pos = member.end;
  try {
    const comments = ts.getTrailingCommentRanges(source.text, pos);
    return parseComments(source, comments) as ParsedMemberComment;
  } catch (e) {
    return {};
  }
}

function parseComments(source: ts.SourceFile, comments?: ts.CommentRange[]): any {
  if (Array.isArray(comments)) {
    return comments.reduce((acc: any, commentData) => {
      const commentText = source.text.substring(commentData.pos, commentData.end).substring(2).trim();

      if (commentText && commentText.startsWith('@')) {
        const commentParts = commentText
          .substring(1)
          .split(',')
          .map(c => c.split(':'));

        commentParts
          .filter(c => !! c && !!c.length)
          .map(([param, val]) => {
            acc[param.trim()] = val.trim();
          });
      }

      return acc;
    }, {});
  }

  return {};
}
