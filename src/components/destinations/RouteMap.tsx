'use client';

import React, { useEffect, useState } from 'react';
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup, Line } from 'react-simple-maps';
import { useTranslation } from '@/lib/i18n';
import { Loader } from '@/components/ui/Loader';

// A simple world map topology
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

export const RouteMap = () => {
  const [links, setLinks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const loadLinks = async () => {
      try {
        const partnersRes = await fetch('/api/partners');
        const partnersData = await partnersRes.json();
        
        let primaryCompanyId = 17643;
        if (!Array.isArray(partnersData) && partnersData.primaryCompanyId) {
          primaryCompanyId = partnersData.primaryCompanyId;
        }

        const res = await fetch(`/api/airline-club/airlines/${primaryCompanyId}/links`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setLinks(data);
        }
      } catch (err) {
        console.error("Failed to load map data", err);
      } finally {
        setLoading(false);
      }
    };
    loadLinks();
  }, []);

  // ✅ ПЕРЕНЕСЛИ ХУК СЮДА (До раннего возврата if (loading))
  // На первом рендере links равен [], хук вернет пустой массив и не упадет.
  // Зато порядок вызова хуков во всех рендерах теперь будет строго одинаковым.
  const highlightCountries = React.useMemo(() => {
    try {
      const codes = new Set<string>();
      links.forEach(l => {
        if (l.fromCountryCode) codes.add(l.fromCountryCode);
        if (l.toCountryCode) codes.add(l.toCountryCode);
      });
      const dn = new Intl.DisplayNames(['en'], { type: 'region' });
      return Array.from(codes).map(code => dn.of(code));
    } catch (e) {
      return [];
    }
  }, [links]);

  // ⚠️ Условие отрисовки лоадера идет строго ПОСЛЕ объявления всех хуков
  if (loading) {
    return (
      <div className="w-full h-[600px] bg-neutral-light/10 border border-neutral-light/30 rounded-3xl overflow-hidden flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  // Обычные переменные и циклы — это не хуки, их можно оставлять здесь.
  // Они выполнятся только тогда, когда загрузка завершена и links заполнен.
  const airportsMap = new Map();
  links.forEach(l => {
    airportsMap.set(l.fromAirportCode, {
      code: l.fromAirportCode,
      city: l.fromAirportCity,
      coords: [l.fromLongitude, l.fromLatitude],
      isPrimary: l.fromAirportCode === 'SVO' || l.fromAirportCode === 'ZRH'
    });
    airportsMap.set(l.toAirportCode, {
      code: l.toAirportCode,
      city: l.toAirportCity,
      coords: [l.toLongitude, l.toLatitude],
      isPrimary: l.toAirportCode === 'SVO' || l.toAirportCode === 'ZRH'
    });
  });
  
  const airports = Array.from(airportsMap.values());

  return (
    <div className="w-full h-[600px] bg-neutral-light/10 border border-neutral-light/30 rounded-3xl overflow-hidden relative cursor-move">
      <ComposableMap
        projection="geoAzimuthalEqualArea"
        projectionConfig={{
          rotate: [-20, -50, 0],
          scale: 1200
        }}
        className="w-full h-full"
      >
        <ZoomableGroup center={[20, 50]} zoom={1} minZoom={1} maxZoom={5}>
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const isHighlight = highlightCountries.includes(geo.properties.name);
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={isHighlight ? "#ffe6e6" : "#ffffff"}
                    stroke={isHighlight ? "#ffb3b3" : "#ffcccc"}
                    strokeWidth={1}
                    style={{
                      default: { outline: "none" },
                      hover: { fill: "#fff5f5", outline: "none" },
                      pressed: { outline: "none" },
                    }}
                  />
                );
              })
            }
          </Geographies>

          {links.map((link, i) => (
            <Line
              key={`line-${i}`}
              from={[link.fromLongitude, link.fromLatitude]}
              to={[link.toLongitude, link.toLatitude]}
              stroke="#e93d3d"
              strokeWidth={1.5}
              strokeOpacity={0.6}
              style={{
                strokeLinecap: "round",
              }}
            />
          ))}

          {airports.map((airport) => (
            <Marker key={airport.code} coordinates={airport.coords}>
              <circle r={airport.isPrimary ? 8 : 4} fill="#e93d3d" opacity={0.8} />
              {airport.isPrimary && (
                <circle r={14} fill="#e93d3d" opacity={0.2} className="animate-ping" />
              )}
              <text
                textAnchor="middle"
                y={airport.isPrimary ? -14 : -8}
                style={{ fontFamily: "Inter, sans-serif", fontSize: airport.isPrimary ? "12px" : "10px", fontWeight: "bold", fill: "#111111" }}
              >
                {t(airport.city)}
              </text>
            </Marker>
          ))}
        </ZoomableGroup>
      </ComposableMap>
    </div>
  );
};