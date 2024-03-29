import React from "react";
import ProductItem from "../components/ProductItem";

import BookLoader from "../components/BookLoader";
import ScrollButton from "../components/ScrollButton";

import InfiniteScroll from "react-infinite-scroll-component";

import { API_URL } from "../constants";

class ProductsList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      books: [],
      hasMoreData: true,
      limit: 0,
      filter: "",
    };

    this.getBooks = this.getBooks.bind(this);
  }

  componentDidMount() {
    this.getBooks(20);

    window.onpopstate = () => {
      if (document.getElementById("filter_input")) {
        console.log("set");
        document.getElementById("filter_input").value = this.state.filter;
      }
    };
  }

  getBooks(increment) {
    const newLimit = this.state.limit + increment;
    let query = (this.props.query || "/books") + "?limit=" + newLimit;
    if (this.state.filter !== "" && this.state.filter !== null)
      query += "&filter=" + this.state.filter;
    fetch(`${API_URL}${query}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Length: " + data.books.length + "  Count: " + data.count);
        this.setState({
          limit: newLimit,
          books: data.books,
          hasMoreData: data.books.length < data.count,
        });
      });
  }

  render() {
    let timeOut = null;
    this.getBooks(20);
    return (
      <>
        <div className="container mt-4 d-flex justify-content-center">
          <div className="input-group w-75">
            <div className="input-group-prepend">
              <span className="input-group-text" id="basic-addon1">
                <i className="fas fa-search" />
              </span>
            </div>
            <input
              type="text"
              className="form-control"
              style={{ borderRadius: "0 .25rem .25rem 0" }}
              placeholder="Search name, ISBN or authors..."
              aria-label="ISBN"
              aria-describedby="basic-addon1"
              id="filter_input"
              onChange={(e) => {
                if (timeOut) {
                  clearTimeout(timeOut);
                  timeOut = null;
                }
                timeOut = setTimeout(() => {
                  this.setState(
                    { filter: e.target.value, limit: 20, books: [] },
                    () => this.getBooks(0)
                  );
                  timeOut = null;
                }, 500);
              }}
            />
            <button
              type="button"
              className="btn bg-transparent"
              style={{ marginLeft: "-40px", zIndex: "10" }}
              onClick={() => {
                this.setState({ filter: "", limit: 20, books: [] }, () =>
                  this.getBooks(0)
                );
              }}
            >
              <i className="fas fa-times" />
            </button>
          </div>
        </div>
        <InfiniteScroll
          dataLength={this.state.limit}
          next={() => this.getBooks(20)}
          hasMore={this.state.hasMoreData}
          scrollThreshold="90%"
          loader={
            <div className="h-100 d-flex justify-content-center align-items-center py-4">
              <BookLoader />
            </div>
          }
          scrollableTarget="main-content"
          className="w-100 h-100"
        >
          <div id="books_container" className="mx-4 mt-4">
            <div className="row w-100">
              {this.state.books.map((product, index) => (
                <ProductItem
                  key={index}
                  product={product}
                  addToCart={this.props.addToCart}
                  index={index}
                />
              ))}
            </div>
          </div>
        </InfiniteScroll>
        <ScrollButton container="main-content" />
      </>
    );
  }
}

export default ProductsList;
