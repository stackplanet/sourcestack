import { Model } from "./Model";

export interface CalendarEvent extends Model {
    
    name: string;
    date: string;
    time?:string;
    peopleIds?: string[];
    allDay?:boolean;
    appointments?: Appointment[];
    

}

export interface Appointment {

    name: string;
    priority: 'low'|'medium'|'high'

}