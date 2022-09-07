import React from "react";

export default class QuantitySelector extends React.Component {
  constructor(props) {
    super(props);
    this.state = { quantity: this.props.quantity };

    this.setQuantity = this.setQuantity.bind(this);
    this.handleQuantityChange = this.handleQuantityChange.bind(this);
    this.checkChangeQuantity = this.checkChangeQuantity.bind(this);

    if (this.props.quantity > this.props.max) {
      this.setQuantity(this.props.max);
    }
  }

  static getDerivedStateFromProps(props, state) {
    if (props.quantity !== state.quantity) {
      return { quantity: props.quantity };
    }
    return null;
  }

  checkChangeQuantity(n) {
    if (n < 0 && this.state.quantity === 1) {
      return false;
    }
    if (n > 0 && this.state.quantity === this.props.max) {
      return false;
    }
    return true;
  }

  handleQuantityChange(n) {
    if (this.checkChangeQuantity(n)) {
      this.setQuantity(this.state.quantity + n);
    }
  }

  setQuantity(quantity) {
    if (quantity > 0 && quantity <= this.props.max) {
      this.setState({ quantity: quantity });
      this.props.onChange(quantity);
    }
  }

  render() {
    return (
      <>
        <div
          className={"input-group d-flex " + this.props.className}
          style={this.props.style}
        >
          <div
            className="input-group-prepend pointer counter-btn"
            onClick={() => this.handleQuantityChange(-1)}
          >
            <span
              className={
                "input-group-text" +
                (this.checkChangeQuantity(-1) ? " counter-bg" : " disabled")
              }
            >
              <i className="fas fa-minus fa-xs text-white" />
            </span>
          </div>
          <input
            type="number"
            value={this.state.quantity}
            className="form-control text-center"
            style={
              this.props.fixed
                ? { width: "64px", fontSize: "18px", flex: "none" }
                : { width: "64px", fontSize: "18px" }
            }
            onChange={(e) => this.setQuantity(parseInt(e.target.value))}
          />
          <div
            className="input-group-append pointer counter-btn"
            onClick={() => this.handleQuantityChange(1)}
          >
            <span
              className={
                "input-group-text" +
                (this.checkChangeQuantity(1) ? " counter-bg" : " disabled")
              }
            >
              <i className="fas fa-plus fa-xs text-white" />
            </span>
          </div>
        </div>
      </>
    );
  }
}
