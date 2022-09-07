import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";

const CustomLink = ({ history, to, onClick, tag: Tag, ...rest }) => (
  <Tag
    {...rest}
    onClick={async (event) => {
      if (onClick) {
        try {
          await onClick(event);
          history.push(to);
        } catch (e) {
          window.location.reload();
        }
      } else {
        if (!event.defaultPrevented) history.push(to);
      }
    }}
    style={{ cursor: "pointer" }}
  />
);

CustomLink.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  onClick: PropTypes.func,
};
export default withRouter(CustomLink);
