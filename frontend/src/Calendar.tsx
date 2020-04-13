import m, { Vnode, VnodeDOM } from 'mithril';
import { AppContext } from './model/AppContext';
import { CalendarEvent as CalendarEventModel, CalendarEvent } from './model/CalendarEvent';
import moment from 'moment';
import { CalendarDay } from './CalendarDay';
import { CalendarEventEditor } from './CalendarEventEditor';

export default class Calendar {

    showEventEditor = false;
    eventToEdit: CalendarEventModel;

    monthStart = moment().startOf('month');

    nextMonth = () => {
        this.monthStart = this.monthStart.add(1, 'month');
    }

    prevMonth = () => {
        this.monthStart = this.monthStart.subtract(1, 'month');
    }

    showNewEventEditor = () => {
        this.eventToEdit = new CalendarEventModel();
        this.eventToEdit.date = moment();
        this.showEventEditor = true;
    }

    view() {
        var end = moment(this.monthStart).endOf('month');
        let day = moment(this.monthStart);
        let days = [];
        while (day.isBefore(end)){
            days.push(moment(day));
            day.add(1, 'days');
        }
        return <div>             

            <div class="flex items-center">
                <a class="button ml1 mr1" onclick={this.prevMonth}><span class="icon"><i class="fas fa-chevron-left fa-lg"></i></span></a>
                <a class="button ml1 mr1" onclick={this.nextMonth}><span class="icon"><i class="fas fa-chevron-right fa-lg"></i></span></a>
                <h1 class="ml3">{this.monthStart.format('MMMM YYYY')}</h1> 
                <button class="button ml3" onclick={this.showNewEventEditor}>New event</button>
            </div>
            {days.map(day => <CalendarDay parent={this} day={day}/>)}
            {this.showEventEditor && <CalendarEventEditor parent={this} event={this.eventToEdit}/>}
        </div>
    }
}




