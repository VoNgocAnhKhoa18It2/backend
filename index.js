const express = require('express')
var app = require('express')();

var http = require('http').createServer(app);
var request = require('request');
var io = require('socket.io').listen(http);

const PORT = process.env.PORT || 3000;
http.listen(PORT, err => {
    if (err) console.log("ERROR: "+err)
    console.log("Server running: " + PORT);
});
app.get("",(req,res)=> {
	res.send("ĐÃ Kết Nối")
})
io.on('connection', (socket) => {
	console.log('co nguoi ket noi ' + socket.id);

	socket.on('country', (data) => {
		console.log(data);
		var url = "https://restcountries.eu/rest/v2/region/"+data;
		request(url,(err,res,body) => {
			var country = JSON.parse(body);
			var nameCountry = [];
			country.forEach(country => {
				var position = country.name.indexOf('(');
				if (position !== -1) {
					country.name = country.name.substring(0,position).trim();
				}
				nameCountry.push(country.name);
			})
			console.log(nameCountry);
			socket.emit('nameCountry', nameCountry);
		});
		socket.on("sendCountry", (data) => {
			var url = "http://api.openweathermap.org/data/2.5/weather?q="+data+"&appid=2adf20e14bd34f6b029a97c5e1188d47";
			request(url,(err,res,body) => {
				var weather = JSON.parse(body);
				socket.emit('weather', weather);
			});
		})
	});
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});