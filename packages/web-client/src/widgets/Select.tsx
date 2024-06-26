import { useCallback, useRef, useState } from "react";
import { RuntimeContext, WidgetDocumentation } from "tal-eval";
import ErrorPopover from "./internal/ErrorPopover";
import { InputProps, InputPropsDocs } from "./internal/inputProps";
import { Closure } from "tal-eval";
import { Select as ThemedSelect } from "../theme";

type SelectProps = {
  ctx: RuntimeContext;
  options: (string | { value: string; label: string })[];
  placeholder?: string;
} & InputProps<string>;

export default function Select({
  ctx,
  options,
  placeholder,
  onChange,
  value,
  disabled,
}: SelectProps) {
  const [lastError, setLastError] = useState(null as any);

  const showEmpty =
    value === undefined ||
    !options
      .map((a) => (typeof a === "string" ? a : a.value))
      .includes(value ?? "");

  const onChangeHandler = useCallback(
    async (newSelectedIndex: number) => {
      try {
        const optionToSet = options[newSelectedIndex - (showEmpty ? 1 : 0)];
        const valueToSet =
          typeof optionToSet === "string" ? optionToSet : optionToSet.value;
        if (onChange) {
          await ctx.callFunctionAsync(onChange as Closure, [valueToSet]);
        }
      } catch (err) {
        setLastError(err);
      }
    },
    [ctx, options, showEmpty, onChange]
  );

  const popoverTargetRef = useRef<HTMLDivElement | null>(null);

  return (
    <div ref={popoverTargetRef}>
      <ThemedSelect
        options={options.map((option) =>
          typeof option === "string" ? { label: option, value: option } : option
        )}
        disabled={disabled}
        onChange={onChangeHandler}
        placeholder={placeholder}
        showEmpty={showEmpty}
        value={value ?? ""}
      />
      <ErrorPopover
        target={popoverTargetRef.current}
        lastError={lastError}
        setLastError={setLastError}
      />
    </div>
  );
}

export const SelectDocumentation: WidgetDocumentation<SelectProps> = {
  description: "Pick a string value from a predefined list",
  props: {
    options:
      "List of all possible values as string | {value: string, label: string}",
    placeholder: "Message to show when the widget is empty",
    ...InputPropsDocs,
  },
};
