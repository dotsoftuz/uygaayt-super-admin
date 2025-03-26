import { Map, Placemark, YMaps } from "react-yandex-maps";

const CourierMap = ({ storeCoordinates, couriers, showDriverName }: any) => {
  return (
    <div style={{ height: "calc(100% - 140px)" }}>
      <YMaps query={{ load: "package.full" }}>
        <Map
          width="100%"
          height="100%"
          state={{
            center: storeCoordinates,
            zoom: 12,
            behaviors: ["default", "scrollZoom"],
          }}
        >
          {couriers?.map((location: any, index: number) => (
            <Placemark
              key={location?._id}
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
                  : "islands#redHomeIcon"
              }}
            />
          ))}
        </Map>
      </YMaps>
    </div>
  );
};

export default CourierMap;
