"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
const createObjectFactory_1 = require("./createObjectFactory");
const factoryStore_1 = require("../factoryStore");
function parse(code) {
    const source = ts.createSourceFile('', code, ts.ScriptTarget.Latest, true);
    ts.forEachChild(source, node => {
        if (node.kind === ts.SyntaxKind.InterfaceDeclaration) {
            const interfaceDeclaration = node;
            const isExported = !!interfaceDeclaration.modifiers && interfaceDeclaration.modifiers.some(m => m.kind === ts.SyntaxKind.ExportKeyword);
            const modifiers = createObjectFactory_1.parseInterfaceComments(interfaceDeclaration);
            const factory = createObjectFactory_1.default(interfaceDeclaration);
            const route = modifiers.resource || interfaceDeclaration.name.text;
            factoryStore_1.default.set(route, { factory, isExported });
        }
    });
    return factoryStore_1.default;
}
exports.default = parse;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLGlDQUFpQztBQUNqQywrREFBb0Y7QUFDcEYsa0RBQXdDO0FBRXhDLGVBQThCLElBQVk7SUFDeEMsTUFBTSxNQUFNLEdBQUcsRUFBRSxDQUFDLGdCQUFnQixDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDM0UsRUFBRSxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUUsSUFBSTtRQUMxQixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLEVBQUUsQ0FBQyxVQUFVLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDO1lBQ3JELE1BQU0sb0JBQW9CLEdBQUcsSUFBK0IsQ0FBQztZQUM3RCxNQUFNLFVBQVUsR0FBRyxDQUFDLENBQUMsb0JBQW9CLENBQUMsU0FBUyxJQUFJLG9CQUFvQixDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLEtBQUssRUFBRSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUN4SSxNQUFNLFNBQVMsR0FBRyw0Q0FBc0IsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO1lBQy9ELE1BQU0sT0FBTyxHQUFHLDZCQUFtQixDQUFDLG9CQUFvQixDQUFDLENBQUM7WUFDMUQsTUFBTSxLQUFLLEdBQUcsU0FBUyxDQUFDLFFBQVEsSUFBSyxvQkFBb0IsQ0FBQyxJQUFzQixDQUFDLElBQUksQ0FBQztZQUN0RixzQkFBUyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQztRQUNoRCxDQUFDO0lBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDSCxNQUFNLENBQUMsc0JBQVMsQ0FBQztBQUNuQixDQUFDO0FBYkQsd0JBYUMifQ==