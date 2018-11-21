var Movie = function(title, rate, description, id){//konstruktor tworzocy obiekty typu film
	this.title = title;
	this.rate = rate;
	this.description = description;
	this.id = id;

	this.createLiElement = function(){//zwraca element listy
		return `
		<li id="${this.id}">
			Tytul: ${this.title} --- Ocena: ${this.rate} <br/> Opis: ${this.description}
			<button id="delete">Delete</button> | <button id="edit">Edit</button>
		</li>`;
	}
}


var Server = function(){//tworze server
	this.host = 'localhost';
	this.port = '3000';

	this.getUrl = function(enpoint){
		return `http://${this.host}:${this.port}/${enpoint}/`;
	};
}


var MoviesHelper = function(){//dodawnie usuwanie filmow
	this.server = new Server();
	this.endpoint = 'movies';

	this.getMovies = function(){
		$('#read ul').empty();//czysci strone
		$.ajax({//wykonuje ajax
		  url: this.server.getUrl(this.endpoint),//endpoint na movies
		})
		.done(function(resp) {//to co zwraca server to tablica dlatego for do stworzenie nowvego obiektu movie
			for(var i = 0; i < resp.length; i++){
				var movie = new Movie(
					resp[i]['title'],
					resp[i]['rate'],
					resp[i]['description'],
					resp[i]['id']
				);
				console.log(movie);

				$('#read ul').append(movie.createLiElement());//lista li ddaje i zwraca listę
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
			movie.id = resp['id'];//aktualizuje movie id
			$('#read ul').append(movie.createLiElement());//dodalismy id kt przyslal server
		});
	};

	this.deleteMovie = function(id){
		$.ajax({
		  url: this.server.getUrl(this.endpoint) + id + '/',//options leci z automatu
		  method: 'DELETE'//zmieniam metode na delete
		})
		.done(function(resp) {
			$('#' + id).remove();//usowam element z listy
		});
	}
}


$(document).ready(function(){
	var moviesHelper = new MoviesHelper();

	moviesHelper.getMovies();//po wejsciu na strone wywołuje sie
	

	$(document).on('click', 'form input[type="submit"]', function(e){
		e.preventDefault();//żeby się nie przeładowało
		var movie = new Movie(//tworzenie obiektu movie
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