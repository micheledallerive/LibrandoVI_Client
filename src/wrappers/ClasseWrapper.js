import React from "react";
import { useHistory, useParams } from "react-router-dom";

import Classe from "../pages/adozioni/Classe";

function ClasseWrapper(props) {
  const { codice, classe } = useParams();
  return (
    <>
      <Classe
        codice={codice}
        classe={classe}
        goBack={useHistory().goBack}
        addToCart={props.addToCart}
      />
    </>
  );
}
export default ClasseWrapper;
