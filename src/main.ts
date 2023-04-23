import './style.css'

// Polling time for the timer (milliseconds)
const TIMER_REFRESH_DELAY = 100

const SECTION_CONTAINERS = document.getElementsByClassName('section')

// Middle section elements
const MIDDLE_INPUT_CONTAINER = document.getElementById(
    'middle-input-container'
) as HTMLDivElement

const MIDDLE_INPUT = document.getElementById(
    'middle-input'
) as HTMLInputElement

const TIMER_DISPLAY = document.getElementById(
    'timer-display'
) as HTMLParagraphElement

// Left and Right buttons
const LEFT_BUTTON = document.getElementById('left-button') as HTMLButtonElement
const RIGHT_BUTTON = document.getElementById('right-button') as HTMLButtonElement

// Input elements for the timer options
const TIME_INPUTS = document.getElementsByClassName('time-input') as HTMLCollectionOf<HTMLInputElement>

// When the user starts the timer
LEFT_BUTTON.addEventListener('click', (e: Event) => {
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
            switchInterface()

            startTimer(work, rest, cycles)
        } 

    } catch(err) {


        console.log(err)
    }

})

// Listener for right button to reset the timer options on click
RIGHT_BUTTON.addEventListener('click' , (e) => {
    e.preventDefault()

    for (let i = 0; i < TIME_INPUTS.length; i++) {
        (TIME_INPUTS[i] as HTMLInputElement).value = ""
    }
})

// Preventing the user from typing more than 3 characters
for (let i = 0; i < TIME_INPUTS.length; i++) {
    TIME_INPUTS[i]?.addEventListener('input', (e: Event) => {
        const target = e.target as HTMLInputElement

        if (!target) return 

        // Here we restrict the length of the input field to three digits
        if (target.value.length > 3) target.value = target.value.slice(0, 3)
    })
}

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
        } else {
            TIMER_DISPLAY.innerHTML = formatTime(deltaTime, checkpoints[0])
        }
    }, TIMER_REFRESH_DELAY)
}

// Hides the left and right sections to leave the middle alongside changing
// the relevant UI elements to reflect the new state of the app.
const switchInterface = () => {
    // Disabling all the inputs
    for (let i = 0; i < TIME_INPUTS.length; i++) {
        TIME_INPUTS[i].setAttribute('disabled', '')
    }

    // Adjusting the middle section
    MIDDLE_INPUT_CONTAINER.style.width = '12rem'
    MIDDLE_INPUT_CONTAINER.style.height = '12rem'

    MIDDLE_INPUT.setAttribute('hidden', '')

    TIMER_DISPLAY.removeAttribute('hidden')

    // Changing the action buttons
    LEFT_BUTTON.setAttribute('hidden', '')
    RIGHT_BUTTON.setAttribute('hidden', '')

    // Hiding the left and right sections
    for (let i = 0; i < SECTION_CONTAINERS.length; i++) {
        let optionContainer = SECTION_CONTAINERS[i] as HTMLDivElement 

        if (optionContainer.id !== 'middle-section') {
            optionContainer.style.opacity = '0'
        }
    }
}

// Takes in 
const formatTime = (delta: number, nextCheckpoint: number): string => {
    

    return ''
}