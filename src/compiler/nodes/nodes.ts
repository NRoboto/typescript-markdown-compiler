import { ASTNodeType } from "../symbolTable/types";
import { IVisitable, IVisitor } from "./";
import { Token } from "../tokenizer";

export abstract class TreeNode implements IVisitable {
  private children?: this[];
  public get childCount() {
    return this.children?.length ?? 0;
  }
  public get lastChild() {
    return this.children ? this.children[this.childCount - 1] : undefined;
  }
  constructor(readonly nodeID: number) {}

  AddChild(node: this) {
    if (this.children === undefined) this.children = [];

    this.children.push(node);
    return node;
  }

  GetChildren() {
    return (this.children ?? []) as readonly this[];
  }

  GetChild(index: number) {
    return this.GetChildren()[index];
  }

  HasChildren() {
    return this.children !== undefined && this.children.length !== 0;
  }

  Accept(visitor: IVisitor) {
    visitor.VisitNode(this);
  }
}

export class RootNode extends TreeNode {
  constructor() {
    super(0);
  }
}

export class BranchNode extends TreeNode {
  constructor(
    nodeID: number,
    readonly parent: TreeNode,
    readonly token: Token
  ) {
    super(nodeID);
  }
}

export class ASTNode extends TreeNode {
  constructor(nodeID: number, readonly nodeType: ASTNodeType) {
    super(nodeID);
  }
}

export class ASTRoot extends ASTNode {
  constructor() {
    super(0, "markdown");
  }
}

export class ASTBranch extends ASTNode {
  constructor(
    nodeID: number,
    readonly parent: TreeNode,
    nodeType: ASTNodeType,
    readonly content: string
  ) {
    super(nodeID, nodeType);
  }
}
