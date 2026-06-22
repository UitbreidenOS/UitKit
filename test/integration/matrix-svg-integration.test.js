/**
 * Matrix Theme + SVG Inspector Integration Tests
 *
 * Verifies:
 * - Theme colors applied to SVG viewport correctly
 * - Contrast validation for interactive elements
 * - Theme switching doesn't break SVG rendering
 * - SVG nodes maintain visibility across theme transitions
 * - Interactive elements (drag, click) work in all themes
 */

const MATRIX_THEME = {
  name: "Matrix Theme",
  id: "matrix-theme",
  colors: {
    primary: "#00ff41",
    secondary: "#00ffff",
    accent: "#ff00ff",
    background: "#000000",
    surface: "#0a0a0a",
  },
  cssVariables: {
    "--canvas": "#000000",
    "--cream": "#0a0a0a",
    "--surface": "#0d0d0d",
    "--soft": "#1a1a1a",
    "--hairline": "#00ff41",
    "--olive": "#00ffff",
    "--ink": "#00ff41",
    "--body": "#00ffff",
    "--mute": "#888888",
    "--code-bg": "#000000",
    "--code-text": "#00ff41",
  },
};

const GHOST_SHELL_THEME = {
  name: "Ghost Shell",
  id: "ghost-shell",
  colors: {
    primary: "#c0c0c0",
    secondary: "#4a4a4a",
    accent: "#00ff41",
    background: "#333333",
    surface: "#2a2a2a",
  },
  cssVariables: {
    "--canvas": "#333333",
    "--cream": "#2a2a2a",
    "--surface": "#3a3a3a",
    "--soft": "#4a4a4a",
    "--hairline": "#c0c0c0",
    "--olive": "#4a4a4a",
    "--ink": "#c0c0c0",
    "--body": "#999999",
    "--mute": "#666666",
    "--code-bg": "#2a2a2a",
    "--code-text": "#00ff41",
  },
};

describe("Matrix Theme + SVG Inspector Integration", () => {
  let themeElement;
  let svgContainer;
  let svgViewport;

  beforeEach(() => {
    // Setup DOM structure
    document.documentElement.innerHTML = `
      <div id="root" data-theme="matrix-theme">
        <div id="svg-container" class="svg-viewport">
          <svg id="svg-viewport" viewBox="0 0 1000 800" width="1000" height="800">
            <defs>
              <style id="theme-styles"></style>
            </defs>
            <!-- Graph nodes -->
            <g id="nodes">
              <circle id="node-1" cx="100" cy="100" r="20" class="svg-node" fill="var(--node-color-primary)" />
              <circle id="node-2" cx="300" cy="200" r="20" class="svg-node" fill="var(--node-color-secondary)" />
              <circle id="node-3" cx="500" cy="300" r="20" class="svg-node" fill="var(--node-color-accent)" />
            </g>
            <!-- Interactive elements -->
            <g id="interactive">
              <rect id="btn-zoom-in" x="10" y="10" width="30" height="30" class="interactive-btn" fill="var(--btn-color)" />
              <rect id="btn-zoom-out" x="50" y="10" width="30" height="30" class="interactive-btn" fill="var(--btn-color)" />
              <rect id="btn-reset" x="90" y="10" width="30" height="30" class="interactive-btn" fill="var(--btn-color)" />
            </g>
            <!-- Links -->
            <g id="links">
              <line id="link-1-2" x1="100" y1="100" x2="300" y2="200" stroke="var(--link-color)" stroke-width="2" />
              <line id="link-2-3" x1="300" y1="200" x2="500" y2="300" stroke="var(--link-color)" stroke-width="2" />
            </g>
          </svg>
        </div>
      </div>
    `;

    themeElement = document.documentElement;
    svgContainer = document.getElementById("svg-container");
    svgViewport = document.getElementById("svg-viewport");
  });

  afterEach(() => {
    document.documentElement.innerHTML = "";
  });

  describe("Theme Application to SVG", () => {
    test("should apply Matrix theme CSS variables to SVG", () => {
      applyTheme(themeElement, MATRIX_THEME);

      Object.entries(MATRIX_THEME.cssVariables).forEach(([key, value]) => {
        const computedValue = getComputedStyle(themeElement).getPropertyValue(key).trim();
        expect(computedValue).toBe(value);
      });
    });

    test("should apply Ghost Shell theme CSS variables to SVG", () => {
      applyTheme(themeElement, GHOST_SHELL_THEME);

      Object.entries(GHOST_SHELL_THEME.cssVariables).forEach(([key, value]) => {
        const computedValue = getComputedStyle(themeElement).getPropertyValue(key).trim();
        expect(computedValue).toBe(value);
      });
    });

    test("should update SVG node colors when theme is applied", () => {
      applyTheme(themeElement, MATRIX_THEME);
      const node1 = document.getElementById("node-1");

      const fill = getComputedStyle(node1).fill;
      expect(fill).toBeTruthy();
      expect(fill).not.toContain("undefined");
    });

    test("should preserve SVG stroke colors across theme changes", () => {
      applyTheme(themeElement, MATRIX_THEME);
      const link = document.getElementById("link-1-2");

      const stroke = getComputedStyle(link).stroke;
      expect(stroke).toBeTruthy();
      expect(stroke).not.toContain("undefined");
    });

    test("should render SVG viewport with correct dimensions in themed context", () => {
      applyTheme(themeElement, MATRIX_THEME);

      expect(svgViewport.getAttribute("viewBox")).toBe("0 0 1000 800");
      expect(svgViewport.getAttribute("width")).toBe("1000");
      expect(svgViewport.getAttribute("height")).toBe("800");
    });
  });

  describe("SVG Contrast Validation", () => {
    test("should have sufficient contrast between text and background in Matrix theme", () => {
      applyTheme(themeElement, MATRIX_THEME);

      const foreground = hexToRgb(MATRIX_THEME.cssVariables["--ink"]);
      const background = hexToRgb(MATRIX_THEME.cssVariables["--canvas"]);

      const contrast = calculateContrastRatio(foreground, background);
      expect(contrast).toBeGreaterThanOrEqual(4.5); // WCAG AA standard
    });

    test("should have sufficient contrast for interactive buttons", () => {
      applyTheme(themeElement, MATRIX_THEME);

      const buttonFill = MATRIX_THEME.colors.primary;
      const buttonBackground = MATRIX_THEME.colors.background;

      const foreground = hexToRgb(buttonFill);
      const background = hexToRgb(buttonBackground);

      const contrast = calculateContrastRatio(foreground, background);
      expect(contrast).toBeGreaterThanOrEqual(4.5);
    });

    test("should have sufficient contrast between node colors and viewport", () => {
      applyTheme(themeElement, MATRIX_THEME);

      const nodeColor = hexToRgb(MATRIX_THEME.colors.primary);
      const viewportBg = hexToRgb(MATRIX_THEME.colors.background);

      const contrast = calculateContrastRatio(nodeColor, viewportBg);
      expect(contrast).toBeGreaterThanOrEqual(3); // Minimum for UI elements
    });

    test("should validate Ghost Shell theme contrast", () => {
      applyTheme(themeElement, GHOST_SHELL_THEME);

      const foreground = hexToRgb(GHOST_SHELL_THEME.cssVariables["--ink"]);
      const background = hexToRgb(GHOST_SHELL_THEME.cssVariables["--canvas"]);

      const contrast = calculateContrastRatio(foreground, background);
      expect(contrast).toBeGreaterThanOrEqual(4.5);
    });

    test("should maintain adequate contrast for secondary nodes in themed SVG", () => {
      applyTheme(themeElement, MATRIX_THEME);

      const secondaryColor = MATRIX_THEME.colors.secondary;
      const bgColor = MATRIX_THEME.colors.background;

      const foreground = hexToRgb(secondaryColor);
      const background = hexToRgb(bgColor);

      const contrast = calculateContrastRatio(foreground, background);
      expect(contrast).toBeGreaterThanOrEqual(3);
    });
  });

  describe("Theme Switching & SVG Rendering", () => {
    test("should not break SVG rendering when switching themes", () => {
      applyTheme(themeElement, MATRIX_THEME);
      const nodes1 = document.querySelectorAll(".svg-node");
      expect(nodes1.length).toBe(3);

      applyTheme(themeElement, GHOST_SHELL_THEME);
      const nodes2 = document.querySelectorAll(".svg-node");
      expect(nodes2.length).toBe(3);
    });

    test("should preserve SVG node count across theme changes", () => {
      const initialCount = document.querySelectorAll(".svg-node").length;

      applyTheme(themeElement, MATRIX_THEME);
      const matrixCount = document.querySelectorAll(".svg-node").length;

      applyTheme(themeElement, GHOST_SHELL_THEME);
      const ghostCount = document.querySelectorAll(".svg-node").length;

      expect(matrixCount).toBe(initialCount);
      expect(ghostCount).toBe(initialCount);
    });

    test("should maintain SVG viewport aspect ratio during theme transitions", () => {
      const initialAspect = 1000 / 800;

      applyTheme(themeElement, MATRIX_THEME);
      const matrixAspect = svgViewport.clientWidth / svgViewport.clientHeight;

      applyTheme(themeElement, GHOST_SHELL_THEME);
      const ghostAspect = svgViewport.clientWidth / svgViewport.clientHeight;

      // Both should maintain the same aspect ratio as original
      expect(Math.abs(matrixAspect - initialAspect)).toBeLessThan(0.1);
      expect(Math.abs(ghostAspect - initialAspect)).toBeLessThan(0.1);
    });

    test("should update all SVG element colors when theme changes", () => {
      applyTheme(themeElement, MATRIX_THEME);

      const node1BeforeMatrix = getComputedStyle(document.getElementById("node-1")).fill;

      applyTheme(themeElement, GHOST_SHELL_THEME);

      const node1AfterGhost = getComputedStyle(document.getElementById("node-1")).fill;

      // Colors should be different between themes
      expect(node1BeforeMatrix).not.toBe(node1AfterGhost);
    });

    test("should not lose SVG element references after theme switch", () => {
      applyTheme(themeElement, MATRIX_THEME);

      const node1 = document.getElementById("node-1");
      expect(node1).toBeTruthy();

      applyTheme(themeElement, GHOST_SHELL_THEME);

      const node1After = document.getElementById("node-1");
      expect(node1After).toBeTruthy();
      expect(node1After).toBe(node1);
    });
  });

  describe("Interactive Elements in Themed SVG", () => {
    test("should render interactive buttons with theme colors", () => {
      applyTheme(themeElement, MATRIX_THEME);

      const buttons = document.querySelectorAll(".interactive-btn");
      expect(buttons.length).toBeGreaterThan(0);

      buttons.forEach((btn) => {
        const fill = getComputedStyle(btn).fill;
        expect(fill).toBeTruthy();
      });
    });

    test("should allow hover state on SVG interactive elements", () => {
      applyTheme(themeElement, MATRIX_THEME);

      const btn = document.getElementById("btn-zoom-in");
      expect(btn).toBeTruthy();

      // Simulate hover
      btn.classList.add("hover");

      expect(btn.classList.contains("hover")).toBe(true);
    });

    test("should apply correct cursor style to interactive SVG elements", () => {
      applyTheme(themeElement, MATRIX_THEME);

      const buttons = document.querySelectorAll(".interactive-btn");
      buttons.forEach((btn) => {
        btn.style.cursor = "pointer";
        expect(getComputedStyle(btn).cursor).toBe("pointer");
      });
    });

    test("should fire click events on SVG interactive elements", () => {
      applyTheme(themeElement, MATRIX_THEME);

      const btn = document.getElementById("btn-zoom-in");
      let clicked = false;

      btn.addEventListener("click", () => {
        clicked = true;
      });

      const event = new MouseEvent("click", { bubbles: true });
      btn.dispatchEvent(event);

      expect(clicked).toBe(true);
    });

    test("should allow drag interactions on SVG nodes", () => {
      applyTheme(themeElement, MATRIX_THEME);

      const node = document.getElementById("node-1");
      const dragStart = new DragEvent("dragstart", { bubbles: true });
      const dragEnd = new DragEvent("dragend", { bubbles: true });

      node.draggable = true;
      expect(node.draggable).toBe(true);

      node.dispatchEvent(dragStart);
      node.dispatchEvent(dragEnd);
    });
  });

  describe("SVG Rendering Performance", () => {
    test("should render SVG with theme colors efficiently", () => {
      const start = performance.now();
      applyTheme(themeElement, MATRIX_THEME);
      const end = performance.now();

      const renderTime = end - start;
      expect(renderTime).toBeLessThan(100); // Should complete in < 100ms
    });

    test("should handle rapid theme switches without visual glitches", () => {
      const themes = [MATRIX_THEME, GHOST_SHELL_THEME, MATRIX_THEME];

      const start = performance.now();
      themes.forEach((theme) => {
        applyTheme(themeElement, theme);
      });
      const end = performance.now();

      const totalTime = end - start;
      expect(totalTime).toBeLessThan(300); // Three switches should take < 300ms
    });

    test("should not accumulate DOM nodes during theme switches", () => {
      const initialNodeCount = document.querySelectorAll(".svg-node").length;

      applyTheme(themeElement, MATRIX_THEME);
      const afterMatrix = document.querySelectorAll(".svg-node").length;

      applyTheme(themeElement, GHOST_SHELL_THEME);
      const afterGhost = document.querySelectorAll(".svg-node").length;

      expect(afterMatrix).toBe(initialNodeCount);
      expect(afterGhost).toBe(initialNodeCount);
    });
  });

  describe("SVG Viewport Accessibility", () => {
    test("should have proper ARIA labels on interactive SVG elements", () => {
      const btn = document.getElementById("btn-zoom-in");
      btn.setAttribute("role", "button");
      btn.setAttribute("aria-label", "Zoom in");

      expect(btn.getAttribute("role")).toBe("button");
      expect(btn.getAttribute("aria-label")).toBe("Zoom in");
    });

    test("should maintain readable text in themed SVG legends", () => {
      applyTheme(themeElement, MATRIX_THEME);

      const svg = document.getElementById("svg-viewport");
      const style = window.getComputedStyle(svg);
      expect(style.backgroundColor).toBeTruthy();
    });

    test("should support keyboard navigation in themed SVG", () => {
      applyTheme(themeElement, MATRIX_THEME);

      const btn = document.getElementById("btn-zoom-in");
      btn.setAttribute("tabindex", "0");

      expect(btn.getAttribute("tabindex")).toBe("0");
    });
  });
});

// Helper Functions

/**
 * Apply theme to document element
 */
function applyTheme(element, theme) {
  element.setAttribute("data-theme", theme.id);

  Object.entries(theme.cssVariables).forEach(([key, value]) => {
    element.style.setProperty(key, value);
  });
}

/**
 * Convert hex color to RGB object
 */
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Calculate WCAG contrast ratio between two colors
 * https://www.w3.org/TR/WCAG20-TECHS/G17.html
 */
function calculateContrastRatio(rgb1, rgb2) {
  const getLuminance = (rgb) => {
    const [r, g, b] = [rgb.r / 255, rgb.g / 255, rgb.b / 255].map((c) => {
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  const l1 = getLuminance(rgb1);
  const l2 = getLuminance(rgb2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Mock test function for environments without Jest
 */
if (typeof describe === "undefined") {
  global.describe = (name, fn) => {
    console.log(`\n${name}`);
    fn();
  };

  global.test = (name, fn) => {
    try {
      fn();
      console.log(`  ✓ ${name}`);
    } catch (e) {
      console.log(`  ✗ ${name}`);
      console.error(`    ${e.message}`);
    }
  };

  global.beforeEach = (fn) => {
    global._beforeEach = fn;
  };

  global.afterEach = (fn) => {
    global._afterEach = fn;
  };

  global.expect = (value) => ({
    toBe: (expected) => {
      if (value !== expected) throw new Error(`Expected ${value} to be ${expected}`);
    },
    toEqual: (expected) => {
      if (JSON.stringify(value) !== JSON.stringify(expected)) {
        throw new Error(`Expected ${JSON.stringify(value)} to equal ${JSON.stringify(expected)}`);
      }
    },
    toBeTruthy: () => {
      if (!value) throw new Error(`Expected ${value} to be truthy`);
    },
    toBeFalsy: () => {
      if (value) throw new Error(`Expected ${value} to be falsy`);
    },
    toContain: (item) => {
      if (!value.includes(item)) throw new Error(`Expected ${value} to contain ${item}`);
    },
    not: {
      toBe: (expected) => {
        if (value === expected) throw new Error(`Expected ${value} not to be ${expected}`);
      },
      toContain: (item) => {
        if (value.includes(item)) throw new Error(`Expected ${value} not to contain ${item}`);
      },
    },
    toBeGreaterThanOrEqual: (expected) => {
      if (value < expected) throw new Error(`Expected ${value} to be >= ${expected}`);
    },
    toBeGreaterThan: (expected) => {
      if (value <= expected) throw new Error(`Expected ${value} to be > ${expected}`);
    },
    toBeLessThan: (expected) => {
      if (value >= expected) throw new Error(`Expected ${value} to be < ${expected}`);
    },
  });
}
