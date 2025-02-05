import { useState, useEffect } from 'react';
import './GameSpace.css';
import QUOTES from '../scripts/quotes.js';

export default function GameSpace({ state, setGameState }) {
    const [userAnswers, setUserAnswers] = useState([]);
    const [questionNumber, setQuestionNumber] = useState(1);
    const [score, setScore] = useState(0);
    const activeQuestionIndex = userAnswers.length;

    // Function to shuffle the order of answers
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function handleQuestionNumber() {
        setQuestionNumber((prevNumber) => prevNumber + 1);
    }

    function handleSelectAnswer(selectedAnswer) {
        const isCorrect = selectedAnswer === 'real_quote';
        setUserAnswers((prevUserAnswers) => [...prevUserAnswers, selectedAnswer]);

        if (isCorrect) {
            setScore((prevScore) => prevScore + 1);
            setGameState('correct'); // Transition to 'correct' state
            console.log('Sending to correct.')
        } else {
            setGameState('incorrect'); // Transition to 'incorrect' state
            console.log('Sending to incorrect.')
        }

        handleQuestionNumber();
    }


    // function handleScore(answersList) {
    //     const currentAnswer = answersList[answersList.length - 1];
    //     if (currentAnswer === 'real_quote') {
    //         setScore((prevScore) => prevScore + 1);
    //     }
    // }

    // Game over condition
    const isGameOver = activeQuestionIndex >= QUOTES.length;

    if (state === 'inactive') {
        return (
            <div id="question-container">
                <div id="game-over-screen">
                    <h2>Click on any of the modes to start a game of Deduction!</h2>
                    <h3>Choose how many deductions you want to make!</h3>
                </div>
            </div>
        );
    }

    if (state === 'inactive-user-error') {
        return (
            <div id="question-container">
                <div id="game-over-screen">
                    <h2>Error: Deduction cannot start.</h2>
                    <h3>You may have not specified how many deductions you want to make.</h3>
                </div>
            </div>
        );
    }

    if (state === 'loading') {
        return (
            <div id="question-container">
                <div id="game-over-screen">
                    <h2>Loading ...</h2>
                    <h3>Please wait for Deduction to begin.</h3>
                </div>
            </div>
        );
    }

    if (state === 'error') {
        return (
            <div id="question-container">
                <div id="game-over-screen">
                    <h2>Unfortunately, an error occurred.</h2>
                    <h3>Please try again.</h3>
                </div>
            </div>
        );
    }

    if (state === 'game-over' || isGameOver) {
        return (
            <div id="question-container">
                <div id="game-over-screen">
                    <div id="inner-game-over">
                        <h2>Game Over!</h2>
                        <h3>Your score is {score} out of {QUOTES.length}!</h3>
                        <button id="reload-button" onClick={() => window.location.reload()}>
                            Play Again?
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (state === 'incorrect') {
        return (
        <div id="question-container">
            <div id="game-over-screen">
                <div id="incorrect-screen">
                    <h2>Incorrect Answer!</h2>
                    <h3>Your current score is {score}.</h3>
                    <button id="continue-button" onClick={() => setGameState('active')}>Continue</button>
                </div>
            </div>
        </div>)
    }

    if (state === 'correct') {
        return (
        <div id="question-container">
            <div id="game-over-screen">
                <div id="correct-screen">
                    <h2>Correct Answer!</h2>
                    <h3>Your current score is {score}!</h3>
                    <button id="continue-button" onClick={() => setGameState('active')}>Continue</button>
                </div>
            </div>
        </div>)
    }

    const { fake_quote, real_quote, author } = QUOTES[activeQuestionIndex] || {};
    const answers = shuffleArray([
        { text: fake_quote, type: 'fake_quote' },
        { text: real_quote, type: 'real_quote' },
    ]);

    return (
        <div id="question-container">
            <h2>Question {questionNumber} of {QUOTES.length}</h2>
            <h3>Which quote was made by {author}?</h3>
            <div id="answers-grid-container">
                {answers.map((answer, index) => (
                    <div key={index} className="answer">
                        <button className="answer-button" onClick={() => handleSelectAnswer(answer.type)}>
                            {answer.text}
                        </button>
                    </div>
                ))}
            </div>
            <h4>Score: {score}</h4>
        </div>
    );
}