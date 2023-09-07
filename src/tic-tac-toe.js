import {reactive} from "./reactive.js";

export const CellState = {
    Cross: "X",
    Zero: "O",
    Empty: ""
}

export const game_state = reactive({
    count: 0,
    player: CellState.Cross
})

export const board_state = Array.from({length: 15 * 15}, () => reactive({
    value: CellState.Empty
}))


export function onCellClick(cell_id, cell_state) {
    return () => {
        if (!try_set(game_state.player, cell_id))
            return
        console.log('click', cell_id, cell_state.value)
        game_state.count += 1
        game_state.player = nextPlayer(game_state.player)

        const winner = who_wins()
        if (winner === undefined) return

        console.log("winner is", winner)
        // show modal with winner name
        // *restart* button
    }
}

function nextPlayer(player) {
    if (player === CellState.Zero)
        return CellState.Cross
    if (player === CellState.Cross)
        return CellState.Zero
    return undefined
}

function try_set(player, position) {
    if (board_state[position].value)
        return false
    board_state[position].value = player
    return true
}

// return value
// string - winner
// null - nobody win
// undefined - game not ended
function who_wins() {
    if (isWinning(CellState.Cross))
        return CellState.Cross
    if (isWinning(CellState.Zero))
        return CellState.Zero
    const board_is_full = board_state.every(v => v.value !== CellState.Empty)
    if (board_is_full)
        return null
    return undefined
}

function isWinning(player) {
    // rows, cols, diagonal-asc, diagonal-desc

    const coordToIdx = (x, y) => x + y * 15

    for (let y = 0; y < 15; ++y) {
        for (let x = 0; x < 11; ++x) {
            if (board_state[coordToIdx(x, y)].value === player) {
                let counter = 0
                for (let j = 0; j < 5 && board_state[coordToIdx(x + j, y)].value === player; ++j)
                    ++counter
                if (counter === 5)
                    return true
            }
        }
    }

    for (let x = 0; x < 15; ++x) {
        for (let y = 0; y < 11; ++y) {
            if (board_state[coordToIdx(x, y)].value === player) {
                let counter = 0
                for (let j = 0; j < 5 && board_state[coordToIdx(x, y + j)].value === player; ++j)
                    ++counter
                if (counter === 5)
                    return true
            }
        }
    }

    for (let i = 4; i < 11; ++i) {
        for (let j = 0; j < i - 3; ++j) {
            if(board_state[coordToIdx(j, i - j)].value === player) {
                let counter = 0
                for (let k = 0; k < 5 && board_state[coordToIdx(j, i - k)].value === player; ++k)
                    ++counter
                if (counter === 5)
                    return true
            }
        }
    }

    return false
}

export function restart() {
    game_state.player = CellState.Cross
    game_state.count = 0
    board_state.forEach(v => {
        v.value = CellState.Empty
    })
}
