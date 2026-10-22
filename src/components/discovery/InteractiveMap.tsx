import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { PropertyListing } from '../../types';
import { useApp } from '../../context/AppContext';
import { UNIVERSITIES } from '../../data/mockData';

interface InteractiveMapProps {
  properties: PropertyListing[];
  onSelectProperty: (property: PropertyListing) => void;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  properties,
  onSelectProperty,
}) => {
  const { language, searchFilter } = useApp();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Center map around Alexandria (31.2001, 29.9187) or Cairo based on filter
    const initialCenter: [number, number] =
      searchFilter.city === 'Cairo' || searchFilter.city === 'Giza'
        ? [30.0444, 31.2357]
        : searchFilter.city === 'Tanta'
        ? [30.7937, 31.0028]
        : [31.2052, 29.9350]; // Alexandria

    const map = L.map(mapContainerRef.current, {
      center: initialCenter,
      zoom: 13,
      scrollWheelZoom: false,
    });

    mapInstanceRef.current = map;

    // Use OpenStreetMap clean tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    // Add University Markers
    UNIVERSITIES.forEach((u) => {
      const uniIcon = L.divIcon({
        className: 'custom-uni-icon',
        html: `
          <div style="background-color: #697A58; color: #fff; padding: 4px 8px; border-radius: 9999px; font-size: 11px; font-weight: bold; border: 2px solid #fff; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.2); white-space: nowrap; display: flex; align-items: center; gap: 4px;">
            🎓 <span>${language === 'ar' ? u.nameAr.split('—')[0] : u.nameEn.split('—')[0]}</span>
          </div>
        `,
        iconSize: [120, 26],
        iconAnchor: [60, 13],
      });

      L.marker([u.lat, u.lng], { icon: uniIcon })
        .addTo(map)
        .bindPopup(`<b>${language === 'ar' ? u.nameAr : u.nameEn}</b><br><span style="font-size: 11px;">${language === 'ar' ? u.governorateAr : u.governorate}</span>`);
    });

    // Add Property Markers with Bohemian Terracotta Price Tags
    const markers: L.Marker[] = [];
    properties.forEach((p) => {
      const priceIcon = L.divIcon({
        className: 'custom-property-pin',
        html: `
          <div style="background-color: #C47D60; color: #fff; padding: 5px 9px; border-radius: 12px; font-size: 12px; font-weight: bold; font-family: monospace; border: 2px solid #F8F4EC; box-shadow: 0 6px 12px rgba(118, 85, 65, 0.35); cursor: pointer; white-space: nowrap;">
            ${p.monthlyPrice.toLocaleString()} ${language === 'ar' ? 'ج.م' : 'EGP'}
          </div>
        `,
        iconSize: [80, 28],
        iconAnchor: [40, 14],
      });

      const marker = L.marker([p.location.lat, p.location.lng], { icon: priceIcon })
        .addTo(map)
        .on('click', () => {
          onSelectProperty(p);
        });

      // Bind rich popup card
      const popupHtml = `
        <div style="width: 200px; font-family: inherit; direction: ${language === 'ar' ? 'rtl' : 'ltr'};">
          <img src="${p.coverImage}" style="width: 100%; height: 110px; object-fit: cover; border-radius: 8px; margin-bottom: 6px;" />
          <h4 style="font-weight: bold; font-size: 12px; margin: 0 0 4px; color: #34332F;">${language === 'ar' ? p.titleAr : p.title}</h4>
          <p style="font-size: 11px; margin: 0 0 6px; color: #765541;">${p.location.neighborhood} · ${p.location.city}</p>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <b style="color: #765541; font-size: 13px;">${p.monthlyPrice} ${language === 'ar' ? 'ج.م' : 'EGP'}</b>
            <button id="view-prop-${p.id}" style="background: #765541; color: #fff; border: none; padding: 3px 8px; border-radius: 6px; font-size: 10px; cursor: pointer;">
              ${language === 'ar' ? 'عرض السكن' : 'View'}
            </button>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);
      marker.on('popupopen', () => {
        const btn = document.getElementById(`view-prop-${p.id}`);
        if (btn) {
          btn.onclick = () => onSelectProperty(p);
        }
      });

      markers.push(marker);
    });

    return () => {
      map.remove();
    };
  }, [properties, language, searchFilter.city]);

  return (
    <div className="w-full h-[540px] rounded-3xl overflow-hidden border border-[#E9DDCC] shadow-inner relative">
      <div ref={mapContainerRef} className="w-full h-full" />
      
      {/* Map legend */}
      <div className="absolute top-4 right-4 z-[400] bg-white/90 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-[#E9DDCC] shadow-md text-xs space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#C47D60]" />
          <span className="font-medium text-[#765541]">{language === 'ar' ? 'سكن معتمد وسعر الإيجار' : 'Verified Housing Pin'}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#697A58]" />
          <span className="font-medium text-[#765541]">{language === 'ar' ? 'مقر الجامعة / الكليات' : 'University Campus'}</span>
        </div>
      </div>
    </div>
  );
};
