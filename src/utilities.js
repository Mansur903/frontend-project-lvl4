import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

const config = {
  position: 'top-right',
  autoClose: 3000,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
};

const showToast = (type, message) => toast[type](message, config);

export function selectors() {
  const { channels } = useSelector((state) => state.channels);
  const { messages } = useSelector((state) => state.messages);
  const { activeChannel } = useSelector((state) => state.channels);
  const { modal } = useSelector((state) => state);
  const { dropdown } = useSelector((state) => state);
  return ({
    channels, messages, activeChannel, modal, dropdown,
  });
}

export default showToast;
