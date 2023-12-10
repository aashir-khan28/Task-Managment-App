import React, { Component } from "react";
import Tasks from "./Tasks";

class App extends Component {
  render() {
    return (
      <>
        <div className="app">
          <h1 className="text-center">Task Management App</h1>
        </div>
        <div className="container">
          <Tasks />
        </div>
      </>
    );
  }
}

export default App;
