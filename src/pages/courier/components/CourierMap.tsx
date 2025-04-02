import { Map, YMaps } from "react-yandex-maps";
import { useState, useMemo } from "react";
import AnimatedPlacemark from "./AnimatedPlacemark";

const CourierMap = ({ storeCoordinates, couriers, showDriverName }: any) => {
  const [mapState, setMapState] = useState({
    center: storeCoordinates,
    zoom: 12,
    behaviors: ["default", "scrollZoom"],
  });

  // Memoize couriers to prevent unnecessary re-renders
  const memoizedCouriers = useMemo(() => couriers, [couriers]);

  return (
    <div style={{ height: "calc(100% - 140px)" }}>
      <YMaps query={{ load: "package.full" }}>
        <Map
          width="100%"
          height="100%"
          state={mapState}
          onBoundsChange={(e: any) => {
            setMapState(prev => ({
              ...prev,
              center: e.get('newCenter'),
              zoom: e.get('newZoom')
            }));
          }}
        >
          {memoizedCouriers?.map((location: any, index: number) => (
            <AnimatedPlacemark
              key={location?._id}
              id={location?._id}
              geometry={[location?.location.latitude, location?.location.longitude]}
              properties={{
                iconContent: index + 1,
                iconCaption: showDriverName
                  ? `${location?.firstName || ""} ${location?.lastName || ""}`
                  : undefined,
                balloonContentHeader: `${location?.firstName} ${location?.lastName}`,
              }}
              options={{
                preset: location?.hasOrder !== true
                  ? "islands#greenAutoCircleIcon"
                  : "islands#blackAutoCircleIcon",
                // Enable dragging if needed
                draggable: false,
              }}
              duration={20000} // Adjust animation duration as needed
              easingFunction={(t) => t * t}
            />
          ))}
        </Map>
      </YMaps>
    </div>
  );
};

export default CourierMap;