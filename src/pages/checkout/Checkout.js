import React from "react";
import { getTotalPrice, priceFormat } from "../../utils";

import * as bootstrap from "bootstrap";

import { Redirect, Switch, Route } from "react-router-dom";
import CheckoutSuccess from "./CheckoutSuccess";

import { API_URL } from "../../constants";

import $ from "jquery";

export default class Checkout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nome: "",
      cognome: "",
      email: "",
      codice: "",
      tassa: 3,
      order_id: null,
    };

    this.sendOrder = this.sendOrder.bind(this);
    this.validateForm = this.validateForm.bind(this);
  }

  changeTassa(index) {
    let t = 0;
    switch (index) {
      case 0: // VENIAMO A CASA TUA
        t = 3;
        break;
      case 1: // IN CENTRO
        t = 0;
        break;
    }
    this.setState({ tassa: t });
  }

  componentDidMount() {
    const tooltipTriggerList = [].slice.call(
      document.querySelectorAll('[data-toggle="tooltip"]')
    );
    tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl);
    });
  }

  sendOrder() {
    const orderInfo = this.state;
    delete orderInfo.order_id;
    const prezzoLibri = getTotalPrice(this.props.cart);
    orderInfo.prezzoLibri = prezzoLibri;
    orderInfo.prezzoTotale = prezzoLibri + this.state.tassa;
    orderInfo.libri = {};
    Object.keys(this.props.cart).forEach((key) => {
      orderInfo.libri[key] = {
        action: this.props.cart[key].action,
        quantity: this.props.cart[key].quantity,
      };
    });
    console.log(orderInfo);
    fetch(`${API_URL}/order`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderInfo),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          this.setState({ order_id: data.id });
        }
        console.log(data);
      });
  }

  validateForm() {
    $(".has-validation").addClass(" was-validated");
    if (
      this.state.nome === "" ||
      this.state.cognome === "" ||
      this.state.email === "" ||
      this.state.tassa === null
    )
      return false;
    if (!this.state.email.includes("@") || !this.state.email.includes("."))
      return false;
    return true;
  }

  render() {
    const cartPrice = getTotalPrice(this.props.cart);
    return (
      <Switch>
        <Route exact path="/checkout">
          <>
            {this.state.order_id ? <Redirect to="/checkout/success" /> : <></>}
            {!this.props.cart ||
            Object.keys(this.props.cart).length === 0 ||
            this.props.cart === undefined ||
            this.props.cart === null ? (
              <>
                <Redirect to="/" />
              </>
            ) : (
              <></>
            )}
            <div className="row h-100">
              <div className="col-lg-6 bg-white d-flex justify-content-center align-items-center py-lg-0 py-4 shadow">
                <form
                  className="col-lg-8 col-12 mt-lg-0 mt-2"
                  id="checkout-form"
                  noValidate
                >
                  <div className="form-row">
                    <div className="form-group has-validation col-lg-6 col-6">
                      <label for="nome">Name*</label>
                      <input
                        type="text"
                        style={{ textTransform: "capitalize" }}
                        className="form-control invalid"
                        id="nome"
                        value={this.state.nome}
                        onChange={(e) =>
                          this.setState({ nome: e.target.value })
                        }
                        required
                      />
                      <div className="invalid-feedback">Write your name</div>
                    </div>
                    <div className="form-group has-validation col-lg-6 col-6">
                      <label for="cognome">Surname*</label>
                      <input
                        type="text"
                        style={{ textTransform: "capitalize" }}
                        className="form-control"
                        id="cognome"
                        value={this.state.cognome}
                        onChange={(e) =>
                          this.setState({ cognome: e.target.value })
                        }
                        required
                      />
                      <div className="invalid-feedback">Write your surname</div>
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group has-validation col-lg-8 col-12">
                      <label for="email">Email*</label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        value={this.state.email}
                        onChange={(e) =>
                          this.setState({ email: e.target.value })
                        }
                        required
                      />
                      <div className="invalid-feedback">Write your email</div>
                    </div>
                    <div className="form-group col-lg-4 col-12">
                      <label for="codice">Referral code</label>
                      <li
                        className="fas fa-question-circle text-muted ml-2"
                        data-toggle="tooltip"
                        data-placement="top"
                        data-html="false"
                        title="If anyone invited you, use their referral code to get a discount."
                      />
                      <input
                        type="text"
                        style={{ textTransform: "uppercase" }}
                        className="form-control"
                        id="codice"
                        value={this.state.codice}
                        onChange={(e) =>
                          this.setState({ codice: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label for="tassa">Shipping fee*</label>
                    <li
                      className="fas fa-question-circle text-muted ml-2"
                      data-toggle="tooltip"
                      data-placement="top"
                      data-html="true"
                      title="
                                        <div className='text-left'>
                                            Choose the shipping fee that best suits you.
                                            <ul>
                                                <li className='mt-2'>
                                                    We come to your house to ship/collect the books. (<b>3€</b>)
                                                </li>
                                                <li className='mt-2'>
                                                    We meet in the city center. (<b>Free</b>)
                                                </li>
                                            </ul>
                                        </div>
                                    "
                    />
                    <select
                      id="tassa"
                      className="form-control form-select"
                      onChange={(e) =>
                        this.changeTassa($(e.target).prop("selectedIndex"))
                      }
                    >
                      <option selected>We come to you house - 3€</option>
                      <option>In the center - Free</option>
                    </select>
                  </div>
                  <small className="d-block text-muted">* compulsory</small>
                  <div className="col-12 mt-4 d-flex justify-content-center ">
                    <button
                      className="btn btn-primary col-lg-4 col-12 "
                      onClick={(e) => {
                        e.preventDefault();
                        if (this.validateForm()) {
                          this.sendOrder();
                        }
                      }}
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>
              <div className="col-lg-6 bg-light d-flex justify-content-center align-items-center row py-lg-0 py-4">
                <div className="card rounded-lg shadow border-0 col-lg-6 col-12">
                  <div className="card-body px-4 py-3">
                    <p className="card-title h3">Recap</p>
                    {/* <h6 className="card-subtitle mb-2 text-muted">Card subtitle</h6> */}
                    <div
                      className="card-text d-flex mt-4"
                      style={{ fontSize: "1.2rem" }}
                    >
                      <span className="" style={{ fontWeight: "500" }}>
                        Books total:{" "}
                      </span>
                      <span className="ml-auto">{priceFormat(cartPrice)}</span>
                    </div>
                    <div
                      className="card-text d-flex mt-2"
                      style={{ fontSize: "1.2rem" }}
                    >
                      <span className="" style={{ fontWeight: "500" }}>
                        Fee:{" "}
                      </span>
                      <span className="ml-auto">
                        {priceFormat(this.state.tassa)}
                      </span>
                    </div>
                    <hr className="mt-4 mb-3" />
                    <div
                      className="card-text d-flex"
                      style={{ fontSize: "1.5rem" }}
                    >
                      <span className="font-weight-bold">Total: </span>

                      <span className="ml-auto">
                        {priceFormat(cartPrice + this.state.tassa)}
                      </span>
                    </div>
                    <small className="text-muted">
                      Remember: if the total is negative, we are going to pay
                      you!
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </>
        </Route>
        <Route path="/checkout/success">
          <CheckoutSuccess
            id={this.state.order_id}
            clearCart={this.props.clearCart}
          />
        </Route>
      </Switch>
    );
  }
}
