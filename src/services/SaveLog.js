import UAPI from "../services/UniversalAPI";
import ClientIP from "../services/GetClientIP";
import * as AuthService from "../services/auth.service";

const currentUser = AuthService.getCurrentUser();

let clientIP='';
ClientIP.getIP().then(data => clientIP=data.ip);

const addZero = (x,n) => {
  let r=x;
  if (typeof x !== 'undefined') {
    if (typeof n !== 'undefined') {
      for (let i = 0; i < (parseInt(n)-x.toString().length); i++) {
        r='0'+r.toString();
      }
    }
  }
  return r;
}
  
const save = (event_datail) => {
  let d=new Date();
  let data ={
    date : d.getFullYear()+'-'+addZero(parseInt(d.getMonth())+1,2)+'-'+addZero(d.getDate(),2),
    time : addZero(d.getHours(),2)+':'+addZero(d.getMinutes(),2)+':'+addZero(d.getSeconds(),2),
    userId : currentUser.userId,
    userCid: currentUser.user.cid,
    ip : clientIP,
    software : 'web:R8AnyWhere',
    event : event_datail,
  }
  UAPI.create(data, 'logs');
  return data;
}

export default {
  save
};
