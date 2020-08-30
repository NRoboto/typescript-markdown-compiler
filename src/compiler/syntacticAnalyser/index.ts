import { Token } from "../tokenizer";

// TODO: Use seperate root node to prevent undefined issues.

class Node {
  private children: Node[] = [];
  constructor(readonly parent?: Node, readonly token?: Token) {}

  AddChild(node: Node) {
    this.children.push(node);
    return node;
  }

  GetChildren() {
    return this.children as readonly Node[];
  }
}

export class SyntacticAnalyser {
  readonly rootNode: Node = new Node();

  constructor(readonly tokens: Token[]) {
    this.GenerateAST();
  }

  private GenerateAST() {
    let currNode = this.rootNode;

    for (const token of this.tokens) {
      if (
        currNode.token?.symbol.symbolElement?.matchCloses &&
        token.value === currNode.token.value
      ) {
        currNode = currNode.parent!;
        continue;
      }

      if (token.type === "linebreak") {
        while (currNode.token?.symbol.symbolElement?.newLineCloses) {
          currNode = currNode.parent!;
        }
      }

      const newNode = currNode.AddChild(new Node(currNode, token));

      if (token.symbol.symbolElement?.hasChildren) {
        currNode = newNode;
      }
    }
  }
}
