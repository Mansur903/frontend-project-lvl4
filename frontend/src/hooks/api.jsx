import { useContext } from 'react';

import apiContext from '../contexts/api.jsx';

const useApi = () => useContext(apiContext);

export default useApi;
