import './AccountPage.scss';
import Http from 'components/http/Http';
import React, {useEffect, useState} from 'react';
import {Button} from 'primereact/button';



const paths = {
  ACCOUNT_INFO: '/account/info',
  LOGIN: '/account/login',
  LOGOUT: '/account/logout',
};


const AccountPage = props => {
  const [userInfo, setUserInfo] = useState(null);
  const http = new Http.Factory().create();

  const onAccountInfo = rsp => {
    setUserInfo(rsp.body);
  };
  const login = async () => {
    let rsp = await http.get(paths.LOGIN);
    document.location.href = rsp.body.oauth_url;
  };
  const logout = async () => {
    let rsp = await http.post(paths.LOGOUT);
    setUserInfo(null);
  };

  const loginButton = <Button label='Log in with Google' onClick={login} />;
  const logoutButton = <Button label='Log out' onClick={logout} />;

  useEffect(() => {
    http.get(paths.ACCOUNT_INFO)
        .then(onAccountInfo, err => console.log(err));
  }, [http]);

  return (
    <div className='AccountPage'>
      <div className='section'>
        <div className='subtitle'>Your account</div>
        <div className='info'>
          {userInfo ? userInfo.email : 'You are not logged in.'}
        </div>
        <div className='buttons'>
          {userInfo ? logoutButton : loginButton}
        </div>
      </div>
    </div>
  );
};


export default AccountPage;
