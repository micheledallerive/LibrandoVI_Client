import React from "react";
import { useParams } from "react-router-dom";

import Book from "../pages/Book";

function BookWrapper(props) {
  const { isbn } = useParams();
  return (
    <>
      <Book ISBN={isbn} addToCart={props.addToCart} />
    </>
  );
}
export default BookWrapper;
