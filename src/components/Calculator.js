import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { FormControl, FormGroup, InputGroup, Button, Modal } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import * as loanActions from '../actions/loanActions';

export class Calculator extends React.Component {
  state = {
    loanAmountValid: null,
    loanDateValid: null,
    loanNotNumeric: false,
    loanAmountExceeded: false,
    totalAmount: 0,
    loanDate: null,
    loanDayCount: null,
    loanAmount: '',
    highRisk: true,
    recentLoanCount: 0,
    displayMessage: false,
    messageTitle: '',
    messageText: ''
  };

  componentDidMount() {
    const { riskEvalEnabled, quickRiskTimer, highRiskTimer } = process.env;

    if (riskEvalEnabled) {
      setTimeout(this.endRiskTime(), quickRiskTimer);
      setInterval(this.resetLoanCount(), highRiskTimer);
    }
  }

  endRiskTime = () => {
    this.setState({ highRisk: true });
  }

  resetLoanCount = () => {
    this.setState({ recentLoanCount: 0 });
  }

  calculateTotalAmount = (loanAmount, loanDays) => {
    const { interestRate } = process.env;

    if (!(loanAmount !== null || loanDays !== null)) return 0;

    let amount = Number(loanAmount);
    const dailyIncrease = (amount * ((interestRate) / 100));

    for (let i = 0; i < loanDays; i += 1) {
      amount += dailyIncrease;
    }

    return amount;
  }

  handleDateChange = (date) => {
    const { loanAmount } = this.state;
    const loanDayCount = date.diff(moment(), 'days') + 1;

    this.setState({
      loanDateValid: 'success',
      loanDate: date,
      loanDayCount: loanDayCount,
      totalAmount: this.calculateTotalAmount(loanAmount, loanDayCount)
    });
  }

  handleAmountChange = (val) => {
    const { loanDayCount } = this.state;
    const { maxLoanAmount } = process.env;
    const loanAmountExceeded = val.target.value > maxLoanAmount;
    const loanNotNumeric = !val.target.value.match(/^[0-9]+$/);

    this.setState({
      loanAmountExceeded,
      loanNotNumeric,
      loanAmountValid: loanAmountExceeded || loanNotNumeric ? 'error' : 'success',
      loanAmount: val.target.value,
      totalAmount: this.calculateTotalAmount(val.target.value, loanDayCount)
    });
  }

  clearInputFields = () => {
    this.setState({
      loanAmountValid: null,
      loanDateValid: null,
      loanDayCount: null,
      loanAmount: '',
      loanDate: null
    });
  }

  renderAmountErrorMessage() { // double-check
    const { loanAmountExceeded, loanNotNumeric } = this.state;
    const { label } = process.env;

    return (
      <div>
        {loanAmountExceeded && <span className="label label-danger">
          {label.calculator.loanAmountLimitError}
        </span>}
        {loanNotNumeric && <span className="label label-danger">
          {label.calculator.loanAmountNanError}
        </span>}
      </div>
    );
  }

  renderMessage() {
    const { messageTitle, messageText } = this.state;

    return (
      <Modal show={true} onHide={() => { this.setState({ displayMessage: false }); }}>
        <Modal.Header closeButton>
          <Modal.Title>{messageTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{messageText}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => { this.setState({ displayMessage: false }); }}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }

  submitLoan = () => {
    const {
      loanDate,
      loanDayCount,
      loanAmount,
      recentLoanCount,
      highRisk
    } = this.state;

    const {
      riskEvalEnabled,
      label,
      interestRate,
      maxLoanAmount
    } = process.env;

    if (riskEvalEnabled && (recentLoanCount === 3 || (highRisk && parseFloat(loanAmount) === maxLoanAmount))) {
      this.setState({
        displayMessage: true,
        messageTitle: label.common.refuseLoanTitle,
        messageText: label.common.refuseLoanText
      });
      return;
    }

    this.props.loanActions.addLoan({
      id: Math.random(),
      loanDate: loanDate.valueOf(),
      loanDayCount,
      loanAmount: parseFloat(loanAmount),
      totalAmount: this.calculateTotalAmount(loanAmount, loanDayCount),
      interestRate: interestRate,
      extended: false,
      history: []
    });

    this.clearInputFields();

    this.setState({
      recentLoanCount: recentLoanCount + 1,
      displayMessage: true,
      messageTitle: label.common.successLoanTitle,
      messageText: label.common.successLoanText,
      totalAmount: 0
    });
  }

  render() {
    const {
      totalAmount,
      loanAmount,
      loanAmountValid,
      loanDayCount,
      loanDate,
      loanDateValid,
      displayMessage
    } = this.state;
    const { label, format } = process.env;

    return (
      <div className="col-sm-5 module-container">
        <div className="dashboard-module">
        <h2>{label.calculator.calcTitle}</h2>
          {loanAmountValid === 'error' && this.renderAmountErrorMessage()}
            <FormGroup
              controlId="ammountValidtation"
              validationState={loanAmountValid}
            >
              <InputGroup>
                <FormControl
                  value={loanAmount}
                  placeholder={label.calculator.loanAmount}
                  type="text"
                  bsClass="form-control"
                  onChange={this.handleAmountChange}
                />
                <FormControl.Feedback />
              </InputGroup>
            </FormGroup>
            <FormGroup
              controlId="dateValidation"
              validationState={loanDateValid}
            >
              <DatePicker
                className="form-control"
                dateFormat={format.date}
                readOnly={true}
                minDate={moment()}
                maxDate={moment().add(30, 'days')}
                locale="en-gb"
                onChange={this.handleDateChange}
                selected={loanDate}
                placeholderText={label.calculator.datepicker}
              />
              <FormControl.Feedback />
            </FormGroup>
            <span className="lead">
              Repay: {loanAmountValid === 'error' ? '0.00 €' : totalAmount.toFixed(2) + ' €'}
            </span>
            <br />
            <span className="lead">Term: {loanDateValid === null ? '0' : loanDayCount} days</span>
            <hr />
            <FormGroup>
              <Button
                onClick={this.submitLoan}
                disabled={!(loanAmountValid === 'success' && loanDateValid === 'success')}
                bsStyle="primary"
              >
                {label.calculator.submit}
              </Button>
              &nbsp;
              <Button
                onClick={this.clearInputFields}
                bsStyle="default"
              >
                {label.calculator.clear}
              </Button>
            </FormGroup>
        </div>
        {displayMessage && this.renderMessage()}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    loan: state.loan
  };
}

function mapDispatchToProps(dispatch) {
  return {
    loanActions: bindActionCreators(loanActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Calculator);
