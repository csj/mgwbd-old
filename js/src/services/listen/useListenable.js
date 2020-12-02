import Listenable from './Listenable';
import {useEffect, useState} from 'react';


/**
 * Use example:
 *   In React component:
 *     const value = useListenable(Listenable);
 */
const useListenable = listenable => {
  const [value, setValue] = useState(listenable.value);

  useEffect(() => {
    let listenerId = listenable.listen(setValue);
    return () => listenable.unlisten(listenerId);
  }, [listenable]);

  if (!listenable instanceof Listenable) {
    console.log('useListenable must be used with a Listenable property.');
    return undefined;
  }

  return value;
};


export default useListenable;

