import { useEffect, useState, useRef } from "react";
import { Placemark } from "react-yandex-maps";

// **Silliq harakat (Yandex Taxi uslubi)**
const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

// **Masofani hisoblash (harakat yo‘nalishini aniqlash)**
const getDistance = ([lat1, lon1]: [number, number], [lat2, lon2]: [number, number]) =>
  Math.sqrt((lat2 - lat1) ** 2 + (lon2 - lon1) ** 2);

// **Teskari harakatni oldini olish**
const isMovingBackward = (prev: [number, number], next: [number, number], history: [number, number][]) => {
  if (history.length < 2) return false; // Tarix yetarli emas

  const [lastLat, lastLon] = history[history.length - 1];
  const [prevLat, prevLon] = history[history.length - 2];

  const prevDistance = getDistance([prevLat, prevLon], [lastLat, lastLon]);
  const nextDistance = getDistance([lastLat, lastLon], next);

  return nextDistance < prevDistance; // Agar yangi nuqta oldingidan yaqin bo‘lsa, orqaga qaytyapti
};

// **Harakatsizlikda tabiiy tebranish**
const getSlightMovement = ([lat, lon]: [number, number]): [number, number] => [
  lat + (Math.random() - 0.5) * 0.0001, // ±0.0001 darajada tebranadi
  lon + (Math.random() - 0.5) * 0.0001,
];

const AnimatedPlacemark = ({
  id,
  geometry,
  properties,
  options,
  duration = 4000,
  easingFunction = easeInOutCubic,
}: {
  id?: string;
  geometry: [number, number];
  properties?: any;
  options?: any;
  duration?: number;
  easingFunction?: (t: number) => number;
}) => {
  const [currentGeometry, setCurrentGeometry] = useState(geometry);
  const prevGeometryRef = useRef(geometry);
  const historyRef = useRef<[number, number][]>([]); // Oldingi harakatlar tarixi
  const animationRef = useRef<number | null>(null);
  const isAnimatingRef = useRef(false);

  useEffect(() => {
    let newGeo = geometry;
    const prevGeo = prevGeometryRef.current;
    const history = historyRef.current;

    let distance = getDistance(prevGeo, newGeo);

    // **Agar orqaga qaytgan bo‘lsa, uni qabul qilmaymiz**
    if (isMovingBackward(prevGeo, newGeo, history)) {
      console.log("⚠ Orqaga qaytish aniqlandi! Lokatsiya yangilanmadi.");
      return;
    }

    // **Agar harakat juda kichik bo‘lsa (0.0005 dan kam)**
    if (distance < 0.0005) {
      console.log("⚠ Juda kichik harakat: Sun'iy tebranish qo‘shildi!");
      newGeo = getSlightMovement(prevGeo);
      distance = getDistance(prevGeo, newGeo);
    }

    const adaptiveDuration = Math.min(5000, Math.max(2000, distance * 200000000));

    isAnimatingRef.current = true;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      let progress = Math.min(elapsed / adaptiveDuration, 1);
      progress = easingFunction(progress);

      const interpolated: [number, number] = [
        prevGeo[0] + (newGeo[0] - prevGeo[0]) * progress,
        prevGeo[1] + (newGeo[1] - prevGeo[1]) * progress,
      ];

      setCurrentGeometry(interpolated);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        isAnimatingRef.current = false;
        prevGeometryRef.current = newGeo;
        historyRef.current.push(newGeo); // Tarixga qo‘shamiz
      }
    };

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        isAnimatingRef.current = false;
      }
    };
  }, [geometry]);

  return (
    <Placemark
      key={id}
      geometry={currentGeometry}
      properties={properties}
      options={options}
    />
  );
};

export default AnimatedPlacemark;
