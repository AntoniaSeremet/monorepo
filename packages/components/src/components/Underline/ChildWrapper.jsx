import React, { useCallback, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import styles from "./index.module.scss";

const ChildWrapper = ({ children, onClick, className, defaultSelected }) => {
  const wrapperRef = useRef();

  const handleOnClick = useCallback(() => {
    if (!onClick || !wrapperRef.current) return;
    try {
      onClick(wrapperRef.current.getBoundingClientRect());
    } catch (error) {
      onClick({});
    }
  }, [onClick]);

  useEffect(() => {
    if (defaultSelected) handleOnClick();
  }, [handleOnClick, defaultSelected]);

  return (
    <div
      className={classnames(className, styles.underlineWrapper__childWrapper)}
      ref={wrapperRef}
      onClickCapture={handleOnClick}
    >
      {children}
    </div>
  );
};

ChildWrapper.propTypes = {
  defaultSelected: PropTypes.bool,
  children: PropTypes.node,
  onClick: PropTypes.func,
  className: PropTypes.string,
};

export default ChildWrapper;
