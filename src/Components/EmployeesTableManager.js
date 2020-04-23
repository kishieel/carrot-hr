import React, { Component } from 'react';

const format = require('date-format');
const moment = require('moment');
const momentDurationFormatSetup = require("moment-duration-format");

const days = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
let getDayName = (date) => {
	let dt = new Date(date);
	return days[dt.getDay()];
}

const days_PL = ["ND", "PN", "WT", "ŚR", "CZ", "PT", "SB"];
let getPolishDayName = (date) => {
	let dt = new Date(date);
	return days_PL[dt.getDay()];
}

let timeValidator = (time) => {
	let reg = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/;
	return reg.test(time);
}

let shiftValidator = (shift) => {
	let shifts = ["1", "2", "3", "W", "PN", "WT", "ŚR", "CZ", "PT", "SB", "ND"];
	return shifts.includes(shift)
}

export default class EmployeesTableManager extends Component {
	constructor(props) {
		super(props);
	}

	tableHeader() {
		let tr = []

		tr.push(<th key="number-header" >#</th>)
		tr.push(<th className="border-right" key="signature-header">Pracownik</th>)

	    for ( const date of this.props.dates ) {
	      	tr.push(<th data-date={date} key={date} className="border-right text-center p-0"><span class="px-3">{ format.asString('dd.MM', new Date(date)) }</span><hr class="m-0"/><span class="px-3">{ getPolishDayName(date) }</span></th>)
	    }
	    return ( <tr key="tr-header">{ tr }</tr> )
	}

	tableData() {
		let tbody = []

		for ( const [i, employee] of this.props.employees.entries() ) {
			const tr = []

			tr.push(<th className="align-middle" key={ "number-" + employee.id }>{ i + 1 }</th>)
			tr.push(<th className="border-right align-middle" key={ "signature-" + employee.id }>{ employee.signature }</th>)

			for ( const date of this.props.dates ) {
				const schedule = this.props.schedules.find(schedule => { return (
					schedule.employee_id == employee.id &&
					schedule.date == date
				)});

				let scheduleBegin = ( schedule ) ? schedule.begin : "";
				let scheduleEnd = ( schedule ) ? schedule.end : "";

				let tdTitle = "";
				let tdClassName = "border-right py-1 align-middle";
				let inputClassName = "carrotHR__input carrotHR__input--shift form-control";

				if ( getDayName(date) == "sun" ) tdClassName += " carrotHR__field--sunday";
				if ( schedule && schedule.preference ) tdClassName += " carrotHR__field--preference";
				if ( this.props.settings.holidays.find( holiday => { return ( holiday.date == date ) }) ) tdClassName += " carrotHR__field--holiday";
				if ( scheduleBegin && ! timeValidator( scheduleBegin ) && ! shiftValidator( scheduleBegin ) ) {
					tdClassName += " carrotHR__field--warning"
					tdTitle = "\"" + scheduleBegin + "\" nie jest poprawnym wpisem.";
				}
				if ( scheduleBegin && timeValidator( scheduleBegin ) && ! timeValidator ( scheduleEnd )) {
					tdClassName += " carrotHR__field--warning"
					tdTitle = "\"" + scheduleEnd + "\" nie jest poprawnym wpisem.";
				}

				let shiftTime = "";
				if ( ( timeValidator( scheduleBegin ) && timeValidator( scheduleEnd ) ) ) {
					let scheduleBeginDate = moment(date + " " + scheduleBegin)
					let scheduleEndDate = moment(date + " " + scheduleEnd)

					if ( scheduleEndDate.diff(scheduleBeginDate) <= 0 ) {
						scheduleEndDate.add(1, 'days');
					}

					shiftTime = moment.duration( scheduleEndDate.diff( scheduleBeginDate ) );

					let norm = shiftTime.asHours() - this.props.settings.max_daily_time
					if ( norm > 0 ) {
						tdClassName += " carrotHR__field--warning";
						tdTitle = " Przekroczono normę czasu pracy o " + norm + "h.";
					}

					shiftTime = shiftTime.format("H:mm");
				} else if( shiftValidator( scheduleBegin) ) {
					shiftTime = scheduleBegin;
				}

				if ( this.props.settings.is_absences_layer ) {

				} else if ( this.props.settings.is_time_layer ) {
					tr.push(
						<td id={employee.id + ":" + date} key={ employee.id + ":" + date} className={ tdClassName } title={ tdTitle }>
							<input data-date-id={date} data-employee-id={employee.id} className={ inputClassName } value={ shiftTime } disabled/>
						</td>
					);
				} else {
					let endInput = null;

					if ( schedule && timeValidator(schedule.begin) && !shiftValidator(schedule.begin) ) {
						endInput = <input data-date-id={date} data-employee-id={employee.id} className={ inputClassName } onChange={ this.props.onScheduleEndChange } value={ scheduleEnd } />
					}

					tr.push(
						<td id={employee.id + ":" + date} key={ employee.id + ":" + date} className={ tdClassName } title={ tdTitle }>
							<input data-date-id={date} data-employee-id={employee.id} className={ inputClassName } onChange={ this.props.onScheduleBeginChange } value={ scheduleBegin } />
							{ endInput }
						</td>
					);
				}
			}

			tbody.push(<tr key={ employee.id } >{ tr }</tr>)
		}

		return tbody;
	}

	tableNewRow() {
		const tr = [];
		tr.push(<th key="order-new">#</th>)
		tr.push(<th key="signature-new"><input key="signature-input-new" onKeyDown={ this.props.onNewEmployee } /></th>)

		for ( const date of this.props.dates ) {
			tr.push(<td key={date}></td>)
		}

		return ( <tr key="signature-tr">{ tr }</tr> );
	}

	render() {
		return (
			<table className="carrotHR__table table table-hover table-striped mb-0 text-nowrap border-top">
				<thead>
					{ this.tableHeader() }
				</thead>
				<tbody>
					{ this.tableData() }
					{ this.tableNewRow() }
				</tbody>
			</table>
		)
	}
}
