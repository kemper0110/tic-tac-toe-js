import '../style.css'
import {autoRun} from "./reactive.js";
import {board_state, game_state, onCellClick, restart} from "./tic-tac-toe.js";
import {scores_state} from "./scores.js";

/*
    4*. Крестики-нолики (игра с компьютером) на поле 15x15.
    Первый, выстроивший в ряд 5 своих фигур по вертикали, горизонтали или диагонали, выигрывает.


    Общие требования:
    Кнопки: новая игра, таблица рекордов.
    Подсчет очков (и/или времени игры) и вывод их по завершению игры, если очков набрано достаточно для попадания в таблицу рекордов - спросить у пользователя его имя.
    Ведение таблицы рекордов: таблица из 10 лучших партий в порядке убывания (имя - очки и/или время игры). Данные хранить в Cookie или localStorage.
    Изменение уровней сложности ("*" в номере задания - игра не предполагает уровней сложности).
    НИКАКОЙ ASCII-графики!
    ЗАПРЕЩАЕТСЯ использовать: любые JavaScript библиотеки или фреймворки.

    ОТЧЕТ должен включать - титульный лист, лист задания, скриншот, исходный код.
*/


document.querySelector('#app').innerHTML = `
  <div>
    <div class="flex justify-between">
        <div class="flex flex-col gap-1">
        <h1>
            Игрок: <span id="player"></span>
        </h1>
        <h2>
            Количество ходов: <span id="count"></span>    
        </h2>
        <h3>
            Время: <span id="time"></span> с
        </h3>
        </div>
        <button id="restart" class="w-32 px-3 py-1.5 bg-slate-500 rounded-md hover:bg-slate-600">
            Заново    
        </button>
    </div>
    <div id="board" class="mt-4 bg-slate-400 grid grid-cols-[repeat(15,minmax(0,1fr))] grid-rows-[repeat(15,minmax(0,1fr))]">
        ${
            Array.from({length: 15 * 15}, (v, i) => i).map(id => `
                <button id="cell-${id}" class="bg-slate-400 w-14 h-14 border-black border border-solid text-black text-5xl" />
            `).join('\n')
        }
    </div>
    <table id="scores" class="mt-10 w-full bg-slate-500 border-black">
        <caption id="scores-caption" class="bg-slate-600"></caption>
        <thead>
            <tr>
                <th class="py-2 px-2">#</th>
                <th class="py-2 px-5">Имя</th>
                <th class="py-2 px-3">Время</th>
            </tr>
        </thead>
        <tbody>
        ${
            Array.from({length: 10}, (v, i) => i).map(id => `
                <tr class="">
                    <td class="py-1" id="score-name-id">${id}</td>
                    <td class="py-1" id="score-name-${id}"></td>
                    <td class="py-1" id="score-time-${id}"></td>
                </tr>
            `).join('\n')
        }
        </tbody>
    </table>
  </div>
`

// ### CONNECT STATE TO HTML ELEMENTS ###

const player_element = document.querySelector('#player')
autoRun(() => {
    console.log("rendered player")
    player_element.innerHTML = game_state.player
})

const count_element = document.querySelector('#count')
autoRun(() => {
    console.log("rendered count")
    count_element.innerHTML = game_state.count
})

const time_element = document.querySelector('#time')
autoRun(() => {
    console.log("rendered time")
    time_element.innerHTML = game_state.time
})


const board_element = document.querySelector('#board')
board_state.forEach((cell_state, id) => {
    const cell_element = board_element.querySelector(`#cell-${id}`)
    cell_element.onclick = onCellClick(id, cell_state)
    autoRun(() => {
        cell_element.innerHTML = cell_state.value
    })
    autoRun(() => {
        if(cell_state.winner)
            cell_element.classList.add("bg-red-400")
        else
            cell_element.classList.remove("bg-red-400")
    })
})

const restart_button = document.querySelector('#restart')
restart_button.onclick = restart


const scores_table = document.querySelector('#scores')
autoRun(() => {
    scores_state.data.forEach((score, id) => {
        const name_element = scores_table.querySelector(`#score-name-${id}`)
        name_element.innerHTML = score.name
        const time_element = scores_table.querySelector(`#score-time-${id}`)
        time_element.innerHTML = score.time
    })
})


const caption_element = scores_table.querySelector('#scores-caption')
autoRun(() => {
    console.log("rendered caption")
    const best_name = scores_state.data[0].name
    if(best_name)
        caption_element.innerHTML = `Лучший игрок: ${best_name}`
})