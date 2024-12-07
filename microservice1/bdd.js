const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'mysql-projet-test.alwaysdata.net',
  user: '389773', 
  password: 'V#vfys6_BEmtb!6', 
  database: 'projet-test_micro-service'
});


connection.connect((err) => {
    if (err) {
      console.error('Erreur de connexion :', err.stack);
      return;
    }
    console.log('Connecté à la base de données MySQL');
  });
  

module.exports = connection;
