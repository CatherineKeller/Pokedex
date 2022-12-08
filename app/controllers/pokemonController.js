const dataMapper = require('../datas/dataMapper');

const pokemonController = {
  allPokemons: async (req, res) => {
    try {
      let pokemons = await dataMapper.getAllPokemons();

      // Si Recherche (utilisation de la meme vue)
      // Je remplace tous les pokemons par le résultat de la recherche
      if(res.locals.searchedPokemons){
        pokemons = res.locals.searchedPokemons;
      }

      res.render('main/home', { pokemons });

    } catch (error) {
      console.trace(error);
      res.status(500).send(`Une erreur s'est produite...`);
    }
  },
  onePokemon: async (req, res, next) => {
    const numero = Number(req.params.number);
    try {
      // Récupérer les données d'1 Pokemon
      const pokemon = await dataMapper.getOnePokemon(numero);

      // Si le Pokemon existe, j'affiche les données, sinon 404
      if(pokemon){

        // Si il y a une session Pokedex et Si le Pokemon est dans la session,
        // j'ajoute "true" à la locals "pokedexActive"
        if(req.session.selectedPokemonIds){
          // Je recherche le Pokemon dans la Session
          const foundPokemonInSession = req.session.selectedPokemonIds.find(element => element.id == pokemon.id);
          if(foundPokemonInSession){
            res.locals.pokedexActive = true;
          }
        }

        // Récupérer les Types du Pokemon
        const typesPokemon = await dataMapper.getTypesPokemon(numero);

        res.render('pokemon/item', { pokemon, typesPokemon });
      } else {
        next();
      }
    } catch (error) {
      console.trace(error);
      res.status(500).send(`Une erreur s'est produite...`);
    }
  },
  // Afichage de la page "/types/"
  allTypes: async (req, res) => {
    try {
      // Je récupère tous les Types de Pokemon
      const types = await dataMapper.getAllTypes();
      res.render('pokemon/types', { types });

    } catch (error) {
      console.trace(error);
      res.status(500).send(`Une erreur s'est produite...`);
    }
  },
  // Affichage de la page "/types/:id"
  oneType: async (req, res, next) => {
    const id = Number(req.params.id);
    try {
      const type = await dataMapper.getOneType(id);

      // Si le Type existe, j'affiche les données, sinon 404
      if(type) {
        // Je récupère tous les Pokemon qui ont le type sélectionné
        const typeAllPokemons = await dataMapper.getOneTypePokemons(id);

        res.render('main/home', { pokemons: typeAllPokemons, type });
      } else {
        next();
      }
    } catch (error) {
      console.trace(error);
      res.status(500).send(`Une erreur s'est produite...`);
    }
  },
  countPokedex: (req, res, next) => {
    // Compter le nombre de Pokemon dans le Pokedex

    // Initialiser à 0
    let pokedexSession = 0;

    // Si j'ai des Pokemons dans la Session, ajouter le nombre
    if(req.session.selectedPokemonIds) {
      pokedexSession = req.session.selectedPokemonIds.length;
    }

    // Ajouter dans la locals "nbPokedex"
    res.locals.nbPokedex = pokedexSession;
    next();
  },
  renderPokedex: async (req, res) => {
    // Afficher le Pokedex (/pokedex)

    // Initialisation
    let pokemons = [];

    // Ajouter les Pokemons en session à la variable initialisée
    if(req.session.selectedPokemonIds) {
      pokemons = req.session.selectedPokemonIds;
    }

    res.render('main/home', { pokemons, pokedex: true });
  },
  addPokemon: async (req, res, next) => {
    // Ajout d'un Pokemon au Pokedex
    const pokeId = Number(req.params.numero); // ID du pokemon à ajouter

    try {
      // Rechercher le Pokemon à ajouter (avec l'id)
      const pokemon = await dataMapper.getOnePokemon(pokeId);

      // Initialiser la session du pokedex "selectedPokemonIds", si elle n'existe pas encore (tableau)
      if(!req.session.selectedPokemonIds) {
        req.session.selectedPokemonIds = [];
      }

      // Si le pokemon existe
      if(pokemon){
        // Tester si le Pokemon a déjà été ajouté et si il y a moins de 20 Pokemon dans le Pokedex
        const findAlreadyExist = req.session.selectedPokemonIds.find(element => element.id === pokeId);

        // si non je l'ajoute, si oui je ne fais rien
        if(!findAlreadyExist && req.session.selectedPokemonIds.length < 20) {
          req.session.selectedPokemonIds.push(pokemon);
        }

        // Après l'ajout, je redirige vers la page du Pokemon
        res.redirect(`/pokemon/${pokeId}`);
      } else {
        next();
      }

    } catch (error) {
      console.trace(error);
      res.status(500).send('Oups, une erreur s\'est produite...');
    }
  },
  removePokemon: (req, res) => {
    // Suppression d'un Pokemon du Pokedex
    const pokeId = Number(req.params.numero); // ID du pokemon à supprimer

    // Filtrer la session : j'enleve le Pokemon de la session "selectedPokemonIds"
    const pokedex = req.session.selectedPokemonIds.filter(pokemon => !(pokemon.numero === pokeId));
    req.session.selectedPokemonIds = pokedex; // Et je réaffecte la nouvelle valeur du Pokedex à la session

    // Je redirige vers la page du Pokemon
    res.redirect(`/pokemon/${pokeId}`);
  },
  searchPokemon: async (req, res, next) => {
    try {
      // Si je valide mon formulaire de recherche et que ma valeur n'est pas vide (?search=STRING)
      if(req.query.search){

        // Terme recherché
        const searchedTerm = req.query.search;

        // Requete de la recherche (terme recherché en minuscules)
        const searchedPokemons = await dataMapper.search(searchedTerm.toLowerCase());

        // J'ajoute aux locals "searchedPokemons" le résultat de la recherche
        res.locals.searchedPokemons = searchedPokemons;

      }
      next();

    } catch (error) {
      console.trace(error);
      res.status(500).send(`Une erreur s'est produite...`);
    }
  },
};

module.exports = pokemonController;
