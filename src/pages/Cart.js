import React from "react";
import ListItem from "../components/ListItem";
import { priceFormat, getTotalPrice } from "../utils";
import CustomLink from "../components/CustomLink";

import $ from "jquery";

import { API_URL } from "../constants";

export default class Cart extends React.Component {
  constructor(props) {
    super(props);
    this.state = { loading: false };
    this.checkBooks = this.checkBooks.bind(this);
  }

  componentDidMount() {
    const toRemove = [];
    this.checkBooks(([isbn, availableQuantity]) => {
      if (availableQuantity === 0) toRemove.push(isbn);
    }).catch((err) => {
      console.error(err);
      this.props.removeFromCart(toRemove);
    });
  }

  checkBooks(callBack) {
    this.setState({ loading: true });
    return new Promise((resolve, reject) => {
      const promises = [];
      const isbns = Object.keys(this.props.cart);
      isbns.map((ISBN, index) => {
        promises.push(
          new Promise((resolve, reject) => {
            fetch(
              `${API_URL}/magazzino/quantity/` +
                this.props.cart[ISBN].action.toString().replace("1", "") +
                ISBN
            )
              .then((res) => res.json())
              .then((data) => resolve(data.max));
          })
        );
        return ISBN;
      });
      let error = null;
      Promise.all(promises).then((quantities) => {
        isbns.map((isbn, index) => {
          if (this.props.cart[isbn].quantity > quantities[index]) {
            if (error) {
              error =
                "Some products in the cart are not available anymore. Please refresh the page and check your cart.";
            } else if (quantities[index] === 0) {
              error =
                'The book "' +
                isbn +
                '" is not available anymore. The page will automatically refresh.';
            } else {
              error =
                "There are " +
                quantities[index] +
                ' available units of the book "' +
                isbn +
                '".\nThe page will automatically refresh.';
            }
            callBack([isbn, quantities[index]]);
          }
          return isbn;
        });
        this.setState({ loading: false });
        if (error) reject(error);
        else resolve(error);
      });
    });
  }

  render() {
    return (
      <>
        {Object.keys(this.props.cart).length === 0 ? (
          <>
            <div className="d-flex justify-content-center align-items-center h-100">
              <p className="display-4 text-center" style={{ fontSize: "5vw" }}>
                Your cart is empty.
              </p>
            </div>
          </>
        ) : (
          <>
            <div
              className={
                "d-flex flex-column h-100 overflow-visible" +
                (this.state.loading ? " loading-cursor" : "")
              }
            >
              <div
                className="list-group list-group-flush flex-grow-1 "
                style={{ overflow: "auto" }}
              >
                {Object.keys(this.props.cart).map((key, index) => (
                  <ListItem
                    item={this.props.cart[key]}
                    removeFromCart={this.props.removeFromCart}
                    changeQuantity={this.props.changeQuantity}
                    key={index}
                  />
                ))}
              </div>
              <div
                className="d-flex flex-column shadow-reversed bg-white"
                style={{ zIndex: 1000, overflow: "visible" }}
              >
                <div className="w-100 text-center">
                  <i
                    className="fas fa-chevron-down text-muted mt-1 pointer"
                    id="toggle_bottom_bar"
                    style={{ fontSize: 24, transition: "all .2s ease" }}
                    data-toggle="collapse"
                    data-target="#bottom_cart_bar"
                    onClick={() => {
                      $("#toggle_bottom_bar").toggleClass("rotated");
                    }}
                  />
                </div>
                <div id="bottom_cart_bar" className="collapse show">
                  <div
                    className="p-4  row"
                    style={{ zIndex: 100, position: "relative" }}
                  >
                    <div className="justify-content-lg-start justify-content-center col-lg-4 col-12 d-flex align-items-center">
                      <button
                        className="btn btn-outline-primary px-2 py-1"
                        onClick={() => {
                          if (
                            window.confirm(
                              "Are you sure you want to empty your cart?"
                            )
                          ) {
                            this.props.clearCart();
                          }
                        }}
                      >
                        Empty your cart.
                      </button>
                    </div>
                    <div className="d-flex col-lg-8 justify-content-end pt-lg-0 pt-2">
                      <div className="d-flex row align-items-center justify-content-center">
                        <div className="d-flex align-items-center justify-content-center">
                          <span className="text-secondary h4 mr-4 mb-0">
                            Total:{" "}
                          </span>
                          <span className="h3 mb-0 mr-lg-4 mr-0">
                            {priceFormat(getTotalPrice(this.props.cart))}
                          </span>
                        </div>
                        <CustomLink
                          onClick={
                            this.state.loading
                              ? () => {}
                              : (e) => this.checkBooks(() => {})
                          }
                          tag="button"
                          to="/checkout"
                          className={
                            "btn btn-primary ml-lg-4 ml-0 mt-3 mt-lg-0 px-2 py-1" +
                            (this.state.loading ? " disabled" : "")
                          }
                        >
                          <i
                            className="fas fa-arrow-circle-right mr-3"
                            style={{ fontSize: 20 }}
                          />
                          <span style={{ fontSize: 22 }}>Next</span>
                        </CustomLink>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </>
    );
  }
}
