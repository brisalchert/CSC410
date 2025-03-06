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

    result += `Frame: ${this.name}\n\n`;
    result += `Superset: ${(this.superset != null ? this.superset.name : "None")}\n\n`; // Check for superset first
    result += `Subsets: ${(this.subsets.length !== 0 ? this.subsets.map(set => set.name).join(", ") : "None")}\n\n` // Check for subsets first
    result += "Inherited Attributes:\n";

    // List inherited attributes if applicable
    if (this.inheritedAttributes != null && Object.keys(this.inheritedAttributes).length > 0) {
      result += Object.entries(this.inheritedAttributes).map(
        ([key, value]) => `\t${key}: ${value}`
      ).join("\n") + "\n\n";
    } else {
      result += "\tNone\n\n";
    }

    result += "Unique Attributes:\n"

    // List attributes if specified
    if (this.attributes != null && Object.keys(this.attributes).length > 0) {
      result += Object.entries(this.attributes).map(
        ([key, value]) => `\t${key}: ${value}`
      ).join("\n") + "\n\n";
    } else {
      result += "\tNone\n\n";
    }

    return result;
  }
}

const animal = new Frame("Animal", null, {
  hasSkin: "Yes",
  hasEyes: "Yes"
});

const fish = new Frame("Fish", animal, {
  canSwim: "Yes",
  hasScales: "Yes",
  floats: "Yes"
})

const shark = new Frame("Shark", fish, {
  canBite: "Yes",
  isApex: "Yes",
  floats: "No"
})

const salmon = new Frame("Salmon", fish, {
  isEdible: "Yes",
  freshwater: "Yes"
})

const bird = new Frame("Bird", animal, {
  flies: "Yes",
  hasBeak: "Yes"
});

const ostrich = new Frame("Ostrich", bird, {
  flies: "No",
  runs: "Yes"
});

const canary = new Frame("Canary", bird, {
  small: "Yes"
});

// Construct the semantic network
framesToTree(animal)

function framesToTree(rootFrame) {
  // Create a group for the tree
  const svg = d3.select("svg"), g = svg.append("g");
  const width = svg.attr("width"), height = svg.attr("height");

  // Create the hierarchy data
  const root = d3.hierarchy(rootFrame, d => d.subsets);
  const treeLayout = d3.tree()
    .size([width - 200, height - 200])
    .separation((a, b) => (a.parent === b.parent ? 2 : 3));
  treeLayout(root)

  // Center tree horizontally
  const centerX = width / 2;
  const offsetX = centerX - root.x;
  g.attr("transform", `translate(${offsetX}, 50)`);

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
  document.querySelector("#dialog-title").textContent = `Frame: ${frame.name}`;
  const tableBody = document.querySelector("#dialog-table-body");

  // Clear the table
  tableBody.innerHTML = "";

  // Add frame attributes to the table
  tableBody.innerHTML += `<tr><th scope="row">Name</th><td>${frame.name}</td></tr>`;
  if (frame.superset != null) {
    tableBody.innerHTML += `<tr><th scope="row">Superset</th><td>${frame.superset.name}</td></tr>`;
  }
  if (frame.subsets != null && frame.subsets.length > 0) {
    tableBody.innerHTML += `<tr><th scope="row">Subsets</th><td>${frame.subsets.map(set => set.name).join(", ")}</td></tr>`;
  }
  if (frame.inheritedAttributes != null) {
    Object.keys(frame.inheritedAttributes).forEach(key => {
      tableBody.innerHTML += `<tr><th scope="row">${key}</th><td>${frame.inheritedAttributes[key]}</td></tr>`;
    })
  }
  if (frame.attributes != null) {
    Object.keys(frame.attributes).forEach(key => {
      tableBody.innerHTML += `<tr><th scope="row">${key}</th><td>${frame.attributes[key]}</td></tr>`;
    })
  }

  dialog.showModal();
}
