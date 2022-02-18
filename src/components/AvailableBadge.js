import React from 'react';

const AvailableBadge = (props)=>{

    let style = {position: 'absolute', zIndex: 1000, top: '.5rem', left: '.5rem'}
    if(props.fontSize) style.fontSize = props.fontSize;
    return(
        <>
        {
            (props.available===false)
            ?
            <>
              <div className="badge badge-danger p-2 shadow-sm" style={style}>Non disponibile per l'acquisto</div>
            </>
            :
            <>
                <div className="badge badge-success p-2 shadow-sm " style={style}>Disponibile</div>
            </>
        }
        </>
    )

};

export default AvailableBadge;