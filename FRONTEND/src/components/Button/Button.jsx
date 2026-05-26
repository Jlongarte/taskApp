// src/components/Button.js

class ButtonComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    const variant = this.getAttribute("variant") || "primary";

    this.shadowRoot.innerHTML = `
      <style>
        button {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-size: 14px;
          font-weight: 500;
          padding: 10px 14px;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          width: 100%;
          box-sizing: border-box;
        }

        .primary {
          background-color: #0c66e4;
          color: white;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        }
        .primary:hover {
          background-color: #0055cc;
        }

        .secondary {
          background-color: transparent;
          color: #44546f;
        }
        .secondary:hover {
          background-color: rgba(9, 30, 66, 0.08);
        }

        .danger {
          background-color: #ae2e24;
          color: white;
        }
        .danger:hover {
          background-color: #c9372c;
        }

        button:active {
          transform: scale(0.97);
        }
      </style>
      
      <button class="${variant}">
        <slot></slot>
      </button>
    `;
  }
}

if (!customElements.get("custom-button")) {
  customElements.define("custom-button", ButtonComponent);
}
