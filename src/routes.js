// @ts-check

const host = '';
const prefix = 'api/v1';

export default {
  homePath: '/',
  loginPath: '/login',
  signupPath: '/signup',
  otherPath: '*',
  httpDataPath: () => [host, prefix, 'data'].join('/'),
  httpLoginPath: () => [host, prefix, 'login'].join('/'),
  channelsPath: () => [host, prefix, 'channels'].join('/'),
  channelPath: (id) => [host, prefix, 'channels', id].join('/'),
  channelMessagesPath: (id) => [host, prefix, 'channels', id, 'messages'].join('/'),
};
