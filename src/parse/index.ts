import * as ts from 'typescript';
import createObjectFactory from './createObjectFactory';
import factories from '../factoryStore';

export default function parse(code: string) {
  const source = ts.createSourceFile('', code, ts.ScriptTarget.Latest, true);
  ts.forEachChild(source, node => {
    if (node.kind === ts.SyntaxKind.InterfaceDeclaration) {
      const interfaceDeclaration = node as ts.InterfaceDeclaration;
      const isExported = !!interfaceDeclaration.modifiers && interfaceDeclaration.modifiers.some(m => m.kind === ts.SyntaxKind.ExportKeyword);
      const { route, factory } = createObjectFactory(interfaceDeclaration);
      factories.set(route, { factory, isExported });
    }
  });
  return factories;
}
