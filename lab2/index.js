const http = require('http');
const url = require('url');
const port = 3000;
const host = 'localhost';

const server = http.createServer(function (req, res) {
    const parsedURL = url.parse(req.url, true);
    if (parsedURL.pathname == '/echo' && parsedURL.query.message) {
        res.statusCode = 200;
        res.setHeader('Cache-control', 'no-cache');
        res.end(parsedURL.query.message);
    } else {
        res.statusCode = 404;
        res.end("Такой команды не существует");
    }
});

server.listen(port, host, function () {
    console.log(`Эхо-сервер запущен и работает на порте: ${port}`);
});