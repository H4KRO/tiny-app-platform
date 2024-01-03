import { useCallback, useState } from "react";
import { RuntimeContext, WidgetDocumentation } from "tal-eval";
import ErrorPopin from "./internal/ErrorPopin";
import { InputProps, InputPropsDocs } from "./internal/inputProps";
import { Closure } from "tal-eval";
import { CheckBox as ThemedCheckBox } from "../theme";

type CheckBoxProps = {
  ctx: RuntimeContext;
  secondary?: boolean;
} & InputProps<boolean>;

export default function CheckBox({
  ctx,
  disabled,
  onChange,
  value,
  secondary,
}: CheckBoxProps) {
  const [lastError, setLastError] = useState(null as any);

  const handleChange = useCallback(
    async (value: boolean) => {
      try {
        if (onChange) {
          await ctx.callFunctionAsync(onChange as Closure, [value]);
        }
      } catch (err) {
        setLastError(err);
      }
    },
    [ctx, onChange]
  );

  return (
    <>
      <ThemedCheckBox
        onChange={handleChange}
        value={value}
        disabled={disabled}
        secondary={secondary}
      />
      <ErrorPopin lastError={lastError} setLastError={setLastError} />
    </>
  );
}

export const CheckBoxDocumentation: WidgetDocumentation<CheckBoxProps> = {
  description: "A checkbox to input a boolean value",
  props: {
    ...InputPropsDocs,
    secondary: "Give the secondary style",
  },
};
