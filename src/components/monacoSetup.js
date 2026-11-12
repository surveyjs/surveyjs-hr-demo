import * as monaco from "monaco-editor/editor";
import "monaco-editor/features/register.all";
import "monaco-editor/languages/features/json/register";
import EditorWorker from "monaco-editor/editor/editor.worker?worker";
import JsonWorker from "monaco-editor/languages/features/json/json.worker?worker";

window.MonacoEnvironment = {
  getWorker: (_, label) => (label === "json" ? new JsonWorker() : new EditorWorker())
};
window.monaco = monaco;

export function applyMonacoTheme(creator) {
  monaco.editor.setTheme(creator.preferredColorPalette === "dark" ? "vs-dark" : "vs");
}
