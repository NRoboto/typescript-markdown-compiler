export interface IVisitable {
  Accept: (visitor: IVisitor) => void;
}

export interface IVisitor {
  VisitNode: (node: TreeNode) => void;
}

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

  Accept(visitor: IVisitor) {
    visitor.VisitNode(this);
  }
}
