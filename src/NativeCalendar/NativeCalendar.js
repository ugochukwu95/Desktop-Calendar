import React, { Component } from "react";
import { TopSection } from "./TopSection/TopSection";
import { addZero } from "../Utils/Utils";
import "./NativeCalendar.css";
import { DateTime } from "luxon";
import { EventModal } from "./EventModal/EventModal";

export class NativeCalendar extends Component {
    constructor(props) {
        super(props)
        this.state = {
            year: "",
            month: "",
            monthName: "",
            currentMonthDays: null,
            calenderDays: null,
            position: 0,
            years: null,
            offset: Intl.DateTimeFormat().resolvedOptions().timeZone,
            errorMessage: "",
            currentLuxonDate: null,
            selectedEvent: null,
            events: [
                { title: "Speaking class", displayName: "Liam", topic: "Food", duration: "45", dateTime: "2022-11-05T14:00:00.000Z", materials: ["Video Learning", "Music Learning"] },
                { title: "Speaking class", displayName: "Liam", topic: "Food", duration: "90", dateTime: "2022-11-15T16:00:00.000Z", materials: ["Competency Learning", "React Learning"] },
                { title: "Speaking class", displayName: "Ugo", topic: "Compassion", duration: "30", dateTime: "2022-11-30T18:00:00.000Z", materials: ["Exercise", "Music Learning"] },
                { title: "Speaking class", displayName: "Jane", topic: "Wealth", duration: "30", dateTime: "2022-12-02T08:00:00.000Z", materials: ["Tests", "Focus improvement"] },
            ]
        }

        this.days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"]
        this.calRows = [1, 2, 3, 4, 5, 6]
    }

    /**
     * @summary - Closes event modal
     */
    closeEventModal = () => {
        this.setState({ selectedEvent: null })
    }

    /**
     * @summary - Update state to change timezone
     * @param {string} offset 
     */
    updateStateWithOffset = offset => {
        this.setState({ offset }, () => this.initializeCalendar())
    }

    /**
     * @summary - Go to next month
     */
    handleGoToNextMonth = () => {
        let currentLuxonDate = this.state.currentLuxonDate
        currentLuxonDate = currentLuxonDate.plus({ months: 1 })

        this.setState({ currentLuxonDate }, () => this.initializeCalendar(currentLuxonDate.toJSDate()))
    }

    /**
     * @summary - Go to previous month
     */
    handleGoToPreviousMonth = () => {
        let currentLuxonDate = this.state.currentLuxonDate
        currentLuxonDate = currentLuxonDate.minus({ months: 1 })

        this.setState({ currentLuxonDate }, () => this.initializeCalendar(currentLuxonDate.toJSDate()))
    }

    /**
     * @summary - Navigates to current day, month, and year
     */
    handleGoToToday = () => {
        this.initializeCalendar()
    }

    /**
     * @summary - Determines whether to grey out UI date
     * @param {Object} luxDate 
     * @returns Boolean
     */
    checkIfDateShouldBeGreyedOut = luxDate => {
        let currentLuxonMonth = DateTime.fromJSDate(new Date(`${this.state.year}-${addZero(this.state.month)}-02`))

        if ((luxDate < currentLuxonMonth.startOf("month")) || (luxDate > currentLuxonMonth.endOf("month"))) {
            return true
        }

        return false
    }

    /**
     * @summary - Used to check if to render the month name by the date
     * @param {Object} luxDate 
     * @returns String|Number
     */
    formatDatesForUI = luxDate => {
        // compare month dates
        if (Number(luxDate.toFormat("d")) === 1) {
            return `${luxDate.toFormat("LLL")} 1`
        }

        return Number(luxDate.toFormat("d"))
    }

    /**
     * @summary - Compares two dates (no times) for similarity
     * @param {Date} d1 
     * @returns Boolean
     */
     checkIfTwoDatesAreSame = (d1) => {
        if (d1.toFormat("d") === "1") {
            return false
        }

        let currentLuxonDate = DateTime.fromISO(new Date().toISOString(), { zone: this.state.offset });
        currentLuxonDate = currentLuxonDate.set({ hour: "00" }).set({ minutes: "00" })
        currentLuxonDate = DateTime.fromISO(currentLuxonDate.toISO(), { zone: "utc" }).toISO()
        currentLuxonDate = DateTime.fromISO(currentLuxonDate).setZone(this.state.offset).set({ hour: "00" }).set({ minutes: "00" })

        if (d1.toFormat("yyyy-LL-dd") === currentLuxonDate.toFormat("yyyy-LL-dd")) {
            return true
        }
        return false
    }

     /**
     * @summary - generate calendar formatted days for UI purposes
     */
    handleLoadDaysInMonth = () => {
        // structure of the calendar
        const calenderDays = { 1: { days: [] }, 2: { days: [] }, 3: { days: [] }, 4: { days: [] }, 5: { days: [] }, 6: { days: [] } };

        // the first day of the month is 1
        let calenderDaysStart = 1;

        // generate days for calender
        for (let i = 0; i < this.state.currentMonthDays.length; i++) {
            // cache the day of the week
            let dayOfWeek = Number(this.state.currentMonthDays[i].toFormat("c"))

            // if generating the first row of days and the first day doesn't fall on a sunday add the date
            if ((i === 0) && (dayOfWeek !== 0) && (dayOfWeek !== 7)) {
                calenderDays[calenderDaysStart]["days"].push(this.state.currentMonthDays[i]);

                // add previous month days
                if (dayOfWeek !== 1) {
                    for (let j = 1; j < dayOfWeek; j++) {
                        let d_ = this.state.currentMonthDays[i].minus({ days: j })
                        calenderDays[calenderDaysStart]["days"].unshift(d_)
                    }
                }
            }

            // if the first day is a sunday, add previous month days
            else if (dayOfWeek === 7) {
                calenderDays[calenderDaysStart]["days"].push(this.state.currentMonthDays[i]);

                if ((calenderDays[calenderDaysStart]["days"].length < 7) && (i === 0)) {
                    for (let j = 1; j < dayOfWeek; j++) {
                        let d_ = this.state.currentMonthDays[i].minus({ days: j })
                        calenderDays[calenderDaysStart]["days"].unshift(d_)
                    }
                }
                calenderDaysStart = calenderDaysStart + 1;
            }
            // if the last day of the month is not a sunday, add next month days
            else if ((i === (this.state.currentMonthDays.length - 1)) && (dayOfWeek !== 0) && (dayOfWeek !== 7)) {
                calenderDays[calenderDaysStart]["days"].push(this.state.currentMonthDays[i]);

                for (let j = 1; j < ((7 - dayOfWeek) + 1); j++) {
                    let d_ = this.state.currentMonthDays[i].plus({ days: j })
                    calenderDays[calenderDaysStart]["days"].push(d_)
                }
            }
            else {
                calenderDays[calenderDaysStart]["days"].push(this.state.currentMonthDays[i]);
            }
        }

        this.setState({ calenderDays })
    }

    /**
     * @summary - Initialize calendar
     */
    initializeCalendar = async (date = null) => {
        // cache default IANA timezone name
        let offset = this.state.offset
        
        let curr = date || new Date();

        curr = DateTime.fromISO(curr.toISOString(), date ? {} : { zone: offset })
        curr = curr.set({ hour: "00" }).set({ minutes: "00" })
        curr = DateTime.fromISO(curr.toISO(), { zone: "utc" }).toISO()

        // cache first day of month
        let firstDayOfMonth = DateTime.fromISO(curr).set({ hour: "00" }).set({ minutes: "00" }).startOf("month")

        // cache last day of month
        let lastDayOfMonth = firstDayOfMonth.endOf("month");
        
        let year = Number(firstDayOfMonth.toFormat("yyyy"));

        let month = Number(firstDayOfMonth.toFormat("L"))

        let monthName = firstDayOfMonth.toFormat("LLLL")

        // cache list of days in month here
        let currentMonthDays = [];

        // loop to get list of days 
        for (let i = 0; i <= Number(lastDayOfMonth.toFormat("d")) - 1; i++) {
            currentMonthDays.push(firstDayOfMonth.plus({ days: i }))
        }

        this.setState({ year, month, currentMonthDays, offset, monthName, currentLuxonDate: firstDayOfMonth }, () => {
            // get days in month to display in the UI
            this.handleLoadDaysInMonth()
        })
    }

    render() {
        return <React.Fragment>
            {
            /**
             * Change month and timezone section
             */
            }
            <TopSection {...this.state} handleGoToToday={this.handleGoToToday} handleGoToPreviousMonth={this.handleGoToPreviousMonth} handleGoToNextMonth={this.handleGoToNextMonth} updateStateWithOffset={this.updateStateWithOffset} />

            {
            /**
             * Event detail modal
             */
            }
            <EventModal {...this.state} closeEventModal={this.closeEventModal} />

            {
            /**
             * Render list of days in month
             */
            }
            <table className={`native_calendar_cont default_transition_anim`}>
                {
                /**
                 * List of day in week
                 */
                }
                <thead>
                    <tr>{this.days.map(day => <th className="center" key={day}>{day}</th>)}</tr>
                </thead>

                {
                /**
                 * List of days in the monthe
                 */
                }
                <tbody>
                    {this.state.calenderDays && Object.keys(this.state.calenderDays).map(i => <tr key={i}>
                        {
                            this.state.calenderDays[i]['days'].map((val, index) => <td key={val.toFormat("d") + index}>
                                <span className={`native_calendar_date ${this.checkIfDateShouldBeGreyedOut(val) ? "greyed_out" : ""} ${this.checkIfTwoDatesAreSame(val) ? "active" : ""}`}>
                                    {this.formatDatesForUI(val)}
                                </span>

                                {
                                /**
                                 * Events
                                 */
                                }
                                {(Array.isArray(this.state.events) && this.state.events.length > 0 && this.state.events.find(obj => DateTime.fromISO(obj.dateTime).setZone(this.state.offset).toFormat("yyyy LLL dd") === val.toFormat("yyyy LLL dd"))) && <div className="native_calendar_date_event_cont">
                                    {this.state.events.filter(obj => DateTime.fromISO(obj.dateTime).setZone(this.state.offset).toFormat("yyyy LLL dd") === val.toFormat("yyyy LLL dd")).map(j => <div key={j.dateTime} className={`native_calendar_date_event ${DateTime.fromISO(j.dateTime).setZone(this.state.offset) < DateTime.local().setZone(this.state.offset) ? "greyed_out" : ""}`} onClick={() => this.setState({ selectedEvent: j })}>
                                        <div><span></span></div>
                                        <div>
                                            <span>{DateTime.fromISO(j.dateTime).setZone(this.state.offset).toFormat("hh:mm")} - {DateTime.fromISO(j.dateTime).setZone(this.state.offset).plus({ minutes: Number(j.duration) }).toFormat("hh:mm")}</span>
                                            <span>{j.title}</span>
                                        </div>
                                    </div>)}
                                </div>}
                            </td>)
                        }
                    </tr>)}
                </tbody>
            </table>
            <br /><br />
        </React.Fragment>
    }

    componentDidMount() {
        // we setup the component
        this.initializeCalendar(this.props.date ? new Date(this.props.date) : null)
    }
}