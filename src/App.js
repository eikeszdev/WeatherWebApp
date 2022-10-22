import './App.css';
// import apiWeather from './services/weatherApi';
import react, {useEffect, useState} from 'react';
import axios from 'axios';

const myApiKey = 'cba5643ae04b2d08e4ff6b1cbc921946';
const loc = 'Santos'

function App() {

  const [weather, setWeather] = useState();
  const [forecast, setForecast] = useState();
  // const [cityResponse, setCityResponse] = useState();
  /// só preciso da req de previsão que já tem a cidade
  const [city, setCity] = useState('');
  const [cep, setCep] = useState("");

  useEffect(() => {
    console.log(weather); 
  }, [weather, forecast])
  
  async function handleLoadWeather(e) {
    e.preventDefault();

    // Carregando a cidade informada, apenas para pegar a lat e long
    let cityRequested = city.toLocaleLowerCase();
    const response = await axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${cityRequested},BR&limit=5&appid=${myApiKey}`);
    // console.log(response.data)
    // console.log(`Resposta a respeito da cidade = ${response.data}` );
    // setCityResponse(response.data);
    // console.log(`cityResponse`)
    // // retirando a lat e long da cidade para fazer a previsão
    const latCity = response.data[0].lat;
    const longCity = response.data[0].lon;
    // requisição da previsão do tempo para a cidade informada
    const weatherResponse = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latCity}&lon=${longCity}&units=metric&appid=${myApiKey}`)
    console.log(weatherResponse.data)
    setWeather(weatherResponse.data);
    // console.log('Resposta a respeito da previsão para a cidade = ' + forecastResponse);
  }

  async function handleLoadForecast(e) {
    e.preventDefault();

    let cityRequested = city.toLocaleLowerCase();
    const response = await axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${cityRequested},BR&limit=5&appid=${myApiKey}`);
    // retirando a lat e long da cidade para fazer a previsão
    const latCity = response.data[0].lat;
    const longCity = response.data[0].lon;
    // Chamando a API de previsão para os próximos 5 dias, os dados se atualizam estão dividos de 3 em 3 horas
    const forecastResponse = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${latCity}&lon=${longCity}&units=metric&appid=${myApiKey}`)
    console.log(forecastResponse.data);
    setForecast(forecastResponse.data);
  }

  return (
    <div id="App">
      

      <main className="Content">
        <div className="Header">
          <span> Voltar </span>
          <img src='location.png' className="Logo"></img>
        </div>

        <h1 className="title">Weather Web App</h1>~

        <form action=''>
          <h3 className="subtitle">Insira sua cidade ou CEP</h3>

          <div className='input-block'>
            <label htmlFor=''>CIDADE: </label>
            <input 
            type="text"
            name="city"
            id="city"
            required
            placeholder='Salvador'
            value={city}
            onChange={e => setCity(e.target.value)} />
          </div>

          <div className='input-block'>
            <label htmlFor=''>CEP: </label>
            <input 
            type="number"
            name="cep"
            id="cep"
            placeholder='12345123'
            value={cep || ''}
            onChange={e => setCep(e.target.value)} />
          </div>

          <button className="form-button" onClick={(e) => handleLoadWeather(e)}>Consultar clima atual</button>
          <button className="form-button" onClick={(e) => handleLoadForecast(e)}>Previsão do tempo</button> {/*<!-tirar o submit do forms ativando a função de chamada a API e colocar através do botão--> */}

        </form>

        <section className={weather ? `result` : 'hide'}>

            <span> Clima Atual</span>
            <p>A adicionar previsão dos 5 dias</p>
          <div className="result-title">
            <img src={weather ? `https://countryflagsapi.com/png/${weather.sys.country}` : ''} alt="Bandeira do Brasil" />
            <span>{weather ? weather.name : ''}</span>
          </div>

          <div className="result-date">
            <span>{weather ? weather.main.temp : ''} °C</span>
            <img src={weather ? `http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png` : ''} alt="" />
          </div>

          <div className="result-data">
            <span>Chuva: <b>7%</b></span>
            <span>Umidade: <b>{weather ? weather.main.humidity : ''}%</b></span>
            <span>Vento: <b>{weather ? weather.wind.speed : ''}Km/h</b></span>
          </div>

        </section>

        <section className={forecast ? `result` : 'hide'}>

            <span> Previsão para os próximos dias</span>
            <p>A adicionar previsão dos 5 dias</p>
          <div className="result-title">
            <img src={forecast ? `https://countryflagsapi.com/png/${forecast.city.country}` : ''} alt="Bandeira do Brasil" />
            <span>{forecast ? forecast.city.name : ''}</span>
          </div>

          <button></button>

          {/* TER QUE POR CAIXA DE SELEÇÃO PARA OS 5 DIAS E PARA AS HORAS DE 3 em 3 horas
          
          <div className="result-date">
            <span>{forecast ? weather.main.temp : ''} °C</span>
            <img src={weather ? `http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png` : ''} alt="" />
          </div>

          <div className="result-data">
            <span>Chuva: <b>7%</b></span>
            <span>Umidade: <b>{weather ? weather.main.humidity : ''}%</b></span>
            <span>Vento: <b>{weather ? weather.wind.speed : ''}Km/h</b></span>
          </div> */}

        </section>
      </main>
    </div>
  );
}

export default App;
