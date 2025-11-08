import React, { useEffect, useState, useRef } from "react";
import {
  YMaps,
  Map,
  Placemark,
  Circle,
  Clusterer,
  FullscreenControl,
  TypeSelector,
  ZoomControl,
} from "react-yandex-maps";
import { useApiMutation } from "hooks/useApi/useApiHooks";
import useAllQueryParams from "hooks/useGetAllQueryParams/useAllQueryParams";

interface IOrderLocation {
  _id: string;
  addressLocation: {
    latitude: number;
    longitude: number;
  };
  addressName: string;
}

interface ILocationGroup {
  latitude: number;
  longitude: number;
  count: number;
  areaName: string;
  orders: IOrderLocation[];
}

// Jizzax shahri markaziy koordinatalari
const JIZZAX_CENTER = [40.1158, 67.8422];
const JIZZAX_DEFAULT_ZOOM = 13;

// Demo data generator - Jizzax shahri bo'ylab 123 ta zakaz
const generateDemoOrders = (): IOrderLocation[] => {
  const orders: IOrderLocation[] = [];
  let id = 1;

  // Zilol mahallasi - 15 zakaz
  for (let i = 0; i < 15; i++) {
    orders.push({
      _id: String(id++),
      addressLocation: {
        latitude: 40.1200 + (Math.random() - 0.5) * 0.015,
        longitude: 67.8500 + (Math.random() - 0.5) * 0.015,
      },
      addressName: "Zilol mahallasi",
    });
  }

  // Markaziy hudud - 25 zakaz (qaynoq nuqta)
  for (let i = 0; i < 25; i++) {
    orders.push({
      _id: String(id++),
      addressLocation: {
        latitude: 40.1158 + (Math.random() - 0.5) * 0.02,
        longitude: 67.8422 + (Math.random() - 0.5) * 0.02,
      },
      addressName: "Markaziy hudud",
    });
  }

  // Yangi shahar - 18 zakaz
  for (let i = 0; i < 18; i++) {
    orders.push({
      _id: String(id++),
      addressLocation: {
        latitude: 40.1100 + (Math.random() - 0.5) * 0.02,
        longitude: 67.8350 + (Math.random() - 0.5) * 0.02,
      },
      addressName: "Yangi shahar",
    });
  }

  // Sharqiy hudud - 12 zakaz
  for (let i = 0; i < 12; i++) {
    orders.push({
      _id: String(id++),
      addressLocation: {
        latitude: 40.1250 + (Math.random() - 0.5) * 0.015,
        longitude: 67.8600 + (Math.random() - 0.5) * 0.015,
      },
      addressName: "Sharqiy hudud",
    });
  }

  // G'arbiy hudud - 14 zakaz
  for (let i = 0; i < 14; i++) {
    orders.push({
      _id: String(id++),
      addressLocation: {
        latitude: 40.1050 + (Math.random() - 0.5) * 0.015,
        longitude: 67.8200 + (Math.random() - 0.5) * 0.015,
      },
      addressName: "G'arbiy hudud",
    });
  }

  // Janubiy hudud - 10 zakaz
  for (let i = 0; i < 10; i++) {
    orders.push({
      _id: String(id++),
      addressLocation: {
        latitude: 40.1000 + (Math.random() - 0.5) * 0.01,
        longitude: 67.8400 + (Math.random() - 0.5) * 0.01,
      },
      addressName: "Janubiy hudud",
    });
  }

  // Shimoliy hudud - 9 zakaz
  for (let i = 0; i < 9; i++) {
    orders.push({
      _id: String(id++),
      addressLocation: {
        latitude: 40.1300 + (Math.random() - 0.5) * 0.01,
        longitude: 67.8450 + (Math.random() - 0.5) * 0.01,
      },
      addressName: "Shimoliy hudud",
    });
  }

  // Toshkent ko'chasi - 8 zakaz
  for (let i = 0; i < 8; i++) {
    orders.push({
      _id: String(id++),
      addressLocation: {
        latitude: 40.1180 + (Math.random() - 0.5) * 0.008,
        longitude: 67.8380 + (Math.random() - 0.5) * 0.008,
      },
      addressName: "Toshkent ko'chasi",
    });
  }

  // Navoiy ko'chasi - 7 zakaz
  for (let i = 0; i < 7; i++) {
    orders.push({
      _id: String(id++),
      addressLocation: {
        latitude: 40.1130 + (Math.random() - 0.5) * 0.008,
        longitude: 67.8480 + (Math.random() - 0.5) * 0.008,
      },
      addressName: "Navoiy ko'chasi",
    });
  }

  // Mustaqillik maydoni - 5 zakaz
  for (let i = 0; i < 5; i++) {
    orders.push({
      _id: String(id++),
      addressLocation: {
        latitude: 40.1175 + (Math.random() - 0.5) * 0.005,
        longitude: 67.8430 + (Math.random() - 0.5) * 0.005,
      },
      addressName: "Mustaqillik maydoni",
    });
  }

  return orders;
};

const DEMO_ORDERS = generateDemoOrders();

interface DashboardMapProps {
  height?: string;
  useDemoData?: boolean; // Demo data ishlatish uchun flag
}

const DashboardMap = ({ height = "600px", useDemoData = true }: DashboardMapProps) => {
  const allParams = useAllQueryParams();
  const [orderLocations, setOrderLocations] = useState<IOrderLocation[]>([]);
  const [locationGroups, setLocationGroups] = useState<ILocationGroup[]>([]);
  const [currentZoom, setCurrentZoom] = useState<number>(JIZZAX_DEFAULT_ZOOM);
  const mapRef = useRef<any>(null);

  // Zoom darajasiga qarab cluster distance ni hisoblash
  const getClusterDistance = (zoom: number): number => {
    if (zoom <= 10) return 0.08; // Juda katta radius - butun shahar
    if (zoom <= 11) return 0.05; // Katta radius - katta hududlar
    if (zoom <= 12) return 0.03; // O'rtacha radius
    if (zoom <= 13) return 0.02; // O'rtacha-kichik radius
    if (zoom <= 14) return 0.01; // Kichik radius - kichik hududlar
    if (zoom <= 15) return 0.005; // Juda kichik radius - aniq hududlar
    return 0.002; // Minimal radius - aniq nuqtalar
  };

  // Zakazlar ma'lumotlarini olish (real data uchun)
  const { mutate: fetchOrders } = useApiMutation(
    "order/paging",
    "post",
    {
      onSuccess(response) {
        if (response?.data?.data) {
          // Faqat addressLocation bo'lgan zakazlarni filter qilish
          const ordersWithLocation = response.data.data.filter(
            (order: any) =>
              order.addressLocation &&
              order.addressLocation.latitude &&
              order.addressLocation.longitude
          );
          setOrderLocations(ordersWithLocation);
          groupOrdersByArea(ordersWithLocation, currentZoom);
        }
      },
      onError(error) {
        console.error("Error fetching orders:", error);
      },
    }
  );

  // Zakazlarni hududlar bo'yicha guruhlash
  const groupOrdersByArea = (orders: IOrderLocation[], zoom?: number) => {
    const groups: { [key: string]: ILocationGroup } = {};
    const zoomLevel = zoom !== undefined ? zoom : currentZoom;
    const CLUSTER_DISTANCE = getClusterDistance(zoomLevel);

    orders.forEach((order) => {
      const lat = order.addressLocation.latitude;
      const lng = order.addressLocation.longitude;

      // Eng yaqin guruhni topish
      let closestGroup: ILocationGroup | null = null;
      let minDistance = Infinity;

      for (const key in groups) {
        const group = groups[key];
        const distance = Math.sqrt(
          Math.pow(group.latitude - lat, 2) + Math.pow(group.longitude - lng, 2)
        );

        if (distance < CLUSTER_DISTANCE && distance < minDistance) {
          minDistance = distance;
          closestGroup = group;
        }
      }

      if (closestGroup) {
        // Eng yaqin guruhga qo'shish
        closestGroup.count += 1;
        closestGroup.orders.push(order);
        // Markazni yangilash (o'rtacha koordinata)
        closestGroup.latitude =
          (closestGroup.latitude * (closestGroup.count - 1) + lat) / closestGroup.count;
        closestGroup.longitude =
          (closestGroup.longitude * (closestGroup.count - 1) + lng) / closestGroup.count;
        
        // Hudud nomini yangilash (ko'proq zakaz bo'lgan hudud nomini olish)
        if (order.addressName && order.addressName !== "Noma'lum hudud") {
          closestGroup.areaName = order.addressName;
        }
      } else {
        // Yangi guruh yaratish
        const areaName = order.addressName || "Noma'lum hudud";
        const key = `${lat.toFixed(6)}_${lng.toFixed(6)}`;
        groups[key] = {
          latitude: lat,
          longitude: lng,
          count: 1,
          areaName: areaName,
          orders: [order],
        };
      }
    });

    setLocationGroups(Object.values(groups));
  };

  // Zakazlarni yuklash
  useEffect(() => {
    if (useDemoData) {
      // Demo data ishlatish
      setOrderLocations(DEMO_ORDERS);
      groupOrdersByArea(DEMO_ORDERS, currentZoom);
    } else {
      // Real data olish
      fetchOrders({
        page: 1,
        limit: 1000, // Ko'proq zakazlarni olish uchun
        dateFrom: allParams.dateFrom,
        dateTo: allParams.dateTo,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allParams.dateFrom, allParams.dateTo, useDemoData]);

  // Zoom o'zgarganda guruhlarni qayta hisoblash
  useEffect(() => {
    if (orderLocations.length > 0) {
      groupOrdersByArea(orderLocations, currentZoom);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentZoom]);

  // Xarita zoom o'zgarganda guruhlarni yangilash
  const handleMapBoundsChange = (event: any) => {
    const map = event.get("target");
    const zoom = map.getZoom();
    
    // Zoom darajasi o'zgarganda, yangi zoom ni saqlash
    if (zoom !== currentZoom) {
      setCurrentZoom(zoom);
    }
  };

  // Marker rangini aniqlash
  const getMarkerColor = (count: number) => {
    if (count > 10) return "#FF4500"; // Qizil - ko'p zakazlar
    if (count > 5) return "#FF6701"; // To'q jigarrang - o'rtacha
    return "#FFA500"; // Sariq - kam zakazlar
  };

  // Marker o'lchamini aniqlash
  const getMarkerSize = (count: number) => {
    if (count > 10) return [50, 50];
    if (count > 5) return [40, 40];
    return [30, 30];
  };

  return (
    <YMaps query={{ load: "package.full" }}>
      <Map
        width="100%"
        height={height}
        defaultState={{
          center: JIZZAX_CENTER,
          zoom: JIZZAX_DEFAULT_ZOOM,
          behaviors: ["default", "scrollZoom"],
        }}
        instanceRef={(mapInstance) => {
          mapRef.current = mapInstance;
        }}
        onBoundsChange={handleMapBoundsChange}
        onActionEnd={(event: any) => {
          // Zoom yoki pan tugagandan keyin
          const map = event.get("target");
          if (map && typeof map.getZoom === 'function') {
            const zoom = map.getZoom();
            if (zoom !== currentZoom) {
              setCurrentZoom(zoom);
            }
          }
        }}
      >
        {/* Qaynoq nuqtalar uchun aylanalar */}
        {locationGroups
          .filter((group) => group.count > 10)
          .map((group, index) => {
            const color = getMarkerColor(group.count);
            // Aylana radiusini zakazlar soniga qarab hisoblash (metrlarda)
            const circleRadius = Math.min(500 + (group.count * 20), 1500);
            
            return (
              <Circle
                key={`circle_${group.latitude}_${group.longitude}_${index}`}
                geometry={[
                  [group.latitude, group.longitude],
                  circleRadius
                ]}
                options={{
                  fillColor: color,
                  fillOpacity: 0.15,
                  strokeColor: color,
                  strokeOpacity: 0.7,
                  strokeWidth: 3,
                }}
                properties={{
                  hintContent: `${group.areaName}: ${group.count} zakaz (Qaynoq nuqta)`,
                }}
              />
            );
          })}

        <Clusterer
          options={{
            preset: "islands#invertedOrangeClusterIcons",
            groupByCoordinates: false,
            clusterDisableClickZoom: false,
            clusterHideIconOnBalloonOpen: false,
            geoObjectHideIconOnBalloonOpen: false,
          }}
        >
          {locationGroups.map((group, index) => {
            const [width, height] = getMarkerSize(group.count);
            const color = getMarkerColor(group.count);
            const isHotSpot = group.count > 10; // Qaynoq nuqta - 10+ zakaz
            
            // SVG icon yaratish
            const svgIcon = `
              <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
                <circle cx="${width/2}" cy="${height/2}" r="${width/2 - 2}" fill="${color}" stroke="white" stroke-width="3"/>
                <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" 
                      fill="white" font-weight="bold" font-size="${width > 40 ? '16' : width > 30 ? '14' : '12'}">
                  ${group.count}
                </text>
              </svg>
            `;
            
            const iconDataUrl = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgIcon)))}`;

            return (
              <Placemark
                key={`marker_${group.latitude}_${group.longitude}_${index}`}
                geometry={[group.latitude, group.longitude]}
                properties={{
                  balloonContentHeader: `<b>${group.areaName}${isHotSpot ? ' 🔥' : ''}</b>`,
                  balloonContentBody: `<p>Zakazlar soni: <b>${group.count}</b></p>${isHotSpot ? '<p style="color: #FF4500; font-weight: bold;">Qaynoq nuqta</p>' : ''}`,
                  balloonContentFooter: `<small>Koordinatalar: ${group.latitude.toFixed(4)}, ${group.longitude.toFixed(4)}</small>`,
                  hintContent: `${group.areaName}: ${group.count} zakaz`,
                }}
                options={{
                  iconLayout: "default#image",
                  iconImageHref: iconDataUrl,
                  iconImageSize: [width, height],
                  iconImageOffset: [-width / 2, -height / 2],
                }}
              />
            );
          })}
        </Clusterer>

        <FullscreenControl />
        <TypeSelector options={{ float: "right" }} />
        <ZoomControl options={{ float: "right" }} />
      </Map>
    </YMaps>
  );
};

export default DashboardMap;

