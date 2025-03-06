import './style.css'
import javascriptLogo from './javascript.svg'
import viteLogo from '/vite.svg'
import {setupCounter} from './counter.js'

document.querySelector('#app').innerHTML = `
  <div>
    <a href="https://vite.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
      <img src="${javascriptLogo}" class="logo vanilla" alt="JavaScript logo" />
    </a>
    <h1>Hello Vite!</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <p class="read-the-docs">
      Click on the Vite logo to learn more
    </p>
  </div>
`

setupCounter(document.querySelector('#counter'))

class Frame {
  constructor(name, superset, attributes = {}) {
    this.name = name
    this.subsets = []

    // Assign superset if applicable
    if (superset != null) {
      this.superset = superset;
      superset.subsets.push(name)
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
    result += `Subsets: ${(this.subsets.length !== 0 ? this.subsets : null)}\n` // Check for subsets first
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

console.log(ostrich.toString());
