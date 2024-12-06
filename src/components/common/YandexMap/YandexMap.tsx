import { useEffect, useState, useRef } from "react";
import {
  YMaps,
  Map,
  Placemark,
  FullscreenControl,
  GeolocationControl,
  TypeSelector,
  ZoomControl,
} from "react-yandex-maps";

import { ILocation } from "types/common.types";

interface IYandexMap {
  getCoordinate: (coordinate: ILocation) => void;
  center?: ILocation;
  height?: string;
}

const YandexMap = ({ getCoordinate, center, height }: IYandexMap) => {
  const [coordinate, setCoordinate] = useState<ILocation | undefined>(center);
  const mapRef = useRef<any>(null); // Xarita instansiyasiga murojaat qilish uchun ref

  useEffect(() => {
    if (center) {
      setCoordinate(center);
      if (mapRef.current) {
        mapRef.current.setCenter([center.latitude, center.longitude]);
      }
    }
  }, [center]);

  const handleGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newCoord = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          setCoordinate(newCoord);
          getCoordinate(newCoord);

          if (mapRef.current) {
            mapRef.current.setCenter([newCoord.latitude, newCoord.longitude], 14);
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

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
        instanceRef={(mapInstance) => {
          mapRef.current = mapInstance; // Xarita instansiyasini saqlash
        }}
        onClick={(event: any) => {
          const newCoord = {
            latitude: event.get("coords")[0],
            longitude: event.get("coords")[1],
          };
          setCoordinate(newCoord);
          getCoordinate(newCoord);
        }}
      >
         {/* @ts-ignore */}
        <Placemark geometry={[coordinate?.latitude, coordinate?.longitude]} />
        <FullscreenControl />
        <GeolocationControl
          options={{ float: "left" }}
          onClick={handleGeolocation} // Geolokatsiya tugmasini boshqarish
        />
        <TypeSelector options={{ float: "right" }} />
        <ZoomControl options={{ float: "right" }} />
      </Map>
    </YMaps>
  );
};

export default YandexMap;
