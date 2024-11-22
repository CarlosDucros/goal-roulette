let dollarCounter = 0; 
let goal = 5; 
let comboCounter = 0;
let comboTimeout;

window.addEventListener('onWidgetLoad', function (obj) {
    const fieldData = obj.detail.fieldData;
    goal = parseFloat(fieldData.goal) || 5; 
    updateDollarCounterDisplay(); 
});

window.addEventListener('onEventReceived', function (obj) {
    if (!obj.detail.event) return;

    const listener = obj.detail.listener.split("-")[0];
    const event = obj.detail.event;

    let dollars = 0;

    if (listener === 'subscriber') {
        dollars = processSubscriber(event);
    } else if (listener === 'cheer') {
        dollars = Math.floor(event.amount / 100);
    } else if (listener === 'tip') {
        dollars = event.amount;
    }

    if (dollars > 0) {
        dollarCounter += dollars;

        const combos = Math.floor(dollarCounter / goal);
        if (combos > 0) {
            comboCounter += combos;
            dollarCounter %= goal; 
            displayGoalMessage(comboCounter);

            clearTimeout(comboTimeout);
            comboTimeout = setTimeout(() => {
                comboCounter = 0; 
                updateDollarCounterDisplay();
            }, 10000);
        }
    }
    updateDollarCounterDisplay();
});

function processSubscriber(event) {
    let dollars = 0;

    if (event.tier === "2000") {
        dollars = 2; 
    } else if (event.tier === "3000") {
        dollars = 5; 
    } else {
        dollars = 1; 
    }

    if (event.bulkGifted) {
        return;
    } 

    return dollars;
}

function displayGoalMessage() {
    const display = document.getElementById('sub-counter-display');
    const backgroundFill = document.querySelector('.background-fill');
	 
    display.innerText = `Meta alcanzada! x${comboCounter}`;
    backgroundFill.style.width = '100%';
   
  	
 
    confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
    });
}

function updateDollarCounterDisplay() {
    const fillPercentage = (dollarCounter / goal) * 100;
    const display = document.getElementById('sub-counter-display');

    if (comboCounter === 0) {
        display.innerText = `Meta: $${Math.floor(dollarCounter)} / ${goal}`;
    }
 
  if (fillPercentage >= 75 || comboCounter > 0) {
    display.classList.add('urgent');
} else {
    display.classList.remove('urgent');
}

    document.querySelector('.background-fill').style.width = `${Math.min(fillPercentage, 100)}%`;
}
