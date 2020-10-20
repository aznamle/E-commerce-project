import React from 'react';
import { Switch, Route, Link } from 'react-router-dom'

import './App.css';

import HomePage from './pages/homepage/homepage.component'
import ShopPage from './pages/shop/shop.component'
import SignInAndSignOutPage from './pages/sign-in-and-sign-up/sign-in-and-sign-up.component'
import Header from './components/header/header.component'
import { auth, createUserProfileDocument } from './firebase/firebase.utils';



class App extends React.Component {
  constructor() {
    super();

    this.state = {
      currentUser: null
    };
  }


  // firebase google auth open subscription, persisent user
  // how we handle our application being aware of any auth changes on firebase
  unsubscribeFromAuth = null

  componentDidMount() {
    this.unsubscribeFromAuth = auth.onAuthStateChanged(async userAuth => {
      //checks if there is a user auth
      if(userAuth) {
        //if there is, get back a userRef
        const userRef = await createUserProfileDocument(userAuth);

        //set snapShot to local state: curretUser 
        userRef.onSnapshot(snapShot => {
          this.setState({
            currentUser: {
              id: snapShot.id,
              ...snapShot.data()
            }
          })
        });
      } else {
        this.setState({currentUser: userAuth});
      }
    });
  }

  componentWillUnmount() {
    this.unsubscribeFromAuth();
  }

  render() {
    return (
        <div>
          <Header currentUser={this.state.currentUser} />
          <Switch>
            <Route exact path='/' component={HomePage} />
            <Route path='/shop' component={ShopPage} />
            <Route path='/signin' component={SignInAndSignOutPage} />
          </Switch>
        </div>
    );
  }
}

export default App;
