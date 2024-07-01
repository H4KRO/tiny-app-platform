import { useRef, useState, useMemo, useEffect } from "react";
import { javascript } from "@codemirror/lang-javascript";
import { EditorView, basicSetup } from "codemirror";
import { keymap } from "@codemirror/view";
import { indentWithTab, undo, redo } from "@codemirror/commands";
import styles from "./Editor.module.css";

export interface EditorApi {
  replaceSelection(text: string): void;
  replaceAll(text: string): void;
  undo(): void;
  redo(): void;
}

export function Editor({
  hidden,
  grabSetSource,
  onApiReady,
  onSaveAndFormat,
  onCloseEditor,
}: {
  hidden?: boolean;
  grabSetSource(arg: () => () => string): void;
  onApiReady(api: EditorApi): void;
  onSaveAndFormat(source: string): void;
  onCloseEditor(): void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [editor, setEditor] = useState<EditorView | null>(null);
  const setUpdateSourceFunc = useMemo(
    () => () => () => {
      if (editor) {
        const newSource = [...editor.state.doc].join("");
        return newSource;
      }
      return "";
    },
    [editor]
  );
  const editorApi = useMemo<EditorApi>(
    () => ({
      undo() {
        editor && undo(editor);
      },
      redo() {
        editor && redo(editor);
      },
      replaceSelection(text) {
        editor?.dispatch(editor?.state.replaceSelection(text));
      },
      replaceAll(text) {
        const previousSelection = editor?.state.selection;
        editor?.dispatch(
          editor.state.update({
            changes: { from: 0, to: editor.state.doc.length, insert: text },
          })
        );
        if (previousSelection) {
          editor?.dispatch({
            selection: previousSelection,
          });
        }
      },
    }),
    [editor]
  );

  const onSaveAndFormatRef = useRef(onSaveAndFormat);
  useEffect(() => {
    onSaveAndFormatRef.current = onSaveAndFormat;
  }, [onSaveAndFormat]);

  useEffect(() => {
    if (ref.current == null) {
      console.log("ref is null");
      return;
    }
    if (editor == null) {
      const saveWithModS = keymap.of([
        {
          key: "Mod-s",
          run: ({ state }) => {
            onSaveAndFormatRef.current([...state.doc].join(""));
            return true;
          },
        },
      ]);
      setEditor(
        new EditorView({
          doc: "",
          extensions: [
            basicSetup,
            keymap.of([indentWithTab]),
            saveWithModS,
            javascript(),
          ],
          parent: ref.current,
        })
      );
    }
    grabSetSource(setUpdateSourceFunc);
  }, [
    editor,
    editorApi,
    grabSetSource,
    onCloseEditor,
    onSaveAndFormat,
    setUpdateSourceFunc,
  ]);

  useEffect(() => {
    onApiReady(editorApi);
  }, [editorApi, onApiReady]);

  return (
    <div
      ref={ref}
      className={`${styles.Editor} ${hidden ? styles.hidden : ""}`}
      id="editor"
    ></div>
  );
}
