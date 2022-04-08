import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    const disposable = vscode.commands.registerCommand(
        'delphi-caption-converter.convertCaption',
        () => {
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                return;
            }

            const document = editor.document;
            const selection = editor.selection;
            const text = document.getText(selection);
            if (!text) {
                console.log("text not detected.");
                return;
            }

            const converted = convertCaption(text);
            if (!converted) {
                console.log("text not formatted.");
                return;
            }

            editor.edit(editBuilder => {
                editBuilder.replace(selection, converted);
            });
        }
    );
    context.subscriptions.push(disposable);
}

function convertCaption(text: string): string {
    let converted = '';
    const codes = text.split('#');
    for (let code of codes) {
        if (!code) {
            continue;
        }

        const words = code.split("'");
        let isFirst: boolean = true;
        for (let word of words) {
            if (!word) {
                continue;
            }

            if (!isFirst) {
                converted += word;
                continue;
            }

            isFirst = false;
            const codePoint: number = Number(word);
            if (!codePoint) {
                converted += word;
                continue;
            }

            converted += String.fromCodePoint(codePoint);
        }
    }

    return converted;
}