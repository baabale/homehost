var moviesData = require('./movies.json'); // or fs.readFileSync + JSON.parse()
var musicData =  require('./music.json'); 
var tvData =  require('./tv.json'); 
const { shuffleArr } = require('../utils');

const multiPropsFilterMovies = (movie, keyword) => {
  return (movie.title.match(new RegExp(keyword, 'i')) != null ||
    movie.tagline.match(new RegExp(keyword, 'i')) != null ||
    movie.overview.match(new RegExp(keyword, 'i')) != null
    ) || (
    movie.credits.cast.some(x => x.name.match(new RegExp(keyword, 'i')) != null)
    ) || (
    movie.credits.crew.find(x => x.job === "Director").name.match(new RegExp(keyword, 'i')) != null)
}
  
const multiPropsFilterTV = (tv, keyword) => {
  return (tv.name.match(new RegExp(keyword, 'i')) != null ||
    tv.tagline.match(new RegExp(keyword, 'i')) != null ||
    tv.overview.match(new RegExp(keyword, 'i')) != null
    ) || (
    tv.seasons.some(x => x.name.match(new RegExp(keyword, 'i')) || x.overview.match(new RegExp(keyword, 'i')) != null)
    ) || (
    tv.seasons.some(x => x.episodes.some(ep => ep.name.match(new RegExp(keyword, 'i')) || ep.overview.match(new RegExp(keyword, 'i')) != null))
    ) || (
    tv.credits.cast.some(x => x.name.match(new RegExp(keyword, 'i')) != null))
}
  
const multiPropsFilterMusicSongs = (keyword) => {
  return musicData.music.map(album => album.tracks.items
    .map(song => {song.album_name = album.name; song.album_images = album.images; song.artists = album.artists; return song}))
    .flat(Infinity)
    .filter(song => song.url_path != null)
    .filter(song => song.name.match(new RegExp(keyword, 'i')) != null)
}
  
const multiPropsFilterMusicArtists = (keyword) => {
  let artists = [...new Map(musicData.music.map(music => music.artists).flat(Infinity).map(item => [item.id, item])).values()];
  return artists.filter(x => x.name.match(new RegExp(keyword, 'i')) != null)
}
  
const multiPropsFilterMusicAlbums = (keyword) => {
  return musicData.music.filter(x => x.name.match(new RegExp(keyword, 'i')) != null)
}
  
module.exports = {
  
getAbout: () => {
  const hello = {homehost: 'hello world', environment: process.env.NODE_ENV};
  return hello
},

getAllMovies: () => {
  return moviesData.movies;
},

getMostPopularMovies: () => {
  return moviesData.movies.sort((a,b) => b.popularity - a.popularity).slice(0,25);
},

getHighestRatedMovies: () => {
  return moviesData.movies.sort((a,b) => b.vote_average - a.vote_average).slice(0,25);
},

getRecentlyAddedMovies: () => {
  return moviesData.movies.sort((a,b) => new Date(b.mtime) - new Date(a.mtime)).slice(0,25);
},

getMovieGenres: () => {
  const genres = [...new Map(moviesData.movies.map(movie => movie.genres).flat(Infinity).map(item => [item.id, item])).values()];
  genres.sort((a, b) => {
    if(a.name < b.name) { return -1; }
    if(a.name > b.name) { return 1; }
    return 0;
  })
  return genres;
},

getMoviesByGenre: (name) => {
  return shuffleArr(moviesData.movies.filter(movie => movie.genres.some( genre => genre.name == name )))
},

getRandomMovie: () => {
  return moviesData.movies[Math.floor(Math.random() * moviesData.movies.length)]
},

getMovie: (id) => {
  return moviesData.movies.find(movie => movie.id == parseInt(id))
},

getAllTVShows: () => {
  return tvData.tv
},

getMostPopularTVShows: () => {
  return tvData.tv.sort((a,b) => b.popularity - a.popularity).slice(0,25)
},

getHighestRatedTVShows: () => {
  return tvData.tv.sort((a,b) => b.vote_average - a.vote_average).slice(0,25)
},

getRecentlyAddedTVShows: () => {
  return tvData.tv.sort((a,b) => b.mtime - a.mtime).slice(0,25)
},

getTVShowGenres: () => {
  const genres = [...new Map(tvData.tv.map(tv => tv.genres).flat(Infinity).map(item => [item.id, item])).values()];
  genres.sort((a, b) => {
    if(a.name < b.name) { return -1; }
    if(a.name > b.name) { return 1; }
    return 0;
  })
  return genres;
},

getTVShowsByGenre: (name) => {
  return shuffleArr(tvData.tv.filter(tv => tv.genres.some( genre => genre.name == name )))
},

getRandomTVShow: () => {
  return tvData.tv[Math.floor(Math.random() * tvData.tv.length)]
},

getTVShow: (id) => {
  return tvData.tv.find(tv => tv.id == parseInt(id))
},

getRecentlyAddedMusic: () => {
  return musicData.music.sort((a,b) => b.mtime - a.mtime).slice(0,25)
},

getAllArtists: () => {
  return [...new Map(musicData.music.map(music => music.artists).flat(Infinity).map(item => [item.id, item])).values()]
},

getAllAlbums: () => {
  return musicData.music
},

getMusicAlbum: (id) => {
  return musicData.music.find(album => album.id == id)
},

getAllSongs: () => {
  const songs = musicData.music.map(album => album.tracks.items
    .map(song => {song.album_name = album.name; song.album_images = album.images; song.artists = album.artists; return song}))
    .flat(Infinity)
    .filter(song => song.url_path != null)
  return songs
},

getMovieFilePath: (id) => {
  const file_path = moviesData.movies
    .filter(movie => movie.id == parseInt(id))
    .map(movie => movie.fs_path).toString();
  return file_path
},

getSongFilePath: (album_id, disc_number, track_number) => {
  const file_path = musicData.music
    .find(album => album.id == album_id)
    .tracks.items.filter(item => item.disc_number == parseInt(disc_number) && item.track_number == parseInt(track_number))
    .map(track => track.fs_path).toString();
  return file_path
  },

getEpisodeFilePath: (tv_id, season_number, episode_number) => {
  const file_path = tvData.tv
    .find(tv => tv.id == parseInt(tv_id)) 
    .seasons.find(season => season.season_number == parseInt(season_number))
    .episodes.find(episode => episode.episode_number == parseInt(episode_number))
    .fs_path.toString();
  return file_path
  },

searchMoviesAndTV: (keyword) => {
  let search_results = {};
  search_results.results = tvData.tv.filter(tv => multiPropsFilterTV(tv, keyword))
    .concat(moviesData.movies.filter(movie => multiPropsFilterMovies(movie, keyword)));
    search_results.count = search_results.results.length

  return search_results
},

searchMusic: (keyword) => {
  let search_results = {results: {songs:[], artists: [], albums: []}, song_count: 0, artist_count: 0, album_count: 0, total_count: 0};
  if (keyword.trim() === "" ) {
    return search_results;
  }
  search_results.results.songs = multiPropsFilterMusicSongs(keyword);
  search_results.results.artists = multiPropsFilterMusicArtists(keyword);
  search_results.results.albums = multiPropsFilterMusicAlbums(keyword);
  search_results.song_count = search_results.results.songs.length
  search_results.artist_count = search_results.results.artists.length
  search_results.album_count = search_results.results.albums.length
  search_results.total_count = Object.values(search_results.results).reduce((acc, group) => acc + group.length, 0)

  return search_results
},

getRandomMovieOrTVShow: () => {
  const item = Math.random() < (tvData.tv.length / moviesData.movies.length).toFixed(2) ? 
    tvData.tv[Math.floor(Math.random() * tvData.tv.length)] 
    : moviesData.movies[Math.floor(Math.random() * moviesData.movies.length)]
  return item
}

}