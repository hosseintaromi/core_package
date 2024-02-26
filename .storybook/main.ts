import TsconfigPathsPlugin  from "tsconfig-paths-webpack-plugin";
import type { StorybookConfig } from "@storybook/react-webpack5";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-onboarding",
    "@storybook/addon-interactions",
    {
      name: '@storybook/addon-docs',
      options: {
        csfPluginOptions: null,
        mdxPluginOptions: {},
      },
    },
  ],
  framework: {
    name: "@storybook/react-webpack5",
    options: {},
  },
  webpackFinal: async (config:any) => {

    if (config.resolve.plugins && Array.isArray(config.resolve.plugins)) {
      config.resolve.plugins.push(new TsconfigPathsPlugin({}));
    } else {
      config.resolve.plugins = [new TsconfigPathsPlugin({})];
    }

    return config;
  },
  docs: {
    autodocs: "tag",
  },
};
export default config;
