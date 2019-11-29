import Actions from '../actions/actions-enums';

const initialState = {
  items: []
};

export default function productsState(state = initialState, action) {
  switch (action.type) {
    case Actions.ADD_LOAN:
      return Object.assign({}, state, {
        items: [
          ...state.items, action.payload
        ]
      });

    case Actions.EXTEND_LOAN:
      return Object.assign({}, state, {
        items: state.items.map(loan => loan.id === action.id ? // eslint-disable-line no-confusing-arrow, max-len
        { ...loan, ...action.payload } : // eslint-disable-line no-unused-expressions
          loan)
      });

    default:
      return state;
  }
}
