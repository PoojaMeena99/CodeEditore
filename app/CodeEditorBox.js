"use client";

import React, { useEffect, useRef } from "react";
import { EditorView } from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import { basicSetup } from "codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { oneDark } from "@codemirror/theme-one-dark";
import "./CodeEditorBox.css";

const languageExtensions = {
  JavaScript: javascript(),
  Python: python(),
};

function handleEditorUpdate(update, onCodeChange) {
  if (update.docChanged && onCodeChange) {
    const updatedCode = update.state.doc.toString();
    onCodeChange(updatedCode);
  }
}

const CodeEditor = ({ selectedLanguage, code, onCodeChange }) => {
  const editorRef = useRef(null);
  const viewRef = useRef(null);

  useEffect(() => {
    if (!editorRef.current) return;

    const language = languageExtensions[selectedLanguage] || javascript();

    if (viewRef.current) {
      viewRef.current.destroy();
    }

    const state = EditorState.create({
      doc: code || "",
      extensions: [
        basicSetup,
        language,
        oneDark,
        EditorView.updateListener.of((update) =>
          handleEditorUpdate(update, onCodeChange)
        ),
      ],
    });

    viewRef.current = new EditorView({
      state,
      parent: editorRef.current,
    });
    
    return () => {
      if (viewRef.current) {
        viewRef.current.destroy();
        viewRef.current = null;
      }
    };
  }, [selectedLanguage, onCodeChange]);

  useEffect(() => {
    if (viewRef.current && typeof code === "string") {
      const currentCode = viewRef.current.state.doc.toString();
      if (currentCode !== code) {
        viewRef.current.dispatch({
          changes: { from: 0, to: currentCode.length, insert: code },
        });
      }
    }
  }, [code]);

  return <div ref={editorRef} className="editor" />;
};

export default CodeEditor;
















