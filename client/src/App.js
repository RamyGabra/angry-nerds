import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './App.css';
import Companies from './pages/Companies';
import signup from './pages/signUp'
import signin from './pages/signin'
import home from './pages/home'
import LawyerHome from './pages/LawyerHome'
import ChangePricing from './pages/ChangePricing'
import AdminViewLaws from './pages/AdminViewLaws'
import AddLawyer from './components/AddLawyer';
import AddReviewer from './components/AddReviewer';
import testing from './components/testing';




class App extends Component {

  
  render() {
    
    return (
      <Router>
        <div className="App">
          <div className="container">
          <Route exact path = '/ViewMyCompanies' component =  {Companies}/>
          <Route  exact path = "/home" component = {home}  />
            <Route exact path="/signUp" component={signup} />
            <Route exact path="/signin" component= {signin} />
          </div>  
        </div>
        <div>
          <Route exact path="/lawyer" component={AddLawyer} />
          <Route exact path="/reviewer" component={AddReviewer} /> 
          <Route  exact path="/testing" component={testing} /> 



        </div>

        <Route exact path = "/LawyerHome" component={LawyerHome} />
        <Route exact path = "/ChangePricing" component={ChangePricing} />
        <Route exact path = "/AdminViewLaws" component={AdminViewLaws} />
      </Router>
    );
  }
  
}

export default App;
