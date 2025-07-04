import { Button } from '../components/ui/button'
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { useGeolocation } from '../hooks/use-geolocation'
import WeatherSkeleton from '../components/loading-skeleton'
import { MapPin, RefreshCw,AlertTriangle} from "lucide-react";
import { useForecastQuery,
  useReverseGeocodeQuery,
  useWeatherQuery} from '../hooks/use-weather';
import CurrentWeather from '../components/CurrentWeather';
import { HourlyTemperature } from '../components/hourly-temprature';
import { WeatherDetails } from '../components/weather-details';
import { WeatherForecast } from '../components/weather-forecast';
import { FavoriteCities } from '../components/favorite-cities';
import { useLanguage } from '../context/language-provider';

const WetherDashboard = () => {
    const {coordinates,error:locationError,getLocation,isLoading:locationLoading} = useGeolocation();
    const weatherQuery = useWeatherQuery(coordinates);
  const forecastQuery = useForecastQuery(coordinates);
  const locationQuery = useReverseGeocodeQuery(coordinates);
    console.log(locationQuery.data)
     console.log(weatherQuery.data)
      console.log(forecastQuery.data)
      const { language } = useLanguage();


    const handelRefresh=()=>{
        getLocation()
        if(coordinates){
        weatherQuery.refetch();
        forecastQuery.refetch();
        locationQuery.refetch();
        }
    };
    if (locationLoading){
        <WeatherSkeleton />
    }

    if (locationError) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Location Error</AlertTitle>
        <AlertDescription className="flex flex-col gap-4">
          <p>{locationError}</p>
          <Button variant="outline" onClick={getLocation} className="w-fit">
            <MapPin className="mr-2 h-4 w-4" />
            Enable Location
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

     if (!coordinates){
        return(<Alert>
        <MapPin className="h-4 w-4" />
        <AlertTitle>Location Required</AlertTitle>
        <AlertDescription className="flex flex-col gap-4">
          <p>Please enable location access to see your local weather.</p>
          <Button variant="outline" onClick={getLocation} className="w-fit">
            <MapPin className="mr-2 h-4 w-4" />
            Enable Location
          </Button>
        </AlertDescription>
      </Alert>
        );
    }
const locationName = locationQuery.data?.[0];

  if (weatherQuery.error || forecastQuery.error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription className="flex flex-col gap-4">
          <p>Failed to fetch weather data. Please try again.</p>
          <Button variant="outline" onClick={handelRefresh} className="w-fit">
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (!weatherQuery.data || !forecastQuery.data) {
    return <WeatherSkeleton />;
  }


  return (
    <div className='space-y-4'>
        
         <FavoriteCities />
        <div className='flex items-center justify-between'>
             <h1 className='text-xl font-bold tracking-tight'>
  {language === "kn"
    ? locationName?.local_names?.kn || locationName?.name
    : locationName?.name}
</h1>
            <Button variant={'outline'}
            size={"icon"}
            onClick = {handelRefresh}
            disabled={weatherQuery.isFetching || forecastQuery.isFetching}

            > <RefreshCw className={`h-4 w-4 ${
                weatherQuery.isFetching ? "animate-spin" : ""
            } `}/>
            </Button>
        </div>
        <div className='grid gap-6'>
            <div className='flex flex-col lg:flex-row gap-4'><CurrentWeather data={weatherQuery.data}
            locationName={locationName}/>
             <HourlyTemperature data={forecastQuery.data} />
            </div>
            <div className='grid gap-6 md:grid-cols-2 items-start'> <WeatherDetails data={weatherQuery.data} />
             <WeatherForecast data={forecastQuery.data} /> </div>

        </div>
        
    </div>
  )
}

export default WetherDashboard