import React, { Component } from "react";

import { withFirebase } from "../Firebase";

class AdminPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      users: {},
    };
  }

  componentDidMount() {
    this.setState({ loading: true });

    // The on() method registers a continuous listener
    // that triggers every time something has changed, the once() method registers a listener that would
    // be called only once. In this scenario, we are interested to keep the latest list of users.
    this.props.firebase.users().on("value", (snapshot) => {
      this.setState({
        users: snapshot.val(),
        loading: false,
      });
    });
  }

  render() {
    return (
      <div>
        <h1>Admin</h1>
      </div>
    );
  }
}

export default withFirebase(AdminPage);
