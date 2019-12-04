import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, Panel } from 'react-bootstrap';
import moment from 'moment';
import * as loanActions from '../actions/loanActions';

export class Loans extends React.PureComponent {

  extendLoan(loanItem) {
    const { loanActions } = this.props;
    const { extensionDays } = process.env;

    loanItem.history.push(Object.assign({}, loanItem));
    loanItem.interestRate *= 1.5;

    const amount = loanItem.loanAmount;
    const dailyIncrease = amount * ((loanItem.interestRate) / 100);

    let totalAmount = loanItem.totalAmount;

    totalAmount += dailyIncrease * extensionDays;
    loanItem.loanDate = moment(loanItem.loanDate).add(extensionDays, 'days').valueOf();
    loanItem.loanDayCount += extensionDays;
    loanItem.totalAmount = totalAmount;
    loanItem.extended = true;
    loanActions.extendLoan(loanItem);
  }

  render() {
    const { items } = this.props.loan;
    const { label, format, extensionDays } = process.env;

    return (
      <div className="col-sm-7 module-container">
        <div className="dashboard-module">
          <h2>{label.loans.loansTitle}</h2>
          {items.length > 0 ?
            <div>
              {items.map(item => (
                <div key={item.id}>
                  {item.history.map(oldLoan => (
                    <Panel
                      key={Math.random()}
                      eventKey={Math.random()}
                      header={item.loanAmount + ' € (' + moment(oldLoan.loanDate).format(format.dateExtended) + ') - extended by ' + extensionDays + ' days'}
                    >
                      <div className="col-sm-12">
                        <p>{label.loans.repayableAmount}: {oldLoan.totalAmount.toFixed(2)} €</p>
                        <p>{label.loans.loanDayCount} {oldLoan.loanDayCount} days</p>
                        <p>{label.loans.extensionInterest}: {oldLoan.interestRate}%</p>
                      </div>
                    </Panel>
                  ))}
                  <Panel
                    header={item.loanAmount + ' € (' + moment(item.loanDate).format(format.dateExtended) + ')'}
                    bsStyle="primary"
                  >
                    <div className="col-sm-9">
                      <p>{label.loans.repayableAmount}: {item.totalAmount.toFixed(2)} €</p>
                      <p>{label.loans.loanedDays} {item.loanDayCount} days</p>
                      <p>{item.extended ? label.loans.extensionInterest : label.loans.interest} : {item.interestRate}%</p>
                    </div>
                    <div className="col-sm-3 text-right">
                      <Button type="button" className="btn btn-default btn-sm" onClick={() => { this.extendLoan(item); }}>Extend</Button>
                    </div>
                  </Panel>
                  <hr />
                </div>
              ))}
            </div>
          : label.loans.noActiveLoans }
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    loan: state.loan,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    loanActions: bindActionCreators(loanActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Loans);
