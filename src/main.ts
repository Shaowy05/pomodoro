import './style.css'

// Polling time for the timer (milliseconds)
const TIMER_REFRESH_DELAY = 10

// Containers for each of the sections
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

const MIDDLE_SECTION_TEXT = document.getElementById(
    'middle-section-text'
) as HTMLParagraphElement

// Left and Right buttons
const LEFT_BUTTON = document.getElementById('left-button') as HTMLButtonElement
const RIGHT_BUTTON = document.getElementById('right-button') as HTMLButtonElement

// Input elements for the timer options
const TIME_INPUTS = document.getElementsByClassName('time-input') as HTMLCollectionOf<HTMLInputElement>

// Audio HTML tags
const BEEP_AUDIO = document.getElementById('beep-audio') as HTMLAudioElement
const FINAL_BEEP_AUDIO = document.getElementById('final-beep-audio') as HTMLAudioElement

// When the user starts the timer
LEFT_BUTTON.addEventListener('click', (e: Event) => {
    e.preventDefault()

    try {

        const work = parseInt((TIME_INPUTS[0] as HTMLInputElement).value)
        const rest = parseInt((TIME_INPUTS[1] as HTMLInputElement).value)
        const cycles = parseInt((TIME_INPUTS[2] as HTMLInputElement).value)

        const inputs = [work, rest, cycles]

        if (
            inputs.some((element) => Number.isNaN(element))
            ||
            inputs.some((element) => element === 0)
        ) {
            for (let i = 0; i < TIME_INPUTS.length; i++) {
                TIME_INPUTS[i].style.animationPlayState = 'running'
                TIME_INPUTS[i].style.webkitAnimationPlayState = 'running'
                setTimeout(() => {
                    TIME_INPUTS[i].style.animationPlayState = 'paused'
                    TIME_INPUTS[i].style.webkitAnimationPlayState = 'paused'
                },200)
            }
        } else {
            switchInterface()

            // Initialising the countdown timeer
            let count = 3
            const countdown = setInterval(() => {
                if (count !== 0) {
                    BEEP_AUDIO.play()
                    TIMER_DISPLAY.innerHTML = count.toString()
                    count--
                } else {
                    FINAL_BEEP_AUDIO.play()
                    startTimer(work, rest, cycles)
                    clearInterval(countdown)
                }
            }, 1000)
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

    const startTime = Date.now()

    let working = true

    const timer = setInterval(() => {
        const deltaTime = Date.now() - startTime

        if (deltaTime >= checkpoints[0]) {
            // Toggle the state that the user is in
            working = !working

            // Change the text of the middle section
            if (working) {
                MIDDLE_SECTION_TEXT.innerHTML = 'Work'
            } else {
                MIDDLE_SECTION_TEXT.innerHTML = 'Rest'
            }

            // Play the final beep audio to signify a change
            FINAL_BEEP_AUDIO.play()

            // If it was the last checkpoint, end the timer.
            if (checkpoints.shift() === cycles * CYCLE_IN_MS) {
                resetInterface()
                clearInterval(timer)
            }
        } else {
            TIMER_DISPLAY.innerHTML = formatTime(deltaTime, checkpoints[0])

            // Begin beep sequence if time is '00:03'
            let count = 3
            const countdown = setInterval(() => {
                if (count !== 0) {
                    BEEP_AUDIO.play()
                    count--
                } else {
                    clearInterval(countdown)
                }
            }, 1000)
            
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

    MIDDLE_SECTION_TEXT.innerHTML = 'Work'

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

// Takes in the change in time and the next checkpoint and formats the
// time left into minutes and seconds
const formatTime = (delta: number, nextCheckpoint: number): string => {

    const timeLeftInSeconds = Math.trunc((nextCheckpoint - delta) / 1000)

    const seconds = timeLeftInSeconds % 60
    const minutes = (timeLeftInSeconds - seconds) / 60

    const secondBuffer = (seconds < 10) ? 0 : ''
    const minuteBuffer = (minutes < 10) ? 0 : ''

    return `${minuteBuffer}${minutes}:${secondBuffer}${seconds}`
}

// Resets the user interface after the timer has finished.
const resetInterface = () => {
    // First we hide the timer display inside the middle section
    TIMER_DISPLAY.setAttribute('hidden', '')

    // Then we remove the hidden attribute from the middle input
    MIDDLE_INPUT.removeAttribute('hidden')

    // Then we resize the container to the original size
    MIDDLE_INPUT_CONTAINER.style.height = '10rem'
    MIDDLE_INPUT_CONTAINER.style.width = '10rem'

    // Returning the left and right sections
    for (let i = 0; i < SECTION_CONTAINERS.length; i++) {
        let optionContainer = SECTION_CONTAINERS[i] as HTMLDivElement 

        if (optionContainer.id !== 'middle-section') {
            optionContainer.style.opacity = '1'
        }
    }

    // Enabling the input fields for all of the sections
    for (let i = 0; i < TIME_INPUTS.length; i++) {
        TIME_INPUTS[i].removeAttribute('disabled')
    }

    // Resetting the middle text to rest
    MIDDLE_SECTION_TEXT.innerHTML = 'Rest'

    // Finally we return the buttons to their original state
    LEFT_BUTTON.removeAttribute('hidden')
    RIGHT_BUTTON.removeAttribute('hidden')
}