import { Button } from "../components/ui/button"
import { AlertTriangle, MapPin, RefreshCw } from "lucide-react"
import { useGeolocation } from "../hooks/use-geolocation"
import WeatherSkeleton from "../components/loading-skeleton";
import { Alert , AlertDescription,AlertTitle } from "../components/ui/alert";
import { useWeatherQuery,useForecastQuery,useReverseGeocodeQuery } from "../hooks/use-weather";
import CurrentWeather from "../components/current-weather";
import HourlyTemperature from "../components/hourly-temperature";
import WeatherDetails from "../components/weather-details";
const WeatherDashboard = () => {
    const {
        coordinates,
        error:locationError,
        getLocation,
        isloading:locationLoading,
    } = useGeolocation();

    const weatherQuery = useWeatherQuery(coordinates);
    const forecastQuery = useForecastQuery(coordinates);
    const locationQuery = useReverseGeocodeQuery(coordinates);

    const handleRefresh = async () => {
        await getLocation();
        if (coordinates) {
            console.log("Refreshing Weather Data...");
            await weatherQuery.refetch();
            await forecastQuery.refetch();
            await locationQuery.refetch();
        }
    };
     
    if(locationLoading){
        return <WeatherSkeleton />
    }
    if(locationError){
        return (
        <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Location Error</AlertTitle>
            <AlertDescription className="flex flex-col gap">
                <p>{locationError}</p>
                <Button onClick={getLocation} variant={"outline"} className="w-fit">
                    <MapPin className="mr-2 h-4 w-4" />
                </Button>
                Enable location
            </AlertDescription>
        </Alert>
        );
    }

    if(!coordinates){
        return (
        <Alert variant="destructive">
            <AlertTitle>Location Required</AlertTitle>
            <AlertDescription className="flex flex-col gap">
                <p>Please enable location access to see your local weather</p>
                <Button onClick={getLocation} variant={"outline"} className="w-fit">
                    <MapPin className="mr-2 h-4 w-4" />
                </Button>
                Enable location
            </AlertDescription>
        </Alert>
        );
    }

    const locationName = locationQuery.data?.[0];
    if(weatherQuery.error || forecastQuery.error){
        return (
            <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription className="flex flex-col gap">
                <p>Failed to fetch weather data. Please try again.</p>
                <Button onClick={handleRefresh} variant={"outline"} className="w-fit">
                    <RefreshCw className="mr-2 h-4 w-4" />
                </Button>
                Retry
            </AlertDescription>
        </Alert>
        )
    }

    if(!weatherQuery.data || !forecastQuery.data){
        return <WeatherSkeleton />;
    }
  return (
    <div className="space-y-4">
        <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold traking-tight">My Location</h1>
            <Button
             variant={"outline"}
             size={"icon"}
             onClick={handleRefresh}
             disabled={weatherQuery.isFetching || forecastQuery.isFetching}
             >
                <RefreshCw className={`h-4 w-4 ${weatherQuery.isFetching?"animate-spin":""} `} />
            </Button>
        </div>


        <div className="grid gap-6">
            <div className="flex flex-col lg:flex-row gap-4">
            <CurrentWeather
            data={weatherQuery.data}
            locationName={locationName}
           />

           <HourlyTemperature
            data={forecastQuery.data}
            />
            </div>

            <div>
                <WeatherDetails data={weatherQuery.data} />
            </div>
        </div>
    </div>
  );
};

export default WeatherDashboard