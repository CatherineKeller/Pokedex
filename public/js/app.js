import { pokedexModule } from './pokedex.js';

export const app = {
  init: function () {
    app.addListenerToActions();
  },
  addListenerToActions() {
    const addRemovePokedexBtn = document.querySelector('.pokedex');
    if(addRemovePokedexBtn){
      addRemovePokedexBtn.addEventListener('click', pokedexModule.pokedexAddFavorites);
    }
  }
};

document.addEventListener('DOMContentLoaded', app.init );
