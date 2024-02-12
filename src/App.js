import React, {useState, useEffect} from 'react';
import './App.css';
import polish_flag from './polish_flag.png';
import words_file from './5_letter_words_no_polish_chars.json';

function App() {
  const [firstRow, setFirstRow] = useState(['Q','W','E','R','T','Y','U','I','O','P']);  
  const [secondRow, setSecondRow] = useState(['A','S','D','F','G','H','J','K','L']);
  const [thirdRow, setThirdRow] = useState(['Z','X','C','V','B','N','M','\u232B']);
  const [typedWord, setTypedWord] = useState('');
  const [typedSum, setTypedSum] = useState(0);
  const [BackspaceCheck, setBackspaceCheck] = useState(false);
  const [solution, setSolution] = useState('');
  const [wrongLetters, setWrongLetters] = useState([]);
  const [correctLetters, setCorrectLetters] = useState([]);
  const [wrongPlaces, setWrongPlaces] = useState([]);
  const [bannedLetters, setBannedLetters] = useState(new Set());
  const [winStreak, setWinStreak] = useState(0);
  // set words manually
  // const [solutionExamples, setSolutionExamples] = useState(['ROWER','JUHAS','KASZA','RYBKA','TEMPO','ENZYM','MLECZ','CEZAR','PISMO','CZART','KWITA','TRAWA','OPERA','BANAN']);
  const [solutionExamples, setSolutionExamples] = useState('');
  const [previousSolution, setPreviousSolution] = useState('');

  // Handle key pressing
  function handleKeyDown(event) {
      try {
        if (solution === '') {
          const randomIndex = Math.floor(Math.random() * 888);
          setSolution(prev => (words_file.words[randomIndex].word).toUpperCase());
        }

        let alphabet = /^[a-zA-Z\b]+$/;
        // Check if the pressed key is the letter in the alphabet
        if (alphabet.test(event.key)) {

          if(event.key !== "Backspace") {
            let key_to_change = document.getElementById((event.key).toUpperCase());
            key_to_change.setAttribute('change_color_when_clicked', 1);
          }
  
          // Block already typed wrong letters
          if (!bannedLetters.has((event.key).toUpperCase())) {
            if(event.key === "Backspace") {
              if(typedWord.length > 0) {
                setBackspaceCheck(prev => true);
                setTypedWord(typedWord => typedWord + "'");
              }
            }
            else {
              setTypedWord(typedWord => typedWord + (event.key).toUpperCase());
              setTypedSum(prev => prev + 1);
            }
          }
        }
      } catch (e) {}
  }

  // Handle screen click
  function handleScreenClick(key) {
    try {
      if (solution === '') {
        const randomIndex = Math.floor(Math.random() * 888);
        setSolution(prev => (words_file.words[randomIndex].word).toUpperCase());
      }

      let alphabet = /^[a-zA-Z\⌫]+$/;

      if (alphabet.test(key)) {
        if(key !== "⌫") {
          let key_to_change = document.getElementById((key).toUpperCase());
          key_to_change.setAttribute('change_color_when_clicked', 1);
        }

        // Block already used wrong letters
        if (!bannedLetters.has((key).toUpperCase())) {
          if(key === "⌫") {
            if(typedWord.length > 0) {
              setBackspaceCheck(prev => true);
              setTypedWord(typedWord => typedWord + "'");
            }
          }
          else {
            setTypedWord(typedWord => typedWord + (key).toUpperCase());
            setTypedSum(prev => prev + 1);
          }
        }
      }
    } catch (e) {}
  }

  // Reset game, clear visuals
  function resetGame(win_check) {
    if (win_check === true) {
      setWinStreak(prev => prev + 1);
      document.getElementById("win_streak").setAttribute('animate_streak', 1);
    }

    setPreviousSolution(prev => solution);

    const randomIndex = Math.floor(Math.random() * 888);
    setSolution(prev => (words_file.words[randomIndex].word).toUpperCase());

    document.getElementById("previousSolution").classList.add("anim_previous");

    document.querySelectorAll('td').forEach((element) => {
      element.classList.remove('correct-letter');
      element.classList.remove('correct-letter-hidden');
      element.classList.remove('wrong-letter');
      element.classList.remove('wrong-letter-hidden');
      element.classList.remove('wrong-place');
      element.classList.remove('wrong-place-hidden');
      element.classList.remove('filled');
      element.classList.remove('filled2');
    });

    document.querySelectorAll('tr').forEach((element) => {
      element.classList.remove('wrong-letters-summary');
    });   
    
    document.querySelectorAll('td:not(.letter)').forEach((element) => {
      element.innerHTML = '';
    });

    setTypedWord(() => '');
    setTypedSum(() => 0);
    setWrongLetters(() => []);
    setCorrectLetters(() => []);
    setWrongPlaces(() => []);
    setBannedLetters(() => new Set());
  }

  // Fill the board 
  useEffect(() => {
    if (typedWord.length > 0 && typedSum < 31) {
      try {

        // Check if user wants to remove last letter
        if (BackspaceCheck === true) {
          setTypedWord(prev => typedWord.slice(0, -2));
          let board_place = document.getElementById("board-row-" + (Math.ceil(typedSum/5)) + "").childNodes[typedWord.length-2];

          board_place.classList.remove('correct-letter');
          board_place.classList.remove('correct-letter-hidden');
          board_place.classList.remove('wrong-letter');
          board_place.classList.remove('wrong-letter-hidden');
          board_place.classList.remove('wrong-place');
          board_place.classList.remove('wrong-place-hidden');
          board_place.classList.remove('filled');
          board_place.classList.remove('filled2');
          board_place.innerHTML = "";
          setTypedSum(prev => typedSum - 1);
          setBackspaceCheck(prev => false);
        }

        else {
          let board_place = document.getElementById("board-row-" + (Math.ceil(typedSum/5)) + "").childNodes[typedWord.length-1];
          board_place.innerHTML = typedWord.slice(-1);

          // Mark typed letters on the board and keyboard
          if (solution.includes(typedWord.slice(-1))) {
            if (typedWord.slice(-1) === solution[typedWord.length-1]) {
              board_place.classList.add(typedWord.slice(-1));
              board_place.classList.add("filled");    
              board_place.classList.add("correct-letter-hidden");    
              correctLetters.push(typedWord.slice(-1));

            } else {
              board_place.classList.add("filled");  
              board_place.classList.add("wrong-place-hidden");    
              wrongPlaces.push(typedWord.slice(-1));

            }
          } else {
            board_place.classList.add("wrong-letter-hidden");    

            // 2 different animations
            if(typedWord.length % 2 === 0) {
              board_place.classList.add("filled2");  
            }
            else {
              board_place.classList.add("filled");  
            }

            wrongLetters.push(typedWord.slice(-1));
          }      
      
          // Color all letters and reset row
          if (typedWord.length === 5) {
            if (typedWord === solution) {
              resetGame(true);
            } 
            else if (typedSum === 30) {
              resetGame(false);
            } else {
              wrongLetters.forEach(bannedLetters.add, bannedLetters);

              wrongLetters.forEach((letter) => {
                let letters_to_change = document.querySelectorAll("." + "wrong-letter-hidden");
                document.getElementById(letter).classList.add("wrong-letter");

                letters_to_change.forEach(letter => {
                  letter.className = "wrong-letter";
                });
              });

              correctLetters.forEach((letter) => {
                let letters_to_change = document.querySelectorAll("." + "correct-letter-hidden");
                document.getElementById(letter).classList.add("correct-letter");

                letters_to_change.forEach(letter => {
                  letter.className = "correct-letter";
                });
              });


              wrongPlaces.forEach((letter) => {
                let letters_to_change = document.querySelectorAll("." + "wrong-place-hidden");
                document.getElementById(letter).classList.add("wrong-place");

                letters_to_change.forEach(letter => {
                  letter.className = "wrong-place";
                });
              });

              setWrongLetters(pev => []);
              setCorrectLetters(pev => []);
              setWrongPlaces(pev => []);


              setTypedWord(() => '');
            }
        }

        }
      } catch(e) {}

    }
  }, [typedWord, typedSum, solution]);

  return (
    <div className="App" tabIndex={0} onKeyDown={handleKeyDown}>


      <aside>
        <div>
          <button onClick={() => resetGame(false)}>New word</button>

          <h1>
            Win streak: 
            <br></br>
            <span className="winStreak" id="win_streak" onAnimationEnd={(event) => event.target.setAttribute('animate_streak', 0) }>{winStreak}</span>
          </h1>
        </div>
      </aside>


      <section>

        <header className="App-header">
          <h1>
            Wordle 🧠
          </h1>
        </header>

        <table className="board">
          <tr id="board-row-1">
            <td></td><td></td><td></td><td></td><td></td>
          </tr>
          <tr id="board-row-2"> 
            <td></td><td></td><td></td><td></td><td></td>
          </tr>
          <tr id="board-row-3">
            <td></td><td></td><td></td><td></td><td></td>
          </tr>
          <tr id="board-row-4">
            <td></td><td></td><td></td><td></td><td></td>
          </tr>
          <tr id="board-row-5">
            <td></td><td></td><td></td><td></td><td></td>
          </tr>
          <tr id="board-row-6">
            <td></td><td></td><td></td><td></td><td></td>
          </tr>
        </table>

        <table className="keyboard">
          <tr>
            {firstRow.map((letter, index) => ( 
              <td className="letter" key={index} id={letter} onAnimationEnd={(event) => event.target.setAttribute('change_color_when_clicked', 0) } onClick={()=>handleScreenClick(letter)}>{letter}</td>
              ))}
          </tr>
          <tr>
            {secondRow.map((letter, index) => (
              <td className="letter" key={index} id={letter} onAnimationEnd={(event) => event.target.setAttribute('change_color_when_clicked', 0) } onClick={()=>handleScreenClick(letter)}>{letter}</td>
            ))}
          </tr>
          <tr>
            {thirdRow.map((letter, index) => (
              <td className="letter" key={index} id={letter} onAnimationEnd={(event) => event.target.setAttribute('change_color_when_clicked', 0) } onClick={()=>handleScreenClick(letter)}>{letter}</td>
              ))}
          </tr>
        </table>

      </section>


      <aside>
        <h3>Polish words <img class="polish_flag" src={polish_flag} alt="polish_flag" /></h3>
        <h2>Previous solution: <br></br> <span className="previousSolution" id="previousSolution" onAnimationEnd={(event) => event.target.classList.remove("anim_previous")}>{previousSolution}</span></h2>
        <div className="info-container">

          <div className="color-green"></div>
          <span>It's the correct letter</span>

          <div className="color-yellow"></div>
          <span>It's in the wrong spot</span>

          <div className="color-red"></div>
          <span>The letter isn't in the word</span>

        </div>
      </aside>


    </div>
  );
}

export default App;
