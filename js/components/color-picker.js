class ColorPicker extends HTMLElement {
    constructor() {
        super();
        this.historyColors = Array();
        this.stardardColors = [];
        this.attachShadow({ mode: "open" });
        this.shadowRoot.innerHTML = `
            <style>
            </style>
            <canvas width="400" height="400"></canvas>
        `;

        this.hsv = { h: 0, s: 0, v: 0 };
        this.rgb = { r: 0, g: 0, b: 0 };
        this.hex = "#000000";
        this.alpha = 1;

        this.backgroundColor = "#FFFFFF";

        this.ringRadius = 100;
        this.ringLineWidth = 20;
        this.ringOuterStrokeStyle = "rgba(255, 255, 255, 1)";
        this.ringInnerStrokeStyle = "rgba(255, 255, 255, 1)";

        this.areaShape = "quad";
    }

    connectedCallback() {
        this.canvas = this.shadowRoot.querySelector("canvas");
        this.context = this.canvas.getContext("2d");

        this.circleCenter = {x: 200, y: 200};

        this.drawHueRing();
        this.drawSvArea(this.areaShape);
    }

    drawBackground(canvas) {

    }

    drawHueRing() {
        for (let angle = 0; angle < 360; ++angle) {
            let startAngle = (angle - 1) * Math.PI / 180;
            let endAngle = (angle + 1) * Math.PI / 180;

            let [r, g, b] = ColorPicker.hsvToRgb(angle / 360, 1, 1);
            this.context.strokeStyle = `rgb(${r}, ${g}, ${b})`;
            this.context.lineWidth = this.ringLineWidth;

            this.context.beginPath();
            this.context.arc(this.circleCenter.x, this.circleCenter.y, 
                             this.ringRadius, startAngle, endAngle);
            this.context.stroke();
        }

        this.context.lineWidth = 0.5;
        this.context.strokeStyle = this.ringOuterStrokeStyle;

        this.context.beginPath();
        const ringOuterRadius = this.ringRadius + this.ringLineWidth / 2;
        this.context.arc(this.circleCenter.x, this.circleCenter.y, ringOuterRadius, 0, 2 * Math.PI);
        this.context.stroke();

        this.context.strokeStyle = this.ringInnerStrokeStyle;
        
        this.context.beginPath();
        const ringInnerRadius = this.ringRadius - this.ringLineWidth / 2;
        this.context.arc(this.circleCenter.x, this.circleCenter.y, ringInnerRadius, 0, 2 * Math.PI);
        this.context.stroke();
    }

    drawHueRingCursor(canvas) {

    }

    drawSvArea() {
        if (this.areaShape == "triangle") {
            this.drawSvTriangle();
        } else {
            this.drawSvQuad();
        }
    }

    drawSvQuad() {
        const sideLength = Math.floor((this.ringRadius - this.ringLineWidth / 2) * Math.SQRT2) - 1;
        let imageData = this.context.createImageData(sideLength, sideLength);
        const xmin = this.circleCenter.x - sideLength / 2;
        const xmax = this.circleCenter.x + sideLength / 2;
        const ymin = this.circleCenter.y - sideLength / 2;
        const ymax = this.circleCenter.y + sideLength / 2;
        for (let x = xmin; x < xmax; ++x) {
            for (let y = ymin; y < ymax; ++y) {
                let s = (x - xmin) / sideLength;
                let v = 1 - (y - ymin) / sideLength;
                let [r, g, b] = ColorPicker.hsvToRgb(this.hsv.h, s, v);

                let index = 4 * ((y - ymin) * sideLength + x - xmin);
                imageData.data[index + 0] = r;
                imageData.data[index + 1] = g;
                imageData.data[index + 2] = b;
                imageData.data[index + 3] = 255;
            }
        }

        this.context.putImageData(imageData, xmin, ymin);
    }

    drawSvTriangle() {

    }

    drawSvAreaCursor(canvas) {

    }

    drawSlider() {

    }

    // Converts an HSV color value to RGB.
    // Assuming h, s, v are contained in the set [0, 1] and
    // returns r, g, b in the set [0, 255]
    static hsvToRgb(h, s, v) {
        let r, g, b;
        let i = Math.floor(h * 6);
        let f = h * 6 - i;
        let p = v * (1 - s);
        let q = v * (1 - f * s);
        let t = v * (1 -(1 - f) * s);

        switch (i % 6) {
            case 0:
                r = v, g = t, b = p;
                break;
            case 1:
                r = q, g = v, b = p;
                break;
            case 2:
                r = p, g = v, b = t;
                break;
            case 3:
                r = p, g = q, b = v;
                break;
            case 4:
                r = t, g = p, b = v;
                break;
            case 5:
                r = v, g = p, b = q;
                break;
        }

        r = Math.floor(r * 255), g = Math.floor(g * 255), b = Math.floor(b * 255);

        return [r, g, b];
    }

    // Converts an RGB color value to HSV.
    // Assuming r, g, b are contained in the set [0, 255] and
    // returns h, s, v in set [0, 1]
    static rgbToHsv(r, g, b) {
        r /= 255, g /= 255, b /= 255;
        const cmax = Math.max(r, g, b);
        const cmin = Math.min(r, g, b);
        const delta = cmax - cmin;
        
        let h = 0;
        if (delta != 0) {
            switch (cmax) {
                case r:
                    h = (g - b) / delta + (g < b ? 6 : 0);
                    break;
                case g:
                    h = (b - r) / delta + 2;
                    break;
                case b:
                    h = (r - g) / delta + 4;
                    break;
            }
            h /= 6;
        }

        let s = cmax == 0 ? 0 : delta / cmax;

        let v = cmax;

        return [h, s, v];
    }

    // Converts a hex color value to RGB.
    // Assuming hex is a string in the following format
    //   1. start with #, e.g #FFFFFF
    //   2. start with 0x, e.g 0xFFFFFF
    // returns r, g, b in set [0, 255]
    static hexToRgb(hex) {
        hex = hex.charAt(0) == "#" ? hex.slice(1) : hex;
        const dec = parseInt(hex, 16);
        let r = (dec & 0xFF0000) >> 16;
        let g = (dec & 0x00FF00) >> 8;
        let b = dec & 0x0000FF;

        return [r, g, b];
    }

    // Converts an RGB color value to hex.
    // Assuming r, g, b are contained in the set [0, 255] and
    // returns hex in the format starting with #, e.g #FFFFFF
    static rgbToHex(r, g, b) {
        r = parseInt(r);
        g = parseInt(g);
        b = parseInt(b);
        let hex_r = (r < 16 ? "0" : "" ) + r.toString(16);
        let hex_g = (g < 16 ? "0" : "" ) + g.toString(16);
        let hex_b = (b < 16 ? "0" : "" ) + b.toString(16);

        return "#" + hex_r + hex_g + hex_b;
    }
};

if(!customElements.get('i-color-picker')){
    customElements.define('i-color-picker', ColorPicker);
}

export { ColorPicker }