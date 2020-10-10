import AccountPage from 'page/AccountPage';
import Environment from 'page/internal/Environment';
import GamesList from 'page/GamesList';
import GamePlay from 'page/GamePlay';
import GameTypeMap from 'games/GameTypeMap';
import JoinGame from 'page/JoinGame';
import Icons from 'page/internal/Icons';


const makeGamePage = canonicalName => {
  let game = new GameTypeMap[canonicalName]();
  return {
    label: game.getDisplayName(),
    path: `/games/${canonicalName}`,
    component: GamePlay,
    componentProps: {game},
  };
};


const NAV_LINKS = Object.freeze([
  {
    label: 'Games',
    path: '/games',
    component: GamesList,
    sidenavVisible: false,
    children: [
      {
        label: 'Join',
        path: '/join/:gameKey',
        component: JoinGame,
      },
      makeGamePage('dandelions'),
      makeGamePage('sequencium'),
      makeGamePage('prophecies'),
      makeGamePage('neighbors'),
    ],
  },
  {
    label: 'Blog',
    path: 'https://mathwithbaddrawings.com',
  },
  {
    label: 'Account',
    path: '/account',
    component: AccountPage,
    showIf: _ => false,
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

