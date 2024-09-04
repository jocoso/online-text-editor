// Import methods to save and get data from the indexedDB database in './database.js'
import { getDb, putDb } from './database';
import { header } from './header';

export default class {
  constructor() {
    // Gets the content from the client localStorage
    const localData = localStorage.getItem('content');

    // check if CodeMirror is loaded
    // CodeMirror is a code editor library
    if (typeof CodeMirror === 'undefined') {
      throw new Error('CodeMirror is not loaded');
    }

    // Creates a new instance of CodeMirror and assign it to this.editor.
    this.editor = CodeMirror(document.querySelector('#main'), { // Attaches the CodeMirror editor to the #main element replacing #main with the editor
      value: '', // Initial content of the editor
      mode: 'javascript', // Syntax highlighting mode. (How the words are colored)
      theme: 'monokai',  // Theme (dark theme monokai)
      lineNumbers: true,  // A column with numbers (like in vscode) will appear
      lineWrapping: true, // If a line of code is too long to fit the visible space of the editor it will wrap onto the next line.
      autofocus: true,    // Focuses the editor when the page loads.
      indentUnit: 4,      // Number of spaces used for each indentation level.
      tabSize: 4,         // Number of spaces when pressing tab.
    });

    // When the editor is ready, set the value to whatever is stored in indexeddb.
    // Fall back to localStorage if nothing is stored in indexeddb, and if neither is available, set the value to header.
    getDb().then((data) => {
      console.info('Loaded data from IndexedDB, injecting into editor');
      
      let piece = '';

      piece = data.forEach((dat) => {
        return dat + '\n';
      })
      
      this.editor.setValue(piece || localData || header);
    });

    this.editor.on('change', () => {
      localStorage.setItem('content', this.editor.getValue());
    });

    // Save the content of the editor when the editor itself is loses focus
    this.editor.on('blur', () => {
      console.log('The editor has lost focus');
      putDb(localStorage.getItem('content'));
    });
  }
}
