import ReactDOM from 'react-dom/client';
import { isEnvBrowser } from '@/lib/constants';

// Styles
import '@/styles/index.css';
import Menu from '@/components/menu';

if (isEnvBrowser) {
  document.body.style.backgroundImage =
    'url("https://i.imgur.com/3pzRj9n.png")';
  document.body.style.backgroundSize = 'cover';
  document.body.style.backgroundRepeat = 'no-repeat';
  document.body.style.backgroundPosition = 'center';
}

ReactDOM.createRoot(document.body).render(<Menu />);
