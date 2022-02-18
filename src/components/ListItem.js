import React from 'react';
import { BUY_MULTIPLIER, SELL_MULTIPLIER } from '../constants';
import { getFinalPrice, priceFormat } from '../utils';
import QuantitySelector from './QuantitySelector';
import CustomLink from './CustomLink';

export default class ListItem extends React.Component{

    constructor(props){
        super(props);
        // STRUTTURA: {book: {roba del libro (ISBN, immagine, prezzo, autori ecc)}, quantity: quantità, action: -1 se vendi 1 se compri}
        // ottengo i dati in this.props.item
        // i dati riguardo il libro sono this.props.item.book
        this.state = {max: 0, loading: true}
    }

    componentDidMount(){
        fetch("https://micheledallerive.ch:3001/magazzino/quantity/"+this.props.item.action.toString().replace("1", "")+this.props.item.book.ISBN)
        .then((res)=>res.json())
        .then((data)=>{
            this.setState({max: data.max, loading:false});
        });
    }
/*
    static getDerivedStateFromProps(props, state){
        if(props.item.quantity !== state.quantity)
            return {quantity: props.item.quantity};
        return null;
    }*/

    render(){
        return(
            <>
                {
                    (this.state.loading)?<></>
                    :<>
                        <div className="list-group-item row bg-light py-4">
                    <div className="col-lg-2 d-flex justify-content-center align-items-center">
                        <CustomLink tag="div" to={"/book/"+this.props.item.book.ISBN}>
                            <img src={this.props.item.book.URL} style={{width: 100}}/>
                        </CustomLink>
                    </div>

                    <div className="col-lg-6 mt-lg-0 mt-4 d-flex align-items-center">
                        <div className="d-flex flex-column justify-content-start align-items-center text-start truncate">
                        <CustomLink tag="div" to={"/book/"+this.props.item.book.ISBN} className="title text-truncate">
                            <span className={"h4 font-weight-bold"+((parseInt(this.props.item.action)>0)?" text-success":" text-danger")}>{(parseInt(this.props.item.action)>0)?"COMPRA":"VENDI"}</span>
                            <span className="h4 ml-2">{this.props.item.book.nome}</span>
                        </CustomLink>
                        <p className="text-muted w-100 mt-2 font-weight-normal" style={{fontSize: '1.2rem'}}>{this.props.item.book.ISBN}</p>
                        </div>
                    </div>

                    <div className="col-lg-4 col-12 d-flex align-items-center">
                        <div className="row w-100">
                            <div className="col-lg-6 col-12 d-flex justify-content-center px-4" style={{width: 64}}>
                                <QuantitySelector className="justify-content-center" max={this.state.max} quantity={this.props.item.quantity} fixed={true} onChange={(q)=>this.props.changeQuantity(this.props.item.book.ISBN, q)}/>
                            </div>
                            <div className="price col-lg-4 col-6 mt-lg-0 mt-4 d-flex justify-content-center align-items-center ">
                                <p className="h3" style={{margin: '0'}}>{
                                    priceFormat(getFinalPrice(this.props.item.book, ((parseInt(this.props.item.action)>0)?BUY_MULTIPLIER:SELL_MULTIPLIER))*this.props.item.quantity*parseFloat(this.props.item.action))
                                }</p>
                            </div>

                            <div className=" col-lg-2 col-6 d-flex mt-lg-0 mt-4 justify-content-center align-items-center ">
                                <i class="fas fa-trash text-primary pointer delete" style={{fontSize: "32px"}} onClick={()=>this.props.removeFromCart([this.props.item.book.ISBN])}/>
                            </div>
                        </div>
                    </div>
                </div>
                    </>
                }
            </>
        )
    }

}