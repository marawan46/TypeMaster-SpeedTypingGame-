console.log("connected")
const textField = document.querySelector('.text')
let ScreenText = "Click Generate To Generate New Text"
let WrongChars = 0
const urls = {
  "random":"https://baconipsum.com/api/?type=all-meat&sentences=2&paras=1&format=json",
  "stoicism": "https://corsproxy.io/https://stoic.tekloon.net/stoic-quote",
  "programmers":"https://corsproxy.io/?https://perl.is/random"
}
let url = urls.random
let tokens = {}
let cursorCurrent = 0
let cursor
let startTime;
let timerInterval;
let timeStarted = false


function makeScreen(text){
      //reset Timer and Accuracy
       clearTimer()
       timeStarted = false
       WrongChars = 0
       CalcAccuracy(WrongChars)
       //add keyboard eventlistener

       window.addEventListener('keydown',ManageKeyStroke)
    let WordWrapper = document.createElement("span")
    WordWrapper.classList.add("WordWrapper")

        for(let i=0;i<text.length;i++){
            if(text[i] != ' '){
                const token = document.createElement("span")
                token.classList.add("token")
                token.textContent = text[i]
                WordWrapper.appendChild(token)
            }
            else{
                textField.appendChild(WordWrapper)
                const token = document.createElement("span")
                token.classList = "token space"

                token.textContent = "\u00A0"
                textField.appendChild(token)
                WordWrapper = document.createElement("span")
                WordWrapper.classList.add("WordWrapper")
            }
        if(WordWrapper.childNodes.length > 0){
            textField.appendChild(WordWrapper)
        }
        }
        tokens = document.querySelectorAll('.token')
        cursor = tokens[cursorCurrent]
        cursor.classList.add('CursorCurrent')


}

function ManageKeyStroke(event){
  if(event.key.length>1 && event.key!=='Backspace')return
        if(!timeStarted){
          clearTimer()
          timeStarted = true
          startTimer()
        }
        
        if(event.key=="Backspace"){

               cursor.classList.toggle('CursorCurrent')
               cursorCurrent = (cursorCurrent-1 < 0 ? cursorCurrent : --cursorCurrent)
               cursor = tokens[cursorCurrent]
               cursor.classList.toggle('CursorCurrent')
               cursor.classList.remove('done')

               if(cursor.classList.contains('wrong'))
                {
                    CalcAccuracy(--WrongChars)
                    cursor.classList.remove('wrong')
                    cursor.classList.add('edit')
                }
               return 
            }
        else
          {
            match(event)
            cursorCurrent = (cursorCurrent+1 >= ScreenText.length ? cursorCurrent : ++cursorCurrent) 
            cursor = tokens[cursorCurrent]
            cursor.classList.toggle('CursorCurrent')
            
            //Check if reached the end
            if (cursorCurrent == ScreenText.length-1 && (
              tokens[cursorCurrent].classList.contains('wrong')||
              tokens[cursorCurrent].classList.contains('done')
           )) 
           {
                  stopTimer()
                  window.removeEventListener('keydown', ManageKeyStroke);
                  return;
            }
          
          }
    
}

  function handleKeyDown(e) {
    if (e.code === 'Space') {
      e.preventDefault();
    }
  }
function CategorySelection(e){
  console.log(e.currentTarget.name)
  url = urls[e.currentTarget.name]
  const activeBtn=document.querySelector(".active")
  activeBtn.classList.toggle("active")
  e.currentTarget.classList.toggle("active")
}
function Generate(event){
    //clear screen first and reset the cursor place

    console.log("Generating...")
    cursorCurrent = 0
    while (textField.firstChild) {
         textField.removeChild(textField.firstChild);
    }
    //fetch new data and display it on screen
    fetch(url)
  .then(res => res.json())
  .then(data => {
    if(data.quote)
      ScreenText = data.quote
    else if(data.data)
      ScreenText = data.data.quote
    else if(data[0])
      ScreenText = data[0]
    console.log(data)
    makeScreen(ScreenText)
  })
  .catch(err => console.error(err));

}

function match(event){
    if(event.key == cursor.innerText || (event.key==' ' && cursor.innerText=="\u00A0") ) 
        cursor.classList.toggle('done')
    else{
        cursor.classList.toggle('wrong')
        CalcAccuracy(++WrongChars)
    }
    //console.log(cursor.innerText)
    cursor.classList.toggle('CursorCurrent')

}
function CalcAccuracy(wrongs){
    const accuracy = document.querySelector('.accuracy')
    console.log(ScreenText.length)
    accuracy.textContent = (((ScreenText.length-wrongs)/ScreenText.length)*100).toFixed(2) + '%'
    const errors = document.querySelector('.errors')
    errors.textContent = wrongs

}
function CalcWPM(elapsedMins){
  const CharsTyped = document.querySelectorAll(".done")
  const words = CharsTyped.length/5
  return (words/elapsedMins).toFixed(2)
}
function startTimer() {
    startTime = Date.now(); // current time in milliseconds

    // update timer every second
    timerInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;

      const totalSeconds = Math.floor(elapsed / 1000);
      const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
      const seconds = String(totalSeconds % 60).padStart(2, '0');

      document.querySelector('.time').textContent = `${minutes}:${seconds}`;
      console.log(`${minutes}:${seconds}`)
      console.log("elapsed="+totalSeconds / 60)
      
      //console.log("WPM: "+CalcWPM(totalSeconds/60))
      document.querySelector('.WPM').textContent = CalcWPM(totalSeconds/60)
      
    }, 1000);
}

function clearTimer(){
   console.log("timer Cleared!")
   document.querySelector('.time').textContent = '00:00';
    
}
function stopTimer() {
   console.log("timer Stoped!")
    clearInterval(timerInterval);
}

makeScreen(ScreenText)