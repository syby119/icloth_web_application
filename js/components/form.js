class Form extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.innerHTML = `
            <style>
            :host {
                display: block;
            }
            form {
                display: grid;
                grid-template-columns: auto 1fr;
                grid-gap: 0.8em;
                align-items: center;
                justify-items: end;
            }
            :host ::slotted(:not(i-form-item)) {
                justify-self: stretch;
                grid-column: span 2;
            }
            </style>
            <form method="${this.method}" 
                  action="${this.action}"
                  name="${this.name}" 
                  ${this.novalidate ? "novalidate" : ""}>
                <slot></slot>
            </form>
        `;
    }

    checkValidity() {
        if (this.novalidate) {
            return true;
        }

        const elements = [...this.elements].reverse();
        this.invalid = elements.some((el)=>{
            return el.checkValidity && !el.checkValidity();
        });

        return !this.invalid;
    }

    get disabled() { return this.getAttribute("disabled") !== null; }
    get method() { return (this.getAttribute("method") || "get").toUpperCase(); }
    get action() { return this.getAttribute("action") || ""; }
    get name() { return this.getAttribute("name"); }
    get formdata() {
        const formdata = new FormData();
        if (!this.disabled) {
            this.elements.forEach((el)=>{
                formdata.set(el.name, el.value);
            })
        }
        return formdata;
    }

    get novalidate() { return this.getAttribute("novalidate") !== null; }
    set novalidate(val) {
        if (val === null || val ===false) {
            this.removeAttribute("novalidate");
        } else {
            this.setAttribute("novalidate", "");
        }
    }

    get invalid() { return this.getAttribute("invalid") != null; }
    set invalid(val) {
        if (val === null || val === false) {
            this.removeAttribute("invalid");
        } else {
            this.setAttribute("invalid", "");
        }
    }

    connectedCallback() {
        this.form = this.shadowRoot.querySelector("form");
        this.elements = [...this.querySelectorAll("[name]:not([disabled])")];
        this.btnSubmit = this.shadowRoot.querySelector("[type=submit]");
        this.btnReset = this.shadowRoot.querySelector("[type=reset]");

        if (this.btnSubmit) {
            this.btnSubmit.addEventListener("click", (ev)=>{
                this.submit();
            });
        }
        if (this.btnReset) {
            this.btnReset.addEventListener("click", (ev)=>{
                this.reset();
            });
        }

        if (!this.novalidate) {
            this.elements.forEach((el)=>{
                if (el.tagName == "I-INPUT") {
                    el.addEventListener("input", (ev)=>{
                        this.invalid = !this.elements.every(el=>el.validity);
                    });
                } else {
                    el.addEventListener("change", (ev)=>{
                        this.invalid = !this.elements.every(el=>el.validity);
                    });
                }
            });
        }
    }

    async submit() {
        if (this.checkValidity() && !this.disabled) {
            if (this.action) {
                this.btnSubmit && (this.btnSubmit.loading = true);
                if (this.method == "GET") {
                    const params = new URLSearchParams(this.formdata).toString();
                    const response = await fetch(`${this.action}?${params}`, {
                        method: "GET"
                    });
                    this.btnSubmit && (this.btnSubmit.loading = false);
                    // the backend will response the following result
                    // .text() .json() .blob() .arrayBuffer() .formData()
                    if (response.headers.get("content-type") == "application/json") {
                        this.dispatchEvent(new CustomEvent("submit", {
                            detail: {
                                data: data.json()
                            }
                        }));
                    }
                    return response;
                } else if (this.method == "POST") {
                    const response = await fetch(this.action, {
                        method: "POST",
                        body: this.formdata
                    });
                    this.btnSubmit && (this.btnSubmit.loading = false);
                    // the backend will response the following result
                    // .text() .json() .blob() .arrayBuffer() .formData()
                    if (response.headers.get("content-type") == "application/json") {
                        this.dispatchEvent(new CustomEvent("submit", {
                            detail: {
                                data: data.json()
                            }
                        }));
                    }
                    return response;
                }
            }
        }
    }

    reset() {
        this.invalid = false;
        this.elements.forEach((el)=>{
            el.reset && el.reset();
        })
    }
};

if (!customElements.get("i-form")) {
    customElements.define("i-form", Form);
}

class FormItem extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: contents;
                }
                label {
                    color: var(--fontColor, #333333);
                }
                label.required:not(:empty)::before {
                    content:"*";
                    color: var(--errorColor, #f4615c);
                }
                label + div {
                    justify-self: stretch;
                }
            </style>
            <label>${this.legend}</label>
            <div><slot></slot></div>
        `;
    }

    get legend() { return this.getAttribute("legend") || ""; }
    set legend(val) { this.setAttribute("legend", val); }

    connectedCallback() {
        this.label = this.shadowRoot.querySelector("label");
        this.item = this.shadowRoot.querySelector("slot");
        this.item.addEventListener("slotchange", (ev)=>{
            this.input = this.shadowRoot.querySelector("[name]");
            if (this.input && this.input.required) {
                this.label.classList.add("required");
            }
        });
    }
};

if (!customElements.get("i-form-item")) {
    customElements.define("i-form-item", FormItem);
}

export { Form, FormItem }