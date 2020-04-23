- supprimer les modules inutiles x
- définir un cache (volume du cache paramétrable) x
- intégrer les màj (page suivante) au component tracklist (props nextPage qui prend une fonction next page et une fonction get data par exemple) / faire un nouveau component Dynamic tracklist (abandon)
- enlever les doublons dans la recherche x
- faire un component titre et artiste courant x
- mettre le activity indicator ailleurs qu'à la place du caret x (autre chose)
- redux :
	- reducer TrackPlayer (App va faire des dispatch et connecter éléments "Player", qui vont disparaitre)
		state isFetching (pour indiquer le chargement dans les éléments "Player")
		state currentTrack (pour afficher les infos dans les éléments "Player") <- prendre les infos ici (dont le thumbnail) plutôt que dans TrackPlayer
		state cache (liste de tracks avec les uri)
	- reducer history à persister
		state listenedTracks (map track => count, lastListened)
		state allRelatedTracks (map track => lastRelation, relations (video IDs où a été trouvé le track))
	utiliser les actions creator pour combiner des actions entre les 2 reducers + map dispatchtoprops
- autoplay (autoplay on ou off paramétrable)
	- ajouter automatiquement (dès le lancement d'un morceau) le premier morceau conseillé si la tracklist est vide
- afficher la liste de lecture (trackplayer queue ou state queue dans TrackPlayer reducer) et réordonnable
- playlists
	- screen playlist (stack avec tracklist ?)
	- ajouter (depuis tracklist) / supprimer(depuis screen playlist) tracks à la playlist
	- réordonner la playlist depuis screen playlist
- redux (2) :
	- reducer playlists à persister
		state savedPlaylists
- mix (radios) = playlists 

- accueil
	- derniers titres écoutés
	- titres conseillés (à découvrir) en fonction des derniers titres écoutés (allRelatedTracks moins listenedTracks)
	- titres les plus écoutés
	
- live support