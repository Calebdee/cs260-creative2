document.getElementById("weatherSubmit").addEventListener("click", function(event) {
  event.preventDefault();
  const type = document.getElementById("selectTool").value;
  const value = document.getElementById("weatherInput").value;
  if (value === "")
    return;
  console.log(value);

  if (type == "pokemon") {
    const url = "https://pokeapi.co/api/v2/pokemon/" + value.toLowerCase();
    fetch(url)
      .then(function(response) {
        return response.json();
      }).then(function(json) {
        prepDivs();

        document.getElementById("img_home").src = json.sprites.front_default;
        document.getElementById("img_home_back").src = json.sprites.back_default;
        titleText = '<h2>' + json.name.charAt(0).toUpperCase() + json.name.slice(1) + '</h2><hr>'
        typeOneText = json.types[0].type.name;
        if (json.types.length > 1) {
          typeTwoText = json.types[1].type.name;
          document.getElementById("typeTwo").innerHTML = '<p>Type: ' + typeTwoText.charAt(0).toUpperCase() + typeTwoText.slice(1) + '</p>';
        }
        document.getElementById("typeOne").innerHTML = '<hr><p>Type: ' + typeOneText.charAt(0).toUpperCase() + typeOneText.slice(1) + '</p>';
        document.getElementById("poke_name").innerHTML = titleText;
        
  	   
       
       results = prepStats(json);
       abilities = prepAbilities(json);
       moves = prepMoves(json);
  	   document.getElementById("statsResults").innerHTML = results;
       document.getElementById("movesResults").innerHTML = moves;
       document.getElementById("abilitiesResults").innerHTML = abilities;
      });

  }

  if (type == "type") {
    const url = "https://pokeapi.co/api/v2/type/" + value.toLowerCase();
    fetch(url)
      .then(function(response) {
        return response.json();
      }).then(function(json) {
        prepDivs();
        titleText = '<h2>' + formatWords(json.name) + ' Type</h2>'

        
        titleText += "<hr id=\"center\"><h3>Weaknesses From</h3>";
        for (let i=0; i < json.damage_relations.double_damage_from.length; i++) {
          titleText += "<hr><p>" + formatWords(json.damage_relations.double_damage_from[i].name) + "</p>"
        }
        titleText += "<hr><h3>Resistences From</h3>";
        for (let i=0; i < json.damage_relations.half_damage_from.length; i++) {
          titleText += "<hr><p>" + formatWords(json.damage_relations.half_damage_from[i].name) + "</p>"
        }
        titleText += "<hr><h3>Immunities From</h3>";
        if (json.damage_relations.no_damage_from.length > 0) {
          titleText += "<hr><p>" + json.damage_relations.no_damage_from[0].name + "</p>";
        }
        else {
          titleText += "<hr><p>None</p>";
        }

        weaknesses = '<h2>' + formatWords(json.name) + ' Type</h2>'
        weaknesses += "<hr id=center><h3>Effective Against</h3>";
        for (let i=0; i < json.damage_relations.double_damage_to.length; i++) {
          weaknesses += "<hr><p>" + formatWords(json.damage_relations.double_damage_to[i].name) + "</p>"
        }
        weaknesses += "<hr><h3>Ineffective Against</h3>";
        for (let i=0; i < json.damage_relations.half_damage_to.length; i++) {
          weaknesses += "<hr><p>" + formatWords(json.damage_relations.half_damage_to[i].name) + "</p>"
        }
        weaknesses += "<hr><h3>Immunities Against</h3>";
        if (json.damage_relations.no_damage_to.length > 0) {
          weaknesses += "<hr><p>" + json.damage_relations.no_damage_to[0].name + "</p>";
        }
        else {
          weaknesses += "<hr><p>None</p>";
        }

        moves = "<h2>" + formatWords(json.name) + "-Type Moves</h2><hr>"
        for (let i=0; i < json.moves.length; i++) {
            moves += "<p>" + formatWords(json.moves[i].name) + "</p>"
        }

        abilities = "<h2>" + formatWords(json.name) + "-Type Pokemon</h2><hr>"
        for (let i=0; i < json.moves.length; i++) {

            abilities += "<p>" + formatWords(json.pokemon[i].pokemon.name) + "</p>"
        }

        document.getElementById("poke_name").innerHTML = titleText;
        document.getElementById("statsResults").innerHTML = weaknesses;
        document.getElementById("movesResults").innerHTML = moves;
        document.getElementById("abilitiesResults").innerHTML = abilities;
      });

  }

  else if (type == "ability") {
    const url = "https://pokeapi.co/api/v2/ability/" + value.toLowerCase();
    fetch(url)
      .then(function(response) {
        return response.json();
      }).then(function(json) {
        prepDivs();
        titleText = '<h2>' + json.name.charAt(0).toUpperCase() + json.name.slice(1) + '</h2>';
        for (let i=0; i < json.effect_entries.length; i++) {
          if (json.effect_entries[i].language.name == "en") {
            typeOneText = json.effect_entries[i].effect;
          }
        }

        hiddens = "<p>Pokemon - Normal Ability</p><hr>";
        for (let i=0; i < json.pokemon.length; i++) {
          if (json.pokemon[i].is_hidden == true) {
            hiddens += "<p>" + formatWords(json.pokemon[i].pokemon.name) + "</p>";
          }
        }

        not_hiddens = "<p>Pokemon - Hidden Ability</p><hr>";
        for (let i=0; i < json.pokemon.length; i++) {
          if (json.pokemon[i].is_hidden == false) {
            not_hiddens += "<p>" + formatWords(json.pokemon[i].pokemon.name) + "</p>";
          }
        }

        langs = "<p>" + formatWords(json.name) +  " in Languages</p><hr>";
        for (let i=0; i < json.names.length; i++) {
          langs += "<p>" + getName(json.names[i]) + " - " + formatWords(json.names[i].name) + "</p>";

        }


        document.getElementById("statsResults").innerHTML = not_hiddens;
        document.getElementById("movesResults").innerHTML = hiddens;
        document.getElementById("abilitiesResults").innerHTML = langs;
        document.getElementById("typeOne").innerHTML = '<p>' + typeOneText + '</p>';
        document.getElementById("poke_name").innerHTML = titleText;
        
      
      });

  }


  
  
});

function prepMoves(json) {
  moves = '<h3>' + "Level-Up Moves" + '</h3><hr>';
  for (let i=0; i < json.moves.length; i++) {
    if (json.moves[i].version_group_details[0].move_learn_method.name == "level-up") {
      move_name = formatWords(json.moves[i].move.name);
      moves += "<p>Lvl." + json.moves[i].version_group_details[0].level_learned_at + " " + move_name + "<p>";

    }
  }
  return moves;
}

function prepAbilities(json) {
  abilities = '<h3>Abilities</h3>';
  const url = json.abilities[0].ability.url;

  for (let i=0; i < json.abilities.length; i++) {
    ability_name = formatWords(json.abilities[i].ability.name);
    abilities += '<hr><p>' + ability_name + '</p>'

  }
  return abilities;
}

function formatWords(word) {
  if (word == "") {
    return "";
  }
  word = word.replace(/-/g, ' ');

  const words = word.split(" ");

  for (let i = 0; i < words.length; i++) {
    if (words[i] != "") {
      words[i] = words[i][0].toUpperCase() + words[i].substr(1);
    }
  }
  return words.join(" ");

}

function prepStats(json) {
   results = '<h3>' + "Base Stats" + '</h3><hr>';
   results += '<p>HP: ' + json.stats[0].base_stat + '<p>'
   results += '<p>Attack: ' + json.stats[1].base_stat + '<p>'
   results += '<p>Defense: ' + json.stats[2].base_stat + '<p>'
   results += '<p>SpAttack: ' + json.stats[3].base_stat + '<p>'
   results += '<p>SpDefense: ' + json.stats[4].base_stat + '<p>'
   results += '<p>Speed: ' + json.stats[5].base_stat + '<p>'
   return results;
}

function prepDivs() {
  document.getElementById("statsResults").style.border = '1px solid black';
  document.getElementById("statsResults").style.backgroundColor = 'lightgrey';
  document.getElementById("movesResults").style.backgroundColor = 'lightgrey';
  document.getElementById("movesResults").style.border = '1px solid black';
  document.getElementById("abilitiesResults").style.backgroundColor = 'lightgrey';
  document.getElementById("abilitiesResults").style.border = '1px solid black';
  document.getElementById("img_box").style.backgroundColor = 'lightgrey';
  document.getElementById("img_box").style.border = '1px solid black';
  document.getElementById("img_box").style["box-shadow"] = '5px 10px';
  document.getElementById("statsResults").style["box-shadow"] = '5px 10px';
  document.getElementById("movesResults").style["box-shadow"] = '5px 10px';
  document.getElementById("abilitiesResults").style["box-shadow"] = '5px 10px';
}

function getName(name) {
  if (name.language.name == "ja-Hrkt") {
    return "Japanese";
  }
  if (name.language.name == "ko") {
    return "Korean";
  }
  if (name.language.name == "zh-Hant") {
    return "Chinese";
  }
  if (name.language.name == "fr") {
    return "French";
  }
  if (name.language.name == "de") {
    return "German";
  }
  if (name.language.name == "es") {
    return "Spanish";
  }
  if (name.language.name == "it") {
    return "Italian";
  }
  if (name.language.name == "en") {
    return "English";
  }
  if (name.language.name == "ja") {
    return "Japanese";
  }
  if (name.language.name == "zh-Hans") {
    return "Chinese";
  }
  return "Failed";
}
