'use babel';

export default class MessageView {

    constructor(serializedState) {
        // Create root element
        this.element = document.createElement('div');
        this.element.classList.add('repo-message-view');
    }

    // Returns an object that can be retrieved when package is activated
    serialize() {}

    // Tear down any state and detach
    destroy() {
        this.element.remove();
    }

    getElement() {
        return this.element;
    }

    appendMessage(message, type, icon) {
        if(icon === undefined) {
            icon = 'info';

            if(type === 'success') {
                icon = 'check';
            } else if (type === 'error') {
                icon = 'alert';
            }
        }

        message = `<span class="icon icon-${icon}"></span> ${message}`;

        const messageElement = document.createElement('div');
        messageElement.innerHTML = message;
        messageElement.classList.add(type);
        this.element.appendChild(messageElement);

        if(this.element.childNodes.length >= 5) {
            this.element.removeChild(this.element.childNodes[0]);
        }
    }
}
