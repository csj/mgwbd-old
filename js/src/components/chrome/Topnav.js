import 'components/chrome/Topnav.scss';
import React from 'react';
import { Button } from 'primereact/button';
import { Link, NavLink } from 'react-router-dom';
import { Sidebar } from 'primereact/sidebar';
import { withRouter } from 'react-router';
import Sitemap from 'components/app/Sitemap';


class Topnav extends React.Component {
  constructor() {
    super();
    this.state = { sidebarVisible: false };
    this.sitemap = new Sitemap.Factory().create();
  }

  mkLink(label, path, className) {
    if (!path) {
      path = '/' + label.toLowerCase();
    }
    if (path.startsWith('http')) {
      return (
      <a
          key={label}
          href={path}
          className={className + ' nav'}
          target='_blank'
          rel='noopener noreferrer'
          onClick={e => this.setState({sidebarVisible: false})}>
        {label}
      </a>
      );
    }
    return (
      <NavLink
          key={label}
          to={path}
          className={className + ' nav'}
          activeClassName='selected'
          onClick={e => this.setState({sidebarVisible: false})}>
        {label}
      </NavLink>
    );
  }

  filter(links) {
    let filtered = links;

    // Show 'showIf=fn()' links only if showIf evaluates true.
    filtered = filtered.filter(i => !i.showIf || i.showIf());

    return filtered;
  }

  render() {
    let links = this.filter(this.props.links || []);
    return (
      <div className='Topnav sticky'>
        <div className='left'>
          <Link to='/'>
            {/* <img /> */}
          </Link>
          <div className='title'>
            <NavLink to='/' className='nav'>
              {this.props.children}
            </NavLink>
          </div>
        </div>
        <div className='right'>
          <div className='desktop'>
            {links.map(i => this.mkLink(i.label, i.path, i.className))}
          </div>
          <div className='mobile'>
            <Sidebar
                position='right'
                className='sidebar'
                visible={this.state.sidebarVisible}
                onHide={(e) => this.setState({sidebarVisible: false})}>
              {links.map(i => this.mkLink(i.label, i.path, i.className))}
            </Sidebar>
            {links.length ?
                <Button
                    className='sidebarButton'
                    icon='pi pi-bars'
                    onClick={(e) => this.setState({sidebarVisible: true})}/>
                : ''}
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Topnav);
