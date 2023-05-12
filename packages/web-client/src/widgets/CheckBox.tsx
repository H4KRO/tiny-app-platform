import React, { useCallback, useState } from "react";
import { RuntimeContext, WidgetDocumentation } from "tal-eval";
import styles from "./CheckBox.module.css";
import ErrorPopin from "./internal/ErrorPopin";
import { InputProps, InputPropsDocs } from "./internal/inputProps";

type CheckBoxProps = {
  ctx: RuntimeContext;
  disabled?: boolean;
} & InputProps<boolean>;

export default function CheckBox({
  ctx,
  bindTo,
  disabled,
  onChange,
  value,
}: CheckBoxProps) {
  const [lastError, setLastError] = useState(null as any);

  const handleChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      try {
        if (bindTo) {
          ctx.setValue(bindTo, e.target.checked);
        }
        if (onChange) {
          await ctx.callFunctionAsync(onChange, [e.target.checked]);
        }
      } catch (err) {
        setLastError(err);
      }
    },
    [ctx, bindTo, onChange]
  );

  return (
    <>
      <div className={styles.CheckBox}>
        <input
          type="checkbox"
          checked={bindTo ? (ctx.evaluateOr(bindTo, false) as boolean) : value}
          onChange={handleChange}
          disabled={disabled}
        />
        <div className={styles.checkMark}></div>
      </div>
      <ErrorPopin lastError={lastError} setLastError={setLastError} />
    </>
  );
}

export const CheckBoxDocumentation: WidgetDocumentation<CheckBoxProps> = {
  description: "A checkbox to input a boolean value",
  props: {
    disabled: "Do not allow changing the value",
    ...InputPropsDocs,
  },
};
