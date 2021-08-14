import * as vscode from "vscode";

import OpenAI from "openai-api";

type CodexConfig = {
  engine: string;
  temperature: number;
  maxTokens: number;
  topP: number;
  frequencyPenalty: number;
  presencePenalty: number;
  apiKey: string | null;
};


const getConfig= (config: vscode.WorkspaceConfiguration): CodexConfig => {
  const engine = config.get("engine", "davinci-codex");
  const temperature = config.get("temperature", 0);
  const maxTokens = config.get("maxTokens", 50);
  const topP = config.get("topP", 1);
  const frequencyPenalty = config.get("frequencyPenalty", 0);
  const presencePenalty = config.get("presencePenalty", 0);
  const apiKey = config.get("apiKey", null);
  return {
    engine,
    temperature,
    maxTokens,
    topP,
    frequencyPenalty,
    presencePenalty,
    apiKey
  };
};


const getExtensionCommandDisposable = (config: any) => {
  return vscode.commands.registerCommand("extension.CodexComplete", async () => {
    const client = new OpenAI(config.apiKey);
    const editor = vscode.window.activeTextEditor;

    if (!editor) {
      return;
    }

    const doc = editor.document;
    const pos = editor.selection.active;
    const text = doc.getText(new vscode.Range(new vscode.Position(0, 0), pos));
    const gptResponse = await client.complete({
      temperature: config.temperature,
      maxTokens: config.maxTokens,
      topP: config.topP,
      frequencyPenalty: config.frequencyPenalty,
      presencePenalty: config.presencePenalty,
      engine: config.engine,
      prompt: text
    });
    const newText = gptResponse.data.choices[0].text;
    editor.edit((editBuilder) => {
      editBuilder.replace(new vscode.Range(pos, pos), newText);
    });
  });
};


export function activate(context: vscode.ExtensionContext) {
  let config = vscode.workspace.getConfiguration("codex");
  // Add configuration
  let disposable: vscode.Disposable | null = null;
  // Listen for configuration changes and reload extension commands
  let configWatcher = vscode.workspace.onDidChangeConfiguration((e) => {
    if (e.affectsConfiguration("codex")) {
      config = vscode.workspace.getConfiguration("codex");
      disposable && disposable.dispose();
      disposable = getExtensionCommandDisposable(getConfig(config));
      context.subscriptions.push(disposable);
    }
  });
  context.subscriptions.push(configWatcher);
  disposable = getExtensionCommandDisposable(getConfig(config));
  context.subscriptions.push(disposable);

}
