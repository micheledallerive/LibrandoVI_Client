import React from "react";
import { BUY_MULTIPLIER, SELL_MULTIPLIER, API_URL } from "../constants";
import defaultBook from "../img/default_book.png";
import { getFinalPrice, priceFormat } from "../utils";
import BookLoader from "../components/BookLoader";
import QuantitySelector from "../components/QuantitySelector";

export default class Book extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data: {},
      quantity: 1,
    };
  }

  componentDidMount() {
    fetch(`${API_URL}/book/` + this.props.ISBN)
      .then((res) => res.json())
      .then((data) => {
        this.setState({ data: data, loading: false });
      });
  }

  render() {
    return (
      <>
        <div className="row h-100 align-items-center">
          {!this.state.loading ? (
            Object.keys(this.state.data).length !== 0 ? (
              <>
                <div className="col-lg-4 col-12 h-75 justify-content-center align-items-center d-flex">
                  <img
                    className={
                      "rounded card-img h-100 d-shadow " +
                      (this.state.data.quantity === 0 ? "bw" : "")
                    }
                    src={
                      this.state.loading || this.state.data.URL === null
                        ? defaultBook
                        : this.state.data.URL
                    }
                    style={{ objectFit: "contain" }}
                  />
                </div>
                <div className="col-lg-8 col-12 d-flex justify-content-start align-items-lg-center align-items-start h-100 px-4">
                  <div
                    className="h-75 mt-4 mt-lg-0 w-100 d-flex flex-column"
                    style={{ fontSize: 18 }}
                  >
                    <div className="titolo">
                      <div className="title">
                        <p className="h2">{this.state.data.nome}</p>
                      </div>
                      <div className="subtitle">
                        <p className="h5 text-muted font-weight-normal font-italic">
                          {this.state.data.sottotitolo}
                        </p>
                      </div>
                    </div>
                    <div
                      className="info flex-grow-1 d-flex flex-column justify-content-center align-items-start"
                      style={{ fontSize: 20 }}
                    >
                      <div className="ISBN">
                        <span className=" font-weight-bold">ISBN: </span>
                        <span className="">{this.state.data.ISBN}</span>
                      </div>
                      <div className="autori mt-2">
                        <span className=" font-weight-bold">Authors: </span>
                        <span className="">
                          {this.state.data.autori.map((author, index) => (
                            <p key={index}>
                              {author +
                              (index === this.state.data.autori.length - 1)
                                ? ""
                                : ", "}
                            </p>
                          ))}
                        </span>
                      </div>
                      <div className="editore mt-2">
                        <span className=" font-weight-bold">Publisher: </span>
                        <span className="">{this.state.data.editore}</span>
                      </div>
                      <div className="volume mt-2">
                        <span className=" font-weight-bold">Volume: </span>
                        <span className="">{this.state.data.volume}</span>
                      </div>
                      <div className="materia mt-2">
                        <span className=" font-weight-bold">Subject: </span>
                        <span className="">{this.state.data.materia}</span>
                      </div>
                      <div className="prezzo mt-2">
                        <span className=" font-weight-bold">Price: </span>
                        <span className="">{this.state.data.prezzo} €</span>
                      </div>
                      <div className="disponibilita mt-2">
                        <span className=" font-weight-bold">
                          Availability:{" "}
                        </span>
                        <span
                          className={
                            "font-weight-bold " +
                            (this.state.data.quantity !== 0
                              ? "text-success"
                              : "text-danger")
                          }
                        >
                          {this.state.data.quantity === 0
                            ? "Non disponibile per l'acquisto"
                            : "Disponibile"}
                        </span>
                      </div>
                    </div>

                    <div className="w-100 mt-4 mt-lg-0 px-4 py-4 d-flex justify-content-around row align-items-center">
                      {this.state.data.quantity === 0 ? (
                        <></>
                      ) : (
                        <>
                          <div className="col-lg-4 col-12">
                            <div className="row d-flex align-items-center">
                              <div className="col-lg-4 d-none d-lg-flex justify-content-center align-items-center h-100">
                                <p
                                  className="font-weight-bold"
                                  style={{ margin: "0" }}
                                >
                                  Quantity:{" "}
                                </p>
                              </div>
                              <div className="col-lg-8 col-12 d-flex justify-content-center align-items-center">
                                <div className="d-block">
                                  <QuantitySelector
                                    max={this.state.data.quantity}
                                    quantity={this.state.quantity}
                                    onChange={(quantity) =>
                                      this.setState({ quantity: quantity })
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          <button
                            className="btn btn-primary col-lg-3 col-12 mt-4 mt-lg-0"
                            style={{ fontSize: 20 }}
                            onClick={() =>
                              this.props.addToCart(
                                this.state.data,
                                1,
                                this.state.quantity
                              )
                            }
                          >
                            Buy&nbsp;-&nbsp;
                            {priceFormat(
                              getFinalPrice(this.state.data, BUY_MULTIPLIER)
                            )}
                          </button>
                        </>
                      )}
                      <button
                        className="btn btn-outline-primary col-lg-3 col-12 mt-4 mt-lg-0"
                        style={{ fontSize: 20 }}
                        onClick={() =>
                          this.props.addToCart(
                            this.state.data,
                            -1,
                            this.state.quantity
                          )
                        }
                      >
                        Sell&nbsp;-&nbsp;
                        {priceFormat(
                          getFinalPrice(this.state.data, SELL_MULTIPLIER)
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="h-100 w-100 d-flex justify-content-center align-items-center">
                  <p className="display-3">Book not found</p>
                </div>
              </>
            )
          ) : (
            <>
              <BookLoader />
            </>
          )}
        </div>
      </>
    );
  }
}
