import Http from './Http';
import {useEffect, useState} from 'react';


const useXhr = (defaultValue, path, query) => {
  const [value, setValue] = useState(defaultValue);
  const queryString = JSON.stringify(query);

  useEffect(() => {
    const http = new Http.Factory().create();
    http.get(path).query(JSON.parse(queryString)).then(
        rsp => setValue(rsp.body),
        err => console.log(err));
  }, [path, queryString]);

  return value;
};


export default useXhr;
