const mysql = require('mysql2/promise');

async function checkTables() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: '',
      database: 'ssb1'
    });

    console.log('🔍 Checking database tables...');
    
    // Check tuyenduong table structure  
    console.log('\n� Checking tuyenduong table structure:');
    const [tuyenColumns] = await connection.execute('DESCRIBE tuyenduong');
    tuyenColumns.forEach((col) => {
      console.log(`- ${col.Field} (${col.Type}) ${col.Null === 'YES' ? 'NULL' : 'NOT NULL'}`);
    });

    // Check phuhuynh table structure  
    console.log('\n🔎 Checking phuhuynh table structure:');
    const [phColumns] = await connection.execute('DESCRIBE phuhuynh');
    phColumns.forEach((col) => {
      console.log(`- ${col.Field} (${col.Type}) ${col.Null === 'YES' ? 'NULL' : 'NOT NULL'}`);
    });

    // Check sample data from lichtrinh with JOINs
    console.log('\n� Sample data with current JOIN:');
    const [sampleData] = await connection.execute(`
      SELECT 
        l.ma_lich,
        l.ma_tuyen,
        l.ngay_chay,
        t.ten_tuyen,
        t.diem_bat_dau,
        t.diem_ket_thuc
      FROM lichtrinh l
      LEFT JOIN tuyenduong t ON l.ma_tuyen = t.ma_tuyen
      LIMIT 3
    `);
    
    console.table(sampleData);

    await connection.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkTables();