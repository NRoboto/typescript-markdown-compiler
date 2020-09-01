import { TreeTraverser, TreeNode, ASTNode, ASTRoot, ASTBranch } from "../nodes";
import { astTable } from "../symbolTable";

export class CodeGenerator {
  readonly html: string;
  constructor(readonly root: ASTRoot) {
    const codeGeneratorTraverser = new CodeGeneratorTraverser();
    root.Accept(codeGeneratorTraverser);
    this.html = codeGeneratorTraverser.html;
  }
}

class CodeGeneratorTraverser extends TreeTraverser {
  private _html: string = "";
  get html() {
    return this._html;
  }

  VisitNode(node: TreeNode) {
    const htmlTag = astTable[(node as ASTNode).nodeType].htmlTagContent;

    if (htmlTag) this._html += `<${htmlTag}>`;
    else if (node instanceof ASTBranch) this._html += node.content;
    super.VisitNode(node);
    if (htmlTag) this._html += `</${htmlTag}>`;
  }
}
