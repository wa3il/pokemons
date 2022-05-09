/* ******************************************************************
 * Constantes de configuration
 * ****************************************************************** */
//const apiKey = "6728f7dc-119d-4db8-914e-cc2954355b14"; //"69617e9b-19db-4bf7-a33f-18d4e90ccab7";
const serverUrl = "https://lifap5.univ-lyon1.fr";

/* ******************************************************************
 * Gestion de la boîte de dialogue (a.k.a. modal) d'affichage de
 * l'utilisateur.
 * ****************************************************************** */





/**
 * Fait une requête GET authentifiée sur /whoami
 * @returns une promesse du login utilisateur ou du message d'erreur
 */
function fetchWhoami(apiKey) {
  console.log(apiKey);

  return fetch(serverUrl + "/whoami", { headers: { "Api-Key": apiKey } })
    .then((response) => {
      if (response.status === 401) {
        return response.json().then((json) => {
          console.log(json);
          return { err: json.message };
        });
      } else {
        return response.json();
      }
    })
    .catch((erreur) => ({ err: erreur }));
}






/**
 * Fait une requête sur le serveur et insère le login dans la modale d'affichage
 * de l'utilisateur puis déclenche l'affichage de cette modale.
 *
 * @param {Etat} etatCourant l'état courant
 * @returns Une promesse de mise à jour
 */
function lanceWhoamiEtInsereLogin(etatCourant) {
  const erreur = `
  <section class="modal-card-body">
  <p id="elt-affichage-login">
    <div id="affiche-erreur">
      <div class="notification is-danger">
        Api non reconnue ! veuillez recommencer !
      </div>
    </div>
  </p>
  </section>
  ` ;

  return fetchWhoami(etatCourant.apiKey).then((data) => {
    majEtatEtPage(etatCourant, {
      login: data.user, // qui vaut undefined en cas d'erreur
      errLogin: data.err, // qui vaut undefined si tout va bien
      loginModal: false, // on affiche la modale
    });
    if (data.user == undefined) {
      majEtatEtPage(etatCourant, { loginModal: true });
      document.getElementById('affiche-erreur').innerHTML = erreur;

    }
    else {
      majEtatEtPage(etatCourant, { loginModal: false, login: data.user });
      alert(`Connexion réussie. Utilisateur : ${data.user}`);
    }
  });
}





/**
 * Fonction permettant de renvoyer une liste HTML d'un tableau entré en parametre
 * si on veut afficher les numéro dans l'ordre on met {i+1} a la place de {pokemon[i].PokedexNumber}
 */
function liste_pokemon(pokemon) {
  //console.debug(`CALL liste_pokemon([${pokemon}])`);

  const pokemon_html = pokemon
    .map((opt, i) => `<tr id ="${pokemon[i].Name}" ${i == 0 ? 'class="is-selected"' : ''}>
  <td><img src=${pokemon[i].Images.Detail} width="64"/></td>
  <td>${pokemon[i].PokedexNumber}</td>
  <td><div class="content">${pokemon[i].Name}</div>  </td>
  <td> ${pokemon[i].Abilities} </td>
  <td> ${pokemon[i].Types} </td>
  </tr>`)
    .join('\n');
  return `${pokemon_html}`;
}





/**
 * Genere une liste d'abilite
 * @param {*} Unpokemon un pokemon quelconque 
 * @returns une liste html des abilités du pokemon
 */
function genere_abilite(Unpokemon){
  const obj_abilite = Unpokemon.Abilities;
  return obj_abilite.map((ab) => `<li> ${ab} </li>`).join('\n');

}




/**
 * Genere une liste des elements contre lesquelle le pokemon resist bien
 * @param {*} Unpokemon un pokemon quelconque 
 * @returns une liste html des resistance du pokemon
 */
function genere_resist(Unpokemon){
  const obj_resist = Unpokemon.Against;
  const obj_resist_tab = Object.entries(obj_resist)
    .filter(([elem, value]) => value < 1)
    .map((res) => `<li> ${res[0]} </li>`).join('\n');
  return obj_resist_tab;
}




/**
 * Genere une liste des elements contre lesquelle le pokemon resiste moins 
 * @param {*} Unpokemon un pokemon quelconque 
 * @returns une liste html des faiblesse du pokemon
 */
function genere_faiblesse(Unpokemon){
  const obj_weak = Unpokemon.Against;
  const obj_weak_list = Object.entries(obj_weak)
    .filter(([elem, value]) => value > 1)
    .map((res) => `<li> ${res[0]} </li>`).join('\n');
  return obj_weak_list;
}



/**
 * fonction permettant de crer une liste de detail
 * @param Unpokemon un pokemon
 * @returns le header de la carte des details
 */
function card_header(Unpokemon){
  return html =
  `<div  class="card">
<div class="card-header">
<div id="num">${Unpokemon.PokedexNumber}</div>
  <div class="card-header-title">${Unpokemon.JapaneseName} (#${Unpokemon.PokedexNumber})</div>
</div>
<div class="card-content">
  <article class="media">
    <div class="media-content">
      <h1 class="title">${Unpokemon.Name}</h1>
    </div>
  </article>
</div>`
}



/* @returns le contenue en html de la carte des details */
function card_content(Unpokemon){
  return html =`
  <div class="card-content">
    <article class="media">
      <div class="media-content">
        <div class="content has-text-left">
          <p>Hit points: ${Unpokemon.Hp}</p>
          <h3>Abilities</h3>
          <ul>
            ${genere_abilite(Unpokemon)}
          </ul>
          <h3>Resistant against</h3>
          <ul>
            ${genere_resist(Unpokemon)}
          </ul>
          <h3>Weak against</h3>
          <ul>
            ${genere_faiblesse(Unpokemon)}
          </ul>
        </div>
      </div>
      <figure class="media-right">
        <figure class="image is-475x475">
          <img
            class=""
            src=${Unpokemon.Images.Detail}
            alt="${Unpokemon.Name}"
          />
        </figure>
      </figure>
    </article>
  </div>`
}

/* @returns le footer en html de la carte des details */
function card_footer(Unpokemon){
  return html = `
  <div class="card-footer">
  <article class="media">
    <div id="affiche_ajout" class="media-content">
    </div>
  </article>
</div>
</div>`
}



/**
 * cette fonction affiche la carte detail pour un pokemon selectionner
 * @param {*} Unpokemon un pokemon
 * @returns la carte html d'un pokemon
 */
function pokemonDetail(Unpokemon) {
  
  return html = card_header(Unpokemon) 
  + card_content(Unpokemon) 
  + card_footer(Unpokemon);
  
}






/**
 * Fonction permettant l'intégration d'un code HTML dans une destination(id)
 */
function afficher(codeHTML, destination) {
  document.getElementById(destination).innerHTML = codeHTML;
}




/** 
 * Fonction qui renvoi le code HTML de la colonne Image
 */
function colonneImage() {
  const html = `<th><span>Image</span></th>
            <th id = "number-pokemon">
              <span class="icon"><span>#&nbsp</span><i class="fas fa-angle-up"></i></span>
            </th>`
  return html;
}

/** 
 * Fonction qui renvoi le code HTML de la colonne Pokemon
 */
function colonnePokemon() {
  const html = `<th id="name-pokemon">
                  <span>Name</span>
                  <span class="icon"><i class="fas fa-angle-up"></i></span>
                </th>`
  return html;
}


/** 
 * Fonction qui renvoi le code HTML de la colonne Abilities
 */
function colonneAbilities() {
  const html = `<th id="abilite-pokemon">
                  <span>Abilities</span>
                  <span class="icon"><i class="fas fa-angle-up"></i></span>
                </th>`
  return html;
}


/** 
 * Fonction qui renvoi le code HTML de la colonne Types
 */
function colonneTypes() {
  const html = `<th id="types-pokemon">
                  <span>Types</span>
                  <span class="icon"><i class="fas fa-angle-up"></i></span>
                </th>`
  return html;
}


/** 
 * Fonction qui renvoi le code HTML des boutons More et Less
 */
function generePlusMoins()
{
  const html= `<span class="icon ">
                <button class="button is-normal is-rounded is-responsive fas fa-arrow-up" id="btnMoins" > Less </button>
                <button class="button is-normal is-rounded is-responsive fas fa-arrow-down" id="btnPlus" > More </button>
              </span>`
  return html;
}




/**
 * Fonction permettant l'affichage des noms des colonnes de la table avec un body vide ou on integrera les éléments du tableau
 * ainsi que l'affichage des bouton "More" et "Less" en bas du tableau
 */
function affichage_table() {
  const html = `<table class="table">
                  <thead>
                    <tr>
                      ${colonneImage()}
                      ${colonnePokemon()}
                      ${colonneAbilities()}
                      ${colonneTypes()}
                    </tr>
                  </thead>
                  <tbody id="test">
                  </tbody>
                </table>
                <div class="columns is-centered">
                  ${generePlusMoins()}
                </div>`

  afficher(html, 'tbl-pokemons');
}




/**
 * Fonctions qui renvoi le code HTML des boutons "Tous les pokemons" et "Mes pokemons" 
*/
function BoutonPokdeck(){
  const html= `<li class="is-active" id="tab-all-pokemons">
                  <a>Tous les pokemons</a>
                </li>
                <li id="tab-tout">
                  <a>Mes pokemons</a>
                </li>`
  return html;
}

/**
 * Fonction permettant l'affichage des boutons au dessus de la table "Tous les pokemons" et "Mes pokemons"
 */
function affichage_header_table() {
  const html = `
  <div class="columns">
    <div class="column">
      <div class="tabs is-centered">
        <ul>
          ${BoutonPokdeck()}
        </ul>
      </div>
      <div id="tbl-pokemons">
      </div>
    </div>
    <div class="column">
      <div class="card" id="detail-pokemon">
      </div>
    </div>`

  afficher(html, 'combat-de-pokemon');
}






/**
 * Fonction permettant de charger les données du server /Pokemons et les afficher grave a l'appel des fonctions AfficherPlus (More) AfficherMoins(Less)
 * 
 */
function affichage_pokemon_tab(etatCourant) {


  console.debug(`affichage des pokemons`);
  charge_donnees(serverUrl + "/pokemon", (pokemon) => {
    AfficherPlus(pokemon, 0,etatCourant);
    AfficherMoins(pokemon, 10,etatCourant);
    chercher(pokemon);
    tri(pokemon);

    //affichage du detail du premier pokemon
    afficher(pokemonDetail(pokemon[0]), 'detail-pokemon');
  }
  )
}






/**
 *  fonction permettant de charger des données depuis une ressource séparée
 * @param {url} url une url
 * @returns Une promesse
 */
function charge_donnees(url, callback) {
  return fetch(url)
    .then((response) => { console.log(response); return response.text() })
    .then((txt) => { console.log("abdel"); return JSON.parse(txt) })
    .then(callback)
    .catch((erreur) => ({ err: erreur }));
}







/**
 * Fonction mettre a jour l'affichage des pokemons, de la recherche et tri
 */
function maj_pokemon(pokemon,etatCourant) {
  console.debug(`CALL maj pokemon`);
  afficher(liste_pokemon(pokemon), 'test');

  
  //met a jour l'element appuyer(séléctionner en bleu) en mettant a jour le nom de sa classe et en rénitialsant l'ancien
  pokemon.forEach((pok, i) => {
    const element = document.getElementById('' + pok.Name);
    element.onclick = () => {
      pokemon.map((opt) => document.getElementById('' + opt.Name).className = " ");
      element.className = "is-selected";
      afficher(pokemonDetail(pok), 'detail-pokemon');
      maj_bouton_ajouter(etatCourant);
    }
  })

  //chercher(pokemon);
  //tri(pokemon);

}




/**
 * Fonction qui filtre les noms des pokemons et qui permet l'utilisation des lettres majuscule
 */
function chercher_dans(pokemon, mot) {
  const tri = pokemon.filter((pok) => pok.Name.toLowerCase().includes(mot));
  return tri;

}



/**
 * Fonction qui appelle chercher_dans() en utilisant l'input et affiche la liste de recherche
 */
function chercher(pokemon) {
  document.getElementById('input-pokemon').oninput = () => {
    const cherche_liste = chercher_dans(pokemon, document.getElementById('input-pokemon').value);
    maj_pokemon(cherche_liste);
    tri(cherche_liste);
  

  }


}







/**
 * Fonction qui regroupe tout les tris par nom, numero,abilités et types
 */
function tri(pokemon) {
  tri_name(pokemon);
  tri_pokedex_number(pokemon);
  tri_abilite_liste(pokemon);
  tri_types_liste(pokemon);
}





/**
 * Fonction qui effectur le tri par noms
 */
function tri_name(pokemon) {
  html_ordre_alpha = `<span>Name</span>#&nbsp
  <span class="icon"><i class="fas fa-angle-up"></i></span>`

  html_ordre_Nalpha = `<span>Name</span>#&nbsp
  <span class="icon"><i class="fas fa-angle-down"></i></span>`

  document.getElementById('name-pokemon').onclick = () => {
    const pokemon_premier = pokemon[0].Name;
    const liste_trie = pokemon;
    const tri_nom = liste_trie.sort((a, b) => { return a.Name.localeCompare(b.Name) });

    if (pokemon_premier == tri_nom[0].Name) {
      maj_pokemon(tri_nom.reverse());
      document.getElementById('name-pokemon').innerHTML = html_ordre_alpha;
    }
    else {
      maj_pokemon(tri_nom);
      document.getElementById('name-pokemon').innerHTML = html_ordre_Nalpha;
    }
  }
}





/**
 * Fonction qui effectur le tri par numéro
 */
function tri_pokedex_number(pokemon) {
  html_ordre_decroissant = `<span class="icon"><span>#&nbsp</span><i class="fas fa-angle-up"></i></span>`

  html_ordre_croissant = `<span class="icon"><span>#&nbsp</span><i class="fas fa-angle-down"></i></span>`

  document.getElementById('number-pokemon').onclick = () => {
    const pokemon_premier = pokemon[0].PokedexNumber;
    const liste_trie = pokemon;
    const tri_number = liste_trie.sort((a, b) => { return parseFloat(a.PokedexNumber) - parseFloat(b.PokedexNumber); });

    if (pokemon_premier == tri_number[0].PokedexNumber) {
      maj_pokemon(tri_number.reverse());
      document.getElementById('number-pokemon').innerHTML = html_ordre_decroissant;
    }
    else {
      maj_pokemon(tri_number);
      document.getElementById('number-pokemon').innerHTML = html_ordre_croissant;
    }
  }
}







/**
 * Fonction qui effectur le tri par abilités
 */
function tri_abilite_liste(pokemon) {
  html_ordre_abilite = `<span>Abilities</span>
  <span class="icon"><i class="fas fa-angle-up"></i></span>`

  html_ordre_Nabilte = `<span>Abilities</span>
  <span class="icon"><i class="fas fa-angle-down"></i></span>`

  document.getElementById('abilite-pokemon').onclick = () => {
    const pokemon_premier = pokemon[0].Abilities;
    const liste_trie = pokemon;
    const tri_abilite = liste_trie.sort((a, b) => {
      if (a.Abilities < b.Abilities) { return -1; }
      if (a.Abilities > b.Abilities) { return 1; }
      return 0;
    });

    if (pokemon_premier == tri_abilite[0].Abilities) {
      maj_pokemon(tri_abilite.reverse());
      afficher(html_ordre_Nabilte, 'abilite-pokemon');
    }
    else {
      maj_pokemon(tri_abilite);
      document.getElementById('abilite-pokemon').innerHTML = html_ordre_abilite;
    }
  }
}







/**
 * Fonction qui effectur le tri par type
 */
function tri_types_liste(pokemon) {
  html_ordre_types = `<span>Types</span>
  <span class="icon"><i class="fas fa-angle-up"></i></span>`

  html_ordre_Ntypes = `<span>Types</span>
  <span class="icon"><i class="fas fa-angle-down"></i></span>`

  document.getElementById('types-pokemon').onclick = () => {
    const pokemon_premier = pokemon[0].Types;
    const liste_trie = pokemon;
    const tri_types = liste_trie.sort((a, b) => {
      if (a.Types < b.Types) { return -1; }
      if (a.Types > b.Types) { return 1; }
      return 0;
    });

    if (pokemon_premier == tri_types[0].Types) {
      maj_pokemon(tri_types.reverse());
      afficher(html_ordre_types, 'types-pokemon');
    }
    else {
      maj_pokemon(tri_types);
      afficher(html_ordre_Ntypes, 'types-pokemon');
    }
  }
}









//Création d'un tableau vide en dehors de la fonction pour eviter de le vider a cause de la récursivité
const tab = [];


/**
 * Fonction qui limite l'affichage a 10 par 10 en appuyant sur "More"
 */
function AfficherPlus(pokemon, index, etatCourant) {

  Array.prototype.push.apply(tab, pokemon.slice(index, index + 10));
  const html = liste_pokemon(tab);
  afficher(html, 'test');
  maj_pokemon(pokemon.slice(0, 10), etatCourant);
/*   chercher(pokemon.slice(0, 10));
  tri(pokemon.slice(0, 10)); */
  const bouton = document.getElementById("btnPlus");
  bouton.onclick = () => {

    AfficherPlus(pokemon, index + 10,etatCourant);
    maj_pokemon(tab, etatCourant);
/*     chercher(tab);
    tri(tab); */

  };

}


/**
 * Fonction qui baisse l'affichage en appuyant sur "Less"
 */
function AfficherMoins(pokemon, index, etatCourant) {


  if (tab.length > 10) { tab.splice(-10, index); }

  maj_pokemon(tab, etatCourant);
  chercher(tab);
  tri(tab);
  const html = liste_pokemon(tab);
  const bouton = document.getElementById("btnMoins");
  bouton.onclick = () => {
    AfficherMoins(tab, index, etatCourant);
    maj_pokemon(tab, etatCourant);
 /*    chercher(tab);
    tri(tab); */
  };

}





/**
 * Fonction permettant d'afficher le deck d'un utilisateur si l'etatCourant !== undefined , sinon affiche a l'utilsateur la modale de connexion pour qu'il puisse entrer son ApiKey
 */
function Pokedex_main(etatCourant) {
  affichage_header_table();

  document.getElementById('tab-all-pokemons').onclick = () => affichage_pokemon_tab(etatCourant);
  document.getElementById('tab-tout').onclick = () => {
    if (etatCourant.login == undefined) {
      majEtatEtPage(etatCourant, { loginModal: true });
    }
    else { affichage_deck(etatCourant); }
  }

}





function maj_bouton_ajouter(etatCourant){
  const idNum = document.getElementById('num');
  const htmlr =  `<button id="retirer" class="is-danger button" tabindex="0">
                    Retirer de mon deck
                </button>` 
  
  const htmla =  `<button id="ajouter" class="is-success button" tabindex="0">
                    Ajouter a mon deck
                 </button>` 
                 
  if(etatCourant.login !== undefined){

    if(etatCourant.deck.includes(idNum.value)){

    afficher(htmla, 'affiche_ajout');
    //console.log("")
    }
  }
  else{

    //afficher(htmlr, 'affiche_ajout');

  }

    



}




/**
 * Méthode GET qui êrmet de récuperer le deck de l'utilisateur sur le server LIFAP5
 */
function fetchDeck(etatCourant) {
  console.debug(`deck`);
  console.log(etatCourant.login);
  return fetch(
    serverUrl + "/deck/" + etatCourant.login,
    { headers: { "Api-Key": etatCourant.apiKey } })
    .then((response) => {
      if (response.status === 401) {
        return response.json().then((json) => {
          console.log(json);
          return { err: json.message };
        });
      } else {
        return response.json();
      }
    })
    .catch((erreur) => ({ err: erreur }));
}




/**
 * Fonction qui appelle la fonction fetchDeck qui nous renvoi le deck de l'utilisateur pour filtrer la table des pokemons initiale 
 * puis afficher les détails des pokémons qui ont le meme numéro que ceux dans le Deck dans l'onglet Mes pokémons.
 */
function affichage_deck(etatCourant) {
  return fetchDeck(etatCourant)
    .then((data) => {
      const tabDeck = [];
      data.forEach((x) => tabDeck.push(x));
      majEtatEtPage(etatCourant, {deck : tabDeck});
      console.log(etatCourant.deck);

      charge_donnees(serverUrl + "/pokemon", (pokemon) => {
        affichage_table();
        const pokemon_deck = pokemon.filter((pok) => data.some((deck) => deck == pok.PokedexNumber));
        maj_pokemon(pokemon_deck);
      });

    })
}











function PostDeck(deck) {
const api_Key = document.getElementById("api-key").value;
  return fetch(serverUrl + "/deck", {
    method: 'POST',
    headers: {
      "Api-Key": api_Key,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(deck),
  })
    .then((response) => response.json())
    .then((json) => {
      console.log({ json });
      return json;
    })
    .catch((erreur) => (console.log({ erreur })));
}



function pushDeck(etatCourant, pok){
  fetchDeck(etatCourant.login)
  .then((i) => {
    Array.prototype.push.apply(pok);

  })
  PostDeck(pok);
}



/**
 * Fonction qui retourne le HTML la page combat
 */
function affichage_combat() {
  const html = ` 
  <div class="container is-fullhd">
      <div class="columns is-centered">
          <h1 class="title">Lancer un combat</h1>
      </div>
      <div class="columns is-centered">
          <button id="combat"class="button is-primary">lancer</button>
      </div>
      <div class="box" id= "resulat">
      </div>
    </div>
  </div> 
  `

  return html;
}




/**
 * Fonction qui récupere grace a la méthode GET sur /fight le résultat du combat
 */
function postPokemonCombat(apiKey) {
  return fetch(serverUrl + "/fight", {
    method: 'POST',
    headers: { "Api-Key": apiKey }
  })
    .then((response) => {
      if (response == "Api-Key requis") {
        console.log("Veuillez vous connectez à l'aide de votre Api-Key")
      }
      else {
        return response.json();
      }
    });
}





/**
 * Fonction qui affiche dans la box le résultat du combat "le gagnant"
 */
function resultatCombat(etatCourant) {
  document.getElementById('combat').onclick = () => {
    if (etatCourant.apiKey == undefined) {
      alert(`vous n'etes plus connectée`);
    } else {
      return postPokemonCombat(etatCourant.apiKey).then((data) => {
        console.log(data.Winner);
        if (data.Winner === "right") {
          console.log("Le gagnant est : " + data.DeckRight.User);
          afficher(`<p id="fightresult"> ⚔️ Le gagnant est:   ${data.DeckRight.User}   ⚔️</p>`, 'resulat');
        }
        else {
          console.log("Le gagnant est : " + data.DeckLeft.User);
          afficher(`<p id="fightresult"> ⚔️ Le gagnant est:  ${data.DeckLeft.User}  ⚔️</p>`, 'resulat');
        }
      })
    }
  }

}





/**
 * Génère le code HTML du corps de la modale de login. On renvoie en plus un
 * objet callbacks vide pour faire comme les autres fonctions de génération,
 * mais ce n'est pas obligatoire ici.
 * @param {Etat} etatCourant
 * @returns un objet contenant le code HTML dans le champ html et un objet vide
 * dans le champ callbacks
 */
function genereModaleLoginBody(etatCourant) {
  const text =
    etatCourant.errLogin !== undefined
      ? etatCourant.errLogin
      : etatCourant.login;
  return {
    html: `
    <section class="modal-card-body">
    <div class="field">
      <p class="control has-icons-left">
        <input id="api-key" class="input" type="password" placeholder="API-KEY">
          <span class="icon is-small is-left">
            <i class="fas fa-lock"></i>
          </span>
      </p>
    </div>

    <div  id="elt-affichage-login" >
      <p id="affiche-erreur">
      </p>
    </div>

  </section>`
    ,
    callbacks: {}
  }
};







/**
 * Génère le code HTML du titre de la modale de login et les callbacks associés.
 *
 * @param {Etat} etatCourant
 * @returns un objet contenant le code HTML dans le champ html et la description
 * des callbacks à enregistrer dans le champ callbacks
 */
function genereModaleLoginHeader(etatCourant) {
  return {
    html: `
<header class="modal-card-head  is-back">
  <p class="modal-card-title">Utilisateur</p>
  <button
    id="btn-close-login-modal1"
    class="delete"
    aria-label="close"
    ></button>
</header>`,
    callbacks: {
      "btn-close-login-modal1": {
        onclick: () => majEtatEtPage(etatCourant, { loginModal: false }),
      },
    },
  };
}









/**
 * Génère le code HTML du base de page de la modale de login et les callbacks associés.
 *
 * @param {Etat} etatCourant
 * @returns un objet contenant le code HTML dans le champ html et la description
 * des callbacks à enregistrer dans le champ callbacks
 */
function genereModaleLoginFooter(etatCourant) {
  return {
    html: `
  <footer class="modal-card-foot" style="justify-content: flex">
    <button id="btn-valid-login-modal2" class="button">Valider</button>
    <button id="btn-close-login-modal2" class="button">Annuler</button>
  </footer>
  `,
    callbacks: {
      "btn-close-login-modal2": {
        onclick: () => majEtatEtPage(etatCourant, { loginModal: false }),
      },
      "btn-valid-login-modal2": {
        onclick: () => afficheModaleConnexion(etatCourant),
      },
    },
  };
}








/**
 * Génère le code HTML de la modale de login et les callbacks associés.
 *
 * @param {Etat} etatCourant
 * @returns un objet contenant le code HTML dans le champ html et la description
 * des callbacks à enregistrer dans le champ callbacks
 */
function genereModaleLogin(etatCourant) {
  const header = genereModaleLoginHeader(etatCourant);
  const footer = genereModaleLoginFooter(etatCourant);
  const body = genereModaleLoginBody(etatCourant);
  const activeClass = etatCourant.loginModal ? "is-active" : "is-inactive";
  return {
    html: `
      <div id="mdl-login" class="modal ${activeClass}">
        <div class="modal-background"></div>
        <div class="modal-card">
          ${header.html}
          ${body.html}
          ${footer.html}
        </div>
      </div>`,
    callbacks: { ...header.callbacks, ...footer.callbacks, ...body.callbacks },
  };
}







/* ************************************************************************
 * Gestion de barre de navigation contenant en particulier les bouton Pokedex,
 * Combat et Connexion.
 * ****************************************************************** */

/**
 * Déclenche la mise à jour de la page en changeant l'état courant pour que la
 * modale de login soit affichée
 * @param {Etat} etatCourant
 */
function afficheModaleConnexion(etatCourant) {
  user_api = document.getElementById("api-key").value;
  etatCourant.apiKey = user_api;
  lanceWhoamiEtInsereLogin(etatCourant);
}



/**
 * 
 * @param  etatCourant 
 * @returns Renvoi le HTML de bouton de connexion si on est connecté sinon renvoi le bouton deconnexion
 */
function boutonConnexion(etatCourant){
  const html=`<div class="navbar-end ">
                <div id="etat-du-modal" style="border-top-width: 20 px"></div>
                <div class="navbar-item ">
                  <p class="buttons">
                    ${etatCourant.login == undefined ? '<a id="btn-open-login-modal" class="button is-success " > <span> Connexion </span> </a>' :
                                                      '<a id="btn-open-logout-modal" class="button is-danger " > <span> Déconnexion </span> </a>' }
                  </p>
                </div>
              </div>`
  return html;
}



/**
 * 
 * @param {*} etatCourant 
 * @returns Retourne le HTML de l'affichage du numero d'utilisateur
 */
function loginUtilisateur(etatCourant){
  const html= `<div class="navbar-end ">
                <div class="field">
                    <p  id="utilisateur" class="control has-icons-right">
                    Utilisateur : ${etatCourant.login}
                        <span class="icon-text is-small is-left">
                          <i class="fas fa-user"></i>
                        </span>
                    </p>
                    </div>
                  </div>`
  return html;
}


/**
 * 
 * @param {*} etatCourant 
 * @returns genere le bouton Connexion et met a jour la page et affiche la loginModal a l'appuie sur connexion
 */
function genereCo(etatCourant){
  const htmlConnexion =boutonConnexion(etatCourant);
  return {
    html: htmlConnexion,
      callbacks: {
        "btn-open-login-modal": {
          onclick: () => majEtatEtPage(etatCourant, { loginModal: true }),
        },
      },
    }
}



/**
 * 
 * @param {*} etatCourant 
 * @returns genere le bouton deconnexion et met a jour l'etat Courant => l'ApiKey login a undefined, donc déconnecte l'utilisateur
 * et réaffiche le tableau des pokemon a l'issue de la deconnexion
 */
function genereDeco(etatCourant){
  const htmlDeconnexion =boutonConnexion(etatCourant);
  const htmlLogin = loginUtilisateur(etatCourant);

  return {
    html: htmlLogin + htmlDeconnexion,
    callbacks: {
      "btn-open-logout-modal": {
        onclick: () => {
          majEtatEtPage(etatCourant, { login: undefined, apiKey: undefined });
          Pokedex_main(etatCourant);
        },
      },
    },

  };
}

/**
 * Génère le code HTML et les callbacks pour la partie droite de la barre de
 * navigation qui contient le bouton de login.
 * @param {Etat} etatCourant
 * @returns un objet contenant le code HTML dans le champ html et la description
 * des callbacks à enregistrer dans le champ callbacks
 */
function genereBoutonConnexion(etatCourant) {

  //Le code HTML du bouton connexion
  const connexion =genereCo(etatCourant);
  const logout = genereDeco(etatCourant);
if(etatCourant.login !== undefined) {return logout;}

    else {return connexion;}

                                        
  
  

}







/**
 * Génère le code HTML de la barre de navigation et les callbacks associés.
 * @param {Etat} etatCourant
 * @returns un objet contenant le code HTML dans le champ html et la description
 * des callbacks à enregistrer dans le champ callbacks
 */
function genereBarreNavigation(etatCourant) {
  const connexion = genereBoutonConnexion(etatCourant);
  return {
    html: `
  <nav class="navbar" role="navigation" aria-label="main navigation">
    <div class="navbar">
      <div class="navbar-item">
        <div class="field">
          <div class="control has-icons-left">
            <input class="input" id="input-pokemon" placeholder="Chercher un pokemon" type="text">
            <span class="icon is-small is-left">
            <i class="fas fa-search"></i>
          </span>
          </div>
        </div>
        <div class="buttons">
            <a id="btn-pokedex" class="button is-light"> Pokedex </a>
            <a id="btn-combat" class="button is-light"> Combat </a>
        </div>
      </div>
    </div>
    ${connexion.html}
  </nav>`,
    callbacks: {
      ...connexion.callbacks,
      "btn-pokedex": { onclick: () => Pokedex_main(etatCourant) },

      "btn-combat": {
        onclick: () => {
          if (etatCourant.login == undefined) {
            majEtatEtPage(etatCourant, { loginModal: true })
          }
          else {
            afficher(affichage_combat(), 'combat-de-pokemon');
            resultatCombat(etatCourant);
          }
        }
      }

    },
  };
}






/**
 * Génére le code HTML de la page ainsi que l'ensemble des callbacks à
 * enregistrer sur les éléments de cette page.
 *
 * @param {Etat} etatCourant
 * @returns un objet contenant le code HTML dans le champ html et la description
 * des callbacks à enregistrer dans le champ callbacks
 */
function generePage(etatCourant) {
  const barredeNavigation = genereBarreNavigation(etatCourant);
  const modaleLogin = genereModaleLogin(etatCourant);
  // remarquer l'usage de la notation ... ci-dessous qui permet de "fusionner"
  // les dictionnaires de callbacks qui viennent de la barre et de la modale.
  // Attention, les callbacks définis dans modaleLogin.callbacks vont écraser
  // ceux définis sur les mêmes éléments dans barredeNavigation.callbacks. En
  // pratique ce cas ne doit pas se produire car barreDeNavigation et
  // modaleLogin portent sur des zone différentes de la page et n'ont pas
  // d'éléments en commun.
  return {
    html: barredeNavigation.html + modaleLogin.html,
    callbacks: { ...barredeNavigation.callbacks, ...modaleLogin.callbacks },
  };
}





/* ******************************************************************
 * Initialisation de la page et fonction de mise à jour
 * globale de la page.
 * ****************************************************************** */



/**
 * Créée un nouvel état basé sur les champs de l'ancien état, mais en prenant en
 * compte les nouvelles valeurs indiquées dans champsMisAJour, puis déclenche la
 * mise à jour de la page et des événements avec le nouvel état.
 *
 * @param {Etat} etatCourant etat avant la mise à jour
 * @param {*} champsMisAJour objet contenant les champs à mettre à jour, ainsi
 * que leur (nouvelle) valeur.
 */
function majEtatEtPage(etatCourant, champsMisAJour) {
  const nouvelEtat = { ...etatCourant, ...champsMisAJour };
  majPage(nouvelEtat);
}







/**
 * Prend une structure décrivant les callbacks à enregistrer et effectue les
 * affectation sur les bon champs "on...". Par exemple si callbacks contient la
 * structure suivante où f1, f2 et f3 sont des callbacks:
 *
 * { "btn-pokedex": { "onclick": f1 },
 *   "input-search": { "onchange": f2,
 *                     "oninput": f3 }
 * }
 *
 * alors cette fonction rangera f1 dans le champ "onclick" de l'élément dont
 * l'id est "btn-pokedex", rangera f2 dans le champ "onchange" de l'élément dont
 * l'id est "input-search" et rangera f3 dans le champ "oninput" de ce même
 * élément. Cela aura, entre autres, pour effet de délclencher un appel à f1
 * lorsque l'on cliquera sur le bouton "btn-pokedex".
 *
 * @param {Object} callbacks dictionnaire associant les id d'éléments à un
 * dictionnaire qui associe des champs "on..." aux callbacks désirés.
 */
function enregistreCallbacks(callbacks) {
  Object.keys(callbacks).forEach((id) => {
    const elt = document.getElementById(id);
    if (elt === undefined || elt === null) {
      console.log(
        `Élément inconnu: ${id}, impossible d'enregistrer de callback sur cet id`
      );
    } else {
      Object.keys(callbacks[id]).forEach((onAction) => {
        elt[onAction] = callbacks[id][onAction];
      });
    }
  });
}







/**
 * Mets à jour la page (contenu et événements) en fonction d'un nouvel état.
 *
 * @param {Etat} etatCourant l'état courant
 */
function majPage(etatCourant) {
  console.log("CALL majPage");
  const page = generePage(etatCourant);
  document.getElementById("root").innerHTML = page.html;
  enregistreCallbacks(page.callbacks);
  Pokedex_main(etatCourant);
  affichage_table();
  affichage_pokemon_tab(etatCourant);
}






/**
 * Appelé après le chargement de la page.
 * Met en place la mécanique de gestion des événements
 * en lançant la mise à jour de la page à partir d'un état initial.
 */
function initClientPokemons() {
  console.log("CALL initClientPokemons");
  const etatInitial = {
    loginModal: false,
    login: undefined,
    errLogin: undefined,
    deck : [],
  };
  majPage(etatInitial);
}






// Appel de la fonction init_client_duels au après chargement de la page
document.addEventListener("DOMContentLoaded", () => {
  console.log("Exécution du code après chargement de la page");
  initClientPokemons();

  console.log("6728f7dc-119d-4db8-914e-cc2954355b14");
  console.log("cbbf7dc5-f749-44a6-9d9c-32858e355a37");
});
