import './App.scss';
import 'primeflex/primeflex.scss';
import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.min.css';
import 'styles/fonts.scss';
import 'styles/media.scss';
import 'styles/page.scss';
import 'primereact/resources/themes/mdc-light-indigo/theme.css';
//import 'styles/theme.scss';
import logo from 'images/logo-white-small.png';
import Footer from 'components/chrome/Footer';
import Landing from 'page/Landing';
import React from 'react';
import ScrollToTop from 'components/chrome/ScrollToTop';
import Sidenav from 'components/chrome/Sidenav';
import Sitemap from './Sitemap';
import Topnav from 'components/chrome/Topnav';
import UnknownPage from 'page/UnknownPage';
import { BrowserRouter } from 'react-router-dom';
import { GrowlElement } from 'components/chrome/Growl';
import { RedirectElement } from 'components/chrome/Redirect';
import { Redirect, Route, Switch } from 'react-router';


const makePageRoute = item => {
  let component = item.component;
  if (!component) {
    if (item.children && item.children.length > 0) {
      return <Route
          key={item.label}
          exact path={item.path}
          render={_ => <Redirect to={item.children[0].path} />} />;
    }
    return null;
  }
  const c = {o: component};
  return <Route
      key={item.label}
      exact path={item.path || `/${item.label.toLowerCase()}`}
      render={_ => <c.o {...item.componentProps} />} />;
}


const makeChildPageRoutes = item => {
  return [ (item.children || []).map(makePageRoute) ];
}


class App extends React.Component {
  constructor() {
    super();
    this.sitemap = new Sitemap.Factory().create();
  }

  render() {
    const topnavItems = this.sitemap.getTopnavItems();
    return (
      <div className='App'>
        <BrowserRouter>
          <ScrollToTop>
            <RedirectElement />
            <GrowlElement />
            <Topnav links={topnavItems} logo={logo}>
            </Topnav>
            <div className='_AppBackdrop'>
              <Sidenav />
              <div className='_AppContent'>
                <Switch>
                  <Route exact path='/' component={Landing} />
                  {topnavItems.map(makePageRoute)}
                  {topnavItems.map(makeChildPageRoutes)}
                  <Route path='*' component={UnknownPage} />
                </Switch>
              </div>
            </div>
            <Footer />
          </ScrollToTop>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
