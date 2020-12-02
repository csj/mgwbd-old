import Http from 'components/http/Http';
import Listenable from './listen/Listenable';


const paths = {
  ACCOUNT_INFO: '/account/info',
  LOGIN: '/account/login',
  LOGOUT: '/account/logout',
};


class AccountService {
  constructor() {
    this.http = new Http.Factory().create();
    this.http.responseInterceptor(this.intercept.bind(this));
    this.accountInfo = new Listenable({});
  }

  intercept(rsp) {
    if (rsp.req.url.endsWith(paths.ACCOUNT_INFO)) {
      this.accountInfo.value = rsp.body || {};
    } else if (rsp.req.url.endsWith(paths.LOGOUT)) {
      this.accountInfo.value = {};
    }
  }
  
  isLoggedIn() {
    return this.accountInfo.value.email;
  }

  async refreshAccountInfo() {
    await this.http.get(paths.ACCOUNT_INFO);
  }
}


AccountService.Factory = class {
  create() {
    return _instance;
  }
}


const _instance = new AccountService();


export default AccountService;


