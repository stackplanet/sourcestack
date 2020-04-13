import { MithrilTsxComponent } from "mithril-tsx-component";
import m, { Vnode } from "mithril";
import {CalendarEvent as CalendarEventModel, CalendarEvent} from './model/CalendarEvent';
import moment from 'moment';
import { AppContext } from "./model/AppContext";
import Calendar from "./Calendar";

export class CalendarDay extends MithrilTsxComponent<any> {

    editEvent(calendar: Calendar, event: CalendarEvent){
        calendar.eventToEdit = event;
        calendar.showEventEditor = true;
    }

    view(vnode:Vnode){
        let day = vnode.attrs['day'] as moment.Moment;
        let parent = vnode.attrs['parent'] as Calendar;
        let dayText = day.format('ddd D');
        if (day.date() < 10) dayText = dayText.replace(' ', '  ')
        let isToday = day.isSame(moment(), 'day');
        let style = "font-family: 'Roboto Mono'; white-space:pre;";
        if (isToday) style += "font-weight: bold;";
        return <div>
            <span style={style}>{dayText}</span>
            {AppContext.dataProvider.getEventsForDay(day).map(e => <a onclick={() => this.editEvent(parent, e)} class="ml1">{e.name}</a>)}
        </div>
    }

}