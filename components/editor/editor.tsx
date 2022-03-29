import React, { useState } from "react";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/theme-vibrant_ink";

export interface EditorProps {
  onChange?: (newValue: string) => void;
  defaultValue?: string | null;
  className: string;
}

export const Editor = ({
  onChange,
  defaultValue,
  className,
  ...props
}: EditorProps) => {
  const [editorValue, setEditorValue] = useState(defaultValue || "");

  const update = (value: string) => {
    setEditorValue(value);
    onChange && onChange(value);
  };

  return (
    <AceEditor
      className={className}
      mode="html"
      theme="vibrant_ink"
      onChange={update}
      height="calc(100vh - 10px)"
      width="100%"
      value={editorValue}
      editorProps={{ $blockScrolling: Infinity }}
      enableBasicAutocompletion
      enableLiveAutocompletion
      tabSize={2}
      fontSize={22}
      {...props}
    />
  );
};
