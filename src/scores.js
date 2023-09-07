import {autoRun, reactive} from "./reactive.js";

const scores_localstorage_name = "scores_table_data"


function get_initial_state() {
    const json = localStorage.getItem(scores_localstorage_name)
    if(json) {
        const data = JSON.parse(json)
        return reactive({
            data
        })
    } else {
        return reactive({
            data: Array.from({length: 10}, () => ({
                name: "------",
                time: 0
            }))
        })
    }
}
export const scores_state = get_initial_state()
scores_state.is_score = function (time) {
    return time > this.data.at(-1).time
}
scores_state.push_score = function (name, time) {
    const pos = this.data.findIndex(item => time > item.time)
    if(pos === -1) return

    this.data.splice(pos, 0, reactive({
        name, time
    }))
    this.data = this.data.slice(0, 10)
}


autoRun(() => {
    console.log("save scores")
    localStorage.setItem(scores_localstorage_name, JSON.stringify(
        scores_state.data
    ))
})

