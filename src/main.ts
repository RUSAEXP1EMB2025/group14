// src/main.ts
import { MyClass, sample } from './sample'; // import で他のファイルから読み込む

// GASのエントリポイントとして公開したい関数
// esbuild-gas-plugin がこれらのexportされた関数をグローバルスコープに露出させる
export function onOpen(e: GoogleAppsScript.Events.SheetsOnOpen) {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('カスタムメニュー').addItem('サンプル実行', 'runSample').addToUi();
  console.log('メニューが追加されました (onOpen)');
}

export function runSample() {
  console.log('runSample関数が実行されました');
  sample(); // importした関数を呼び出す
  const myInstance = new MyClass();
  myInstance.greet('World');
}

// Webアプリの doGet/doPost などもexportする
// export function doGet(request: GoogleAppsScript.Events.AppsScriptHttpRequest) {
//   return HtmlService.createHtmlOutput('<h1>Hello Web App!</h1>');
// }

// その他のGASで必要なグローバル関数（カスタム関数など）もexport
// export function MY_CUSTOM_FUNCTION(input: string) {
//   return `Processed: ${input}`;
// }
