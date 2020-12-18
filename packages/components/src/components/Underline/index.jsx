import React, { useCallback, useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import styles from "./index.module.scss";
import ChildWrapper from "./ChildWrapper";
import { colors } from "../../storybook/Controls/color";
import Shapes from "./Shapes";

const Underline = ({
  children,
  className,
  defaultSelectedIndex = 0,
  backgroundColor,
  color,
  shape = "triangle",
}) => {
  const underlineRef = useRef();

  const [underlineLeft, setUnderlineLeft] = useState(0);
  const [underlineWidth, setUnderlineWidth] = useState(0);

  const underlineStyle = useMemo(() => {
    return {
      left: `${underlineLeft}px`,
      width: `${underlineWidth}px`,
    };
  }, [underlineLeft, underlineWidth]);

  const handleOnChildClick = useCallback(
    (childBoundingRect) => {
      if (underlineRef.current) {
        const underlineBoundingRect = underlineRef.current.getBoundingClientRect();
        if (shape === Shapes.Line) {
          setUnderlineWidth(childBoundingRect.width);
          setUnderlineLeft(childBoundingRect.left - underlineBoundingRect.left);
        } else if (shape === Shapes.Triangle) {
          setUnderlineLeft(
            childBoundingRect.left -
              underlineBoundingRect.left +
              childBoundingRect.width / 2 -
              5
          );
        }
      }
    },
    [shape]
  );

  const elements = useMemo(
    () =>
      React.Children.map(children, (child, index) => (
        <ChildWrapper
          defaultSelected={index === defaultSelectedIndex}
          onClick={handleOnChildClick}
        >
          {child}
        </ChildWrapper>
      )),
    [children, defaultSelectedIndex, handleOnChildClick]
  );

  return (
    <div className={classnames(styles.underlineWrapper)} ref={underlineRef}>
      {elements}
      <div
        className={classnames(className, styles.underlineWrapper__line, {
          [styles[`backgroundColor${color}`]]: color,
        })}
      />
      <div
        className={classnames(styles.underlineWrapper__line__selected, {
          [styles[`backgroundColor${backgroundColor}`]]: backgroundColor,
          [styles[shape]]: shape,
        })}
        style={underlineStyle}
      />
    </div>
  );
};

Underline.propTypes = {
  shape: PropTypes.oneOf(["line", "triangle"]),
  color: PropTypes.oneOf(colors),
  backgroundColor: PropTypes.oneOf(colors),
  defaultSelectedIndex: PropTypes.number,
  children: PropTypes.node,
  className: PropTypes.string,
};

export default Underline;
