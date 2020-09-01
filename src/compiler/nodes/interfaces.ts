import { TreeNode } from "./";

export interface IVisitable {
  Accept: (visitor: IVisitor) => void;
}

export interface IVisitor {
  VisitNode: (node: TreeNode) => void;
}
