import React, { Component } from 'react';

class Clock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentDateTime: this.getFormattedDateTime(),
    };
  }

  getFormattedDateTime() {
    const currentDate = new Date();
    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    };
    return currentDate.toLocaleString(undefined, options);
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      this.setState({
        currentDateTime: this.getFormattedDateTime(),
      });
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return (
      <div>
        <p>{this.state.currentDateTime}</p>
      </div>
    );
  }
}

export default Clock;