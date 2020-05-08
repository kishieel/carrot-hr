const schedulesReducer = (state = [], action) => {
	switch (action.type) {
		case 'GENERATE': {
			state = state.slice()
			state.push({ id: '#' + Math.floor(Math.random() * 16777215).toString(16), status: 'success' })
			console.log( state )
			return [ ...state ]
		}
		case 'CLEAR': {
			state = state.slice()
			state.length = 0
			return [ ...state ]
		}
		default:
			return state;
	}
};

export default schedulesReducer;
