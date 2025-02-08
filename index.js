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
    const listener = obj.detail.listener;
    const event = obj.detail.event;
  	const userName = obj.detail.event.data?.nick || "Unknown";
	const tags = obj.detail.event.data?.tags || {};
	const isModerator = tags.mod === "1";
	const isAdmin = userName === "madokaka";
    
    console.log("Listener: " + obj.detail.listener)
    
    if (obj.detail.listener === "message") {
        const message = obj.detail.event.data.text.toLowerCase();
		console.log("Entre en el message - User: ", userName)
        if ((message === "!subir" || message === "!bajar")  && !(isModerator || isAdmin)) {
          console.log("Entre en el condicional")
            return;
        }
        if (message === "!subir") {
          console.log("Entre en el subir")
            dollarCounter++;  
            updateDollarCounterDisplay(); 
        } else if (message === "!bajar") {
            dollarCounter--; 
            updateDollarCounterDisplay(); 
        }
    }
  
    let dollars = 0;

    if (listener === 'subscriber-latest') {
        dollars = processSubscriber(event);
    } else if (listener === 'cheer-latest') {
        dollars = Math.floor(event.amount / 100);
    } else if (listener === 'tip-latest') {
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
    console.log(event)

    if (event.tier === "1000"){
    dollars = 1; 
    } else if (event.tier === "2000") {
        dollars = 2; 
    } else if (event.tier === "3000") {
        dollars = 5; 
    }
    
    if (event.bulkGifted) {
        return 0;
    } 

    return dollars;
}

function displayGoalMessage() {
    const display = document.getElementById('sub-counter-display');
    const backgroundFill = document.querySelector('.background-fill');
	 
    display.innerText = "Meta alcanzada! x" + comboCounter;
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
        display.innerText =` Meta: $${Math.floor(dollarCounter)} / ${goal}`;
    }
 
  if (fillPercentage >= 75 || comboCounter > 0) {
    display.classList.add('urgent');
} else {
    display.classList.remove('urgent');
}

    document.querySelector('.background-fill').style.width = `${Math.min(fillPercentage, 100)}%`;
}
