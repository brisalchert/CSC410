import './style.css'

class Frame {
  constructor(name, superset, attributes = {}) {
    this.name = name
    this.subsets = []

    // Assign superset if applicable
    if (superset != null) {
      this.superset = superset;
      superset.subsets.push(this)
    } else {
      this.superset = null;
    }

    // Assign inherited attributes
    if (this.superset != null) {
      this.inheritedAttributes = {...superset.inheritedAttributes, ...superset.attributes};
    } else {
      this.inheritedAttributes = null;
    }

    // Assign unique attributes
    this.attributes = attributes;

    // Override inherited attributes if necessary
    if (this.inheritedAttributes != null) {
      // Filter out overridden attributes
      this.inheritedAttributes = Object.fromEntries(
        Object.entries({...this.inheritedAttributes}).filter(([key]) =>
          !(key in this.inheritedAttributes && key in this.attributes)
        )
      );
    }
  }

  toString() {
    let result = "";

    result += `Frame: ${this.name}\n`;
    result += `Superset: ${(this.superset != null ? this.superset.name : null)}\n`; // Check for superset first
    result += `Subsets: ${(this.subsets.length !== 0 ? this.subsets.map(set => set.name) : null)}\n` // Check for subsets first
    result += `Inherited attributes: ${JSON.stringify(this.inheritedAttributes)}\n`;
    result += `Attributes: ${JSON.stringify(this.attributes)}`

    return result;
  }
}

const animal = new Frame("Animal", null, {
  hasSkin: true,
  hasEyes: true,
  coldBlooded: false
});

const bird = new Frame("Bird", animal, {
  flies: true,
  hasBeak: true
});

const ostrich = new Frame("Ostrich", bird, {
  flies: false,
  runs: true
});

const canary = new Frame("Canary", bird, {
  small: true
});

// Construct the semantic network
framesToTree(animal)

function framesToTree(rootFrame) {
  const width = 800, height = 600;
  const svg = d3.select("svg"), g = svg.append("g").attr("transform", "translate(100, 50)");

  // Create the hierarchy data
  const root = d3.hierarchy(rootFrame, d => d.subsets);
  const treeLayout = d3.tree().size([width - 200, height - 200]);
  treeLayout(root)

  // Set up links between nodes
  g.selectAll(".link")
    .data(root.links())
    .enter()
    .append("path")
    .attr("class", "link")
    .attr("d", d3.linkVertical()
      .x(d => d.x)
      .y(d => d.y)
    );

  // Create nodes
  const nodes = g.selectAll(".node")
    .data(root.descendants())
    .enter()
    .append("g")
    .attr("class", "node")
    .attr("transform", d => `translate(${d.x}, ${d.y})`);

  // Add circles for nodes
  nodes.append("circle").attr("r", 10);

  // Add text labels
  nodes.append("text")
    .attr("dy", ".35em")
    .attr("x", d => (d.subsets ? -15 : 15))
    .style("text-anchor", d => (d.subsets ? "end" : "start"))
    .text(d => d.data.name);

  // Add click event listener
  nodes.on("click", (event, d) => {
    showFrame(d.data);
  });
}

function showFrame(frame) {
  const dialog = document.querySelector("#dialog");
  document.querySelector("#dialog-text").textContent = frame;
  dialog.showModal();
}
