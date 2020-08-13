import { Button } from "./button.js";

class Select extends HTMLElement {
    constructor() {
        super();
        const shadowRoot = this.attachShadow({ mode: 'open' });

        shadowRoot.innerHTML = `
            <style>
            </style>
            
        `;
    }
}


if (!customElements.get("i-select")) {
    customElements.define("i-select", Select);
}



export { Select };