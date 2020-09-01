import {
  TreeNode,
  TreeLogger,
  ASTNode,
  ASTBranch,
  RootNode,
  TreeTraverser,
  IsBranchNode,
  BranchNode,
  NodeHasParent,
  ASTRoot,
} from "../nodes";
import { ASTNodeType } from "../symbolTable/types";
import { Token } from "../tokenizer";

export class Transformer {
  constructor(readonly root: RootNode) {
    const astTransformer = new ASTTransformer();
    root.Accept(astTransformer);

    const treeLogger = new TreeLogger<ASTBranch>(
      (node) => `{${node.nodeID}, ${node.nodeType}, ${node.content}}`
    );
    astTransformer.root.Accept(treeLogger);
  }
}

class ASTTransformer extends TreeTraverser {
  private readonly nodeAssembler = new ASTNodeAssembler();
  get root(): RootNode {
    return this.nodeAssembler.root;
  }

  VisitNode(node: TreeNode) {
    const hasChildren = node.HasChildren();
    if (IsBranchNode(node)) {
      this.nodeAssembler.AddNode(node, hasChildren);
    }

    super.VisitNode(node);
    if (hasChildren) this.nodeAssembler.ExitNode();
  }
}

class ASTNodeAssembler {
  readonly root = new ASTRoot();
  private currNode: ASTNode = this.root;
  private prevNode?: ASTNode = undefined;
  private nodeID = 1;

  AddNode(node: BranchNode, enterNode?: boolean) {
    let astType = this.ASTTypeFromToken(node.token);

    if (this.prevNode && this.prevNode.nodeType !== "newline") {
      switch (node.token.symbol.symbolType) {
        case "#":
        case "-":
          debugger;
          astType = "text";
          enterNode = false;
          break;
      }
    }

    const newNode = new ASTBranch(
      this.nodeID++,
      this.currNode,
      astType,
      node.token.value
    );
    this.prevNode = this.currNode.AddChild(newNode);
    if (enterNode) this.currNode = newNode;
  }

  ExitNode() {
    if (NodeHasParent(this.currNode)) this.currNode = this.currNode.parent;
  }

  private ASTTypeFromToken(token: Token): ASTNodeType {
    switch (token.type) {
      case "linebreak":
        return "newline";
      case "listnumber":
        return "olistelement";
      case "text":
        return "text";
      case "symbol":
        switch (token.symbol.symbolType) {
          case "#":
            return "heading";
          case "*":
            return "bold";
          case ">":
            return "blockquote";
          case "-":
            return "ulistelement";
          case "`":
            return "code";
          case "\\":
            return "text";
          case "  ":
          case "\\n":
            return "newline";
          case "text":
            return "text";
        }
    }
  }
}
