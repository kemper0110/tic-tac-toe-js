import {reactive} from "./reactive.js";

export const CellState = {
    Empty: "",
    Cross: "X",
    Zero: "O"
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
        cell_state.value = game_state.player
        game_state.player = game_state.player === CellState.Zero ? CellState.Cross : CellState.Zero
        game_state.count += 1
        console.log('click', cell_id, cell_state.value)
    }
}

export function isEnd() {

}

export function restart() {
    game_state.player = CellState.Cross
    game_state.count = 0
    board_state.forEach(v => {
        v.value = CellState.Empty
    })
}