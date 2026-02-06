import React, { useEffect, useState, useRef } from "react";
import {
  YMaps,
  Map,
  Placemark,
  Circle,
} from "react-yandex-maps";

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

interface MapContentProps {
  locationGroups: ILocationGroup[];
  getMarkerColor: (count: number) => string;
  getMarkerSize: (count: number) => number[];
  createCustomIcon: (count: number, color: string, size: number[]) => string;
}

const MapContent = ({
  locationGroups,
  getMarkerColor,
  getMarkerSize,
  createCustomIcon,
}: MapContentProps) => {
  if (!locationGroups || locationGroups.length === 0) {
    return null;
  }

  return (
    <>
      {locationGroups
        .filter((group) => group && group.latitude && group.longitude)
        .map((group, index) => {
          if (!group || typeof group.count !== "number") {
            return null;
          }

          const color = getMarkerColor(group.count);
          const size = getMarkerSize(group.count);
          const isHotSpot = group.count > 10;
          const iconUrl = createCustomIcon(group.count, color, size);

          const circleRadius = isHotSpot ? Math.min(500 + group.count * 20, 1500) : 0;

          try {
            return (
              <React.Fragment key={`group_${group.latitude}_${group.longitude}_${index}_${group.count}`}>
                {isHotSpot && circleRadius > 0 && (
                  <Circle
                    geometry={[[group.latitude, group.longitude], circleRadius]}
                    options={{
                      fillColor: color,
                      fillOpacity: 0.1,
                      strokeColor: color,
                      strokeOpacity: 0.5,
                      strokeWidth: 2,
                    }}
                  />
                )}
                <Placemark
                  key={`marker_${group.latitude}_${group.longitude}_${index}_${group.count}`}
                  geometry={[group.latitude, group.longitude]}
                  properties={{
                    balloonContentHeader: `<b>${group.areaName || "Noma'lum hudud"}${isHotSpot ? " 🔥" : ""}</b>`,
                    balloonContentBody: `<p>Zakazlar soni: <b>${group.count}</b></p>${isHotSpot
                        ? '<p style="color: #FF4500; font-weight: bold;">Qaynoq nuqta</p>'
                        : ""
                      }`,
                    balloonContentFooter: `<small>Koordinatalar: ${group.latitude.toFixed(
                      4,
                    )}, ${group.longitude.toFixed(4)}</small>`,
                    hintContent: `${group.areaName || "Hudud"}: ${group.count} zakaz`,
                  }}
                  options={{
                    iconLayout: "default#image",
                    iconImageHref: iconUrl,
                    iconImageSize: size,
                    iconImageOffset: [-size[0] / 2, -size[1] / 2],
                  }}
                />
              </React.Fragment>
            );
          } catch (error) {
            console.error("Error rendering placemark:", error);
            return null;
          }
        })}
    </>
  );
};

interface DashboardMapProps {
  height?: string;
  useDemoData?: boolean; // Demo data ishlatish uchun flag
  orders?: any[]; // Dashboard dan keladigan buyurtmalar
  isLoading?: boolean; // Ma'lumotlar yuklanayotganini ko'rsatish
}

const DashboardMap = ({ 
  height = "600px", 
  useDemoData = false,
  orders = [],
  isLoading = false,
}: DashboardMapProps) => {
  const [orderLocations, setOrderLocations] = useState<IOrderLocation[]>([]);
  const [locationGroups, setLocationGroups] = useState<ILocationGroup[]>([]);
  const [currentZoom, setCurrentZoom] = useState<number>(JIZZAX_DEFAULT_ZOOM);
  const mapRef = useRef<any>(null);

  // #region agent log
  fetch("http://127.0.0.1:7242/ingest/ce1c437f-4b53-45a3-b9ea-6cfa04072735", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sessionId: "debug-session",
      runId: "pre-fix-1",
      hypothesisId: "H1",
      location: "DashboardMap.tsx:component-init",
      message: "DashboardMap init",
      data: {
        heightProp: height,
        useDemoDataProp: useDemoData,
      },
      timestamp: Date.now(),
    }),
  }).catch(() => { });
  // #endregion

  // Zoom darajasiga qarab cluster distance ni hisoblash
  const getClusterDistance = (zoom: number): number => {
    if (zoom <= 10) return 0.06;
    if (zoom <= 11) return 0.04;
    if (zoom <= 12) return 0.02;
    if (zoom <= 13) return 0.01;
    if (zoom <= 14) return 0.006;
    if (zoom <= 15) return 0.003;
    return 0.0015;
  };

  // Prop sifatida kelgan buyurtmalarni ishlatish

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

    const grouped = Object.values(groups);
    setLocationGroups(grouped);

    // #region agent log
    fetch("http://127.0.0.1:7242/ingest/ce1c437f-4b53-45a3-b9ea-6cfa04072735", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: "debug-session",
        runId: "pre-fix-1",
        hypothesisId: "H2",
        location: "DashboardMap.tsx:groupOrdersByArea",
        message: "Grouped orders by area",
        data: {
          ordersCount: orders.length,
          zoomLevel,
          groupsCount: grouped.length,
          maxGroupCount: grouped.reduce(
            (max, g) => (g.count > max ? g.count : max),
            0,
          ),
        },
        timestamp: Date.now(),
      }),
    }).catch(() => { });
    // #endregion
  };

  // Prop sifatida kelgan buyurtmalarni ishlatish
  useEffect(() => {
    if (useDemoData) {
      setOrderLocations(DEMO_ORDERS);
      groupOrdersByArea(DEMO_ORDERS, currentZoom);
    } else if (orders && orders.length > 0) {
      // Faqat addressLocation bo'lgan zakazlarni filter qilish
      const ordersWithLocation = orders.filter(
        (order: any) =>
          order.addressLocation &&
          order.addressLocation.latitude &&
          order.addressLocation.longitude
      );
      setOrderLocations(ordersWithLocation);
      groupOrdersByArea(ordersWithLocation, currentZoom);
    } else {
      // Ma'lumotlar bo'sh bo'lsa
      setOrderLocations([]);
      setLocationGroups([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orders, useDemoData]);

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

  useEffect(() => {
    if (locationGroups.length === 0) {
      // #region agent log
      fetch("http://127.0.0.1:7242/ingest/ce1c437f-4b53-45a3-b9ea-6cfa04072735", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: "debug-session",
          runId: "pre-fix-1",
          hypothesisId: "H3",
          location: "DashboardMap.tsx:locationGroups-effect",
          message: "Location groups empty",
          data: {
            groupsCount: 0,
            orderLocationsCount: orderLocations.length,
          },
          timestamp: Date.now(),
        }),
      }).catch(() => { });
      // #endregion
      return;
    }

    const hotGroups = locationGroups.filter((g) => g && g.count > 10);

    // #region agent log
    fetch("http://127.0.0.1:7242/ingest/ce1c437f-4b53-45a3-b9ea-6cfa04072735", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: "debug-session",
        runId: "pre-fix-1",
        hypothesisId: "H3",
        location: "DashboardMap.tsx:locationGroups-effect",
        message: "Location groups updated",
        data: {
          groupsCount: locationGroups.length,
          hotGroupsCount: hotGroups.length,
          hotGroupsSample: hotGroups
            .slice(0, 3)
            .map((g) => ({ lat: g.latitude, lng: g.longitude, count: g.count })),
          allGroupsSample: locationGroups
            .slice(0, 5)
            .map((g) => ({ lat: g.latitude, lng: g.longitude, count: g.count, areaName: g.areaName })),
        },
        timestamp: Date.now(),
      }),
    }).catch(() => { });
    // #endregion
  }, [locationGroups, orderLocations.length]);

  // Marker rangini aniqlash
  const getMarkerColor = (count: number) => {
    if (count > 20) return "#ef4444"; // Qizil - juda ko'p zakazlar
    if (count > 10) return "#f59e0b"; // To'q sariq - ko'p zakazlar
    if (count > 5) return "#eab308"; // Sariq - o'rtacha
    return "#22c55e"; // Yashil - kam zakazlar
  };

  // Marker o'lchamini aniqlash
  const getMarkerSize = (count: number) => {
    if (count > 20) return [50, 50];
    if (count > 10) return [40, 40];
    if (count > 5) return [35, 35];
    return [30, 30];
  };

  // Custom SVG icon yaratish
  const createCustomIcon = (count: number, color: string, size: number[]) => {
    const [width, height] = size;
    const svgIcon = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="shadow-${count}">
            <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.3"/>
          </filter>
        </defs>
        <circle cx="${width / 2}" cy="${height / 2}" r="${Math.min(width, height) / 2 - 2}" 
                fill="${color}" stroke="white" stroke-width="2.5" opacity="0.95" filter="url(#shadow-${count})"/>
        <text x="${width / 2}" y="${height / 2}" 
              text-anchor="middle" dominant-baseline="central" 
              fill="white" font-size="${Math.min(width, height) / 2.5}" font-weight="bold">
          ${count}
        </text>
      </svg>
    `;
    return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgIcon)))}`;
  };

  // Ma'lumotlar yuklanmaguncha loading ko'rsatish
  // Xaritani faqat ma'lumotlar kelgandan so'ng render qilish
  if (!useDemoData && isLoading) {
    return (
      <div
        style={{
          width: "100%",
          height: height,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f5f5f5",
          borderRadius: "8px",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              border: "4px solid #f3f3f3",
              borderTop: "4px solid #FF6701",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 16px",
            }}
          />
          <p style={{ color: "#666", fontSize: "14px" }}>Ma'lumotlar yuklanmoqda...</p>
        </div>
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    );
  }

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
      >
        <MapContent
          locationGroups={locationGroups}
          getMarkerColor={getMarkerColor}
          getMarkerSize={getMarkerSize}
          createCustomIcon={createCustomIcon}
        />
      </Map>
    </YMaps>
  );
};

export default DashboardMap;

