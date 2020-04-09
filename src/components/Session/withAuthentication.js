import React from "react";

import AuthUserContext from "./context";
import { withFirebase } from "../Firebase";

const withAuthentication = (Component) => {
  class WithAuthentication extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        authUser: null,
      };
    }

    componentDidMount() {
      // The helper function onAuthStateChanged() receives a function as parameter that has access to
      // the authenticated user. Also, the passed function is called every time something changes for the
      // authenticated user. It is called when a user signs up, signs in, and signs out. If a user signs out,
      // the authUser object becomes null, so the authUser property in the local state is set to null and all
      // components depending on it adjust their behavior (e.g. display different options like the Navigation
      // component).
      this.listener = this.props.firebase.auth.onAuthStateChanged(
        (authUser) => {
          if (authUser) {
            this.props.firebase
              .user(authUser.uid)
              .once("value")
              .then((snapshot) => {
                const dbUser = snapshot.val();

                // default empty roles
                if (!dbUser.roles) {
                  dbUser.roles = {};
                }

                // merge auth and db user
                authUser = {
                  uid: authUser.uid,
                  email: authUser.email,
                  ...dbUser,
                };

                this.setState({ authUser });
              });
          } else {
            this.setState({ authUser: null });
          }
        }
      );
    }

    componentWillUnmount() {
      // Remove the listener if the component unmounts
      this.listener();
    }

    render() {
      return (
        <AuthUserContext.Provider value={this.state.authUser}>
          <Component {...this.props} />
        </AuthUserContext.Provider>
      );
    }
  }

  return withFirebase(WithAuthentication);
};

export default withAuthentication;
