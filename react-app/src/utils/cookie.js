
export function setCookie(cname, cvalue, hours) {
    let d = new Date();
    d.setTime(d.getTime() + (hours * 60 * 60 * 1000)); // (exdays * 24 * 60 * 60 * 1000));
    let expires = 'expires=' + d.toUTCString();
    document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
}

export function getCookie(cname) {
    let name = cname + '=';
    let ca = document.cookie.split(';');

    for(let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) ===' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }

    return '';
}

export function checkCookie() {
    let userToken = getCookie('_xp_token');
    if (userToken !== '') {
      return userToken;
    } else {
      return null;
    }
}

export function removeCookie(cname) {
  document.cookie = cname + '=;' + 'expires=Thu, 01 Jan 1970 00:00:00 UTC;' + 'path=/;';
}

// export async function verifyToken(token) {
// 	return new Promise((resolve, reject) => {
// 		jwt.verify(token, "node_zoho", (err, payload) => { //config.secrets.jwt
// 			if (err) {
// 				return reject(err)
// 			}
// 			resolve(payload)
// 		})
// 	})
// }

export function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

export function checkRoute() {
  const response ={
    IS_ADMIN: false,
    IS_USER: false
  }
  const tokenCookie = getCookie("_token");
  console.log('tokenCookie', tokenCookie);
  const url = new URL(window.location);
  if(!tokenCookie){
    url.pathname = "/app/";
    return window.location = url.href;
  }
  const token = parseJwt(tokenCookie);
  console.log('token', token);
  console.log('test', new URL(window.location));
  if(token.role == "1") {
    // url.pathname = "/app/admin";
    // return window.location = url.href;
    response.IS_ADMIN = true;
    return response;
  }
  else if(token.role == "2") {
    // url.pathname = "/app/user";
    // return window.location = url.href;
    response.IS_USER = true;
    return response;
  }
}