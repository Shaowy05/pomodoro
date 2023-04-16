import './style.css'

// Preventing the user from typing more than 3 characters
const TIME_INPUTS = document.getElementsByClassName('time-input');

for (let i = 0; i < TIME_INPUTS.length; i++) {
    TIME_INPUTS[i]?.addEventListener('input', (e: Event) => {
        const target = e.target as HTMLInputElement

        if (!target) return 

        // Here we restrict the length of the input field to three digits
        if (target.value.length > 3) target.value = target.value.slice(0, 3)
    })
}

// When the user presses start
const START_BUTTON = document.getElementById('start-button');

START_BUTTON?.addEventListener('click', (e: Event) => {
    e.preventDefault()

    try {

        const work = parseInt((TIME_INPUTS[0] as HTMLInputElement).value)
        const rest = parseInt((TIME_INPUTS[1] as HTMLInputElement).value)
        const cycles = parseInt((TIME_INPUTS[2] as HTMLInputElement).value)

        if (
            [work, rest, cycles].some((element) => Number.isNaN(element))
            ||
            [work, rest, cycles].some((element) => element === 0)
        ) {
            console.log("Incorrect Input")
        } else {
            startTimer(work, rest, cycles)
        } 

    } catch(err) {


        console.log(err)
    }

})

const TIMER_REFRESH_DELAY = 100
const startTimer = (work: number, rest: number, cycles: number) => {
    const WORK_IN_MS = work * 60 * 1000
    const REST_IN_MS = rest * 60 * 1000
    const CYCLE_IN_MS = WORK_IN_MS + REST_IN_MS

    const checkpoints: number[] = []

    for (let i = 0; i < cycles; i++) {
        checkpoints.push(i * CYCLE_IN_MS + WORK_IN_MS)
        checkpoints.push((i + 1) * CYCLE_IN_MS)
    }

    console.log(checkpoints)

    const startTime = Date.now()

    let working = true

    const timer = setInterval(() => {
        const deltaTime = Date.now() - startTime

        if (deltaTime >= checkpoints[0]) {
            // Toggle the state that the user is in
            working = !working

            // If it was the last checkpoint, end the timer.
            if (checkpoints.shift() === cycles * CYCLE_IN_MS) {
                clearInterval(timer)
            }
        }
    }, TIMER_REFRESH_DELAY)
}

// Event listener and function for the reset button
const RESET_BUTTON = document.getElementById('reset-button')

RESET_BUTTON?.addEventListener('click' , (e) => {
    e.preventDefault()

    for (let i = 0; i < TIME_INPUTS.length; i++) {
        (TIME_INPUTS[i] as HTMLInputElement).value = ""
    }
})