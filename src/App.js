import React, {useState, useEffect} from 'react';
import './App.css';

function App() {
  const [firstRow, setFirstRow] = useState(['Q','W','E','R','T','Y','U','I','O','P']);  
  const [secondRow, setSecondRow] = useState(['A','S','D','F','G','H','J','K','L']);
  const [thirdRow, setThirdRow] = useState(['Z','X','C','V','B','N','M']);
  const [typedWord, setTypedWord] = useState('');
  const [typedSum, setTypedSum] = useState(0);
  const [solution, setSolution] = useState('');
  const [wrongLetters, setWrongLetters] = useState([]);
  const [bannedLetters, setBannedLetters] = useState(new Set());
  const [winStreak, setWinStreak] = useState(0);
  const [solutionExamples, setSolutionExamples] = useState(['ROWER','JUHAS','KASZA','RYBKA','TEMPO','ENZYM','MLECZ','CEZAR','PISMO','CZART','KWITA','TRAWA','OPERA', 'BANAN']);
  const [previousSolution, setPreviousSolution] = useState('');

  // Handle key pressing
  function handleKeyDown(event) {
      try {
        if (solution === '') {
          setSolution(prev => solutionExamples[Math.floor(Math.random()*solutionExamples.length)]);
        }

        let alphabet = /^[a-zA-Z]+$/; 

        if (alphabet.test(event.key)) {
          let key_to_change = document.getElementById((event.key).toUpperCase());
          key_to_change.setAttribute('change_color_when_clicked', 1);
  
          // Block already used wrong letters
          if (!bannedLetters.has((event.key).toUpperCase())) {
            setTypedWord(typedWord => typedWord + (event.key).toUpperCase());
            setTypedSum(prev => prev + 1)
          }
        }
      } catch (e) {}
  }

  // Handle screen click
  function handleScreenClick(key) {
    try {
      let alphabet = /^[a-zA-Z]+$/; 

      if (alphabet.test(key)) {
        let key_to_change = document.getElementById((key).toUpperCase());
        key_to_change.setAttribute('change_color_when_clicked', 1);

        // Block already used wrong letters
        if (!bannedLetters.has((key).toUpperCase())) {
          setTypedWord(typedWord => typedWord + (key).toUpperCase());
          setTypedSum(prev => prev + 1)
        }
      }
    } catch (e) {}
  }

  // Reset game
  function resetGame(win_check) {
    if (win_check === true) {
      setWinStreak(prev => prev + 1);
    }

    setPreviousSolution(prev => solution);
    setSolution(prev => solutionExamples[Math.floor(Math.random()*solutionExamples.length)]);

    document.getElementById("previousSolution").classList.add("anim_previous");

    document.querySelectorAll('td').forEach((element) => {
      element.classList.remove('correct-letter');
      element.classList.remove('wrong-letter');
      element.classList.remove('wrong-place');
      element.classList.remove('filled');
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
    setBannedLetters(() => new Set());
  }

  // Fill the board 
  useEffect(() => {
    if (typedWord.length > 0 && typedSum < 31) {
      try {
        let board_place = document.getElementById("board-row-" + (Math.ceil(typedSum/5)) + "").childNodes[typedWord.length-1];
        console.log(typedWord.length, (Math.ceil(typedSum/5)), board_place, typedWord);
        board_place.innerHTML = typedWord.slice(-1);

        // Mark typed letters on the board and keyboard
        if (solution.includes(typedWord.slice(-1))) {
          if (typedWord.slice(-1) === solution[typedWord.length-1]) {
            board_place.classList.add("correct-letter");
            document.getElementById(typedWord.slice(-1)).classList.add("correct-letter");
          } else {
            board_place.classList.add("wrong-place");
            document.getElementById(typedWord.slice(-1)).classList.add("wrong-place");
          }
        } else {
          board_place.classList.add("filled");  
          wrongLetters.push(typedWord.slice(-1));
        }      
    
        // Mark wrong letters and reset row
        if (typedWord.length === 5) {
          if (typedWord === solution) {
            resetGame(true);
          } 
          else if (typedSum === 30) {
            resetGame(false);
          } else {
            wrongLetters.forEach(bannedLetters.add, bannedLetters);
            wrongLetters.forEach((letter) => {
              document.getElementById(letter).classList.add("wrong-letter");
            });
            document.getElementById("board-row-" + (Math.ceil(typedSum/5)) + "").classList.add("wrong-letters-summary");
            setTypedWord(() => '');
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
            <span className="winStreak">{winStreak}</span>
          </h1>
        </div>
      </aside>


      <section>

        <header className="App-header">
          <h1>
            Wordle
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
              <td className="letter" key={index} onAnimationEnd={(event) => event.target.setAttribute('change_color_when_clicked', 0) } id={letter} onClick={()=>handleScreenClick(letter)}>{letter}</td>
              ))}
          </tr>
          <tr>
            {secondRow.map((letter, index) => (
              <td className="letter" key={index} onAnimationEnd={(event) => event.target.setAttribute('change_color_when_clicked', 0) } id={letter} onClick={()=>handleScreenClick(letter)}>{letter}</td>
            ))}
          </tr>
          <tr>
            {thirdRow.map((letter, index) => (
              <td className="letter" key={index} onAnimationEnd={(event) => event.target.setAttribute('change_color_when_clicked', 0) } id={letter} onClick={()=>handleScreenClick(letter)}>{letter}</td>
              ))}
          </tr>
        </table>

      </section>


      <aside>
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
