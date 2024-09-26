import ReactDOM from 'react-dom/client';
import { isEnvBrowser } from '@/lib/constants';

// Styles
import '@/styles/index.css';
import Menu from '@/components/menu';

if (isEnvBrowser) document.body.style.backgroundColor = '#1A1A1A';

ReactDOM.createRoot(document.body!).render(<Menu />);
