import * as jwt from "jwt-then";


export const getRole = (token:string) =>{
    token = token.substr(7,);
    let parseToken:any = jwt.verify(token, 'secret');
    return parseToken
}
