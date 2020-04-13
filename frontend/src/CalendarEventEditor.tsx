import { MithrilTsxComponent } from "mithril-tsx-component";
import m, { Vnode, VnodeDOM } from 'mithril';
import { AppContext } from './model/AppContext';
import { CalendarEvent as CalendarEventModel, CalendarEvent } from './model/CalendarEvent';
import Calendar from "./Calendar";
import { ModelBinder } from "./model/ModelBinder";
import moment from 'moment';

export class CalendarEventEditor extends MithrilTsxComponent<any> {

    parent: Calendar;
    event: CalendarEvent;

    saveNewEvent = () => {
        AppContext.dataProvider.saveModel(this.event);
        this.close();
    }

    close = () => {
        this.parent.showEventEditor = false;
    }

    preventSave = () => {
        return !this.event.name || !this.event.date;
    }

    closeOnEscape = (e:KeyboardEvent) => {
        if (e.keyCode == 27) this.close();
        m.redraw();
    }

    oncreate(vnode:VnodeDOM){
        document.addEventListener("keydown", this.closeOnEscape, false);
        vnode.dom.querySelector('input').focus();
    }

    onremove(){
        document.removeEventListener("keydown", this.closeOnEscape, false);
    }

    view(vnode:Vnode){
        this.parent = vnode.attrs['parent'];
        this.event = vnode.attrs['event'] as CalendarEvent;
        let binder = new ModelBinder(this.event);
        return <div class="modal is-active">
            <div class="modal-background"></div>
            <div class="modal-card">
                <header class="modal-card-head">
                    <p class="modal-card-title">Event detail</p>
                    <button class="delete" aria-label="close" onclick={this.close}></button>
                </header>
                <section class="modal-card-body">
                    <div class="field">
                        <label class="label">Name</label>
                        <div class="control">
                            <input class="input" type="text" value={this.event.name} placeholder="Event name" onkeyup={binder.text('name')}/>
                        </div>
                    </div>
                    <div class="field">
                        <label class="label">Date</label>
                        <div class="control">
                            <input class="input" type="date" value={this.event.date.format('YYYY-MM-DD')} oninput={binder.date('date')}/>
                        </div>
                    </div>
                    <label class="checkbox">
                        <input type="checkbox" onchange={binder.boolean('allDay')} checked={this.event.allDay}/>
                        All day
                    </label>
                    {!this.event.allDay && 
                        <div class="field">
                        <label class="label">Time</label>
                        <div class="control">
                            <input class="input" type="time" oninput={binder.text('time')} value={this.event.time}/>
                        </div>
                    </div>}
                </section>
                <footer class="modal-card-foot">
                    <button class="button is-success" disabled={this.preventSave()} onclick={this.saveNewEvent}>Create</button>
                    <button class="button" onclick={this.close}>Cancel</button>
                </footer>
            </div>
        </div>
    }
}