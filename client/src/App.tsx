import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { WeatherService } from '@/services/weatherService';

function App() {
  const [city, setCity] = useState('');
  
  const handleTest = async () => {
    try {
      const data = await WeatherService.getCurrentWeather(city);
      alert(JSON.stringify(data));
    } catch (error) {
      alert("Error fetching data");
      console.log(error)
    }
  };

  return (
    <div className="p-10 flex gap-4">
      <Input 
        placeholder="Enter city (e.g., Pune)" 
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <Button onClick={handleTest}>Test API</Button>
    </div>
  );
}

export default App;