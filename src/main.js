import '../style.css'
import { setupCounter } from './counter.js'

/*
    4*. Крестики-нолики (игра с компьютером) на поле 15x15.
    Первый, выстроивший в ряд 5 своих фигур по вертикали, горизонтали или диагонали, выигрывает.
*/

function hasChanged(newVal, oldVal) {
    return newVal !== oldVal && (newVal === newVal || oldVal === oldVal);
}
let runningReaction = null;
function reactive(obj) {
    return Object.entries(obj).reduce((acc, [key, val]) => {
        let value = val;
        const deps = new Set();
        Object.defineProperty(acc, key, {
            get() {
                if (runningReaction && !deps.has(runningReaction)) {
                    deps.add(runningReaction);
                }
                return value;
            },
            set(newValue) {
                if (hasChanged(value, newValue)) {
                    value = newValue;
                    deps.forEach(f => f());
                }
            },
            enumerable: true,
        });
        return acc;
    }, {});
}
function autoRun(fn) {
    runningReaction = fn;
    fn();
    runningReaction = null;
}

function Cell(cell_data) {
    const id = cell_data.id
    // autoRun(() => {
    //     const e = container.querySelector(`#c${id}`)
    //     e.innerHTML = cell_data.value
    // })
    return `
        <div id="c${id}" class="w-14 h-14 bg-white border-black border">
        </div>
    `
}

const CellState = {
    Empty: "empty",
    Cross: "cross",
    Zero: "zero"
}

const data = Array.from({length: 15 * 15}, (v, i) => reactive({
    value: CellState.Empty
})).map((v, i) => {
    v.id = i
    return v
})

document.querySelector('#app').innerHTML = `
  <div>
<!--    <button id="counter" type="button"></button>-->
    <div id="container" class="grid grid-cols-[repeat(15,minmax(0,1fr))] grid-rows-[repeat(15,minmax(0,1fr))]">
    </div>
  </div>
`

const container = document.querySelector('#container')

container.innerHTML = `
    ${
        data.map(cell_data => Cell(cell_data)).join('\n')
    }
`

// ${
//     data.map(v => {
//         return Cell(v)
//     }).join('\n')
// }

// setupCounter(document.querySelector('#counter'))
