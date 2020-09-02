import { TreeTraverser, TreeNode, ASTNode, ASTRoot, ASTBranch } from "../nodes";
import { astTable } from "../symbolTable";
import { ASTNodeType } from "../symbolTable/types";

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
    const nodeType = (node as ASTNode).nodeType;
    const [openTag, closeTag] = this.GetOpenCloseTags(nodeType);

    // if (htmlTag) this._html += `<${htmlTag}>`;
    // else if (node instanceof ASTBranch) this._html += node.content;
    this._html += openTag;
    if (openTag === "" && node instanceof ASTBranch) this._html += node.content;
    super.VisitNode(node);
    this._html += closeTag;
    // if (htmlTag) this._html += `</${htmlTag}>`;
  }

  private GetOpenCloseTags(nodeType: ASTNodeType): [string, string] {
    const astEle = astTable[nodeType];

    if (astEle.htmlTagContent) {
      if (astEle.tagIsSelfClosing) return [`<${astEle.htmlTagContent}/>`, ""];
      else return [`<${astEle.htmlTagContent}>`, `</${astEle.htmlTagContent}>`];
    }

    return ["", ""];
  }
}
