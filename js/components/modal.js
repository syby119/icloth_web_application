import { Icon } from "./icon.js"
import { Button } from "./button.js"


class Modal extends HTMLElement {
    constructor({type} = {}) {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.innerHTML = `
            <style>
            :host {
                position: fixed;
                left: 0;
                top: 0;
                right: 0;
                bottom: 0;
                z-index: -1;
                background: rgba(0, 0, 0, 0.3);
                visibility: hidden;
                opacity: 0;
                backdrop-filter: blur(3px);
                transition: 0.3s;
            }
            :host([open]) {
                opacity: 1;
                z-index: 10;
                visibility:visible;
            }
            :host slot[name=modal-header] {

            }
            :host slot[name=modal-body] {

            }
            :host slot[name=modal-footer] {
                
            }
            .modal {
                display: flex;
                position: relative;
                min-width: 360px;

            }
            .modal-content {

            }
            .modal-title {

            }
            .modal-body {

            }
            .modal-footer {

            }
            </style>
            <div class="modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <slot name="modal-title"></slot>
                        <i-button class="btn-close"><i-icon name="close"></i-icon></i-button>
                    </div>
                    <div class="modal-body">
                        <slot name="modal-body"></slot>
                    </div>
                    <div class="modal-footer">
                        <slot name="modal-footer"></slot>
                    </div>
                </div>
            </div>
        `;
    }

    get open() { return this.getAttribute("open") !== null; }
    set open(val) {
        if (val === null || val === false) {
            this.removeAttribute("open");
        } else {
            this.setAttribute("open", "");
        }
    }

    connectedCallback() {

    }
};

if (!customElements.get("i-modal")) {
    customElements.define("i-modal", Modal);
}

export { Modal }

