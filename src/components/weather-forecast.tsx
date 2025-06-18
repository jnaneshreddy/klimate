import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ArrowDown, ArrowUp, Droplets, Wind, Sunrise, Sunset } from "lucide-react"; // Add Sunrise, Sunset
import { format } from "date-fns";
import type { ForecastData } from "../api/types";
import { useLanguage } from '../context/language-provider';

interface WeatherForecastProps {
  data: ForecastData;
}

interface DailyForecast {
  date: number;
  temp_min: number;
  temp_max: number;
  humidity: number;
  wind: number;
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  };
  sunrise?: number; // Add sunrise
  sunset?: number;  // Add sunset
}

export function WeatherForecast({ data }: WeatherForecastProps) {
  const { language } = useLanguage();

  // Group forecast by day and get daily min/max
  const dailyForecasts = data.list.reduce((acc, forecast) => {
    const date = format(new Date(forecast.dt * 1000), "yyyy-MM-dd");

    // Use city sunrise/sunset if available (OpenWeatherMap 5-day forecast does not provide per-day sunrise/sunset)
    const sunrise = data.city?.sunrise;
    const sunset = data.city?.sunset;

    if (!acc[date]) {
      acc[date] = {
        temp_min: forecast.main.temp_min,
        temp_max: forecast.main.temp_max,
        humidity: forecast.main.humidity,
        wind: forecast.wind.speed,
        weather: forecast.weather[0],
        date: forecast.dt,
        sunrise,
        sunset,
      };
    } else {
      acc[date].temp_min = Math.min(acc[date].temp_min, forecast.main.temp_min);
      acc[date].temp_max = Math.max(acc[date].temp_max, forecast.main.temp_max);
    }

    return acc;
  }, {} as Record<string, DailyForecast>);

  // Get next 5 days
  const nextDays = Object.values(dailyForecasts).slice(1, 6);

  // Format temperature (convert Kelvin to Celsius)
  const formatTemp = (temp: number) => `${Math.round(temp - 273.15)}°C`;

  // Format time from unix timestamp
  const formatTime = (timestamp?: number) =>
    timestamp ? format(new Date(timestamp * 1000), "hh:mm a") : "--";

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {language === "kn"
            ? "5-ದಿನಗಳ ಮುನ್ಸೂಚನೆ"
            : "5-Day Forecast"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {nextDays.map((day) => (
            <div
              key={day.date}
              className="flex flex-col sm:flex-row sm:items-center gap-4 rounded-lg border p-3 sm:p-4"
            >
              <div className="flex-1">
                <p className="font-medium text-base sm:text-lg">
                  {format(new Date(day.date * 1000), "EEE, MMM d")}
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground capitalize">
                  {day.weather.description}
                </p>
                <div className="flex gap-2 mt-2">
                  <span className="flex items-center gap-1 text-yellow-500">
                    <Sunrise className="h-4 w-4" />
                    <span className="text-xs">{formatTime(day.sunrise)}</span>
                  </span>
                  <span className="flex items-center gap-1 text-orange-500">
                    <Sunset className="h-4 w-4" />
                    <span className="text-xs">{formatTime(day.sunset)}</span>
                  </span>
                </div>
              </div>

              <div className="flex justify-start sm:justify-center gap-4">
                <span className="flex items-center text-blue-500">
                  <ArrowDown className="mr-1 h-4 w-4" />
                  {formatTemp(day.temp_min)}
                </span>
                <span className="flex items-center text-red-500">
                  <ArrowUp className="mr-1 h-4 w-4" />
                  {formatTemp(day.temp_max)}
                </span>
              </div>

              <div className="flex justify-start sm:justify-end gap-4">
                <span className="flex items-center gap-1">
                  <Droplets className="h-4 w-4 text-blue-500" />
                  <span className="text-xs sm:text-sm">{day.humidity}%</span>
                </span>
                <span className="flex items-center gap-1">
                  <Wind className="h-4 w-4 text-blue-500" />
                  <span className="text-xs sm:text-sm">{day.wind}m/s</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}