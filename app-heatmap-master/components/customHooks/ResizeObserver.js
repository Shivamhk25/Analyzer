import React, { useState, useCallback, useEffect } from "react";
export const useWindowSize = (node) => {
  const [size, setSize] = useState();
  const sizeObserver = () => {
    if (node !== null) {
      // console.log(node.current.getBoundingClientRect());
      setSize(node.current?.getBoundingClientRect());
    }
  };
  useEffect(() => {
    window?.addEventListener("resize", sizeObserver);
    sizeObserver();
    return () => window?.removeEventListener("resize", sizeObserver);
  }, []);
  return [size];
};
