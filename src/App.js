import AppRoutes from './routes';
import 'antd/dist/reset.css';
import { Buffer } from 'buffer';
window.Buffer = Buffer;

function App() {
  return (
    <div className="App" style={{ textAlign: 'center' }}>
      <AppRoutes />
    </div>
  );
}


export default App;