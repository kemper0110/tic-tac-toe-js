import '../style.css'
import {autoRun} from "./reactive.js";
import {board_state, CellState, game_state, onCellClick, restart} from "./tic-tac-toe.js";

/*
    4*. Крестики-нолики (игра с компьютером) на поле 15x15.
    Первый, выстроивший в ряд 5 своих фигур по вертикали, горизонтали или диагонали, выигрывает.
*/


const ids = Array.from({length: 15 * 15}, (v, i) => i)

document.querySelector('#app').innerHTML = `
  <div>
    <h1>
        Player: <span id="player"></span>
    </h1>
    <h2>
        Count: <span id="count"></span>    
    </h2>
    <button id="restart" class="">
        Restart    
    </button>
    <div id="container" class="bg-slate-400 grid grid-cols-[repeat(15,minmax(0,1fr))] grid-rows-[repeat(15,minmax(0,1fr))]">
        ${
            ids.map(id => `
                <button id="cell-${id}" class="w-14 h-14 border-black border border-solid text-black text-5xl" />
            `).join('\n')
        }
    </div>
  </div>
`

// ### CONNECT STATE TO HTML ELEMENTS ###

const player_element = document.querySelector('#player')
autoRun(() => {
    player_element.innerHTML = game_state.player
})


const count_element = document.querySelector('#count')
autoRun(() => {
    count_element.innerHTML = game_state.count
})


const container = document.querySelector('#container')
board_state.forEach((cell_state, id) => {
    const cell_element = container.querySelector(`#cell-${id}`)
    cell_element.onclick = onCellClick(id, cell_state)
    autoRun(() => {
        cell_element.innerHTML = cell_state.value
    })
})

const restart_button = document.querySelector('#restart')
restart_button.onclick = restart
