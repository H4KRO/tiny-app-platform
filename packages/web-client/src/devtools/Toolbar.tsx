import { Button, View } from "../theme";

export default function ToolBar({
  onFormat,
  onApplyAndFormat,
  onShowDocumentation,
  onRedo,
  onUndo,
  onExtendSelection,
  onWrapSelection,
}: {
  onUndo(): void;
  onRedo(): void;
  onFormat(): void;
  onApplyAndFormat(): void;
  onShowDocumentation(): void;
  onExtendSelection(): void;
  onWrapSelection(): void;
}) {
  return (
    <View layout="flex-row">
      <Button outline onClick={onApplyAndFormat} text="💾" />
      <Button outline onClick={onUndo} text="↩️" />
      <Button outline onClick={onRedo} text="↪️" />
      <Button outline onClick={onFormat} text="🧹" />
      <Button outline onClick={onExtendSelection} text="↔️" />
      <Button outline onClick={onWrapSelection} text="🌯" />
      <Button outline onClick={onShowDocumentation} text="📘" />
    </View>
  );
}
