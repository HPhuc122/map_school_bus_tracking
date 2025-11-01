const axios = require('axios');

async function testAPI() {
  try {
    console.log('🧪 Testing Schedules API...');
    const response = await axios.get('http://localhost:5000/api/schedules');
    
    console.log('\n📊 API Response Status:', response.status);
    console.log('📋 Response Data Structure:');
    
    if (response.data.success && response.data.data.length > 0) {
      console.log('\n🔍 First Schedule Object:');
      console.log(JSON.stringify(response.data.data[0], null, 2));
      
      console.log('\n📈 Summary of all schedules:');
      response.data.data.forEach((schedule, index) => {
        console.log(`${index + 1}. Schedule ${schedule.ma_lich}: ${schedule.ten_tuyen || 'undefined'} - Driver: ${schedule.driver_name || 'undefined'} - Bus: ${schedule.bus_number || 'undefined'}`);
      });
    } else {
      console.log('❌ No data returned or API failed');
      console.log(response.data);
    }
    
  } catch (error) {
    console.error('❌ API Test Error:', error.message);
  }
}

testAPI();