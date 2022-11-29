import { DateTime } from "luxon";
import React, {Component} from "react";
import "./EventModal.css";

export class EventModal extends Component {
    render() {
        return <div onClick={this.props.closeEventModal} className={`event_modal_cont default_transition_anim ${this.props.selectedEvent ? "" : "hideWithAnim addPositionedAbsolute"}`}>
            {this.props.selectedEvent && <div onClick={ev => ev.stopPropagation()}>
                <div className="event_modal_topic">
                    <span>{this.props.selectedEvent.title}</span>
                    <div>
                        <img src="/8e88f4561b02f111fd55434f2328dd5.png" alt="" />
                        <span>{this.props.selectedEvent.displayName}</span>
                    </div>
                </div>
                <h6 className="event_modal_title">Topic: {this.props.selectedEvent.topic}</h6>

                <table className={`event_modal_table ${DateTime.fromISO(this.props.selectedEvent.dateTime).setZone(this.props.offset) < DateTime.local().setZone(this.props.offset) ? "past" : ""}`}>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Duration</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{DateTime.fromISO(this.props.selectedEvent.dateTime).setZone(this.props.offset).toFormat("cccc d LLLL yyyy")}</td>
                            <td>{DateTime.fromISO(this.props.selectedEvent.dateTime).setZone(this.props.offset).toFormat("hh:mm")}</td>
                            <td>{this.props.selectedEvent.duration} minutes</td>
                        </tr>
                    </tbody>
                </table>

                {
                /**
                 * Join button
                 */
                }
                <div className={`event_modal_join_btn ${DateTime.fromISO(this.props.selectedEvent.dateTime).setZone(this.props.offset) < DateTime.local().setZone(this.props.offset) ? "past" : ""}`}>
                    {DateTime.fromISO(this.props.selectedEvent.dateTime).setZone(this.props.offset) < DateTime.local().setZone(this.props.offset) ? "WATCH RECORDING" : "JOIN"}
                </div>

                {
                /**
                 * Material
                 */
                }
                <div className="event_modal_material_section">
                    <div>Material:</div>
                    <div>
                        {this.props.selectedEvent.materials.map(v => <span key={v}>{v}</span>)}
                    </div>
                </div>
            </div>}
        </div>
    }
}