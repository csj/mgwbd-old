import 'components/chrome/Sidenav.scss';
import React from 'react';
import Sitemap from 'components/app/Sitemap';
import { NavLink } from 'react-router-dom';
import { withRouter } from 'react-router';


class Sidenav extends React.Component {
  constructor() {
    super();
    this.sitemap = new Sitemap.Factory().create();
  }

  mkLink(label, path, className) {
    className = (className || '') + 'item';
    return (
      <NavLink
          key={label}
          to={path}
          className={className}
          activeClassName='selected'>
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
    let items = this.filter(this.sitemap.getVisibleSidenavItems());
    return (
      <div className={'Sidenav ' + (items.length ? '' : 'collapse')}>
        {items.map(i => this.mkLink(i.label, i.path))}
      </div>
    );
  }
}

export default withRouter(Sidenav);
