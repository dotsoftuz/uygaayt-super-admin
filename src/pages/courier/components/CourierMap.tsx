import { Map, Placemark, YMaps } from "react-yandex-maps";

const CourierMap = ({storeCoordinates, data, showDriverName}:any) => {
  return (
    <>
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
            {data?.data?.map((location: any, index: number) => (
              <Placemark
                key={location?.addressLocationCoordination?.coordinates[1] + location?.addressLocationCoordination?.coordinates[0] + "_key"}
                geometry={[location?.addressLocationCoordination?.coordinates[1], location?.addressLocationCoordination?.coordinates[0]]}
                properties={{
                  iconContent: index + 1,
                  iconCaption: showDriverName
                    ? `${location?.firstName || ""} ${location?.lastName || ""
                    }`
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
    </>
  )
}

export default CourierMap