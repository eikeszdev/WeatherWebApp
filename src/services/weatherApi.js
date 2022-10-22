import axios from "axios";

const api = axios.create({
    baseURL: `api.openweathermap.org/data/2.5/forecast?id=524901&appid={cba5643ae04b2d08e4ff6b1cbc921946}`
});

export default api;