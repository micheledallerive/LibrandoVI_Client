import React from 'react';
import {Link} from 'react-router-dom';
import CustomLink from './CustomLink';

export default class SchoolItem extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <>
                <div className="col-lg-3 col-md-6 col-12 px-0">
                    <div className="card item rounded pointer p-1 px-2 m-2">
                        <CustomLink tag="div" to={"/adozioni/"+this.props.school.CODICESCUOLA}>
                            <div className="card-body">
                                <p className="h5 card-title truncate">{this.props.school.DENOMINAZIONESCUOLA}</p>
                                <p className="card-text">{this.props.school.DESCRIZIONECOMUNE} - {this.props.school.CAPSCUOLA}</p>
                                <div className="card-text"><span className="font-weight-bold">Codice: </span><span>{this.props.school.CODICESCUOLA}</span></div>
                            </div>
                        </CustomLink>
                    </div>
                </div>
            </>
        )
    }
}