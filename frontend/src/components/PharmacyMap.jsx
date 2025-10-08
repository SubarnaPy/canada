import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const PharmacyMap = ({ pharmacies, userLocation, center, zoom = 13, onPharmacySelect }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    if (!mapRef.current) return;

    // Clean up existing map if it exists
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Determine map center with proper validation
    let mapCenter = [22.5643, 88.3693]; // Default to Kolkata
    
    if (center && Array.isArray(center) && center.length === 2 && !isNaN(center[0]) && !isNaN(center[1])) {
      mapCenter = center;
    } else if (userLocation && userLocation.latitude && userLocation.longitude && 
               !isNaN(userLocation.latitude) && !isNaN(userLocation.longitude)) {
      mapCenter = [userLocation.latitude, userLocation.longitude];
    } else if (pharmacies && pharmacies.length > 0 && pharmacies[0].location && pharmacies[0].location.coordinates) {
      const [lng, lat] = pharmacies[0].location.coordinates;
      if (!isNaN(lat) && !isNaN(lng)) {
        mapCenter = [lat, lng];
      }
    }

    // Initialize map
    mapInstanceRef.current = L.map(mapRef.current).setView(mapCenter, zoom);

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(mapInstanceRef.current);

    // Clear markers array
    markersRef.current = [];

    // Add user location marker only if userLocation is valid
    if (userLocation && userLocation.latitude && userLocation.longitude && 
        !isNaN(userLocation.latitude) && !isNaN(userLocation.longitude)) {
      const userMarker = L.marker([userLocation.latitude, userLocation.longitude], {
        icon: L.divIcon({
          className: 'user-location-marker',
          html: '<div style="background-color: #3b82f6; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
          iconSize: [20, 20],
          iconAnchor: [10, 10]
        })
      }).addTo(mapInstanceRef.current);
      
      userMarker.bindPopup('<strong>Your Location</strong>');
      markersRef.current.push(userMarker);
    }

    // Add pharmacy markers
    if (pharmacies && pharmacies.length > 0) {
      pharmacies.forEach((pharmacy, index) => {
        if (pharmacy.location && pharmacy.location.coordinates) {
          const [lng, lat] = pharmacy.location.coordinates;
          
          // Create custom pharmacy icon
          const pharmacyIcon = L.divIcon({
            className: 'pharmacy-marker',
            html: `
              <div style="
                background-color: #10b981; 
                color: white; 
                width: 30px; 
                height: 30px; 
                border-radius: 50%; 
                border: 3px solid white; 
                box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                font-size: 12px;
              ">
                +
              </div>
            `,
            iconSize: [30, 30],
            iconAnchor: [15, 15]
          });

          const marker = L.marker([lat, lng], { icon: pharmacyIcon })
            .addTo(mapInstanceRef.current);

          // Create popup content
          const isOpen = pharmacy.operatingHours ? 
            pharmacy.operatingHours.some(h => h.is24Hours) || 
            pharmacy.operatingHours.some(h => {
              const now = new Date();
              const today = now.getDay();
              return h.day === today && !h.is24Hours;
            }) : false;

          const popupContent = `
            <div style="min-width: 200px;">
              <h3 style="margin: 0 0 8px 0; font-weight: bold; color: #374151;">${pharmacy.name}</h3>
              <p style="margin: 0 0 4px 0; color: #6b7280; font-size: 14px;">${
                typeof pharmacy.address === 'object' 
                  ? `${pharmacy.address.street}, ${pharmacy.address.city}, ${pharmacy.address.state} ${pharmacy.address.zipCode}`
                  : pharmacy.address
              }</p>
              ${pharmacy.distance ? `<p style="margin: 0 0 4px 0; color: #6b7280; font-size: 14px;">📍 ${pharmacy.distance} km away</p>` : ''}
              ${pharmacy.contact?.phone ? `<p style="margin: 0 0 4px 0; color: #6b7280; font-size: 14px;">📞 ${pharmacy.contact.phone}</p>` : ''}
              <div style="margin: 8px 0; display: flex; gap: 4px; flex-wrap: wrap;">
                <span style="background-color: ${isOpen ? '#10b981' : '#ef4444'}; color: white; padding: 2px 8px; border-radius: 12px; font-size: 12px;">
                  ${isOpen ? 'Open' : 'Closed'}
                </span>
                ${pharmacy.rating?.averageRating ? `<span style="background-color: #f59e0b; color: white; padding: 2px 8px; border-radius: 12px; font-size: 12px;">⭐ ${Number(pharmacy.rating.averageRating).toFixed(1)}</span>` : ''}
              </div>
              <button 
                onclick="window.selectPharmacy && window.selectPharmacy('${pharmacy._id}')"
                style="
                  background-color: #3b82f6; 
                  color: white; 
                  border: none; 
                  padding: 6px 12px; 
                  border-radius: 4px; 
                  cursor: pointer; 
                  font-size: 12px;
                  margin-top: 8px;
                "
              >
                View Details
              </button>
            </div>
          `;

          marker.bindPopup(popupContent);
          
          // Add click handler
          marker.on('click', () => {
            if (onPharmacySelect) {
              onPharmacySelect(pharmacy);
            }
          });

          markersRef.current.push(marker);
        }
      });

      // Fit map to show all markers
      if (markersRef.current.length > 0) {
        const group = new L.featureGroup(markersRef.current);
        mapInstanceRef.current.fitBounds(group.getBounds().pad(0.1));
      }
    }

    // Set up global callback for popup buttons
    window.selectPharmacy = (pharmacyId) => {
      const pharmacy = pharmacies.find(p => p._id === pharmacyId);
      if (pharmacy && onPharmacySelect) {
        onPharmacySelect(pharmacy);
      }
    };

    return () => {
      // Clean up global callback
      delete window.selectPharmacy;
    };
  }, [pharmacies, userLocation, center, zoom, onPharmacySelect]);

  // Cleanup effect for component unmount
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      delete window.selectPharmacy;
    };
  }, []);

  // Update map center when location changes (separate effect to avoid full re-initialization)
  useEffect(() => {
    if (mapInstanceRef.current && (center || userLocation)) {
      let newCenter;
      if (center && Array.isArray(center) && center.length === 2 && !isNaN(center[0]) && !isNaN(center[1])) {
        newCenter = center;
      } else if (userLocation && userLocation.latitude && userLocation.longitude && 
                 !isNaN(userLocation.latitude) && !isNaN(userLocation.longitude)) {
        newCenter = [userLocation.latitude, userLocation.longitude];
      }
      
      if (newCenter) {
        mapInstanceRef.current.setView(newCenter, zoom);
      }
    }
  }, [center, userLocation, zoom]);

  return (
    <div 
      ref={mapRef} 
      style={{ 
        height: '400px', 
        width: '100%', 
        borderRadius: '8px',
        border: '1px solid #e5e7eb'
      }} 
    />
  );
};

export default PharmacyMap;