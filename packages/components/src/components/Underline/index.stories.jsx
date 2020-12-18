import React from "react";
import Underline from "./index";
import { ColorControl } from "../../storybook/Controls/color";

export default {
  title: "Components/Underline",
  component: Underline,
  argTypes: {
    backgroundColor: ColorControl,
    color: ColorControl,
  },
};

const CustomComponent = () => {
  return (
    <div>
      <p>Custom Component with Button</p>
      <button>Custom Button 1</button>
    </div>
  );
};

export const Story1 = (args) => (
  <Underline {...args}>
    <button>Button 1</button>
    <button>Button 2</button>
    <img alt="croc" style={{ width: "200px" }} src="/images/crocFriends.png" />
    <CustomComponent />
  </Underline>
);
Story1.storyName = "Basic";
