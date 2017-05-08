import * as ts from 'typescript';
import { random } from 'lodash';
import factoryStore, { FactoryMap } from '../factoryStore';
import createValueForKind from './createValueForKind';

export interface IFactory {
  route: string;
  factory: () => any;
}

export default function createObjectFactory(node: ts.InterfaceDeclaration): IFactory {
  const { resource } = parseInterfaceComments(node);
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

  return {
    route: (resource || (node.name as any).text).replace('/', ''),
    factory,
  }
}

function createValue(member: ts.PropertySignature) {
  const modifiers = parseMemberComments(member);
  let kind;

  if (member.type && member.type.kind) {
    if (member.type.kind === ts.SyntaxKind.ArrayType) {

    } else if (member.type.kind === ts.SyntaxKind.TypeLiteral) {
      const obj: any = {};
      ts.forEachChild(member, (subMember: ts.PropertySignature) => {
        console.log('subMember', ts.SyntaxKind[subMember.kind])
        if (subMember.kind === ts.SyntaxKind.PropertySignature) {
          const fieldName = (subMember.name as ts.Identifier).text;
          obj[fieldName] = createValue(subMember);
        }
      });
      return obj;
    } else {
      return createValueForKind(member.type.kind, member, modifiers);
    }
  }
}

// function createArrayValue(isArray: boolean, min: number, max: number, factory: Function) {
//   if (!isArray) return factory();
//   return times(random(min, max), () => factory());
// }

/* function createValue(member: ts.PropertySignature) {
  let kind;
  let isArrayKind = false;
  // let fieldValue;

  if (member.type && member.type.kind) {
    if (member.type.kind === ts.SyntaxKind.ArrayType) {
      const elType = (member.type as ts.ArrayTypeNode).elementType;
      if (elType.kind === ts.SyntaxKind.TypeReference) {
        isArrayKind = true;
        kind = (elType as ts.TypeReferenceNode).typeName.kind;
      } else {
        kind = elType.kind;
      }
    } else {
      kind = member.type.kind;
    }
  }

  if (!kind) return undefined;

  const comments = parseMemberComments(member);

  switch (kind) {
    case ts.SyntaxKind.StringKeyword:
      const length = comments.length ? parseInt(comments.length, 10) : null;
      const maxLength = comments.maxLength ? parseInt(comments.maxLength, 10) : 100;
      const minLength = comments.minLength ? parseInt(comments.minLength, 10) : 1;
      return length ? 'a'.repeat(length) : 'a'.repeat(random(minLength, maxLength));

    case ts.SyntaxKind.NumberKeyword:
      const max = comments.max ? parseFloat(comments.max) : 1000;
      const min = comments.min ? parseFloat(comments.min) : 0;
      return random(min, max);

    case ts.SyntaxKind.LiteralType: {
      const type = (member.type as ts.LiteralTypeNode);
      const literal = type.literal as ts.LiteralExpression;

      switch (type.literal.kind) {
        case ts.SyntaxKind.NumericLiteral:
          return parseFloat(literal.text);
        default:
          return (type.literal as any).text;
      }
    }

    case ts.SyntaxKind.TypeReference: {
      const type = member.type as any;
      const referencedTypeName = type.typeName.text;
      if (factoryStore.has(referencedTypeName)) {
        const { factory } = (factoryStore.get(referencedTypeName) as FactoryMap);
        return factory();
      }
      break;
    }
  }
} */

interface ParsedInterfaceComment {
  resource?: string;
}

interface ParsedMemberComment {
  max?: string;
  min?: string;
  length?: string;
  maxLength?: string;
  minLength?: string;
}

function parseInterfaceComments(node: ts.InterfaceDeclaration) {
  const source = node.getSourceFile();
  const pos = node.pos;
  const comments = ts.getLeadingCommentRanges(source.text, pos);
  return parseComments(source, comments) as ParsedInterfaceComment;
}

function parseMemberComments(member: ts.PropertySignature) {
  const source = member.getSourceFile();
  const pos = member.end;
  const comments = ts.getTrailingCommentRanges(source.text, pos);
  return parseComments(source, comments) as ParsedMemberComment;
}

function parseComments(source: ts.SourceFile, comments?: ts.CommentRange[]): any {
  if (Array.isArray(comments)) {
    return comments.reduce((acc: any, commentData) => {
      const commentText = source.text.substring(commentData.pos, commentData.end).substring(2).trim();

      if (commentText && commentText.startsWith('##')) {
        const commentParts = commentText
          .substring(2)
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
