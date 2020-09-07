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
    const [openTag, closeTag] = this.GetOpenCloseTags(node as ASTNode);

    this._html += openTag;
    if (openTag === "" && node instanceof ASTBranch) this._html += node.content;
    super.VisitNode(node);
    this._html += closeTag;
  }

  private GetOpenCloseTags(node: ASTNode): [string, string] {
    const astEle = astTable[node.nodeType];
    const tagContent = astEle.htmlTagGenerator(node);
    const tagContentArr =
      typeof tagContent === "object" ? tagContent : [tagContent];

    if (tagContentArr.some((x) => x !== "")) {
      if (astEle.tagIsSelfClosing)
        return [`<${tagContentArr.join("/><")}/>`, ""];
      return [
        `<${tagContentArr.join("><")}>`,
        `</${tagContentArr.reverse().join("></")}>`,
      ];
    }

    return ["", ""];
  }
}
