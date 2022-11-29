import React, { Component } from "react";
import "./Sidenav.css";

export class Sidenav extends Component {
    render() {
        return <div className="sidenav_cont">
            {
            /**
             * Your path section
             */
            }
            <span className="sidenav_title">YOUR PATH</span>
            <div className="sidenav_nav_links_cont active">
                <img src="/calender_icon.png" alt="" />
                <span>Agenda</span>
                <img src="/right_arrow.png" alt="" />
            </div>
            <div className="sidenav_nav_links_cont">
                <img src="/book_open.png" alt="" />
                <span>Exercises</span>
            </div>
            <div style={{marginBottom: "65px"}} className="sidenav_nav_links_cont">
                <img src="/materials.png" alt="" />
                <span>Materials</span>
            </div>

            {
            /**
             * Your profile section
             */
            }
            <span className="sidenav_title">YOUR PROFILE</span>
            <div className="sidenav_nav_links_cont">
                <img src="/card.png" alt="" />
                <span>Personal Information</span>
            </div>
            <div className="sidenav_nav_links_cont">
                <img src="/search_dollar.png" alt="" />
                <span>Invoices</span>
            </div>
            <div className="sidenav_nav_links_cont">
                <img src="/availability.png" alt="" />
                <span>Availability</span>
            </div>
        </div>
    }
}