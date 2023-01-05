import { environment } from './settings.js';

export const pokedexModule = {

  /**
   * Méthode pour ajouter un favoris
   * @param {SubmitEvent} event
   */
  async pokedexAddFavorites(event) {
    event.preventDefault();
    const btnElm = event.currentTarget;
    const idPokemon = btnElm.dataset.id;
    const cls = btnElm.classList;
    const nbPokedexElm = document.getElementById('nbpokedex');
    const iconBtnElm = btnElm.querySelector('i');
    const tooltipElm = document.querySelector('.tooltiptext');
    switch (true) {
    // Add to pokedex
    case cls.contains('addtopokedex'):
      try {
        const url = `${environment.backendBaseUrl}/pokedex/add/${idPokemon}`;
        const response = await fetch(url, {
          method: 'PATCH',
        });
        const data = await response.json();
        if(data){
          btnElm.classList.remove('addtopokedex');
          btnElm.classList.add('deletefrompokedex');
          iconBtnElm.classList.remove('fa-regular');
          iconBtnElm.classList.add('fa-solid');
          nbPokedexElm.textContent = data.count;
          tooltipElm.textContent = 'Retirer du Pokedex';
        }
      } catch (error) {
        console.trace(error);
      }
      break;

      // Remove from pokedex
    case cls.contains('deletefrompokedex'):
      try {
        const url = `${environment.backendBaseUrl}/pokedex/remove/${idPokemon}`;
        const response = await fetch(url, {
          method: 'PATCH',
        });
        const data = await response.json();
        if(data){
          btnElm.classList.remove('deletefrompokedex');
          btnElm.classList.add('addtopokedex');
          iconBtnElm.classList.remove('fa-solid');
          iconBtnElm.classList.add('fa-regular');
          nbPokedexElm.textContent = data.count;
          tooltipElm.textContent = 'Ajouter au Pokedex';
        }
      } catch (error) {
        console.trace(error);
      }
      break;
    }

  }

};
