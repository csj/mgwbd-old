import Dandelions from 'games/Dandelions';
// import Default from 'page/Default';
import Environment from 'page/internal/Environment';
import GamesList from 'page/GamesList';
import GamePlay from 'page/GamePlay';
import Icons from 'page/internal/Icons';


const NAV_LINKS = Object.freeze([
  {
    label: 'Games',
    path: '/games',
    component: GamesList,
    sidenavVisible: false,
    children: [
      {
        label: 'Dandelions',
        path: '/games/dandelions',
        component: GamePlay,
        componentProps: {
          game: Dandelions,
        },
      },
    ],
  },
  {
    label: 'Blog',
    path: 'https://mathwithbaddrawings.com',
  },
  {
    label: 'Internal',
    path: '/_i',
    showIf: _ => false,
    children: [
      {
        label: 'Icons',
        path: '/_i/icons',
        component: Icons,
      },
      {
        label: 'Environment',
        path: '/_i/environment',
        component: Environment,
      },
    ],
  },
]);


class Sitemap {
  getTopnavItems() {
    return NAV_LINKS;
  }

  getVisibleSidenavItems() {
    const currentTopnavItem = NAV_LINKS.find(
        i => window.location.pathname.match('^' + i.path));
    if (currentTopnavItem) {
      if (currentTopnavItem.sidenavVisible === false) {
        return [];
      }
      return currentTopnavItem.children || [];
    }
    return [];
  }

  /** Returns the next URL within a list of children. */
  getNextUrl() {
    let pathname = window.location.pathname;
    let currentTopnavItem = NAV_LINKS.find(i => pathname.match('^' + i.path));
    let children = currentTopnavItem.children || [];
    let index = children.findIndex(c => pathname.match('^' + c.path));
    if (index < 0 || index+1 >= children.length) {
      return pathname;
    }
    return children[index + 1].path;
  }
}


Sitemap.Factory = class {
  create() {
    return _instance;
  }
}


const _instance = new Sitemap();


export default Sitemap;

