# 🚌 Smart School Bus - Google Maps API Integration Guide

## 📋 Tổng quan

Hệ thống Smart School Bus với tích hợp Google Maps API để:
- 🗺️ Tạo và quản lý tuyến đường
- 📍 Thiết lập điểm đón/trả học sinh 
- 🚌 Theo dõi vị trí xe buýt real-time
- 🔔 Thông báo tự động cho phụ huynh khi xe sắp đến (trong vòng 1km)

---

## 🎯 Chức năng chính đã implement (Frontend)

### ✅ **Dashboard Components:**
- **ParentDashboard**: Dashboard cho phụ huynh theo dõi con
- **ParentNotification**: Hệ thống thông báo real-time
- **RealTimeTracking**: Giám sát GPS và trigger notifications
- **LocationTracking**: Theo dõi vị trí với tìm kiếm thông minh

### ✅ **Features đã có:**
- 🔍 Tìm kiếm xe/tuyến/tài xế
- 📊 Analytics và báo cáo
- 🎨 UI/UX responsive đẹp mắt
- ⚡ Real-time simulation
- 🔔 Notification system
- 📱 Mobile-friendly

---

## 🗺️ Google Maps API Integration Plan

### **1. API Keys cần thiết:**

```env
# .env file
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
REACT_APP_GOOGLE_DIRECTIONS_API_KEY=your_directions_api_key
REACT_APP_GOOGLE_GEOCODING_API_KEY=your_geocoding_api_key

# Backend .env
GOOGLE_MAPS_SERVER_API_KEY=your_server_side_api_key
GOOGLE_DISTANCE_MATRIX_API_KEY=your_distance_matrix_key
```

### **2. Required Google APIs:**
- ✅ **Maps JavaScript API** - Hiển thị bản đồ
- ✅ **Directions API** - Tính toán tuyến đường
- ✅ **Geocoding API** - Chuyển đổi địa chỉ ↔ tọa độ
- ✅ **Distance Matrix API** - Tính khoảng cách giữa các điểm
- ✅ **Places API** - Gợi ý địa điểm

---

## 🔧 Frontend Implementation

### **3. Install Dependencies:**

```bash
npm install @googlemaps/js-api-loader
npm install @types/google.maps
npm install react-google-maps-api
```

### **4. Google Maps Component:**

```tsx
// components/maps/GoogleMap.tsx
import { GoogleMap, LoadScript, Marker, DirectionsRenderer } from 'react-google-maps-api';

const SmartBusMap = ({ buses, routes, stops }) => {
  const [directions, setDirections] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(null);

  // Render bus markers
  const renderBusMarkers = () => {
    return buses.map(bus => (
      <Marker
        key={bus.id}
        position={{ lat: bus.latitude, lng: bus.longitude }}
        icon={{
          url: '/bus-icon.png',
          scaledSize: new window.google.maps.Size(40, 40)
        }}
        onClick={() => handleBusClick(bus)}
      />
    ));
  };

  // Render stop markers
  const renderStopMarkers = () => {
    return stops.map(stop => (
      <Marker
        key={stop.id}
        position={{ lat: stop.latitude, lng: stop.longitude }}
        icon={{
          url: '/bus-stop-icon.png',
          scaledSize: new window.google.maps.Size(30, 30)
        }}
      />
    ));
  };

  return (
    <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '500px' }}
        center={{ lat: 21.0285, lng: 105.8542 }} // Hà Nội
        zoom={13}
      >
        {renderBusMarkers()}
        {renderStopMarkers()}
        
        {directions && (
          <DirectionsRenderer
            directions={directions}
            options={{
              polylineOptions: {
                strokeColor: '#2563eb',
                strokeWeight: 4
              }
            }}
          />
        )}
      </GoogleMap>
    </LoadScript>
  );
};
```

### **5. Route Creation Component:**

```tsx
// components/routes/RouteCreator.tsx
const RouteCreator = () => {
  const [waypoints, setWaypoints] = useState([]);
  const [routeName, setRouteName] = useState('');

  const handleAddWaypoint = (address) => {
    // Geocoding address to lat/lng
    const geocoder = new window.google.maps.Geocoder();
    
    geocoder.geocode({ address }, (results, status) => {
      if (status === 'OK') {
        const location = results[0].geometry.location;
        setWaypoints(prev => [...prev, {
          id: Date.now(),
          address,
          lat: location.lat(),
          lng: location.lng(),
          type: 'pickup' // or 'dropoff'
        }]);
      }
    });
  };

  const calculateRoute = () => {
    const directionsService = new window.google.maps.DirectionsService();
    
    directionsService.route({
      origin: waypoints[0],
      destination: waypoints[waypoints.length - 1],
      waypoints: waypoints.slice(1, -1).map(point => ({
        location: { lat: point.lat, lng: point.lng },
        stopover: true
      })),
      travelMode: window.google.maps.TravelMode.DRIVING,
      optimizeWaypoints: true
    }, (result, status) => {
      if (status === 'OK') {
        setDirections(result);
        // Save route to backend
        saveRoute({
          name: routeName,
          waypoints,
          directions: result
        });
      }
    });
  };

  return (
    <div className="route-creator">
      <input 
        placeholder="Tên tuyến đường"
        value={routeName}
        onChange={(e) => setRouteName(e.target.value)}
      />
      
      <AddressInput onAddAddress={handleAddWaypoint} />
      
      <WaypointsList 
        waypoints={waypoints}
        onRemove={removeWaypoint}
        onReorder={reorderWaypoints}
      />
      
      <button onClick={calculateRoute}>
        Tạo tuyến đường
      </button>
    </div>
  );
};
```

---

## 🖥️ Backend Implementation (Node.js)

### **6. Database Schema:**

```sql
-- Routes table
CREATE TABLE routes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  total_distance DECIMAL(10,2),
  estimated_duration INT, -- minutes
  waypoints JSON, -- Array of {lat, lng, address, type}
  directions_data JSON, -- Google Directions API response
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bus stops table  
CREATE TABLE bus_stops (
  id INT PRIMARY KEY AUTO_INCREMENT,
  route_id INT,
  name VARCHAR(255) NOT NULL,
  address TEXT,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  stop_order INT,
  stop_type ENUM('pickup', 'dropoff', 'both'),
  estimated_time TIME,
  FOREIGN KEY (route_id) REFERENCES routes(id)
);

-- GPS tracking table
CREATE TABLE gps_tracking (
  id INT PRIMARY KEY AUTO_INCREMENT,
  bus_id INT,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  speed DECIMAL(5,2),
  heading DECIMAL(5,2),
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  accuracy DECIMAL(5,2),
  FOREIGN KEY (bus_id) REFERENCES buses(id)
);

-- Notification triggers table
CREATE TABLE notification_triggers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  student_id INT,
  parent_id INT,
  bus_stop_id INT,
  trigger_distance DECIMAL(5,3) DEFAULT 1.0, -- km
  notification_types JSON, -- ['sms', 'email', 'push']
  is_active BOOLEAN DEFAULT true,
  FOREIGN KEY (student_id) REFERENCES students(id),
  FOREIGN KEY (bus_stop_id) REFERENCES bus_stops(id)
);
```

### **7. Backend APIs:**

```javascript
// routes/maps.js
const express = require('express');
const router = express.Router();
const { Client } = require('@googlemaps/google-maps-services-js');
const client = new Client({});

// Create new route with waypoints
router.post('/routes', async (req, res) => {
  try {
    const { name, waypoints, optimizeRoute = true } = req.body;
    
    // Calculate route using Google Directions API
    const directionsResponse = await client.directions({
      params: {
        origin: waypoints[0],
        destination: waypoints[waypoints.length - 1],
        waypoints: waypoints.slice(1, -1),
        optimize: optimizeRoute,
        mode: 'driving',
        key: process.env.GOOGLE_DIRECTIONS_API_KEY
      }
    });
    
    // Save to database
    const route = await Route.create({
      name,
      waypoints,
      directions_data: directionsResponse.data,
      total_distance: calculateTotalDistance(directionsResponse.data),
      estimated_duration: calculateTotalDuration(directionsResponse.data)
    });
    
    res.json(route);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get route with stops
router.get('/routes/:id', async (req, res) => {
  try {
    const route = await Route.findByPk(req.params.id, {
      include: [BusStop]
    });
    res.json(route);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Real-time GPS tracking endpoint
router.post('/gps/update', async (req, res) => {
  try {
    const { busId, latitude, longitude, speed, heading } = req.body;
    
    // Save GPS data
    await GpsTracking.create({
      bus_id: busId,
      latitude,
      longitude,
      speed,
      heading
    });
    
    // Check notification triggers
    await checkNotificationTriggers(busId, latitude, longitude);
    
    // Broadcast to connected clients via WebSocket
    io.emit('bus_location_update', {
      busId,
      latitude,
      longitude,
      speed,
      heading,
      timestamp: new Date()
    });
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Notification trigger checking
async function checkNotificationTriggers(busId, lat, lng) {
  try {
    // Get active triggers for this bus route
    const triggers = await NotificationTrigger.findAll({
      where: { is_active: true },
      include: [Student, Parent, BusStop]
    });
    
    for (const trigger of triggers) {
      const distance = calculateDistance(
        lat, lng,
        trigger.BusStop.latitude,
        trigger.BusStop.longitude
      );
      
      if (distance <= trigger.trigger_distance) {
        // Send notification
        await sendNotification({
          parentId: trigger.parent_id,
          studentName: trigger.Student.name,
          busStop: trigger.BusStop.name,
          distance: distance.toFixed(1),
          estimatedTime: calculateETA(distance, 25) // 25 km/h average
        });
        
        // Mark as triggered (to avoid spam)
        await trigger.update({ is_active: false });
      }
    }
  } catch (error) {
    console.error('Error checking triggers:', error);
  }
}

module.exports = router;
```

### **8. Notification System:**

```javascript
// services/NotificationService.js
const twilio = require('twilio');
const nodemailer = require('nodemailer');
const admin = require('firebase-admin');

class NotificationService {
  constructor() {
    this.twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
    this.emailTransporter = nodemailer.createTransporter({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  async sendNotification(type, data) {
    const message = this.generateMessage(type, data);
    
    try {
      // Send SMS
      if (data.parent.phone) {
        await this.sendSMS(data.parent.phone, message);
      }
      
      // Send Email
      if (data.parent.email) {
        await this.sendEmail(data.parent.email, 'Thông báo xe buýt', message);
      }
      
      // Send Push Notification
      if (data.parent.fcmToken) {
        await this.sendPushNotification(data.parent.fcmToken, message);
      }
      
      // Save to database
      await NotificationLog.create({
        parent_id: data.parent.id,
        student_id: data.student.id,
        type,
        message,
        channels: ['sms', 'email', 'push'],
        status: 'sent'
      });
      
    } catch (error) {
      console.error('Notification error:', error);
    }
  }

  generateMessage(type, data) {
    switch (type) {
      case 'approaching_pickup':
        return `🚌 Xe ${data.busNumber} sắp đến điểm đón ${data.stopName}! Cách ${data.distance}km, dự kiến ${data.estimatedTime}`;
      case 'approaching_dropoff':
        return `🏫 ${data.studentName} sắp đến trường! Xe ${data.busNumber} cách ${data.distance}km`;
      case 'arrived':
        return `✅ Xe ${data.busNumber} đã đến ${data.stopName}. ${data.studentName} vui lòng lên xe!`;
      default:
        return 'Thông báo từ hệ thống xe buýt trường học';
    }
  }

  async sendSMS(phone, message) {
    return await this.twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE,
      to: phone
    });
  }

  async sendEmail(email, subject, message) {
    return await this.emailTransporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #2563eb;">🚌 Smart School Bus</h2>
          <p style="font-size: 16px;">${message}</p>
          <hr style="margin: 20px 0;">
          <p style="font-size: 12px; color: #666;">
            Đây là email tự động từ hệ thống xe buýt trường học.
          </p>
        </div>
      `
    });
  }

  async sendPushNotification(token, message) {
    return await admin.messaging().send({
      token,
      notification: {
        title: '🚌 Smart School Bus',
        body: message
      },
      data: {
        type: 'bus_notification',
        timestamp: new Date().toISOString()
      }
    });
  }
}

module.exports = new NotificationService();
```

---

## 🚀 Implementation Steps

### **Phase 1: Setup & Basic Integration**
1. ✅ Tạo Google Cloud Project
2. ✅ Enable required APIs
3. ✅ Generate API keys
4. ✅ Setup frontend components  
5. ✅ Install dependencies

### **Phase 2: Maps Integration**
1. 🔄 Integrate Google Maps vào LocationTracking component
2. 🔄 Tạo RouteCreator component
3. 🔄 Implement Geocoding cho address input
4. 🔄 Directions API cho route calculation

### **Phase 3: Backend Development**
1. 🔄 Setup Node.js server với Express
2. 🔄 Database schema và models
3. 🔄 Google Maps APIs integration
4. 🔄 WebSocket cho real-time updates

### **Phase 4: Notification System**
1. 🔄 SMS integration (Twilio)
2. 🔄 Email notifications (Nodemailer)
3. 🔄 Push notifications (Firebase)
4. 🔄 Distance calculation và triggers

### **Phase 5: Testing & Deployment**
1. 🔄 Unit testing
2. 🔄 Integration testing
3. 🔄 Load testing
4. 🔄 Production deployment

---

## 📱 Mobile App Integration

### **React Native Components:**
```tsx
// ParentApp.tsx - Mobile version
import MapView, { Marker } from 'react-native-maps';
import PushNotification from 'react-native-push-notification';

const ParentMobileApp = () => {
  useEffect(() => {
    // Configure push notifications
    PushNotification.configure({
      onNotification: function(notification) {
        if (notification.data.type === 'bus_notification') {
          // Handle bus notification
          showBusAlert(notification);
        }
      }
    });
  }, []);

  return (
    <MapView
      style={{ flex: 1 }}
      initialRegion={{
        latitude: 21.0285,
        longitude: 105.8542,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }}
    >
      {buses.map(bus => (
        <Marker
          key={bus.id}
          coordinate={{
            latitude: bus.latitude,
            longitude: bus.longitude
          }}
          title={bus.busNumber}
        />
      ))}
    </MapView>
  );
};
```

---

## 🔐 Security & Best Practices

### **API Security:**
- ✅ Restrict API keys by domain/IP
- ✅ Enable usage quotas
- ✅ Monitor API usage
- ✅ Use server-side keys for sensitive operations

### **Data Privacy:**
- ✅ Encrypt GPS coordinates
- ✅ GDPR compliance
- ✅ Parent consent management
- ✅ Data retention policies

---

## 💰 Cost Estimation

### **Google Maps API Pricing:**
- **Maps JavaScript API**: $7/1000 loads
- **Directions API**: $5/1000 requests  
- **Geocoding API**: $5/1000 requests
- **Distance Matrix API**: $5/1000 requests

### **Estimated Monthly Cost:**
- 100 buses × 30 days × 24 hours = 72,000 location updates
- Route planning: ~500 requests/month
- Geocoding: ~1,000 requests/month
- **Total: ~$200-300/month**

---

## 📞 Support & Resources

### **Documentation:**
- [Google Maps Platform](https://developers.google.com/maps)
- [React Google Maps API](https://react-google-maps-api-docs.netlify.app/)
- [Node.js Google Maps Services](https://github.com/googlemaps/google-maps-services-js)

### **Testing Tools:**
- GPS Simulator: [GPX Editor](https://gpx-editor.com/)
- API Testing: Postman collections
- Load Testing: Artillery.js

---

## 🎯 Next Steps

1. **Implement Google Maps vào existing components**
2. **Setup backend Node.js server**  
3. **Create route management system**
4. **Test notification triggers**
5. **Deploy và monitoring**

**Frontend đã sẵn sàng** - chỉ cần tích hợp Maps API và backend! 🚀
