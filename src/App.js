import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import ProductsList from "./pages/ProductsList";
import Cart from "./pages/Cart";
import Adozioni from "./pages/adozioni/Adozioni";
import Checkout from "./pages/checkout/Checkout";

import BookWrapper from "./wrappers/BookWrapper";

import $ from "jquery";

import "./style.css";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cart: localStorage.getItem("cart")
        ? JSON.parse(localStorage.getItem("cart"))
        : {},
    };
    this.addToCart = this.addToCart.bind(this);
    this.removeFromCart = this.removeFromCart.bind(this);
    this.changeQuantity = this.changeQuantity.bind(this);
    this.clearCart = this.clearCart.bind(this);
  }

  componentDidMount() {
    $(".toast").bind("show.bs.toast", () => {
      $(".toast").css("z-index", 10000000000);
    });
    $(".toast").bind("hidden.bs.toast", () => {
      $(".toast").css("z-index", -10);
    });
  }

  // ACTION 1=BUY -1=SELL

  addToCart(product, action, quantity = 1) {
    // trigger toast
    $(".toast").toast({
      delay: 3000,
    });
    $(".toast").toast("show");

    // add product to cart
    const cart = this.state.cart;
    if (cart[product.ISBN] && cart[product.ISBN].action === action) {
      cart[product.ISBN].quantity += quantity;
    } else {
      cart[product.ISBN] = {};
      cart[product.ISBN].book = product;
      cart[product.ISBN].quantity = quantity;
      cart[product.ISBN].action = action;
    }
    this.setState({ cart });
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  removeFromCart(ISBNs) {
    this.setState(
      (prevState) => {
        ISBNs.map((isbn, index) => delete prevState.cart[isbn]);
        return { cart: prevState.cart };
      },
      () => localStorage.setItem("cart", JSON.stringify(this.state.cart))
    );
  }

  clearCart() {
    this.setState({ cart: {} });
    localStorage.clear();
  }

  changeQuantity(ISBN, quantity) {
    const cart = this.state.cart;
    if (cart[ISBN]) {
      cart[ISBN].quantity = quantity;
    }
    this.setState({ cart: cart });
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  render() {
    return (
      <>
        <Router basename="/librandovi/demo/">
          <Switch>
            <Route path="/checkout">
              <Checkout cart={this.state.cart} clearCart={this.clearCart} />
            </Route>
            <div className="h-100 d-flex flex-column">
              <nav className="navbar sticky-top flex-shrink-1 navbar-expand-lg navbar-light bg-white shadow-sm">
                <Link className="navbar-brand d-block d-lg-none" to="/">
                  LibrandoVI
                </Link>
                <button
                  className="ml-auto navbar-toggler"
                  type="button"
                  data-toggle="collapse"
                  data-target="#navbarNavAltMarkup"
                  aria-controls="navbarNavAltMarkup"
                  aria-expanded="false"
                  aria-label="Toggle navigation"
                >
                  <span className="navbar-toggler-icon" />
                </button>
                <div
                  className="collapse navbar-collapse pl-4"
                  id="navbarNavAltMarkup"
                >
                  <div className="nav navbar-nav">
                    <Link className="nav-item nav-link mr-3" to="/">
                      Home
                    </Link>
                    <Link className="nav-item nav-link" to="/adozioni">
                      School books
                    </Link>
                  </div>
                  <Link
                    className="navbar-brand navbar-center d-none d-lg-block"
                    to="/"
                  >
                    LibrandoVI
                  </Link>
                  <div className="dropdown-divider" />
                  <div className="nav navbar-nav navbar-right ml-auto">
                    <Link className="nav-item nav-link" to="/cart">
                      <span className="d-inline-block d-lg-none mr-1">
                        Cart
                      </span>
                      <li
                        className="fas fa-shopping-cart d-none d-lg-inline"
                        style={{ fontSize: 20, color: "#00000080" }}
                      />
                      {/* BADGE PER MOBILE */}
                      <span
                        className="badge bg-primary text-white rounded-circle align-top d-inline-block d-lg-none"
                        style={{ fontSize: ".75rem" }}
                      >
                        {Object.keys(this.state.cart).length}
                      </span>
                      {/* BADGE PER SCHERMO */}
                      <span
                        className="badge bg-primary text-white rounded-circle align-top d-none d-lg-inline-block"
                        style={{
                          marginTop: -4,
                          marginLeft: -8,
                          fontSize: ".75rem",
                        }}
                      >
                        {Object.keys(this.state.cart).length}
                      </span>
                    </Link>
                  </div>
                </div>
              </nav>

              <div
                className="toast"
                style={{
                  position: "absolute",
                  zIndex: -10,
                  top: 64,
                  right: 16,
                }}
              >
                <div className="toast-header d-flex align-items-center">
                  <i className="fas fa-check text-success" />
                  <strong className="mr-auto ml-3">Added!</strong>
                  <button
                    type="button"
                    className="ml-2 mb-1 close"
                    data-dismiss="toast"
                    aria-label="Close"
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div
                  className="toast-body"
                  style={{ backgroundColor: "#ffffff85" }}
                >
                  The book was added to your cart!
                </div>
              </div>
              <div className="h-100" id="main-content">
                <Route exact path="/cart">
                  <Cart
                    cart={this.state.cart}
                    removeFromCart={this.removeFromCart}
                    clearCart={this.clearCart}
                    changeQuantity={this.changeQuantity}
                  />
                </Route>
                <Route exact path="/">
                  <ProductsList
                    addToCart={this.addToCart}
                    filterISBN={this.filter}
                  />
                </Route>
                <Route path="/book/:isbn">
                  <BookWrapper addToCart={this.addToCart} />
                </Route>
                <Route path="/adozioni">
                  <Adozioni addToCart={this.addToCart} />
                </Route>
              </div>
            </div>
          </Switch>
        </Router>
      </>
    );
  }
}

export default App;
