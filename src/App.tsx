import './App.css';
import DeliveryFeeCalculator from './pages/DeliveryFeeCalculator';
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    document.title = 'Delivery Fee Calcultor'; // Set the title when the component mounts
    return () => {
      document.title = 'Delivery Fee Calcultor'; // Set the title when the component unmounts
    };
  }, []);
  return (
    <DeliveryFeeCalculator></DeliveryFeeCalculator>
  );
}

export default App;
