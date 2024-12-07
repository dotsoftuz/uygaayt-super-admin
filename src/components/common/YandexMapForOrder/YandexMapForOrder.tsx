import { useApi } from "hooks/useApi/useApiHooks";
import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
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
  const { reset } = useForm();


  const { data: storeRadius, status: storeRadiusStatus, refetch } = useApi(
    "settings-general",
    {},
    {
      onSuccess({ data }) {
        localStorage.setItem("settings", JSON.stringify(data));
      },
    }
  );

  const { data: storeAddress, status: storeAddressStatus } = useApi(
    "store/get",
    {},
    {
      suspense: false,
    }
  );

  useEffect(() => {
    if (storeRadiusStatus === "success") {
      reset();
    }
  }, [storeRadiusStatus]);

  useEffect(() => {
    if (storeAddressStatus === "success") {
      reset();
    }
  }, [storeAddressStatus]);


  // Do'konning koordinatalari
  const storeCoordinates = {
    latitude: storeAddress?.data?.addressLocation?.latitude,
    longitude: storeAddress?.data?.addressLocation?.longitude,
  };


  const maxDistance = storeRadius?.data?.storeRadius * 1000; // 10 km radius metrda

  useEffect(() => {
    if (center) {
      setCoordinate(center);
      if (mapRef.current) {
        mapRef.current.setCenter([center.latitude, center.longitude]);
      }
    }
  }, [center]);

  // Haversine formulasi orqali masofani hisoblash
  const calculateDistance = (coord1: ILocation, coord2: ILocation) => {
    const R = 6371e3; // Yer radiusi metrda
    const φ1 = (coord1.latitude * Math.PI) / 180;
    const φ2 = (coord2.latitude * Math.PI) / 180;
    const Δφ = ((coord2.latitude - coord1.latitude) * Math.PI) / 180;
    const Δλ = ((coord2.longitude - coord1.longitude) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Masofa metrda qaytariladi
  };

  const handleGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newCoord = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          const distance = calculateDistance(newCoord, storeCoordinates);

          if (distance <= maxDistance) {
            setCoordinate(newCoord);
            getCoordinate(newCoord);

            if (mapRef.current) {
              mapRef.current.setCenter([newCoord.latitude, newCoord.longitude], 14);
            }
          } else {
            toast.error(`Kechirasiz, siz faqat do'kondan ${storeRadius?.data?.storeRadius} km radius ichida joy tanlay olasiz.`);
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
            : [storeCoordinates.latitude, storeCoordinates.longitude],
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
          const distance = calculateDistance(newCoord, storeCoordinates);

          if (distance <= maxDistance) {
            setCoordinate(newCoord);
            getCoordinate(newCoord);
          } else {
            toast.error(`Kechirasiz, siz faqat do'kondan ${storeRadius?.data?.storeRadius} km radius ichida joy tanlay olasiz.`);
          }
        }}
      >
        {coordinate && (
          <Placemark geometry={[coordinate.latitude, coordinate.longitude]} />
        )}
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
