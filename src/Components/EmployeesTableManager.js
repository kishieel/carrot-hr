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

function TableHeader(props) {
	let tr = []

	tr.push(<th key="number-header" >#</th>)
	tr.push(<th className="border-right" key="signature-header">Pracownik</th>)

    for ( const date of props.dates ) {
		// const dt = new Date(date)
      	tr.push(<th data-date={date} key={date} className="border-right text-center p-0"><span class="px-3">{ format.asString('dd.MM', new Date(date)) }</span><hr class="m-0"/><span class="px-3">{ getPolishDayName(date) }</span></th>)
    }
    return ( <tr key="tr-header">{ tr }</tr> )
}

function TableData(props) {
	let tbody = []

	// function compare(a, b) {
	// 	const stateA = a.is_super_manager || a.is_manager;
	// 	const stateB = b.is_super_manager;
	//
	// 	let comparison = 0;
	// 	if (stateA > stateB) {
	// 		comparison = 1;
	// 	} else if (stateA < stateB) {
	// 		comparison = -1;
	// 	}
	// 	return (comparison * -1)
	// }
	//
	// props.employees.sort(compare)

	for ( const [i, employee] of props.employees.entries() ) {
		const tr = []

		tr.push(<th className="align-middle" key={ "number-" + employee.id }>{ i + 1 }</th>)
		tr.push(<th className="border-right align-middle" key={ "signature-" + employee.id }>{ employee.signature }</th>)

		for ( const date of props.dates ) {
			const schedule = props.schedules.find(schedule => { return (
				schedule.employee_id == employee.id &&
				schedule.date == date
			)});

			let begin = ( schedule ) ? schedule.begin : "";
			let end = ( schedule ) ? schedule.end : "";

			if ( props.settings.is_absences_layer === true ) {

			} else if ( props.settings.is_time_layer === true ) {
				let time = "";

				let tdClassName = "border-right py-1 align-middle";
				if ( getDayName(date) == "sun" ) tdClassName += " carrotHR__field--sunday";

				let timeValidator = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/;
				if ( begin && ! ["W", "PN", "WT", "ŚR", "CZ", "PT", "SB", "ND"].includes( begin ) && timeValidator.test(begin) ) {
					let beginDate = moment(date + " " + begin);
					let endDate = moment(date + " " + end);

					// let diff = Math.abs(endDate.getTime() - beginDate.getTime());

					// if ( diff / 36e5 > 12 ) tdClassName += " carrotHR__field--warning"; // Pracuje za długo

					// moment.duration( endDate.diff( beginDate ) ).asHours();

					time = moment.duration( endDate.diff( beginDate ) ).format("H:mm");
				} else if ( begin && ["W", "PN", "WT", "ŚR", "CZ", "PT", "SB", "ND"].includes( begin ) ) {
					time = begin;
				}



				let inputClassName = "carrotHR__input carrotHR__input--shift form-control";



				tr.push(
					<td id={employee.id + ":" + date} key={ employee.id + ":" + date} className={ tdClassName }>
						<input data-date-id={date} data-employee-id={employee.id} className={ inputClassName } value={ time } disabled/>
					</td>
				);
			} else {
				let isBeginProperlyFormated = true;
				let timeValidator = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/;

				if ( begin && ! ["W", "PN", "WT", "ŚR", "CZ", "PT", "SB", "ND"].includes( begin ) ) {
					if ( ! timeValidator.test( begin ) ) {
						isBeginProperlyFormated = false;
					}
				}

				let tdClassName = "border-right py-1 align-middle";
				if ( getDayName(date) == "sun" ) tdClassName += " carrotHR__field--sunday";
				if ( schedule && schedule.preference ) tdClassName += " carrotHR__field--preference";
				if ( props.settings.holidays.find( holiday => { return ( holiday.date == date ) }) ) tdClassName += " carrotHR__field--holiday";
				if ( isBeginProperlyFormated === false ) tdClassName += " carrotHR__field--warning"

				let inputClassName = "carrotHR__input carrotHR__input--shift form-control";

				// <input data-date-id={date} data-employee-id={employee.id} className={ endInputClassName } onChange={ (e) => props.onScheduleChange(e, "end") } value={ end } />
				tr.push(
					<td id={employee.id + ":" + date} key={ employee.id + ":" + date} className={ tdClassName }>
						<input data-date-id={date} data-employee-id={employee.id} className={ inputClassName } onChange={ props.onScheduleBeginChange } value={ begin } />
						{ ( begin && isBeginProperlyFormated && ! ["W", "PN", "WT", "ŚR", "CZ", "PT", "SB", "ND"].includes( begin ) ) ?
							<input data-date-id={date} data-employee-id={employee.id} className={ inputClassName } onChange={ props.onScheduleEndChange } value={ end } /> : ""
						}
					</td>
				);
			}
		}

		let trClassName = "";
		// if ( employee.is_super_manager == true ) trClassName += " carrotHR__row--super-manager"
		// if ( employee.is_manager == true ) trClassName += " carrotHR__row--manager"

		tbody.push(<tr class={ trClassName } key={ employee.id } draggable>{ tr }</tr>)
	}

	return tbody;
}

function TableNewRow(props) {
	const tr = [];
	tr.push(<th key="order-new">#</th>)
	tr.push(<th key="signature-new"><input key="signature-input-new" onKeyDown={ props.onNewEmployee } /></th>)

	for ( const date of props.dates ) {
		tr.push(<td key={date}></td>)
	}

	return ( <tr key="signature-tr">{ tr }</tr> );
}

export default class EmployeesTableManager extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<table className="carrotHR__table table table-hover table-striped mb-0 text-nowrap border-top">
				<thead>
					<TableHeader dates={ this.props.dates }/>
				</thead>
				<tbody>
					<TableData settings={ this.props.settings } employees={ this.props.employees } dates={ this.props.dates } schedules={ this.props.schedules } onScheduleBeginChange={this.props.onScheduleBeginChange} onScheduleEndChange={this.props.onScheduleEndChange}/>
					<TableNewRow dates={ this.props.dates } onNewEmployee={ this.props.onNewEmployee }/>
				</tbody>
			</table>
		)
	}
}
