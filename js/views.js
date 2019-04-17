var ifc = {
	config: {
		rounds: 5,
		maincolor: 8, // from 0 to 8
		playercolors: [
			'purple',
			'pink',
			'indigo',
			'light-blue',
			'teal',
			'light-green',
			'amber',
			'deep-orange',
			'brown'
		]
	},
	home: {
		nicknamelabel: {
			french: 'Ton pseudo',
			english: 'Your nickname',
			spanish: 'Tu nombre'
		},
		nicknameerror: {
			french: '3 caractères minimum. Uniquement des lettres et/ou chiffres',
			english: '3 characters minimum. Only letters and/or numbers',
			spanish: '3 caracteros como minimo. Solo letras y/o numleros'
		},
		joingame: {
			french: 'Rejoindre une partie',
			english: 'Join a game',
			spanish: 'Entrar en un salon'
		},
		roomlabel: {
			french: 'ID du salon',
			english: 'Room ID',
			spanish: 'ID del salon'
		},
		roomerror: {
			french: '4 caractères. Uniquement des lettres',
			english: '4 characters. Only letters',
			spanish: '4 caracteros. Solo letras'
		},
		joinbutton: {
			french: 'REJOINDRE',
			english: 'JOIN',
			spanish: 'ENTRAR'
		},
		startgame: {
			french: 'Démarrer une nouvelle partie',
			english: 'Start a new game',
			spanish: 'Empezar un nuevo juego'
		},
		chooselanguage: {
			french: 'Choisir une langue',
			english: 'Choose a language',
			spanish: 'Elegir un idioma'
		},
		createbutton: {
			french: 'DEMARRER',
			english: 'START',
			spanish: 'EMPEZAR'
		},
		modal: {
			french: 'Un jeu fun de 3 à 9 joueurs, pour jouer sur smartphone en local avec tes amis',
			english: 'A fun game from 3 to 9 players, to play locally with your friends on your smartphones',
			spanish: ''
		}
	},
	faker: {
		youare: {
			french: "Tu es l'imposteur !",
			english: 'You are the faker !',
			spanish: 'Eres el impostor !'
		}
	},
	footerlobby: {
		title: {
			french: 'Comment jouer ?',
			english: 'How to play ?',
			spanish: 'Como se juega ?'
		},
		content: {
			french: 'DLzxrzFCyOs', // youtube link ID
			english: 'DLzxrzFCyOs',
			spanish: 'DLzxrzFCyOs'
		}
	},
	footergame: {
		french: 'Classement',
		english: 'Ranking',
		spanish: 'Puntos'
	},
	gamelist: {
		raiseq: {
			french: 'Lève la main',
			english: 'Raise your hand',
			spanish: '',
			detail: {
				french: 'Tu vas devoir lever la main... ou pas',
				english: 'You will have to raise your hand... or not',
				spanish: ''
			}
		},
		pointq: {
			french: 'Pointe la personne',
			english: 'Point at the person',
			spanish: '',
			detail: {
				french: "Tu vas devoir pointer quelqu'un (toi compris)...",
				english: 'You will have to point someone (including yourself)...',
				spanish: ''
			}
		},
		countq: {
			french: 'Lève autant de doigts',
			english: 'Hold up as many fingers',
			spanish: '',
			detail: {
				french: 'Tu vas devoir lever un certain nombre de doigts...',
				english: 'You will have to holding up a numbr of fingers...',
				spanish: ''
			}
		},
		faceq: {
			french: 'Fais ta tête',
			english: 'Make the face',
			spanish: '',
			detail: {
				french: 'Tu vas devoir faire une tête particulière...',
				english: 'You will have to make some facial expression...',
				spanish: ''
			}
		},
		wordq: {
			french: 'Un seul mot',
			english: 'Only one word',
			spanish: '',
			detail: {
				french: "Tu vas devoir n'exprimer qu'un seul mot",
				english: 'You will have to express only one word...',
				spanish: ''
			}
		}
	},
	modals: {
		noroom: {
			french: "Ce salon n'existe pas !",
			english: "This room doesn't exist !",
			spanish: 'Este salon no existe !'
		},
		closed: {
			french: 'Ce salon est fermé',
			english: 'This room is closed',
			spanish: 'Este salon esta cerrado'
		},
		full: {
			french: 'Ce salon est complet',
			english: 'This room is full',
			spanish: 'Este salon esta lleno'
		},
		noname: {
			french: 'Merci de choisir un autre nom',
			english: 'Please choose another name',
			spanish: 'Por favor elige un otro nombre'
		},
		joined: {
			french: ' a rejoint le salon',
			english: ' has joined the room',
			spanish: ' ha entrado en el salon'
		},
		left: {
			french: ' a quitté le salon',
			english: ' has left the room',
			spanish: ' ha salido del salon'
		},
		newowner: {
			french: 'Tu es le nouveau leader !',
			english: 'You are now leader !',
			spanish: 'Eres el nuevo leader !'
		}
	},
	lobby: {
		title: {
			french: 'Rejoignez le salon',
			english: 'Join the room',
			spanish: 'Entra en el salon'
		},
		startbutton: {
			french: 'Démarrer la partie',
			english: 'Start the game',
			spanish: 'Empezar el juego'
		}
	},
	start: {
		french: 'La partie va commencer !',
		english: 'The game is about to start !',
		spanish: 'El juego va a empezar !'
	},
	choosegame: {
		player: {
			french: 'A toi de choisir',
			english: 'You choose',
			spanish: 'Te toca elegir'
		},
		others: {
			french: 'est en train de choisir le jeu',
			english: 'is choosing the game',
			spanish: 'esta elegiendo el juego'
		}
	},
	ingame: {
		readq: {
			french: 'Lis pour les autres',
			english: 'Read for the others',
			spanish: 'Lee para los otros'
		},
		votebutton: {
			french: 'VOTER',
			english: 'VOTE',
			spanish: 'VOTAR'
		},
		votetitle: {
			french: "Qui est l'imposteur ?",
			english: 'Whos is the faker ?',
			spanish: 'Quien es el impostor ?'
		},
		alreadyvoted: {
			french: 'Vote déjà enregistré',
			english: 'Vote already registered',
			spanish: 'Voto ya registrado'
		},
		fakevote: {
			french: 'Fais semblant de voter',
			english: 'Pretend to vote',
			spanish: 'Pretende que estas votando'
		},
		reveal: {
			french: "L'imposteur était",
			english: 'The faker was',
			spanish: 'El impostor era'
		},
		notfound: {
			french: "L'imposteur court toujours",
			english: 'The faker is still running',
			spanish: 'El impostor sigue corriendo'
		},
		over: {
			french: 'La partie est terminée',
			english: 'The game is over',
			spanish: 'El juego esta acabado'
		}
	},
	howto: {
		1: {
			title: {
				french: 'Placement',
				english: '',
				spanish: ''
			},
			image: {
				french: '',
				english: '',
				spanish: ''
			},
			text: {
				french:
					"Les joueurs doivent se placer de manière à pouvoir s'observer correctement. La meilleure solution est généralement de se placer en rond.",
				english: '',
				spanish: ''
			}
		},
		2: {
			title: {
				french: 'La sélection du jeu',
				english: '',
				spanish: ''
			},
			image: {
				french: 'img/countq.jpg',
				english: '',
				spanish: ''
			},
			text: {
				french: '',
				english: '',
				spanish: ''
			}
		}
	}
};
