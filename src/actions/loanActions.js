import Actions from './actions-enums';

export function addLoan(item) {
  return {
    type: Actions.ADD_LOAN,
    payload: item
  };
}

export function extendLoan(item) {
  return {
    type: Actions.EXTEND_LOAN,
    payload: item
  };
}
