import { RuntimeContext, WidgetDocumentation } from "tal-eval";
import { useCallback, useState } from "react";
import { InputProps, InputPropsDocs } from "./internal/inputProps";
import ErrorPopin from "./internal/ErrorPopin";
import { Closure } from "tal-eval";
import { PagerOnChangeAction, Pager as ThemedPager } from "../theme";

type PagerProps = {
  ctx: RuntimeContext;
  max: number;
  perPage: number;
} & InputProps<number>;

export default function Pager({
  ctx,
  max,
  perPage,
  onChange,
  value,
  disabled,
}: PagerProps) {
  const currentPage = value;
  const pages = [];
  const difference = 3;
  const maxPage = Math.ceil(max / perPage);
  let minToShow = Math.max(1, currentPage - difference);
  const maxToShow = Math.min(minToShow + difference * 2, maxPage);
  minToShow = Math.max(1, maxToShow - difference * 2);
  for (let i = minToShow; i <= maxToShow; i++) {
    pages.push(i);
  }

  const [lastError, setLastError] = useState(null as any);

  const updateValue = useCallback(
    async (value: number) => {
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

  const onChangeHandler = useCallback(
    (change: PagerOnChangeAction) => {
      switch (change) {
        case "FIRST":
          updateValue(1);
          break;
        case "PREVIOUS":
          updateValue(Math.max(1, currentPage - 1));
          break;
        case "NEXT":
          updateValue(Math.min(maxPage, currentPage + 1));
          break;
        case "LAST":
          updateValue(maxPage);
          break;
        default:
          updateValue(change);
          break;
      }
    },
    [currentPage, maxPage, updateValue]
  );

  return (
    <div>
      <ThemedPager
        firstState={currentPage === 1 ? "DISABLED" : "ENABLED"}
        previousState={currentPage === 1 ? "DISABLED" : "ENABLED"}
        disabled={disabled}
        lastState={currentPage === maxPage ? "DISABLED" : "ENABLED"}
        nextState={currentPage === maxPage ? "DISABLED" : "ENABLED"}
        values={pages}
        value={currentPage}
        onChange={onChangeHandler}
      />
      <ErrorPopin lastError={lastError} setLastError={setLastError} />
    </div>
  );
}

export const PagerDocumentation: WidgetDocumentation<PagerProps> = {
  description: "Select a page in a paginated data source",
  props: {
    max: "Maximum page number",
    perPage: "Elements fetched per page",
    ...InputPropsDocs,
  },
};
