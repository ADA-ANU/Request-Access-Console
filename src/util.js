import React from "react";
import { Tag } from "antd";

export const errorMessage = "Server error, please retry.";

export const isEmptyObj = (obj) => {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
};

export const getSubtypeTagList = (subtypeList) => {
  return (subtypeList || "").split(",").map((ele) => getSubtypeTag(ele));
};

export const getSubtypeTag = (subtype) => {
  const typeObj = {
    V: "VEGETARIAN",
    VE: "VEGAN",
    DF: "DAIRY FREE",
    GF: "GLUTEN FREE",
  };
  const colorObj = {
    V: "#48a30b",
    VE: "#0b78a3",
    DF: "#ccbb00",
    GF: "#bd6e00",
  };
  return (
    <Tooltip placement="bottom" title={typeObj[subtype]}>
      <Tag color={colorObj[subtype]}> {subtype} </Tag>
    </Tooltip>
  );
};
