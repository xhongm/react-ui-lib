import type { Preview } from "@storybook/react-vite";
import type { StoryContext, StoryFn } from "@storybook/react";
import "../src/style/global.scss";
import "../src/style/themes/light.scss";
import "../src/style/themes/dark.scss";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
      expanded: true,
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo",
    },
  },
};

export default preview;

export const globalTypes = {
  theme: {
    name: "Theme",
    description: "Global theme for components",
    defaultValue: "light",
    toolbar: {
      icon: "circlehollow",
      items: ["light", "dark"],
    },
  },
};

export const decorators = [
  (storyFn: StoryFn, context: StoryContext) => {
    document.body.classList.remove("light", "dark");
    document.body.classList.add(context.globals.theme);
    return storyFn(context.args, context);
  },
];
