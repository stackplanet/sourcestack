import m, { Vnode } from 'mithril';
import { Message as MessageModel } from './model/Message';
import { AppContext } from './model/AppContext';
import MessageView from './Message';

export default class MessageList {

    composing = false;

    sendMessageViaKeyboard = (e: KeyboardEvent) => {
        if (e.keyCode == 13 && e.metaKey) { // Command-return
            this.sendMessage();
        }
        if (e.keyCode == 27){ // escape
            this.stopEditing();
        }
    }

    messageTextElement(){
        return document.getElementById('newMessageText') as HTMLInputElement;
    }

    sendMessage = () => {
        let message = new MessageModel();
        message.text = this.messageTextElement().value;
        message.from = AppContext.currentUser.name;
        AppContext.dataProvider.saveModel(message);
        console.log('Added new message', message);
        this.stopEditing();
    }

    stopEditing = () => {
        this.messageTextElement().value = '';
        this.composing = false;
    }

    view() {
        let messages = AppContext.dataProvider.loadModels(MessageModel);
        return <div>
            <div class="columns">
                <div class="column">
                    <textarea id="newMessageText" class="textarea" rows={this.composing ? 4 : 1}
                        onkeydown={this.sendMessageViaKeyboard}
                        onclick={() => this.composing = true}
                        placeholder="Write a new message...">
                        {/* {this.newMessage.text} */}
                    </textarea>
                    {this.composing &&
                        <div>
                            <a class="button is-primary mt1 mr1" onclick={this.sendMessage}>
                                <span class="icon">
                                    <i class="fas fa-share-square"></i>
                                </span>
                                <span>Send</span>
                            </a>
                            <a class="button mt1" onclick={this.stopEditing}>
                                <span class="icon">
                                    <i class="fas fa-times"></i>
                                </span>
                                <span>Cancel</span>
                            </a>
                        </div>
                    }
                </div>
            </div>
            {messages.map(msg => <MessageView message={msg} />)}
        </div>
    }
}