declare module 'react-use-websocket' {
  import { useWebSocket as _useWebSocket } from 'react-use-websocket/lib/use-websocket';
  import { ReadyState as _ReadyState } from 'react-use-websocket/lib/constants';
  export default useWebSocket as _useWebSocket;
  export { _ReadyState as ReadyState };
}