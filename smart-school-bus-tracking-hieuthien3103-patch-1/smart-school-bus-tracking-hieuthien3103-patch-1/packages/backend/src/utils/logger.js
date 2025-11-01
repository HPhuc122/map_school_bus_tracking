// utils/logger.js
// Logging utility cho debugging và monitoring

const fs = require('fs');
const path = require('path');

class Logger {
  constructor() {
    this.logDir = path.join(__dirname, '../logs');
    this.ensureLogDir();
  }

  // Tạo thư mục logs nếu chưa có
  ensureLogDir() {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  // Format timestamp
  getTimestamp() {
    return new Date().toISOString();
  }

  // Log ra console với màu sắc
  logToConsole(level, message, data = null) {
    const colors = {
      INFO: '\x1b[36m',    // Cyan
      ERROR: '\x1b[31m',   // Red
      WARN: '\x1b[33m',    // Yellow
      SUCCESS: '\x1b[32m', // Green
      DEBUG: '\x1b[35m'    // Magenta
    };
    const reset = '\x1b[0m';
    
    const timestamp = this.getTimestamp();
    const color = colors[level] || '';
    
    console.log(`${color}[${level}] ${timestamp}${reset} - ${message}`);
    if (data) {
      console.log(data);
    }
  }

  // Ghi log vào file
  logToFile(level, message, data = null) {
    const timestamp = this.getTimestamp();
    const logMessage = `[${level}] ${timestamp} - ${message}\n${
      data ? JSON.stringify(data, null, 2) + '\n' : ''
    }\n`;

    const fileName = `${new Date().toISOString().split('T')[0]}.log`;
    const filePath = path.join(this.logDir, fileName);

    fs.appendFile(filePath, logMessage, (err) => {
      if (err) console.error('Lỗi ghi log:', err);
    });
  }

  // Info log
  info(message, data = null) {
    this.logToConsole('INFO', message, data);
    if (process.env.NODE_ENV === 'production') {
      this.logToFile('INFO', message, data);
    }
  }

  // Error log
  error(message, error = null) {
    const errorData = error ? {
      message: error.message,
      stack: error.stack,
      ...error
    } : null;

    this.logToConsole('ERROR', message, errorData);
    this.logToFile('ERROR', message, errorData);
  }

  // Warning log
  warn(message, data = null) {
    this.logToConsole('WARN', message, data);
    if (process.env.NODE_ENV === 'production') {
      this.logToFile('WARN', message, data);
    }
  }

  // Success log
  success(message, data = null) {
    this.logToConsole('SUCCESS', message, data);
  }

  // Debug log (chỉ trong development)
  debug(message, data = null) {
    if (process.env.NODE_ENV === 'development') {
      this.logToConsole('DEBUG', message, data);
    }
  }

  // Log API request
  apiRequest(req) {
    const message = `${req.method} ${req.originalUrl}`;
    const data = {
      ip: req.ip,
      userAgent: req.get('user-agent'),
      body: req.method !== 'GET' ? req.body : undefined
    };
    this.info(message, data);
  }

  // Log API response
  apiResponse(req, res, duration) {
    const message = `${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`;
    
    if (res.statusCode >= 500) {
      this.error(message);
    } else if (res.statusCode >= 400) {
      this.warn(message);
    } else {
      this.info(message);
    }
  }

  // Log database query
  dbQuery(query, params, duration) {
    if (process.env.NODE_ENV === 'development') {
      this.debug(`DB Query (${duration}ms)`, { query, params });
    }
  }
}

// Export singleton instance
module.exports = new Logger();

// =====================================================
// USAGE EXAMPLES:

/*
const logger = require('../utils/logger');

// Basic logging
logger.info('Server đã khởi động', { port: 3000 });
logger.error('Lỗi kết nối database', error);
logger.warn('Dung lượng disk sắp đầy');
logger.success('Đăng nhập thành công', { userId: 123 });
logger.debug('Debug data', { someVar: 'value' });

// API logging (trong middleware)
app.use((req, res, next) => {
  const start = Date.now();
  logger.apiRequest(req);
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.apiResponse(req, res, duration);
  });
  
  next();
});

// DB query logging
const result = await db.execute(query, params);
logger.dbQuery(query, params, duration);
*/