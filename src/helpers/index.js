export const DAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

const PL_DAYS_FULL = { mon: "Poniedziałek", tue: "Wtorek", wed: "Środa", thu: "Czwartek", fri: "Piatek", sat: "Sobota", sun: "Niedziela"};
export const getDayName = ( en ) => {
	return PL_DAYS_FULL[ en ];
}
