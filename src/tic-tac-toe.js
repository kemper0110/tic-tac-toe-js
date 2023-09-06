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
        if(!try_set(game_state.player, cell_id))
            return
        console.log('click', cell_id, cell_state.value)
        game_state.count += 1
        game_state.player = nextPlayer(game_state.player)

        const winner = who_wins()
        if(winner === undefined) return

        console.log("winner is", winner)
        // show modal with winner name
        // *restart* button
    }
}

function nextPlayer(player) {
    if(player === CellState.Zero)
        return CellState.Cross
    if(player === CellState.Cross)
        return CellState.Zero
    return undefined
}

function try_set(player, position) {
    if(board_state[position].value)
        return false
    board_state[position].value = player
    return true
}

// return value
// string - winner
// null - nobody win
// undefined - game not ended
function who_wins() {
    if(isWinning(CellState.Cross))
        return CellState.Cross
    if(isWinning(CellState.Zero))
        return CellState.Zero
    const board_is_full = board_state.every(v => v.value !== CellState.Empty)
    if(board_is_full)
        return null
    return undefined
}

function isWinning(player) {

}

export function restart() {
    game_state.player = CellState.Cross
    game_state.count = 0
    board_state.forEach(v => {
        v.value = CellState.Empty
    })
}