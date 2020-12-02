import './AccountPage.scss';
import AccountService from 'services/AccountService';
import FlagService from 'services/FlagService';
import GameSettingsDialog from 'components/game/GameSettingsDialog';
import Http from 'components/http/Http';
import LabelValue from 'components/chrome/LabelValue';
import React, {useEffect} from 'react';
import useListenable from 'services/listen/useListenable';
import {Button} from 'primereact/button';


const paths = {
  ACCOUNT_INFO: '/account/info',
  LOGIN: '/account/login',
  LOGOUT: '/account/logout',
};


const AccountPage = props => {
  const accountService = new AccountService.Factory().create();
  const http = new Http.Factory().create();
  const flagService = new FlagService.Factory().create();

  const userInfo = useListenable(accountService.accountInfo);

  const login = async () => {
    let rsp = await http.get(paths.LOGIN);
    document.location.href = rsp.body.oauth_url;
  };
  const logout = async () => await http.post(paths.LOGOUT);
  const setClientFlags = settings => Object.keys(settings).forEach(
      key => flagService.setClientFlag(key, settings[key]));

  const loginButton = <Button label='Log in with Google' onClick={login} />;
  const logoutButton = <Button label='Log out' onClick={logout} />;

  const renderLoggedIn = () => {
    let gameSettingsDialog = <GameSettingsDialog
        settingsConfig={flagService.getClientFlagConfig()}
        settings={flagService.getClientFlags()}
        onSettingsChange={setClientFlags} />
    return (
      <div className='section'>
        <LabelValue
            label='Client-side settings' value={gameSettingsDialog}
            styles={LabelValue.Style.LEFT_RIGHT} />
      </div>
    );
  };

  return (
    <div className='AccountPage'>
      <div className='section'>
        <div className='subtitle'>Your account</div>
        <div className='info'>
          {userInfo.email || 'You are not logged in.'}
        </div>
        {userInfo.email && renderLoggedIn()}
        <div className='buttons'>
          {userInfo.email ? logoutButton : loginButton}
        </div>
      </div>
    </div>
  );
};


export default AccountPage;
