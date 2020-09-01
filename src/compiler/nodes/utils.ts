import { TreeNode, BranchNode, ASTNode, IVisitor } from "./";

export const NodeHasParent = <T extends TreeNode>(
  node: T
): node is T & { parent: T } =>
  (node as T & { parent: T }).parent !== undefined;

export const IsBranchNode = (node: TreeNode): node is BranchNode =>
  (node as BranchNode).token !== undefined;
export const IsASTNode = (node: TreeNode): node is ASTNode =>
  (node as ASTNode).nodeType !== undefined;

/**
 * Any class which traverses a tree should extend this class.
 * VisitNode should be overloaded and super.VisitNode called at the end of the new function.
 */
export abstract class TreeTraverser implements IVisitor {
  private _depth = 0;
  public get depth() {
    return this._depth;
  }

  VisitNode(node: TreeNode) {
    this._depth++;
    node.GetChildren().forEach((child) => child.Accept(this));
    this._depth--;
  }
}

export class TreeLogger<T extends TreeNode = TreeNode> extends TreeTraverser {
  constructor(
    readonly outputFunction = (node: T) =>
      `{${node.nodeID}, ${IsBranchNode(node) ? node.token.value : "root"}}`
  ) {
    super();
  }

  VisitNode(node: TreeNode) {
    console.log("\t".repeat(this.depth) + this.outputFunction(node as T));
    super.VisitNode(node);
  }
}
