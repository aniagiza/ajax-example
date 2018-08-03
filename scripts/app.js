var Movie = function(title, rate, description, id){
	this.title = title;
	this.rate = rate;
	this.description = description;
	this.id = id;

	this.createLiElement = function(){
		return `
		<li id="${this.id}">
			Tytul: ${this.title} --- Ocena: ${this.rate} <br/> Opis: ${this.description}
			<button id="delete">Delete</button> | <button id="edit">Edit</button>
		</li>`;
	}
}


var Server = function(){
	this.host = 'localhost';
	this.port = '3000';

	this.getUrl = function(enpoint){
		return `http://${this.host}:${this.port}/${enpoint}/`;
	};
}


var MoviesHelper = function(){
	this.server = new Server();
	this.endpoint = 'movies';

	this.getMovies = function(){
		$('#read ul').empty();
		$.ajax({
		  url: this.server.getUrl(this.endpoint),
		})
		.done(function(resp) {
			for(var i = 0; i < resp.length; i++){
				var movie = new Movie(
					resp[i]['title'],
					resp[i]['rate'],
					resp[i]['description'],
					resp[i]['id']
				);
				console.log(movie);

				$('#read ul').append(movie.createLiElement());
			}
		});
	};

	this.addMovie = function(movie){
		$.ajax({
		  url: this.server.getUrl(this.endpoint),
		  method: 'POST',
		  data: {
		  	'title': movie.title,
		  	'rate': movie.rate,
		  	'description': movie.description
		  }
		})
		.done(function(resp) {
			movie.id = resp['id'];
			$('#read ul').append(movie.createLiElement());
		});
	};

	this.deleteMovie = function(id){
		$.ajax({
		  url: this.server.getUrl(this.endpoint) + id + '/',
		  method: 'DELETE'
		})
		.done(function(resp) {
			$('#' + id).remove();
		});
	}
}


$(document).ready(function(){
	var moviesHelper = new MoviesHelper();

	moviesHelper.getMovies();
	

	$(document).on('click', 'form input[type="submit"]', function(e){
		e.preventDefault();
		var movie = new Movie(
			$('#title').val(),
			$('#rate').val(),
			$('#description').val()
		)
		moviesHelper.addMovie(movie);
	});

	$(document).on('click', '#delete', function(){
		var id = $(this).parent().attr('id');
		moviesHelper.deleteMovie(id);
	});
});