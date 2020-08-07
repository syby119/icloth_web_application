import { Button } from "./button.js"

class ButtonGroup extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: inline-flex;
                }
                ::slotted(i-button) {
                    margin:0 !important;
                }
                ::slotted(i-button:not(:first-of-type):not(:last-of-type)) {
                    border-radius: 0;
                }
                ::slotted(i-button:first-of-type) {
                    border-top-right-radius: 0;
                    border-bottom-right-radius: 0;
                }
                ::slotted(i-button:last-of-type) {
                    border-top-left-radius: 0;
                    border-bottom-left-radius: 0;
                }
                ::slotted(i-button:not(:first-of-type)) {
                    margin-left: -1px !important;
                }
            </style>
            <slot></slot>
        `;
    }
}

if (!customElements.get("i-button-group")) {
    customElements.define("i-button-group", ButtonGroup);
}

export { ButtonGroup }
