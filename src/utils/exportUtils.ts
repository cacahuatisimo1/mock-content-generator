
import { GeneratedItem, OutputFormat } from '../types';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

// Convert items to JSON format
export const formatAsJson = (items: GeneratedItem[]): string => {
  return JSON.stringify(items, null, 2);
};

// Convert items to CSV format
export const formatAsCsv = (items: GeneratedItem[]): string => {
  if (items.length === 0) return '';

  const headers = Object.keys(items[0]);
  const csvRows = [];

  // Add headers
  csvRows.push(headers.join(','));

  // Add rows
  for (const item of items) {
    const values = headers.map(header => {
      const value = item[header];
      // Escape commas and quotes
      const escaped = String(value).replace(/"/g, '""');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(','));
  }

  return csvRows.join('\n');
};

// Convert items to SQL for PostgreSQL
export const formatAsPostgres = (items: GeneratedItem[]): string => {
  if (items.length === 0) return '';

  const tableName = 'language_content';
  const headers = Object.keys(items[0]);

  // Create table statement
  let sql = `CREATE TABLE IF NOT EXISTS ${tableName} (\n`;
  headers.forEach((header, index) => {
    const isNumber = typeof items[0][header] === 'number';
    const dataType = isNumber ? 'INTEGER' : 'TEXT';
    sql += `  ${header} ${dataType}${index < headers.length - 1 ? ',' : ''}\n`;
  });
  sql += ');\n\n';

  // Insert statements
  sql += `INSERT INTO ${tableName} (${headers.join(', ')}) VALUES\n`;
  items.forEach((item, itemIndex) => {
    sql += '(';
    headers.forEach((header, headerIndex) => {
      const value = item[header];
      if (typeof value === 'number') {
        sql += value;
      } else {
        // Escape single quotes for SQL
        sql += `'${String(value).replace(/'/g, "''")}'`;
      }
      if (headerIndex < headers.length - 1) {
        sql += ', ';
      }
    });
    sql += `)${itemIndex < items.length - 1 ? ',' : ';'}\n`;
  });

  return sql;
};

// Convert items to SQL for MySQL
export const formatAsMysql = (items: GeneratedItem[]): string => {
  if (items.length === 0) return '';

  const tableName = 'language_content';
  const headers = Object.keys(items[0]);

  // Create table statement
  let sql = `CREATE TABLE IF NOT EXISTS ${tableName} (\n`;
  headers.forEach((header, index) => {
    const isNumber = typeof items[0][header] === 'number';
    const dataType = isNumber ? 'INT' : 'TEXT';
    sql += `  ${header} ${dataType}${index < headers.length - 1 ? ',' : ''}\n`;
  });
  sql += ');\n\n';

  // Insert statements
  items.forEach((item) => {
    sql += `INSERT INTO ${tableName} (${headers.join(', ')}) VALUES (`;
    headers.forEach((header, headerIndex) => {
      const value = item[header];
      if (typeof value === 'number') {
        sql += value;
      } else {
        // Escape single quotes for SQL
        sql += `'${String(value).replace(/'/g, "''")}'`;
      }
      if (headerIndex < headers.length - 1) {
        sql += ', ';
      }
    });
    sql += ');\n';
  });

  return sql;
};

// Convert items to MongoDB format
export const formatAsMongodb = (items: GeneratedItem[]): string => {
  if (items.length === 0) return '';

  const collectionName = 'languageContent';

  let mongoCommands = `// MongoDB commands for collection: ${collectionName}\n\n`;
  
  // Create collection
  mongoCommands += `db.createCollection("${collectionName}");\n\n`;
  
  // Insert documents
  mongoCommands += `db.${collectionName}.insertMany([\n`;
  
  items.forEach((item, index) => {
    mongoCommands += `  ${JSON.stringify(item, null, 2)}${index < items.length - 1 ? ',' : ''}\n`;
  });
  
  mongoCommands += ']);\n';

  return mongoCommands;
};

// Generate and download file
export const downloadContent = (items: GeneratedItem[], format: OutputFormat, language: string): void => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const fileName = `language-content-${language}-${timestamp}`;

  switch (format) {
    case 'json':
      const jsonContent = formatAsJson(items);
      const jsonBlob = new Blob([jsonContent], { type: 'application/json' });
      saveAs(jsonBlob, `${fileName}.json`);
      break;
      
    case 'csv':
      const csvContent = formatAsCsv(items);
      const csvBlob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
      saveAs(csvBlob, `${fileName}.csv`);
      break;
      
    case 'excel':
      const worksheet = XLSX.utils.json_to_sheet(items);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Language Content');
      XLSX.writeFile(workbook, `${fileName}.xlsx`);
      break;
      
    case 'postgres':
      const postgresContent = formatAsPostgres(items);
      const postgresBlob = new Blob([postgresContent], { type: 'text/plain' });
      saveAs(postgresBlob, `${fileName}-postgres.sql`);
      break;
      
    case 'mysql':
      const mysqlContent = formatAsMysql(items);
      const mysqlBlob = new Blob([mysqlContent], { type: 'text/plain' });
      saveAs(mysqlBlob, `${fileName}-mysql.sql`);
      break;
      
    case 'mongodb':
      const mongodbContent = formatAsMongodb(items);
      const mongodbBlob = new Blob([mongodbContent], { type: 'text/plain' });
      saveAs(mongodbBlob, `${fileName}-mongodb.js`);
      break;
      
    default:
      console.error(`Unsupported format: ${format}`);
  }
};
