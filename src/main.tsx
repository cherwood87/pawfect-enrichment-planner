import { createRoot } from 'react-dom/client'
import App from './App'

console.log("main.tsx executing!");

const rootElement = document.getElementById("root");
console.log("Root element:", rootElement);

if (rootElement) {
  const root = createRoot(rootElement);
  console.log("Creating root and rendering...");
  root.render(<App />);
} else {
  console.error("No root element found!");
}
