'use babel';

import MessageView from './message-view';
import { CompositeDisposable } from 'atom';

var shell = require('shelljs');
shell.config.execPath = '/usr/local/bin/node';

export default {

    messageView: null,
    messagePanel: null,
    subscriptions: null,
    synchronizationEnabled: false,

    activate(state) {
        this.messageView = new MessageView(state.messageViewState);
        this.messagePanel = atom.workspace.addBottomPanel({
            item: this.messageView.getElement(),
            visible: true
        });

        // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
        this.subscriptions = new CompositeDisposable();

        // Register command that toggles this view
        this.subscriptions.add(atom.commands.add('atom-workspace', {
            'atom-repo:toggleSynchronization': () => this.toggleSynchronization()
        }));

        this.subscriptions.add(atom.commands.add('atom-workspace', {
            'atom-repo:get': (event) => this.handleGetCommand(event)
        }));

        this.subscriptions.add(atom.commands.add('atom-workspace', {
            'atom-repo:put': (event) => this.handlePutCommand(event)
        }));

        let self = this;
        this.subscriptions.add(atom.workspace.observeTextEditors(function(editor) {
            editor.onDidSave((event) => self.handleOnSave(event) );
        }));
    },

    deactivate() {
        this.messagePanel.destroy();
        this.subscriptions.dispose();
        this.messageView.destroy();
    },

    serialize() {
        return {
            messageViewState: this.messageView.serialize()
        };
    },

    toggleSynchronization() {
        this.synchronizationEnabled = !this.synchronizationEnabled;

        let message = this.synchronizationEnabled ?
            'Synchronization is now enabled. Saving files under jcr_root will automatically upload them to AEM' :
            'Synchronization is now disabled'
        this.messageView.appendMessage(message, 'info');
    },

    handleGetCommand(event) {
        let path = event.target.getAttribute('data-path');
        this.executeGetCommand(path);
    },

    executeGetCommand(path) {
        console.log(`repo: getting ${path}`);

        let exec = shell.exec(`repo get -f ${path}`, {silent: false});

        if(exec.code == 0) {
            let relativePath = path.split('/jcr_root')[1];
            this.messageView.appendMessage(`get: ${relativePath}`, 'success');
        } else {
            this.handleError(exec.stderr);
        }
    },

    handlePutCommand(event) {
        let path = event.target.getAttribute('data-path');
        this.executePutCommand(path);
    },

    executePutCommand(path) {
        console.log(`repo: putting ${path}`);

        let exec = shell.exec(`repo put -f ${path}`, {silent: false});

        if(exec.code == 0) {
            let relativePath = path.split('/jcr_root')[1];
            this.messageView.appendMessage(`put: ${relativePath}`, 'success');
        } else {
            this.handleError(exec.stderr);
        }
    },

    handleOnSave(event) {
        let path = event.path;
        if(this.synchronizationEnabled && path.includes('/jcr_root/')) {
            this.executePutCommand(path);
        }
    },

    handleError(message) {
        this.messageView.appendMessage(message, 'error');
    }
};
