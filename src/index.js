import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter  } from 'react-router-dom';
import history from './utils/history';
import store from './store/store';
import App from './App';
import './index.css';

// Set up socket connection
import './utils/socket';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <Provider store={store}>
    <BrowserRouter  history={history}>
      <App />
    </BrowserRouter >
  </Provider>
);