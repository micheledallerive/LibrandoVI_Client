import React from 'react';

import BookLoader from '../../components/BookLoader';
import CustomLink from '../../components/CustomLink';

export default class School extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            scuola: {},
            classi: [],
            loading: true
        };
    }

    componentDidMount(){
        fetch("https://librandovi.it:3001/adozioni/classi?scuola="+this.props.codice)
        .then((res)=>res.json())
        .then((data)=>{
            fetch("https://librandovi.it:3001/school?codice="+this.props.codice)
            .then((res)=>res.json())
            .then((scuola)=>{
                this.setState({scuola, classi: data, loading: false});
            })
        });
    }

    checkIfSplit(classi, index){
        console.log(classi[index+1])
        if(classi[index+1]){
            if(classi[index+1].substring(0,1)!==classi[index].substring(0,1))
                return <div className="w-100"/>
        }
        
    }

    render(){
        return(
            <div className="h-100">
                {
                    (this.state.loading)
                    ?
                    <>
                        <BookLoader/>
                    </>
                    :
                    <>
                    {
                        (Object.keys(this.state.classi).length===0)
                        ?(<>
                            <div className="d-flex justify-content-center align-items-center text-center mt-4">
                                <p className="display-4">Dati non disponibili.</p>
                            </div>
                        </>) // dati non disponibili
                        :(
                            <> 
                                <div className="w-100 d-flex align-items-center" style={{marginTop: 32}}>
                                    
                                    <div className="text-center w-100 text-truncate ">
                                        <span className="display-4" style={{fontWeight: 500, fontSize: '5vh'}}>{this.state.scuola.DENOMINAZIONESCUOLA}</span>
                                        <div className="w-100 d-block d-lg-none"/>
                                        <span className="h3 ml-0 ml-lg-4 font-weight-regular text-secondary">{this.state.scuola.CODICESCUOLA}</span>

                                    </div>
                                </div>
                                <div className="mt-4 p-4">
                                {Object.keys(this.state.classi).map((key, index)=>(
                                    <>
                                        <p className="text-muted h4 mt-4 ml-lg-4">{key}</p>
                                        <div className="row my-3">
                                            {this.state.classi[key].map((classe, index)=>(
                                                <>
                                                <CustomLink tag="div" to={"/adozioni/"+this.props.codice+"/"+classe}>
                                                <div className="card mx-4 my-3 pointer rounded-lg shadow-sm item">
                                                    <div className="card-body">                                                    
                                                        <p className="card-title m-0" style={{fontSize: '1.2rem'}}>{classe}</p>
                                                    </div>
                                                </div>
                                                </CustomLink>
                                                {
                                                    this.checkIfSplit(this.state.classi[key], index)
                                                }
                                                </>
                                            ))}
                                        </div>
                                    </>
                                ))}
                                </div>
                            </>
                        )
                    }
                    </>
                }
            </div>
        )
    }
}