import React from 'react';
import $ from 'jquery';

const ScrollButton = (props)=>{

    let button = document.getElementById("backTopBtn");
    if(button){
        document.getElementById(props.container).onscroll = ()=>{
            if (document.getElementById(props.container).scrollTop > 200) {
                button.classList.add("d-flex");
                button.classList.remove("d-none");
            } else {
              button.classList.add("d-none");
              button.classList.remove("d-flex");
            }
          };
    }

    return(
        <div 
            id="backTopBtn"
            onClick={()=>$("#"+props.container).animate({scrollTop: 0}, 500)}
            className="d-none rounded-circle bg-primary pointer position-absolute d-none justify-content-center align-items-center text-white shadow" 
            style={{right: '2rem', bottom: '1rem', width: 50, height: 50, fontSize: '2rem', zIndex: 10000}}
        >
            <li className="fas fa-arrow-up"/>
        </div>
    )

};

export default ScrollButton;