import { useParams, useSearchParams } from "react-router-dom";
import { useWeatherQuery, useForecastQuery, useReverseGeocodeQuery } from "../hooks/use-weather";
import { Alert, AlertDescription } from "../components/ui/alert";
import { AlertTriangle } from "lucide-react";
import CurrentWeather from "../components/CurrentWeather";
import { HourlyTemperature } from "../components/hourly-temprature";
import { WeatherDetails } from "../components/weather-details";
import { WeatherForecast } from "../components/weather-forecast";
import WeatherSkeleton from "../components/loading-skeleton";
import { FavoriteButton } from "../components/favorite-button";
import { useLanguage } from '../context/language-provider';

export function CityPage() {
  const [searchParams] = useSearchParams();
  const params = useParams();
  const lat = parseFloat(searchParams.get("lat") || "0");
  const lon = parseFloat(searchParams.get("lon") || "0");

  const coordinates = { lat, lon };

  const weatherQuery = useWeatherQuery(coordinates);
  const forecastQuery = useForecastQuery(coordinates);
  const locationQuery = useReverseGeocodeQuery(coordinates); // Add this line

  const locationName = locationQuery.data?.[0]; // Add this line
  const { language } = useLanguage();

  if (weatherQuery.error || forecastQuery.error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Failed to load weather data. Please try again.
        </AlertDescription>
      </Alert>
    );
  }

  if (!weatherQuery.data || !forecastQuery.data || !params.cityName) {
    return <WeatherSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">
          <span>
            {language === "kn"
              ? locationName?.local_names?.kn || locationName?.name
              : locationName?.name}
          </span>
          , {weatherQuery.data.sys.country}
        </h1>
        <div className="flex gap-2">
          <FavoriteButton
            data={{ ...weatherQuery.data, name: params.cityName }}
          />
        </div>
      </div>

      <div className="grid gap-6">
        <CurrentWeather data={weatherQuery.data} />
        <HourlyTemperature data={forecastQuery.data} />
        <div className="grid gap-6 md:grid-cols-2 items-start">
          <WeatherDetails data={{
            ...weatherQuery.data,
            wind: {
              ...weatherQuery.data.wind,
              speed: Math.floor(weatherQuery.data.wind.speed * 100) / 100 // round down to 2 decimals
            }
          }} />
          <WeatherForecast data={{
            ...forecastQuery.data,
            list: forecastQuery.data.list.map(item => ({
              ...item,
              wind: {
                ...item.wind,
                speed: Math.floor(item.wind.speed * 100) / 100 // round down to 2 decimals
              }
            }))
          }} />
        </div>
      </div>
    </div>
  );
}