import React from 'react';
import debounce from 'lodash/debounce';

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

export default function withDimensions(WrappedComponent) {
  class WithDimensions extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        width: 0,
        height: 0,
      };
      this.receiveRef = this.receiveRef.bind(this);
      this.handleResize = debounce(this.handleResize.bind(this), 200);
    }
    receiveRef(node) {
      this._ref = node;
      if (this._ref) {
        this.handleResize();
      }
    }
    componentDidMount() {
      window.addEventListener('resize', this.handleResize);
    }
    componentWillUnmount() {
      window.removeEventListener('resize', this.handleResize);
    }
    handleResize() {
      this.setState({
        width: this._ref.clientWidth,
        height: this._ref.clientHeight,
      });
    }
    render() {
      return (
        <div style={{ width: '100%', height: '100%' }} ref={this.receiveRef}>
          <WrappedComponent {...this.props} width={this.state.width} height={this.state.height} />
        </div>
      )
    }
  }
  WithDimensions.displayName = `WithDimensions(${getDisplayName(WrappedComponent)})`;
  WithDimensions.WrappedComponent = WrappedComponent;
  return WithDimensions;
}
