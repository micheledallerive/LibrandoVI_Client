import React from 'react';

export default class LoginForm extends React.Component{
    constructor(props){
        super(props);
        this.state = {username: "", password: ""}
        this.checkLogin = this.checkLogin.bind(this);
        if(localStorage.getItem("psw"))
            if(localStorage.getItem("psw")==="94a5725a763c52f0199b35ff8638295b9f386b5597b2a471b7ea4021402c6865")
                this.props.onLoginSuccess();
    }

    async sha256(message){
        const msgBuffer = new TextEncoder().encode(message);                    

        // hash the message
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);

        // convert ArrayBuffer to Array
        const hashArray = Array.from(new Uint8Array(hashBuffer));

        // convert bytes to hex string                  
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    }

    checkLogin(){
        return new Promise((resolve, reject)=>{
            const PASSWORD = "94a5725a763c52f0199b35ff8638295b9f386b5597b2a471b7ea4021402c6865";
            this.sha256(this.state.password)
            .then((password)=>{
                let success = this.state.username==="dallerivemiki" && password===PASSWORD;
                if(success) localStorage.setItem("psw", password);
                resolve(success);
            });
        });
    }

    loginFailed(){
        alert("I dati inseriti sono errati");
    }

    render(){
        return(
            <div className="h-100 w-100 d-flex justify-content-center align-items-center">
                            <div className="card rounded-lg shadow col-4 px-2 py-4">
                                <div className="w-100 text-center"><p className="h2">Login</p></div>
                                <div className="form mt-3 d-flex justify-content-center">
                                    <form className="w-75">
                                      <div class="form-group">
                                        <label for="exampleInputEmail1">Username</label>
                                        <input type="text" class="form-control" id="exampleInputEmail1" value={this.state.username} onChange={(e)=>this.setState({username: e.target.value})} aria-describedby="emailHelp" placeholder=""/>
                                      </div>
                                      <div class="form-group">
                                        <label for="exampleInputPassword1">Password</label>
                                        <input type="password" class="form-control" id="exampleInputPassword1" value={this.state.password} onChange={(e)=>this.setState({password: e.target.value})} placeholder=""/>
                                      </div>
                                      <div className="w-100 d-flex justify-content-center mt-4"><button type="submit" class="btn btn-primary " onClick={(e)=>{
                                          e.preventDefault();
                                          this.checkLogin()
                                          .then((success)=>{
                                              (success)
                                              ?this.props.onLoginSuccess()
                                              :this.loginFailed()});

                                            }}>Submit</button></div>
                                    </form>
                                </div>
                                
                            </div>
                        </div>
        )
    }

}