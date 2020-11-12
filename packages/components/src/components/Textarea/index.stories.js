import React from "react";
import Textarea from "./index.jsx";

export default {
  title: "Components/Textarea",
  component: Textarea,
};

const Template = (args) => <Textarea {...args} />;

export const Story1 = Template.bind();
Story1.storyName = "Basic usage";
Story1.args = {
  label: "Banana",
};

export const Story2 = Template.bind();
Story2.storyName = "Resizable";
Story2.args = {
  label: "Banana",
  enableManualResize: "both",
};
Story2.parameters = {
  docs: {
    description: {
      story: `This story shows resizable textarea. 
      User can resize it both vertically and horizontally by pulling icon in bottom right corner.`,
    },
  },
};

export const Story3 = Template.bind();
Story3.storyName = "Character counter";
Story3.args = {
  label: "Banana",
  showCharCount: true,
  maxLength: 50,
};
Story3.parameters = {
  docs: {
    description: {
      story: `This story shows textarea with character counter at the right bottom corner.
      Maximum available characters that can fit in textarea in this case is 50.`,
    },
  },
};

export const Story4 = Template.bind();
Story4.storyName = "Fluid from 3 to 5 rows";
Story4.args = {
  label: "Banana",
  showCharCount: true,
  fluidHeight: true,
  fluidHeightOptions: {
    minRows: 3,
    maxRows: 5,
    lineHeight: 16,
  },
};
Story4.parameters = {
  docs: {
    description: {
      story: `This story shows fluid textarea component. Textarea will be 3 rows high
      when rendered and will grow until is 5 rows high. Textarea will add a row when there
      is no more available space in lines above or when user press Enter key.`,
    },
  },
};

export const Story5 = (args) => {
  return (
    <div>
      <Textarea {...args} />
      <p />
      <Textarea {...args} showCharCount />
      <p />
      <Textarea {...args} showCharCount maxLength={100000} />
      <p />
      <Textarea {...args} error={false} showCharCount />
      <p />
    </div>
  );
};
Story5.storyName = "Error messages";
Story5.args = {
  label: "Banana",
  error: true,
  errorMessage:
    "This is some really long error message that could cause some troubles!",
};
Story5.parameters = {
  docs: {
    description: {
      story: `This story shows multiple textarea components one below another. In this example
      we can see how error message will shorten if there is no more available space for it.
      Character counter will always stay in bottom right corner.`,
    },
  },
};

const TemplateRows = (args) => (
  <>
    <Textarea {...args} />
    <Textarea {...args} />
  </>
);
export const Story6 = TemplateRows.bind();
Story6.storyName = "Multiple textareas in row";
Story6.args = {
  label: "Banana",
  showCharCount: true,
  enableManualResize: "both",
};
Story6.parameters = {
  docs: {
    description: {
      story: `Textareas won't affect each other when positioned horizontally unless manually resized.`,
    },
  },
};

const TemplateColumns = (args) => (
  <>
    <Textarea {...args} /> <p /> <Textarea {...args} />
  </>
);
export const Story7 = TemplateColumns.bind();
Story7.storyName = "Multiple textareas in column";
Story7.args = {
  label: "Banana",
  showCharCount: true,
  enableManualResize: "both",
};
Story7.parameters = {
  docs: {
    description: {
      story: `Textareas won't affect each other when positioned vertically unless manually resized.`,
    },
  },
};
