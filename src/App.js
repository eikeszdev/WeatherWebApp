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

  const [hourForecast, setHourForecast] = useState(null);
  const [dayForecast, setDayForecast] = useState([]);

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
    const response = await axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${cityRequested},BR&limit=5&lang=pt_br&appid=${myApiKey}`);
    // retirando a lat e long da cidade para fazer a previsão
    const latCity = response.data[0].lat;
    const longCity = response.data[0].lon;
    // Chamando a API de previsão para os próximos 5 dias, os dados se atualizam estão dividos de 3 em 3 horas
    const forecastResponse = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${latCity}&lon=${longCity}&units=metric&lang=pt_br&appid=${myApiKey}`)
    console.log(forecastResponse.data);
    setForecast(forecastResponse.data);
  }

  function getDateSplited(dateAsString) {
    // Teste de separação da data e hora
    const dateTotal = forecast.list[0].dt_txt.split(' ');
    // console.log(dateTotal)
    const dateSplited = dateTotal[0].split('-')
    // console.log(dateSplited)
    let year = dateSplited[0]; // working
    let month = dateSplited[1]; // working
    let day  = dateSplited[2]; // working
    // console.log(`${year} -- ${month} -- ${day}`);
    let hourSplited = dateTotal[1].split(':');
    let hours = hourSplited[0]; // working
    let minutes = hourSplited[1]; // working
    let seconds = hourSplited[2]; // working
    
    // tenho que convert. p/ tipo int pra podermos somar as datas númericas = +1 -> amanhã -> +2 -> daqui a2 dias e etc.
    // Pra pegar sempre o [0] e que sei que é o primeiro dia e conforme avanço nas datas coloco +1, +2 até +4
    //deixar string e converter só quando for usar nos dias seguintes
    
    const finalSplitedDate ={
      year: year,
      month: month,
      day: day,
      hour: hours,
      minutes: minutes,
      seconds: seconds
    };
    // console.log('data dividida e separada por data: ')
    // console.log(finalSplitedDate)
    return (finalSplitedDate)
  }

  async function handleForecastDay(e, inputValue) {
    e.preventDefault();
    
    // Colocando o dayOne por fora pra eu usar o objeto que retorna como base para os outros dias.
    // ??? TODO --- VERIFICAR SE O PRIMEIRO DIA DA API É DE HOJE OU AMANHÃ 
    const d = new Date();
    const today = d.getDate(); // pra ver se o primeiro dia da API ainda é hoje, se for tenho que pular pro dia de amanhã
    console.log('today/dia 01: ')
    console.log(today);

    // ????? PEGAR A DATA JÁ SEPARADA DO DIA E FAZER DELA O PRIMEIRO DIA A SE R A BASE PARA O USUÁRIO?? - POR HORA VOU DEIXAR DESSA FORMA..

    const dateFromDayOne = getDateSplited(forecast.list[0].dt_txt); // returns a object

    if(inputValue === 'day-one') {
      // retornar para a string original para comparar com o dado vindo da API == dt_txt
      // -> Resposta da API = "2022-10-23 18:00:00" - vai dar errado pq o formato int não retorna 00 e sim 0 
      const fullDateToCompare = `${dateFromDayOne.year}-${dateFromDayOne.month}-${dateFromDayOne.day} ${dateFromDayOne.hour}:${dateFromDayOne.minutes}:${dateFromDayOne.seconds}`
      console.log(fullDateToCompare === forecast.list[0].dt_txt); // working

      // Retornando todos os dados do dia 01, verificando a primeira metade da data dentro do array de previsão
      const dataFromDayOne = forecast.list.filter((day) => day.dt_txt.split(' ')[0] === fullDateToCompare.split(' ')[0]);
      console.log(`retornando todos os dados do 1° dia ${fullDateToCompare}`); 
      console.log(dataFromDayOne);

    } else if(inputValue === 'day-two') {
      //testando mesma função do dia 01 agora para o 2° dia
      console.log('dia 02')
      // pegar a data do 1° dia disponível na API
      // converter para int o dia do object e adicionar +1 no dia para pegar do dia seguinte
      const dateFromTheDay = dateFromDayOne;
      const dayUpdated = parseInt(dateFromTheDay.day) + 1;
      // console.log(dayUpdated + ''); // convertendo pra string com o {+''}

      // converter de volta para string e reamarzenar no objeto
      dateFromTheDay.day = dayUpdated + '';
      console.log(dateFromTheDay)

      // retornar todos os dados que batem com esse 2° dia
      const fullDateToCompare = `${dateFromTheDay.year}-${dateFromTheDay.month}-${dateFromTheDay.day} ${dateFromTheDay.hour}:${dateFromTheDay.minutes}:${dateFromTheDay.seconds}`
      const dataFromDayTwo = forecast.list.filter((day) => day.dt_txt.split(' ')[0] === fullDateToCompare.split(' ')[0]);
      console.log(`retornando todos os dados do 2° dia ${fullDateToCompare}`); 
      console.log(dataFromDayTwo);
      // working
    } else if(inputValue === 'day-three') {
      console.log('dia 03')
      // pegar a data do 1° dia disponível na API
      // converter para int o dia do object e adicionar +1 no dia para pegar do dia seguinte
      const dateFromTheDay = dateFromDayOne;
      const dayUpdated = parseInt(dateFromTheDay.day) + 2;
      // console.log(dayUpdated + ''); // convertendo pra string com o {+''}

      // converter de volta para string e reamarzenar no objeto
      dateFromTheDay.day = dayUpdated + '';
      console.log(dateFromTheDay)

      // retornar todos os dados que batem com esse 2° dia
      const fullDateToCompare = `${dateFromTheDay.year}-${dateFromTheDay.month}-${dateFromTheDay.day} ${dateFromTheDay.hour}:${dateFromTheDay.minutes}:${dateFromTheDay.seconds}`
      const dataFromDayThree = forecast.list.filter((day) => day.dt_txt.split(' ')[0] === fullDateToCompare.split(' ')[0]);
      console.log(`retornando todos os dados do 3° dia ${fullDateToCompare}`); 
      console.log(dataFromDayThree);
    } else if(inputValue === 'day-four') {
      console.log('dia 04')
      // pegar a data do 1° dia disponível na API
      // converter para int o dia do object e adicionar +1 no dia para pegar do dia seguinte
      const dateFromTheDay = dateFromDayOne;
      const dayUpdated = parseInt(dateFromTheDay.day) + 3;
      // console.log(dayUpdated + ''); // convertendo pra string com o {+''}

      // converter de volta para string e reamarzenar no objeto
      dateFromTheDay.day = dayUpdated + '';
      console.log(dateFromTheDay)

      // retornar todos os dados que batem com esse 2° dia
      const fullDateToCompare = `${dateFromTheDay.year}-${dateFromTheDay.month}-${dateFromTheDay.day} ${dateFromTheDay.hour}:${dateFromTheDay.minutes}:${dateFromTheDay.seconds}`
      const dataFromDayFour = forecast.list.filter((day) => day.dt_txt.split(' ')[0] === fullDateToCompare.split(' ')[0]);
      console.log(`retornando todos os dados do 4° dia ${fullDateToCompare}`); 
      console.log(dataFromDayFour);
    } else if(inputValue === 'day-five') {
      console.log('dia 05')
      // pegar a data do 1° dia disponível na API
      // converter para int o dia do object e adicionar +1 no dia para pegar do dia seguinte
      const dateFromTheDay = dateFromDayOne;
      const dayUpdated = parseInt(dateFromTheDay.day) + 4;
      // console.log(dayUpdated + ''); // convertendo pra string com o {+''}

      // converter de volta para string e reamarzenar no objeto
      dateFromTheDay.day = dayUpdated + '';
      console.log(dateFromTheDay)

      // retornar todos os dados que batem com esse 2° dia
      const fullDateToCompare = `${dateFromTheDay.year}-${dateFromTheDay.month}-${dateFromTheDay.day} ${dateFromTheDay.hour}:${dateFromTheDay.minutes}:${dateFromTheDay.seconds}`
      const dataFromDayFive = forecast.list.filter((day) => day.dt_txt.split(' ')[0] === fullDateToCompare.split(' ')[0]);
      console.log(`retornando todos os dados do 5° dia ${fullDateToCompare}`); 
      console.log(dataFromDayFive);
    } 

  }

  async function handleForecastHour(e, inputValue) {
    // Pegar a previsão especificamente da hora informada no "range";
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

          <form action="" calssName="forecast">
            <div className="forecast-days">
              {/* Day One = Tomorrow */}
              <input type="radio" name="day" id="day-one" value={'day-one'} onInput={(event) => {handleForecastDay(event, event.target.value)}}/>
              <input type="radio" name="day" id="day-two" value={'day-two'} onInput={(event) => {handleForecastDay(event, event.target.value)}}/>
              <input type="radio" name="day" id="day-three" value={'day-three'} onInput={(event) => {handleForecastDay(event, event.target.value)}}/>
              <input type="radio" name="day" id="day-four" value={'day-four'} onInput={(event) => {handleForecastDay(event, event.target.value)}}/>
              <input type="radio" name="day" id="day-five" value={'day-five'} onInput={(event) => {handleForecastDay(event, event.target.value)}}/>
            </div>
          </form>
          
          <form action="" className='forecast-hours'>
            <input type="range" name="hour-selected" id="hour-selected" min="0" max="24" step="3" defaultValue={0} onChange={(e) => {setHourForecast(e.target.value)}}/> { /* Tem que definir de 3 em 3 com inicio em 0 e maximo em 24*/}
            <span>{hourForecast ? `${hourForecast}:00` : '00:00'} </span>
          </form>
          

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
