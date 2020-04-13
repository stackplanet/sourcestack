import m, { Vnode } from 'mithril';
import moment from 'moment';

export default class Clock {

    nowDate: Date;

    constructor() {
        this.tick();
    }

    tick() {
        this.nowDate = new Date();
        setTimeout(() => { this.tick() }, 1000);
        m.redraw();
    }

    secAngle() {
        return 360 * this.nowDate.getSeconds() / 60;
    }

    minAngle() {
        return 360 * this.nowDate.getMinutes() / 60;
    }

    hoursAngle() {
        let date = this.nowDate;
        return 360 * date.getHours() / 12 + date.getMinutes() / 2;
    }

    view() {
        return <div class="Clock" >
            <svg width="120" height="120" viewBox="0 0 200 200">
                <filter id="innerShadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
                    <feOffset in="blur" dx="2.5" dy="2.5" />
                </filter>
                <g>
                    <circle id="shadow" style="fill:rgba(0,0,0,0.1)" cx="97" cy="100" r="87" filter="url(#innerShadow)"></circle>
                    <circle id="circle" style="stroke: #FFF; stroke-width: 12px; fill:#888" cx="100" cy="100" r="80"></circle>
                </g>
                <g>
                    <line x1="100" y1="100" x2="100" y2="55" style="stroke-width: 3px; stroke: #fffbf9;" id="hourhand" transform={`rotate(${this.hoursAngle()} 100 100)`}>
                    </line>
                    <line x1="100" y1="100" x2="100" y2="40" style="stroke-width: 4px; stroke: #fdfdfd;" id="minutehand" transform={`rotate(${this.minAngle()} 100 100)`}>

                    </line>
                    <line x1="100" y1="100" x2="100" y2="30" style="stroke-width: 2px; stroke: #C1EFED;" id="secondhand" transform={`rotate(${this.secAngle()} 100 100)`}>
                    </line>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(i => {
                        return <line x1="100" y1="30" x2="100" y2="40"
                            transform={'rotate(' + (i * 360 / 12) + ' 100 100)'}
                            style="stroke: #ffffff;"></line>
                    })}

                </g>
                <circle id="center" style="fill:#128A86; stroke: #C1EFED; stroke-width: 2px;" cx="100" cy="100" r="3"></circle>
            </svg>
            <div class="Clock__time" style="text-align:center; font-size: 1.2rem;">
                {moment().format('h:mm A')}
            </div>
        </div>
        
        

    }


}
