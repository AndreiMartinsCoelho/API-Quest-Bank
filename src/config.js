module.exports = {
    BASE_URL: 'http://localhost:3000',
    DB_HOST:'mysql.infocimol.com.br',
    DB_USER:'root',
    DB_USER_PASS:'c1i2m3o4l5',
    DB_DATABASE:'infocimol',

    async headers(){
        return [
          {
            source: '/:path*',
            headers: [
              { key: 'Access-Control-Allow-Origin', value: '*' },
              { key: 'Access-Control-Allow-Methods', value: 'GET, POST, OPTIONS, PUT, PATCH, DELETE' },
              { key: 'Access-Control-Allow-Headers', value: 'X-Requested-With,content-type' },
              { key: 'Access-Control-Allow-Credentials', value: true },
              { key: 'x-access-token', value: 'true'},
              { key: 'perfil', value: 'admin'}
            ],    
          },
        ];
    },
};