/*
 * mp3li-nodejs
 * https://github.com/paulomcnally/mp3li-nodejs
 * http://mp3.li/ to json
 * version 0.1
 * created 05/29/2013
 * last update 05/29/2013
 * Example: http://localhost/?q=mana
 */

// require
var http = require('http');
var request = require("request");
var cheerio = require("cheerio");
var fs = require('fs');
var express = require('express');

// express app instance
var app = express();

var result = [];


app.get('/', function(req, res){
	// result array json
	result = [];

	// query
	var q = req.param('q');

	if( q ){
		request({ uri: "http://mp3.li/index.php?q="+encodeURIComponent( q ),}, function(error, response, body) {
			var $ = cheerio.load(body, {ignoreWhitespace: true,xmlMode: false});

			  // Right data
			 $(".right_holder .block .playlist li").each(function() {
			 	add( $, $(this) );
			 });

			 // Left data
			 $(".left_holder .block .playlist li").each(function() {
			  add( $, $(this) );
			 });

			res.send( JSON.stringify(result) );
		});
	}
	else{
		res.send( '<a href="/?q=mana">Song from Mana</a>' );
	}

});



// Function to add object to array
function add( ch, dom_obj ){
	var _$ = cheerio.load(dom_obj.html());

	var titles = _$(".song_title a");
	// author
   var artist = titles.eq(0).html();
   // song name
   var song = titles.eq(1).html();
   // duration
   var duration = _$(".duration").html();
   // Download link
   var link = _$(".link_holder .link_content .dl_link").attr("href");

   var obj = {};
   obj.link = link;
   obj.artist = artist;
   obj.song = song;
   obj.duration = duration;

   result.push(obj);
}

app.listen(80);