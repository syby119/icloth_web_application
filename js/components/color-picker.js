

class ColorPicker extends HTMLElement {
    constructor() {
        super();
        this.historyColors = Array();
        this.stardardColors = [];
        this.attachShadow({ mode: "open" });
        this.shadowRoot.innerHTML = `
            <style>
            </style>
            <canvas>
            </canvas>
        `;
    }

    connectedCallback() {
        this.canvas = this.shadowRoot.querySelector("canvas");
        drawCircle(this.canvas);
    }


    drawRing(canvas, center, radius) {
        const context = canvas.getContext("2d");


    }
}