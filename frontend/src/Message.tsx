import m, { Vnode } from 'mithril';
import { MithrilTsxComponent } from 'mithril-tsx-component'
import { Message as MessageModel } from './model/Message';
import { AppContext } from './model/AppContext';
import moment from 'moment';

export default class Message extends MithrilTsxComponent<any> {

    message:MessageModel;

    deleteMessage = ()=> {
        AppContext.dataProvider.deleteModel(this.message);
    }

     view(vnode:Vnode<{message:MessageModel}>){
        this.message = vnode.attrs.message;
        let timeAgo = moment.duration(moment().diff(this.message.created)).humanize();
        let initial = this.message.from.substring(0,1).toLocaleUpperCase();
        let person = AppContext.dataProvider.loadPerson(this.message.from);
        return <div class="box">
            <article class="media">
                <div class="media-left">
                    <div class="circle-text" style={`background-color: ${person.color}`}>{initial}</div>
                    {/* <figure class="image is-64x64">
                        <img src="https://bulma.io/images/placeholders/128x128.png" alt="Image" />
                    </figure> */}
                </div>
                <div class="media-content">
                    <div class="content">
                        <p>
                            <strong>{this.message.from}</strong> <small>{timeAgo} ago</small>
                            <br />
                            {this.message.text}
                    </p>
                    </div>
                    <nav class="level is-mobile">
                        <div class="level-left">
                            <a class="level-item">
                                <span class="icon is-small">
                                    <a class="message__button"><i class="fa fa-reply"></i></a>
                                </span>
                            </a>

                            <a class="level-item">
                                <span class="icon is-small">
                                    <a class="message__button"><i class="far fa-heart"></i></a>
                                </span>
                            </a>
                            <a class="level-item">
                                <span class="icon is-small">
                                    <a class="message__button" onclick={this.deleteMessage}><i class="fas fa-trash" ></i> </a>
                                </span>
                            </a>
                        </div>
                    </nav>
                </div>
            </article>
        </div>
     }
 }