export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);
  console.error('Error Stack:', err.stack);
  
  // Database connection errors
  if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND' || err.code === 'ETIMEDOUT') {
    return res.status(500).json({ 
      error: 'Database connection failed. Please ensure MySQL/MariaDB is running in XAMPP and credentials are correct.',
      details: err.message 
    });
  }
  
  // Table doesn't exist error (MySQL error codes)
  if (err.code === 'ER_NO_SUCH_TABLE' || err.code === '42P01' || err.message?.includes('does not exist') || err.message?.includes("Table") && err.message?.includes("doesn't exist")) {
    return res.status(500).json({ 
      error: 'Database tables not found. Please import schema_mysql_complete.sql file using phpMyAdmin to create the required tables.',
      details: err.message,
      instructions: {
        step1: 'Open phpMyAdmin: http://localhost/phpmyadmin',
        step2: 'Select or create database: cafe_ordering',
        step3: 'Click Import tab',
        step4: 'Choose file: database/schema_mysql_complete.sql',
        step5: 'Click Go'
      }
    });
  }
  
  // Authentication errors (MySQL error codes)
  if (err.code === 'ER_ACCESS_DENIED_ERROR' || err.code === 'ER_NOT_SUPPORTED_AUTH_MODE' || err.code === '28P01') {
    return res.status(500).json({ 
      error: 'Database authentication failed. Please check your database credentials in .env file. Default XAMPP: user=root, password=(empty)',
      details: err.message 
    });
  }
  
  // Database not found error
  if (err.code === 'ER_BAD_DB_ERROR' || err.code === '3D000') {
    return res.status(500).json({ 
      error: 'Database not found. Please create the database "cafe_ordering" in phpMyAdmin.',
      details: err.message 
    });
  }
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message });
  }
  
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { details: err.stack })
  });
};

