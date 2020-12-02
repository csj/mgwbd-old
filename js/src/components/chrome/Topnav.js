import 'components/chrome/Topnav.scss';
import React, {useState} from 'react';
import { Button } from 'primereact/button';
import { NavLink } from 'react-router-dom';
import { Sidebar } from 'primereact/sidebar';
import { withRouter } from 'react-router';


const Topnav = props => {
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const renderLink = (label, path, className) => {
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
          onClick={() => setSidebarVisible(false)}>
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
          onClick={() => setSidebarVisible(false)}>
        {label}
      </NavLink>
    );
  };

  const filter = links => {
    let filtered = links;

    // Show 'showIf=fn()' links only if showIf evaluates true.
    filtered = filtered.filter(i => !i.showIf || i.showIf());

    return filtered;
  };

  const renderTitle = content =>
    <div className='title'>
      <NavLink to='/' className='nav'>
        {content}
      </NavLink>
    </div>;

  const render = () => {
    let links = filter(props.links || []);
    return (
      <div className='Topnav sticky'>
        <div className='left'>
          <NavLink to='/'>
            {props.logo ?
                <img src={props.logo} className='logo' alt='logo' /> : ''}
          </NavLink>
          {props.children ? renderTitle(props.children) : null}
        </div>
        <div className='right'>
          <div className='desktop'>
            {links.map(i => renderLink(i.label, i.path, i.className))}
          </div>
          <div className='mobile'>
            <Sidebar
                position='right'
                className='sidebar'
                visible={sidebarVisible}
                onHide={() => setSidebarVisible(false)}>
              {links.map(i => renderLink(i.label, i.path, i.className))}
            </Sidebar>
            {links.length ?
                <Button
                    className='sidebarButton'
                    icon='pi pi-bars'
                    onClick={() => setSidebarVisible(true)} />
                : ''}
          </div>
        </div>
      </div>
    );
  };

  return render();
}

export default withRouter(Topnav);
