import { rawTimeZones } from "@vvo/tzdb";
import { DateTime } from "luxon";
import React, { Component } from "react";
import OutsideClickHandler from "react-outside-click-handler";
import "./TopSection.css";

export class TopSection extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showDropdown: false,
            searchString: "",
            rawTimeZones: rawTimeZones.sort((a, b) => (a.mainCities[0]).localeCompare(b.mainCities[0])),
        }
    }

    /**
     * @summary retrieve the selected timezone
     */
    get getTimezoneInfo() {
        let mainCity = ""

        const timezoneObj = rawTimeZones.find(obj => obj.name === this.props.offset)

        if (!timezoneObj) {
            return ""
        }

        if (Array.isArray(timezoneObj.mainCities) && timezoneObj.mainCities.length > 0) {
            mainCity = timezoneObj.mainCities[0]
        }

        return `${mainCity} GMT ${DateTime.local().setZone(this.props.offset).toFormat("ZZ")}`
    }

    /**
	 * handles selecting a new timezone
	 */
	handleSelectNewTimezone = (name) => ev => {
		ev.preventDefault();

        this.props.updateStateWithOffset(name)
        this.setState({ showDropdown: false })
	}

    // searches for a timezone
	handleSearch = ev => {
		ev.persist();
		this.setState({ searchString: ev.target.value }, () => {
			if (!this.state.searchString) {
				this.setState({
					searchString: "",
					rawTimeZones: rawTimeZones.sort((a, b) => (a.rawFormat).localeCompare(b.rawFormat)),
				});
				return;
			}

			let result = this.textSearch(rawTimeZones, this.state.searchString.toLowerCase());
			this.setState({ rawTimeZones: result.sort((a, b) => (a.rawFormat).localeCompare(b.rawFormat)) });
		})
	}

	textSearch = (items, text) => {
		text = text.split(' ');
		return items.filter((item) => {
			return text.every((el) => {
				return (item.name.toLowerCase().indexOf(el) > -1) || (item.mainCities && this.checkMainCities(item.mainCities, el)) || (item.alternativeName && item.alternativeName.toLowerCase().indexOf(el) > -1) || (item.continentName && item.continentName.toLowerCase().indexOf(el) > -1) || (item.countryName && item.countryName.toLowerCase().indexOf(el) > -1);
			});
		});
	}

    checkMainCities = (items, text) => {
		text = text.split(' ');
		let arr = items.filter(item => {
			return text.every(el => {
				return (item.toLowerCase().indexOf(el) > -1)
			})
		})
		return (arr.length > 0) ? true : false;
	}

    render() {
        return <div className="top_section_cont">
            {
            /**
             * Month and year information
             */
            }
            <span className="top_section_month_name_and_year">{this.props.monthName} {this.props.year}</span>

            {
            /**
             * Calendar switches
             */
            }
            <span className="top_section_arrow_box" onClick={this.props.handleGoToPreviousMonth}>
                <img src="/calender_arrow_left.png" alt="" />
            </span>
            <span className="top_section_arrow_box" onClick={this.props.handleGoToNextMonth}>
                <img src="/calendar_arrrow_right.png" alt="" />
            </span>

            {
            /**
             * Today button
             */
            }
            <div onClick={this.props.handleGoToToday} style={{marginLeft: "35px"}} className="top_section_buttons">Today</div>

            {
            /**
             * Selected timezone
             */
            }
            <div className="top_section_buttons" onClick={() => this.setState({ showDropdown: !this.state.showDropdown })}>
                <span>{this.getTimezoneInfo}</span>

                {
                /**
                 * Dropdown
                 */
                }
                <ul className={this.state.showDropdown ? "show" : "hide"}>
                    <OutsideClickHandler onOutsideClick={() => this.setState({ showDropdown: false })}>
                        <li onClick={ev => ev.stopPropagation()}>
                            <input type="text" className="browser-default" name="searchString" value={this.state.searchString} onChange={this.handleSearch} placeholder="Type city" />
                        </li>
                        {this.state.rawTimeZones.map(item => <li key={item.name} className={(item.rawFormat === this.props.offset) ? "active" : ""} title={item.rawFormat} onClick={this.handleSelectNewTimezone(item.name)}>
                            <span>{`${item.mainCities[0]}  ${DateTime.local().setZone(item.name).toFormat("ZZ")}`}</span>
                            {/* <span className="hide-on-med-and-up">{`${item.name} (${item.rawFormat.substring(0, 6)})`}</span> */}
                        </li>)}
                    </OutsideClickHandler>
                </ul>
            </div>
        </div>
    }
}