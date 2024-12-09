import './App.css';
import AppRoutes from "./routes"
import 'antd/dist/reset.css';
import {useEffect} from "react";
import { Buffer } from 'buffer';
window.Buffer = Buffer;



function App() {

  return (
    <div className="App">
      <AppRoutes />
    </div>
  );
}

export default App;
