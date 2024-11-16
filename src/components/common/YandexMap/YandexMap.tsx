import { useEffect, useState } from "react";
import {
  FullscreenControl,
  GeolocationControl,
  Map,
  Placemark,
  TypeSelector,
  YMaps,
  ZoomControl,
} from "react-yandex-maps";
import { ILocation } from "types/common.types";

interface IYandexMap {
  getCoordinate: (coordinate: ILocation) => void;
  center?: ILocation;
  height?: string;
}

const YandexMap = ({ getCoordinate, center, height }: IYandexMap) => {
  const [coordinate, setCoordinate] = useState<any>(center);

  useEffect(() => {
    setCoordinate(center)
  }, [center])

  return (
    <YMaps>
      <Map
        width="100%"
        height={height || "500px"}
        defaultState={{
          center: center?.latitude
            ? [center?.latitude, center?.longitude]
            : [41.315163390767026, 69.27958692367339],
          zoom: 14,
          behaviors: ["default", "scrollZoom"],
        }}
        onClick={(event: any) => {
          const newCoord = {
            latitude: event.get("coords")[0],
            longitude: event.get("coords")[1],
          };
          setCoordinate(newCoord);
          getCoordinate(newCoord);
        }}
        modules={["geoObject.addon.editor"]}
      >
        <Placemark geometry={[coordinate?.latitude, coordinate?.longitude]} />
        <FullscreenControl />
        <GeolocationControl options={{ float: "left" }} />
        <TypeSelector options={{ float: "right" }} />
        <ZoomControl options={{ float: "right" }} />
      </Map>
    </YMaps>
  );
};

export default YandexMap;
