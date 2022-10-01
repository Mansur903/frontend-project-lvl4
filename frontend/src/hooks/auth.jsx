import { useContext } from 'react';

import authContext from '../contexts/auth.jsx';

const useAuth = () => useContext(authContext);

export default useAuth;
