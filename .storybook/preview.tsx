import type { Preview } from "@storybook/nextjs-vite"
import "../app/globals.css"

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: "canvas",
      values: [
        { name: "canvas", value: "#ffffff" },
        { name: "surface-soft", value: "#f7f7f7" },
        { name: "dark", value: "#222222" },
      ],
    },
    a11y: { test: "todo" },
    docs: {
      theme: undefined,
    },
  },
  globalTypes: {
    theme: {
      name: "Theme",
      defaultValue: "light",
      toolbar: {
        icon: "paintbrush",
        items: ["light", "dark"],
        showName: true,
      },
    },
  },
}

export default preview
