import { Icon } from "./icon.js";

class Img extends HTMLElement {
    constructor() {
        super();
        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.innerHTML = `
            <style>
                :host {
                    display: inline-block;
                    position: relative;
                    vertical-align: top;
                    overflow: hidden;
                    background: #eeeeee;
                    font-size: 14px;
                    color: #666666;
                }
                :host([alt])::before {
                    content: attr(alt);
                    position: absolute;
                    color: white;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    z-index: 1;
                    line-height: 1.5;
                    font-size: 14px;
                    padding: 5px 10px;
                    background: linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.5));
                    transform: translateY(100%);
                    transition: 0.3s;
                }
                :host([alt]:hover)::before {
                    transform: translateY(0);
                }
                :host([ratio*="/"]),
                :host([ratio*=":"]) {
                    width: 100%;
                    height: auto!important;
                }
                :host([ratio*="/"]) img,
                :host([ratio*=":"]) img {
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 100%;
                    height: 100%;
                }
                :host([ratio*="/"]) .placeholder,
                :host([ratio*=":"]) .placeholder {
                    position: relative;
                    padding-top: 100%;
                }
                img {
                    box-sizing: border-box;
                    color: transparent;
                    display: inline-block;
                    width: inherit;
                    height: inherit;
                    vertical-align: top;
                    border: 0;
                    opacity: 0;
                    transform: scale(1);
                    background: inherit;
                    object-fit: cover;
                    transition: 0.3s;
                }
                :host img[src] {
                    opacity: 1;
                    transform: scale(1);
                }
                :host(:not([error]):hover) img[src],
                :host(:focus-within) img[src] {
                    transform: scale(1.1);w
                }
                .placeholder {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    box-sizing: border-box;
                    background: inherit;
                    opacity: 0;
                    visibility: hidden;
                    transition: 0.3s;
                }
                :host([error]) .placeholder {
                    visibility: visible;
                    opacity: 1;
                }
                :host([error]) img {
                    padding: 0 20px;
                    min-width: 100px;
                    min-height: 100px;
                    transform: none;
                }
                .loading {
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%, -50%);
                    pointer-events: none;
                    opacity: 1;
                    transition: 0.3s;
                }
                img[src]+.loading, 
                :host([error]) .loading {
                    opacity: 0;
                    visibility: hidden;
                }
                .placeholder i-icon {
                    font-size: 1.15em;
                    margin-right: 0.4em;
                }
                .placeholder-icon {
                    position: absolute;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    left: 0;
                    right: 0;
                    top: 50%;
                    transform: translateY(-50%);
                }
                .animation {
                    width: 2em;
                    height: 2em;
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    grid-gap: 0.7em;
                    transform: rotate(45deg);
                    animation: rotation 1s infinite;
                }
                @keyframes rotation {
                    from {
                        transform: rotate(0deg);
                    }
                    to {
                        transform: rotate(360deg);
                    }
                }
                .animation>div {
                    border-radius: 50%;
                    background: var(--themeColor, #42b983);
                }
                .animation>div:nth-child(1) {
                    animation: animation1 0.3s ease 0s infinite alternate;
                }
                @keyframes animation1 {
                    from {
                        transform: translate(0, 0);
                    }
                    to {
                        transform: translate(5px, 5px);
                    }
                }
                .animation>div:nth-child(2) {
                    animation: animation2 0.3s ease 0s infinite alternate;
                }
                @keyframes animation2 {
                    from {
                        transform: translate(0, 0);
                    }
                    to {
                        transform: translate(-5px, 5px);
                    }
                }
                .animation>div:nth-child(3) {
                    animation: animation3 0.3s ease 0s infinite alternate;
                }
                @keyframes animation3 {
                    from {
                        transform: translate(0, 0);
                    }
                    to {
                        transform: translate(5px, -5px);
                    }
                }
                .animation>div:nth-child(4) {
                    animation: animation4 0.3s ease 0s infinite alternate;
                }
                @keyframes animation4 {
                    from {
                        transform: translate(0, 0);
                    }
                    to {
                        transform: translate(-5px, -5px);
                    }
                }
            </style>
            <div class="placeholder" ${this.ratio ? 'style="padding-top:' + this.ratio + '"' : ""}>
                <div class="placeholder-icon">
                    <i-icon name="image"></i-icon>
                    ${this.alt}
                </div>
            </div>
            <img>
            <div class="loading">
                <div class="animation">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </div>
        `;
    }

    get src() { return this.getAttribute("src"); }
    set src(val) { this.setAttribute("src", val); }

    get error() { return this.getAttribute("error") !== null; }
    set error(val) {
        if (val === false || val === null) {
            this.removeAttribute("error");
        } else {
            this.setAttribute("error", "");
        }
    }
    
    get ratio() {
        let ratio = this.getAttribute("ratio");
        let result = /^\s*[1-9]\d*\s*[:/]\s*[1-9]\d*\s*$/.test(ratio);
        if (result) {
            let delim = ratio.includes('/') ? "/" : ":";
            let r = ratio.split(delim);
            return (r[1] / r[0] * 100) + "%";
        } else {
            return 0;
        }
    }
    set ratio(val) { this.setAttribute("ratio", val); }

    get alt() { return this.getAttribute("alt") || "error"; }
    get fit() { return this.getAttribute("fit"); }
    get defaultsrc() { return this.getAttribute("defaultsrc"); }
    get lazyload() { return this.getAttribute("lazyload") != null; }

    load(src, hasload = false) {
        const img = new Image();
        img.src = src;
        this.error = false;
        img.onload = ()=>{
            console.log("load success");
            this.img.alt = this.alt;
            this.img.src = src;
        }
        img.onerror = ()=>{
            console.log("load error");
            this.error = true;
            this.img.removeAttribute("tabindex");
            if (this.defaultsrc && !hasload) {
                this.load(this.defaultsrc, true);
            }
        }
    }

    static get observedAttributes() {
        return ["src", "ratio"];
    }

    attributeChangedCallback(name, oldVal, newVal) {
        if (name == "src" && this.img) {
            this.load(newVal);
        } else if (name == "ratio" && this.placeholder) {
            this.placeholder.style.paddingTop = this.ratio;
        }
    }

    connectedCallback() {
        this.placeholder = this.shadowRoot.querySelector(".placeholder");
        this.img = this.shadowRoot.querySelector("img");
        if (this.lazyload) {
            this.observer = new IntersectionObserver(entries=>{
                entries.forEach(entry=>{
                    const el = entry.target;
                    const intersectionRatio = entry.intersectionRatio;
                    if (intersectionRatio > 0 && intersectionRatio <= 1) {
                        this.load(this.src);
                        this.observer.unobserve(el);
                    }
                })
            });
            this.observer.observe(this.img);
        } else {
            this.load(this.src);
        }
    }

};

if (!customElements.get("i-img")) {
    customElements.define("i-img", Img);
}

export { Img }