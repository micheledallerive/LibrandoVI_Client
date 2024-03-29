import React from "react";
import { BUY_MULTIPLIER, SELL_MULTIPLIER } from "../constants";
import CustomLink from "./CustomLink";
import AvailableBadge from "./AvailableBadge";
import $ from "jquery";

import { priceFormat, getFinalPrice } from "../utils";

class ProductItem extends React.Component {
  componentDidMount() {
    const src =
      this.props.product.URL.substring(0, 48) +
      $(".card-img")[this.props.index].clientWidth +
      "_0_0.jpg";
    $(".card-img")[this.props.index].src = src;
  }

  render() {
    const productURL = "/book/" + this.props.product.ISBN;
    return (
      <>
        <div className="col-sm-12 col-md-6 col-xl-4 py-3">
          <div className="card mb-3 item rounded">
            <div className="row no-gutters">
              <AvailableBadge available={this.props.product.quantity !== 0} />
              <CustomLink
                tag="div"
                to={productURL}
                className="col-md-12 col-lg-6"
              >
                <img
                  loading="lazy"
                  src=""
                  style={{ aspectRatio: "4/5" }}
                  className={
                    "card-img" +
                    (this.props.product.quantity === 0 ? " bw" : "")
                  }
                />
              </CustomLink>
              <div className="col-md-12 col-lg-6">
                <>
                  <div className="card-body d-flex flex-column h-100">
                    <div className="card-info flex-grow-1">
                      <CustomLink tag="div" to={productURL} className="">
                        <p className="font-weight-bold card-title book-name truncate mb-1">
                          {this.props.product.nome}
                        </p>
                        <p className="font-weight-light font-italic mb-2 card-text">
                          {this.props.product.ISBN}
                        </p>
                        <div className="prezzo mt-2">
                          <span className="font-weight-bold mt-1 card-text">
                            Price: &nbsp;
                          </span>
                          <span className="card-text">
                            {this.props.product.prezzo}€
                          </span>
                          <br />
                        </div>
                      </CustomLink>
                    </div>
                    <div className="card-buttons mt-1">
                      <button
                        className={
                          "btn btn-primary w-100" +
                          (this.props.product.quantity === 0 ? " d-none" : "")
                        }
                        onClick={() =>
                          this.props.product.quantity === 0
                            ? {}
                            : this.props.addToCart(this.props.product, 1)
                        }
                      >
                        Buy -{" "}
                        <p className="font-weight-bold d-inline">
                          {priceFormat(
                            getFinalPrice(this.props.product, BUY_MULTIPLIER)
                          )}
                        </p>
                      </button>
                      <button
                        className="btn btn-outline-primary w-100 mt-2"
                        onClick={() =>
                          this.props.addToCart(this.props.product, -1)
                        }
                      >
                        Sell -{" "}
                        <p className="font-weight-bold d-inline">
                          {priceFormat(
                            getFinalPrice(this.props.product, SELL_MULTIPLIER)
                          )}
                        </p>
                      </button>
                    </div>
                  </div>
                </>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default ProductItem;
