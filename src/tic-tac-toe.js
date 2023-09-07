import {reactive} from "./reactive.js";
import {scores_state} from "./scores.js";

export const CellState = {
    Cross: "X",
    Zero: "O",
    Empty: ""
}

export const game_state = reactive({
    count: 0,
    player: CellState.Cross,
    time: 0
})
game_state.switchPlayer = function () {
    if (this.player === CellState.Zero)
        this.player = CellState.Cross
    else if (this.player === CellState.Cross)
        this.player = CellState.Zero
}
setInterval(() => {
    game_state.time += 1
}, 1000)

export const board_state = Array.from({length: 15 * 15}, () => reactive({
    value: CellState.Empty,
    winner: false
}))
function try_set(player, position) {
    if (board_state[position].value)
        return false
    board_state[position].value = player
    return true
}


export function onCellClick(cell_id, cell_state) {
    return () => {
        if (!try_set(game_state.player, cell_id))
            return
        console.log('click', cell_id, cell_state.value)
        game_state.count += 1
        game_state.switchPlayer()

        const winner = computeWinner(3)
        if (winner === undefined) return

        board_state.forEach((cell, id) => {
            if(winner.includes(id))
                cell.winner = true
        })

        console.log("winner is", winner)
        const winner_player = board_state[winner[0]].value
        setTimeout(() => {
            if(scores_state.is_score(game_state.time)) {
                const name = prompt(`Победитель: ${winner_player}, время игры: ${game_state.time} с, это рекорд, внесите свое имя`,
                    "unknown")
                if(name !== null)
                    scores_state.push_score(name, game_state.time)
            }
            else {
                alert(`Победитель: ${winner_player}, время игры: ${game_state.time} с`)
            }
            restart()
        }, 100)
    }
}

function computeWinner(seqSize = 5, boardSize = 15) {
    const gap = Math.floor(seqSize / 2)
    function compareElements(indices) {
        let result = true
        for (let i = 1; i < indices.length; ++i) {
            result &&= !!board_state[indices[i]]?.value
            result &&= board_state[indices[i]]?.value === board_state[indices[i - 1]]?.value
        }
        return result
    }
    function getSequenceIndices(i) {
        const res = [
            // - \ / |
            [], [], [], []
        ]
        for(let j = 0; j < seqSize; ++j) {
            res[0].push(j - gap + i)
            res[1].push(boardSize * (j - gap) + (j - gap) + i)
            res[2].push(-boardSize * (j - gap) + (j - gap) + i)
            res[3].push(boardSize * (j - gap) + i)
        }
        return res
    }

    for(let i = 0; i < board_state.length; ++i) {
        if(board_state[i].value) {
            const indexRows = getSequenceIndices(i)
            const winnerIndices = indexRows.find(row => compareElements(row))

            if(winnerIndices)
                return winnerIndices
        }
    }

    return undefined
}

export function restart() {
    game_state.player = CellState.Cross
    game_state.count = 0
    game_state.time = 0
    board_state.forEach(v => {
        v.value = CellState.Empty
        v.winner = false
    })
}
