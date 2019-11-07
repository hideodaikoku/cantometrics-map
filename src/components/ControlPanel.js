import React, { PureComponent } from 'react';
import '../css/control-panel.css'
import feature_names from "./feature-names";

const defaultContainer = ({ children }) => <div className="control-panel">{children}</div>;


export default class ControlPanel extends PureComponent {

  
  render() {
    const { onChangeVal } = this.props;

    const _onChangeVal = evt => {
      const selected = evt.target.value;
      onChangeVal(selected);
    };

    const Container = this.props.containerComponent || defaultContainer;
    return (
      <Container>
        <div className="title">
          <h3 className="heading">Cantometrics</h3>
        </div>
        <select onChange={_onChangeVal}>
          {
            feature_names.map((feature, i) => 
              <option key={i} value={ feature.property } >
                {feature.name}
              </option>
            )
          }
        </select>
      </Container>
    );
  }
}