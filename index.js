const newPlayerForm = document.querySelector('#new-player-form');
const playerContainer = document.querySelector('#all-players-container');

const Players_API_URL =
  'http://fsa-puppy-bowl.herokuapp.com/api/2302-ACC-PT-WEB-PT-A/players';


const getAllPlayers = async () => {
  try{
    const response = await fetch(Players_API_URL)
    const data = await response.json();

    if (!Array.isArray(data.data.players)){
      console.warn('Fetched player data is not an array.', data)
      return [];
    }
    return data.data.puppies;
  }catch(err){
    console.error('Issues fectching players', err)
    return [];
  }
};
// get single player by id
const getPlayerById = async (playerId) => {
  try {
    const response = await fetch(`${Players_API_URL}/${playerId}`);
    const player = await response.json();
    return player;
  } catch (error) {
    console.error(error);
  }
};

// delete party
const deletePlayer = async (playerId) => {
  // your code here
  // send a DELETE api call by id
  console.log('deleting ' + playerId);
  try {
    const requestOptions = {
      method: 'DELETE'
    }
    const response = await fetch(`${Players_API_URL}/${playerId}`, requestOptions);
    const player = await response.json();
    return player;
  } catch (error) {
    console.error(error);
  }
};


const getRandomColor = () => {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// render all parties
const renderAllPlayers = async (playerList) => {
  try {
    playerContainer.innerHTML = '';

    if (!Array.isArray(playerList)) {
      console.warn('the  playerList is not an array!', playerList);
      return;
    }

    playerList.forEach((player) => {
      const playerElement = document.createElement('div');
      playerElement.classList.add('player');
      playerElement.innerHTML = `
        <h2>ID: ${player.id}</h2>
        <h2>Name: ${player.name}</h2>
        <h2>Breed: ${player.breed}</h2>
        <img src="${player.imageUrl}">
        <h2 class="hidden">Status: ${player.status}</h2>
        <h2 class="hidden">Created At: ${player.createdAt}</h2>
        <h2 class="hidden">Team ID: ${player.teamId}</h2>
        <h2 class="hidden">Cohort ID: ${player.cohortId}</h2>
        <button class="details-button" data-id="${player.id}">See Details</button>
        <button class="remove-button" data-id="${player.id}">Remove from roster</button>
        `;
      playerContainer.appendChild(playerElement);

      //hide element with class "hidden"
      let hiddenElements = playerElement.querySelectorAll('.hidden');
      hiddenElements.forEach((element) => {
        element.style.display = 'none';
      });
      
      // The event listeners for the "See details" and "Remove from roster"
      const detailsButton = playerElement.querySelector('.details-button');
      const removeButton = playerElement.querySelector('.remove-button');

      detailsButton.addEventListener('click', async (event) => {
        const playerId = event.target.dataset.id;
        const player = await SinglePlayer(playerId);
        if (player) {
          //display the details
          let hiddenElements = playerElement.querySelectorAll('.hidden');
          hiddenElements.forEach((element) => {
              if (element.style.display === 'none') {
                  element.style.display = '';
              } else {
                  element.style.display = 'none'
              }
          });
        }

      });

      removeButton.addEventListener('click', async (event) => {
        const playerId = event.target.dataset.id;
        await removePlayer(playerId);
        init(); // re-render all players after deleting one
      });
    });
  } catch (err) {
    console.error('Uh oh, trouble rendering players!', err);
  }
};
const renderNewPlayerForm = async () => {
  try {
      const form = document.createElement('form');
      
      // create input fields for the form
      form.innerHTML = `
          <label>
              Name:
              <input type="text" name="name">
          </label>
          <label>
              Breed:
              <input type="text" name="breed">
          </label>
          <label>
              Status:
              <input type="text" name="status">
          </label>
          <label>
              Image URL:
              <input type="text" name="imageUrl">
          </label>
          <label>
              Created At:
              <input type="text" name="createdAt">
          </label>
          <label>
              Team ID:
              <input type="text" name="teamId">
          </label>
          <button type="submit">Add Player</button>
      `
      form.addEventListener('submit', async (event) => {
          event.preventDefault();
          const playerObj = {
              id: form.id.value,
              name: form.name.value,
              breed: form.breed.value,
              status: form.status.value,
              imageUrl: form.imageUrl.value,
              createdAt: form.createdAt.value,
              teamId: form.teamId.value,
          };
          
          // Validate the playerObj before adding to the database
          
          await addNewPlayer(playerObj);
          
          // re-fetch all players and render them again
          const players = await getAllPlayers();
          renderAllPlayers(players)
      });

      newPlayerForm.appendChild(form);
  } catch (err) {
      console.error('Uh oh, trouble rendering the new player form!', err);
  }
}

// init function
const init = async () => {
  const players = await getAllPlayers()
  console.log(players);
  renderAllPlayers(players); // <- put players in here as an argument
  
};
renderNewPlayerForm();

init();
