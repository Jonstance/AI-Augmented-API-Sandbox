import type { Collection } from "@/lib/types";

export const openweathermapCollection: Collection = {
  id: "openweathermap",
  name: "OpenWeatherMap",
  baseUrl: "https://api.openweathermap.org",
  authType: "query",
  authLabel: "OpenWeatherMap API Key",
  authParamName: "appid",
  endpoints: [
    {
      id: "owm-current-weather",
      name: "Current Weather",
      category: "Weather",
      method: "GET",
      path: "/data/2.5/weather?q=:city&units=metric",
      params: [{ name: "city", defaultValue: "Lagos", description: "City name" }],
      description: "Get current weather for a city",
    },
    {
      id: "owm-forecast",
      name: "5-Day Forecast",
      category: "Weather",
      method: "GET",
      path: "/data/2.5/forecast?q=:city&units=metric&cnt=5",
      params: [{ name: "city", defaultValue: "Lagos", description: "City name" }],
      description: "Get 5-day weather forecast",
    },
    {
      id: "owm-air-pollution",
      name: "Air Pollution",
      category: "Weather",
      method: "GET",
      path: "/data/2.5/air_pollution?lat=6.5244&lon=3.3792",
      description: "Get air pollution data for Lagos (6.5244°N, 3.3792°E)",
    },
  ],
};
