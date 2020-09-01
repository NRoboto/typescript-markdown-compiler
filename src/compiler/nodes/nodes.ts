import { ASTNodeType } from "../symbolTable/types";
import { IVisitable, IVisitor } from "./";
import { Token } from "../tokenizer";

export abstract class TreeNode implements IVisitable {
  private children?: this[];
  constructor(readonly nodeID: number) {}

  AddChild(node: this) {
    if (this.children === undefined) this.children = [];

    this.children.push(node);
    return node;
  }

  GetChildren() {
    return (this.children ?? []) as readonly this[];
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
