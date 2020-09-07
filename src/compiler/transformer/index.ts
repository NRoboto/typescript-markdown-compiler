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
  readonly astRoot: ASTRoot;
  constructor(readonly root: RootNode) {
    const astTransformer = new ASTTransformer();
    root.Accept(astTransformer);
    this.astRoot = astTransformer.root;

    const treeLogger = new TreeLogger<ASTBranch>(
      (node) =>
        `{${node.nodeID}, ${node.nodeType}, ${node.content}, ${node.count}}`
    );
    astTransformer.root.Accept(treeLogger);
  }
}

class ASTTransformer extends TreeTraverser {
  private readonly nodeAssembler = new ASTNodeAssembler();
  get root(): ASTRoot {
    return this.nodeAssembler.root;
  }

  VisitNode(node: TreeNode) {
    let nodeAdded = false;
    const hasChildren = node.HasChildren();
    if (IsBranchNode(node)) {
      nodeAdded = this.nodeAssembler.AddNode(node, hasChildren);
    }

    super.VisitNode(node);
    if (hasChildren && nodeAdded) this.nodeAssembler.ExitNode();
  }
}

class ASTNodeAssembler {
  readonly root = new ASTRoot();
  private currNode: ASTNode = this.root;
  private nodeID = 1;
  private newLineInQueue = true;

  AddNode(node: BranchNode, enterNode?: boolean) {
    let astType = this.ASTTypeFromToken(node.token);

    if (
      astType === "boldit" &&
      this.currNode.nodeType === "boldit" &&
      this.currNode.childCount === 0
    ) {
      this.currNode.count++;
      return false;
    }

    if (astType === "newline") {
      if (this.newLineInQueue) this.AddNewLine();
      this.newLineInQueue = true;
      return false;
    }

    if (this.newLineInQueue) {
      if (
        astType === "blockquote" &&
        this.currNode.lastChild?.nodeType === "blockquote"
      ) {
        this.currNode = this.currNode.lastChild;
        this.newLineInQueue = true;
        return false;
      }
    } else {
      switch (node.token.symbol.symbolType) {
        case "#":
        case "-":
        case ">":
          astType = "text";
          enterNode = false;
          break;
      }
    }

    this.AddNewLine();

    const newNode = new ASTBranch(
      this.nodeID++,
      this.currNode,
      astType,
      node.token.value,
      node.token.value.length
    );
    this.currNode.AddChild(newNode);
    if (enterNode) this.currNode = newNode;

    return true;
  }

  ExitNode() {
    if (this.currNode instanceof ASTBranch) {
      this.currNode = this.currNode.parent;
    }
  }

  private AddNewLine() {
    if (!this.newLineInQueue) return;
    if (this.nodeID !== 1)
      this.currNode.AddChild(
        new ASTBranch(this.nodeID++, this.currNode, "newline", "\\n")
      );
    this.newLineInQueue = false;
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
            return "boldit";
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
