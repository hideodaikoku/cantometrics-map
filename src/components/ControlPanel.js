import React, { PureComponent } from 'react';
import '../css/control-panel.css'

const defaultContainer = ({ children }) => <div className="control-panel">{children}</div>;


export default class ControlPanel extends PureComponent {
  render() {
    const Container = this.props.containerComponent || defaultContainer;
    return (
      <Container>
        <div className="title">
          <h3 className="heading">Cantometrics</h3>
        </div>
      </Container>
    );
  }
}