import React, { useState } from "react";
import { Checkbox } from "antd";
import { CheckboxChangeEvent } from "../../node_modules/antd/es/checkbox";

interface emailNotification {
  disabled: boolean;
  checked: boolean;
  check: ((e: CheckboxChangeEvent) => void) | undefined;
}

export const EmailNotification: React.FC<emailNotification> = ({
  disabled,
  checked = false,
  check,
}) => {
  return (
    <Checkbox
      checked={checked}
      disabled={disabled}
      onChange={check}
      style={{ color: "#7F7F7F" }}
    >
      Receive email notification regarding saved request.
    </Checkbox>
  );
};

//export default  EmailNotification
