import React from "react";

import { Link } from "react-router-dom";
import $ from "jquery";

export default class CheckoutSuccess extends React.Component {
  constructor(props) {
    super(props);
    localStorage.clear();
    if (this.props.clearCart) this.props.clearCart();
    $(window).bind("beforeunload", function (event) {
      return "Careful! The information could be lost!";
    });
  }

  render() {
    return (
      <>
        {/*
                (!this.props.id)
                ?<><Redirect to="/"/></>
                :<> */}
        <div className="d-flex justify-content-center align-items-center h-100 w-100 bg-success p-3">
          <div
            className="card shadow bg-white col-lg-6 col-12 p-4"
            style={{ borderRadius: "1rem", maxHeight: "90%", overflow: "auto" }}
          >
            <div className=" d-flex justify-content-center text-center flex-column">
              <i
                className="fas fa-check-circle card-img fa-6x text-success"
                style={{ height: 96 }}
              />
              <p className="card-title h4 font-weight-bold mt-4">Success!</p>
              <p className="card-text h5">
                Purchase number:{" "}
                <span className="font-weight-bold">
                  {this.props.id || "ID"}
                </span>
              </p>
              <p className="card-text mt-3" style={{ fontSize: "1.2rem" }}>
                Contact us on instagram (
                <span className="font-weight-bold">@librandovi</span>) o send us
                an email (
                <span className="font-weight-bold">
                  librandovi.staff@gmail.com
                </span>
                ) scrivendoci il tuo numero d'ordine per accordarci per lo
                scambio. <br />
                <span className="font-weight-bold">Attenzione: </span>se non ci
                contatterai entro 48 ore l'ordine verrà automaticamente
                cancellato.
              </p>
              <p
                className="card-text font-weight-light"
                style={{ fontSize: "1.1rem" }}
              >
                We sent you a recap email.
              </p>
              <Link to="/">
                <button
                  className="btn btn-primary mt-2"
                  style={{ fontSize: "1.2rem" }}
                >
                  Go back to the home page
                </button>
              </Link>
            </div>
          </div>
        </div>
        {/* </> */}
      </>
    );
  }
}
