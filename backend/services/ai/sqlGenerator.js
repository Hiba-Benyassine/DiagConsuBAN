// services/ai/sqlGenerator.js
// Very basic SQL generator for incident handling
// Returns a simple SELECT or INSERT statement based on the provided action

/**
 * Generates a SQL statement based on the incident data.
 * @param {Object} params - { action: 'select'|'insert', table: string, data: Object }
 * @returns {string} SQL query string
 */
function generateSQL({ action, table, data }) {
  if (action === 'select') {
    const where = Object.entries(data || {})
      .map(([k, v]) => `${k} = '${v}'`)
      .join(' AND ');
    return `SELECT * FROM ${table}${where ? ' WHERE ' + where : ''};`;
  }
  if (action === 'insert') {
    const columns = Object.keys(data).join(', ');
    const values = Object.values(data)
      .map(v => `'${v}'`)
      .join(', ');
    return `INSERT INTO ${table} (${columns}) VALUES (${values});`;
  }
  throw new Error('Unsupported action for SQL generation');
}

module.exports = { generateSQL };
