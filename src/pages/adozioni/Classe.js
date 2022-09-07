import React from "react";

import BookLoader from "../../components/BookLoader";
import ProductItem from "../../components/ProductItem";

import { API_URL } from "../../constants";

export default class Classe extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      books: [],
    };
    this.addAll = this.addAll.bind(this);
  }

  componentDidMount() {
    fetch(
      `${API_URL}/adozioni/libri?codice=${this.props.codice}&classe=${this.props.classe}`
    )
      .then((res) => res.json())
      .then((data) =>
        fetch(`${API_URL}/school?codice=${this.props.codice}`)
          .then((res) => res.json())
          .then((scuola) => {
            this.setState({
              loading: false,
              books: data,
              scuola,
            });
          })
      );
  }

  addAll() {
    this.state.books.forEach((book) => {
      if (book.quantity > 0) {
        this.props.addToCart(book, 1, 1);
      }
    });
  }

  render() {
    return (
      <div className="h-100">
        {this.state.loading ? (
          <>
            <BookLoader className="w-100" />
          </>
        ) : (
          <>
            {Object.keys(this.state.books).length === 0 ? (
              <>
                <div className="d-flex justify-content-center align-items-center">
                  <p className="display-4">No data available for this class.</p>
                </div>
              </> // dati non disponibili
            ) : (
              <>
                <div
                  className="w-100 d-flex align-items-center"
                  style={{ marginTop: 32 }}
                >
                  <div className="text-center w-100 text-truncate ">
                    <span
                      className="display-4"
                      style={{ fontWeight: 500, fontSize: "5vh" }}
                    >
                      {this.state.scuola.DENOMINAZIONESCUOLA}
                    </span>
                    <div className="w-100 mt-2 d-block d-lg-none" />
                    <span className="h3 text-muted ml-lg-4 ml-0">
                      {this.props.classe}
                    </span>
                    <div className="w-100 mt-4" />
                    <button
                      className="btn btn-primary pointer h3 ml-0 ml-lg-4 font-weight-regular"
                      onClick={() => this.addAll()}
                    >
                      Add all the books to the cart.
                    </button>
                  </div>
                </div>
                <div id="books_container" className="mt-4 mx-4">
                  <div className="row w-100">
                    {this.state.books.map((book, index) => (
                      <ProductItem
                        key={index}
                        product={book}
                        addToCart={this.props.addToCart}
                        index={index}
                      />
                    ))}
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    );
  }
}
