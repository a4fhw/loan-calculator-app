import * as React from 'react';
import Dashboard from './components/Dashboard';
import SiteHeader from './components/SiteHeader';
import SiteFooter from './components/SiteFooter';

class App extends React.Component {
  
  render() {

    return (
      <React.Fragment>
        <SiteHeader />
        <Dashboard />
        <SiteFooter />
      </React.Fragment>
    )
  }
}

export default App;
