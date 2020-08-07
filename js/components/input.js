import { Tip } from "./tip.js"

class Input extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.innerHTML = `
            <style>
            </style>
            <input></input>

        `;
    }
};


export { Input }