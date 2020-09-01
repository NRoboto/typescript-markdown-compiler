import { Token } from "../tokenizer";
import { TreeNode, RootNode, IsBranchNode, BranchNode } from "../nodes";

export class SyntacticAnalyser {
  readonly rootNode = new RootNode();

  constructor(readonly tokens: Token[]) {
    this.GenerateAST();
  }

  private GenerateAST() {
    let currNode: TreeNode = this.rootNode;
    let nodeID = 1;

    for (const token of this.tokens) {
      // Handle close on match tag, but not for consecutive tokens
      if (IsBranchNode(currNode)) {
        if (
          currNode.token.symbol.symbolElement?.matchCloses &&
          token.value === currNode.token.value &&
          nodeID !== currNode.nodeID + 1
        ) {
          currNode = currNode.parent;
          continue;
        }
      }

      // Handle close on line break
      if (token.type === "linebreak") {
        while (
          IsBranchNode(currNode) &&
          currNode.token.symbol.symbolElement?.newLineCloses
        ) {
          currNode = currNode.parent;
        }
      }

      const newNode = currNode.AddChild(
        new BranchNode(nodeID++, currNode, token)
      );

      // If token contains elements, set it to be the parent
      if (token.symbol.symbolElement?.hasChildren) {
        currNode = newNode;
      }
    }
  }
}
