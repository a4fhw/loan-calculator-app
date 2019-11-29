import * as React from 'react';
import Calculator from './Calculator';
import Loans from './Loans';

export class Dashboard extends React.PureComponent {

  render() {
    return (
      <main>
        <div className="page-header">
          <div className="container">
            <div className="col-xs-12">
              <h1>Loan dashboard</h1>
            </div>
          </div>
        </div>
        <div className="container">
          <Calculator />
          <Loans />
        </div>
      </main>
    );
  }
}

export default Dashboard;
