import React from 'react';

import LoginForm from '../components/LoginForm';

import queryString from 'querystring';
import $ from 'jquery';

export default class ControlPanel extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            accessGranted: false,
            dbs: [],
            magazzino: [],
            ordini: []
        };
        this.newDB = this.newDB.bind(this);
        this.deleteDB = this.deleteDB.bind(this);
        this.getData = this.getData.bind(this);
        this.addToMagazzino = this.addToMagazzino.bind(this);
    }

    getData(){
        if(this.state.accessGranted){
            fetch("https://librandovi.it:3001/dbs")
            .then((res)=>res.json())
            .then((dbs)=>this.setState({dbs}));

            fetch("https://librandovi.it:3001/magazzino")
            .then((res)=>res.json())
            .then((magazzino)=>this.setState({magazzino}))

            fetch("https://librandovi.it:3001/ordini")
            .then((res)=>res.json())
            .then((ordini)=>this.setState({ordini}))
        }
    }

    deleteDB(name){
        fetch("https://librandovi.it:3001/dbs/delete", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
            body: JSON.stringify({name})
        })
        .then((res)=>res.json())
        .then((data)=>window.location.reload());
    }

    componentDidMount(){
        this.getData();
    }

    componentDidUpdate(){
        console.log(this.state.dbs.length);
        if(this.state.dbs.length===0) this.getData();
    }

    newDB(name){
        fetch("https://librandovi.it:3001/dbs/new", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
            body: JSON.stringify({name})
        })
        .then((res)=>res.json())
        .then((data)=>{window.location.reload()});
    }

    addToMagazzino(){
        let data = $("#add_form").serializeArray();
        fetch("https://librandovi.it:3001/magazzino/add", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
            body: JSON.stringify(data)
        })
        .then((res)=>res.json())
        .then((data)=>window.location.reload());
    }

    render(){
        let queryOk = (queryString.parse(this.props.location.search)["?psw"]==="asdrubale");
        return(
            <>
                <div className="h-100 w-100">
                {
                    (this.state.accessGranted)
                    ?
                    <>
                        <div className="container py-4">
                            <div id="dbs">
                                <div className="w-100 d-flex mb-3">
                                    <span className="h3 font-weight-bold">Databases: </span>
                                    <button className="btn btn-primary ml-auto" onClick={()=>this.newDB(window.prompt("Nome:"))}>Nuovo</button>
                                </div>
                                <ul class="list-group list-group-flush">
                                    {
                                        this.state.dbs.map((db)=>(
                                            <li className="list-group-item bg-light d-flex" style={{fontSize: '1.25rem'}}>
                                                <p className="d-flex w-100 align-items-center m-0">{db}</p>
                                                <i class="fas fa-trash d-flex flex-shrink-1 align-items-center pointer text-primary delete_db" onClick={()=>{
                                                    if(window.confirm("Sicuro?")){
                                                        this.deleteDB(db);
                                                    }
                                                }}></i>
                                            </li>
                                        ))
                                    }
                                </ul>
                            </div>
                            <div id="csv" style={{marginTop: 32}}>
                                <span className="h3 font-weight-bold">CSV to DB: </span>
                                <form className="mt-4" method="post" action="/csvToDb" ref="uploadForm" id="uploadForm" encType="multipart/form-data">
                                    <div className="row">
                                        <div class="custom-file col-5 mr-2">
                                          <input type="file" name="f" class="custom-file-input" id="customFile" onChange={(e)=>{
                                              document.getElementById("upload_label").innerHTML=(e.target.value!=="")?e.target.value:"Scegli file";
                                          }}/>
                                          <label class="custom-file-label" for="customFile" id="upload_label">Scegli file</label>
                                        </div>
                                            <div class="form-group mb-0 col-4 mr-2">
                                              <select class="form-control" name="db" id="exampleFormControlSelect1">
                                                  {this.state.dbs.map((db, index)=><option>{db}</option>)}
                                              </select>
                                            </div>
                                        <input className="col-2 btn btn-primary" type="submit" value="Invia"/>
                                    </div>
                                </form>
                            </div>
                        <div id="magazzino" style={{marginTop: 32}}>
                                <span className="h3 font-weight-bold">Magazzino:</span>
                            <div id="add_product" style={{marginTop: 32}}>
                                <form id="add_form" class="form-inline w-100">
                                    <div class="form-group w-100">
                                        <input type="text" class="form-control col-4 mr-2" placeholder="ISBN" id="add_ISBN" name="isbn"/>
                                        <input type="number" class="form-control col-4 mr-2" placeholder="Quantità" id="add_quantity" name="quantity"/>
                                        <input type="button" class="btn btn-primary col-3"  value="Modifica" onClick={(e)=>{e.preventDefault(); this.addToMagazzino()}}/>
                                    </div>
                                </form>
                            </div>
                            <div className="magazzino_list mt-4">
                                <table className="table" style={{display: 'block', width: '100%', maxHeight: 500, overflowY: 'auto'}}>
                                    <thead>
                                        <tr>
                                            <th scope="col">ISBN</th>
                                            <th scope="col">Quantità</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            this.state.magazzino.map((mag_item)=>(
                                                <tr>
                                                    <td>{mag_item.ISBN}</td>
                                                    <td>{mag_item.quantity}</td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="ordini mt-4">
                            <span className="h3 font-weight-bold">Ordini:</span>
                            <table className="table mt-4" style={{display: 'block', maxHeight: 500, overflowY: 'auto'}}>
                                <thead>
                                    <tr>
                                        <th scope="col">ID</th>
                                        <th scope="col">Nome</th>
                                        <th scope="col">Email</th>
                                        <th scope="col">Codice</th>
                                        <th scope="col">Prezzo (libri+tassa)</th>
                                        <th scope="col">Libri</th>
                                        <th scope="col">Data</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        this.state.ordini.map((ordine)=>(
                                            <tr>
                                                <td>{ordine._id}</td>
                                                <td>{ordine.nome+" "+ordine.cognome}</td>
                                                <td>{ordine.email}</td>
                                                <td>{ordine.codice}</td>
                                                <td>{ordine.prezzoTotale+" ("+ordine.prezzoLibri+"+"+ordine.tassa+")"}</td>
                                                <td>{
                                                    Object.keys(ordine.libri).map((key, index)=>(
                                                        <>
                                                            {(ordine.libri[key].action===1)?"Compra ":"Vende "}{ordine.libri[key].quantity+" "}{key}
                                                        </>
                                                    ))
                                                }</td>
                                                <td>{ordine.data}</td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </div>

                        </div>
                    </>
                    :
                    <>
                        <LoginForm onLoginSuccess={()=>{
                            this.setState({accessGranted: (queryOk&&true)});
                            }}/>
                    </>
                }
                </div>
            </>
        )
    }
}