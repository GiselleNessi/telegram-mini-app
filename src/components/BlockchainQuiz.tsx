/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { useState } from "react";
import { ConnectButton, TransactionButton, useActiveAccount, useActiveWallet, useDisconnect, useReadContract } from "thirdweb/react";
import { client } from "../client";
import { inAppWallet } from "thirdweb/wallets";
import { shortenAddress } from "thirdweb/utils";
import { getContract } from "thirdweb";
import { baseSepolia } from "thirdweb/chains";
import { claimTo, getBalance } from "thirdweb/extensions/erc20";
import backgroundImage from '../assets/telegram.png';

// Quiz questions and answers
const questions = [
    {
        question: "What is the main purpose of a hackathon?",
        options: [
            "To compete in hacking secure systems",
            "To build collaborative projects in a short period",
            "To attend coding workshops"
        ],
        answer: "To build collaborative projects in a short period",
    },
    {
        question: "Why is women's representation important in hackathons?",
        options: [
            "It increases coding speed",
            "It brings diverse perspectives and fosters innovation",
            "It balances the event ratio"
        ],
        answer: "It brings diverse perspectives and fosters innovation",
    },
    {
        question: "Which of these organizations supports women in tech and hackathons?",
        options: [
            "SheHacks",
            "MenWhoCode",
            "CodeMasters"
        ],
        answer: "SheHacks",
    },
    {
        question: "How can hackathons help bridge the gender gap in tech?",
        options: [
            "By providing mentorship and collaborative platforms for women",
            "By organizing longer events",
            "By focusing on advanced tech skills only"
        ],
        answer: "By providing mentorship and collaborative platforms for women",
    }
];



export default function BlockchainQuiz() {
    const account = useActiveAccount();
    const { disconnect } = useDisconnect();
    const wallet = useActiveWallet();

    const contract = getContract({
        client: client,
        chain: baseSepolia,
        address: "0x2bdDFAba4C52bD09fb8b4608C2c3b34d51Db3C2e"
    });

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [result, setResult] = useState<string | null>(null);
    const [score, setScore] = useState(0);
    const [showPrize, setShowPrize] = useState<boolean>(false);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [prizeClaimed, setPrizeClaimed] = useState<boolean>(false);

    const currentQuestion = questions[currentQuestionIndex];

    const handleAnswerClick = (answer: string) => {
        setSelectedAnswer(answer);
        if (answer === currentQuestion.answer) {
            setResult("Correct!");
            setScore(score + 10);  // Increment score for correct answer
        } else {
            setResult(`Incorrect! The correct answer was: ${currentQuestion.answer}`);
        }
    };

    const nextQuestion = () => {
        setSelectedAnswer(null);
        setResult(null);
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            setShowPrize(true);  // End of quiz
        }
    };

    const claimPrize = () => {
        setShowModal(true);
    };

    const { data: tokenbalance } = useReadContract(
        getBalance,
        {
            contract: contract,
            // biome-ignore lint/style/noNonNullAssertion: <explanation>
            address: account?.address!,
        }
    );

    const resetQuiz = () => {
        setCurrentQuestionIndex(0);  // Start from the first question again
        setScore(0);                 // Reset the score
        setSelectedAnswer(null);     // Clear the selected answer
        setResult(null);             // Clear the result message
        setShowPrize(false);         // Hide the prize section
        setPrizeClaimed(false);      // Reset the prize claimed status
    };


    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            width: '100%',
            backgroundColor: '#000',
            color: '#333',
            overflow: 'hidden',
            boxSizing: 'border-box',
        }}>
            <img
                src={backgroundImage}
                alt="Quiz"
                style={{
                    width: '100%',
                    maxWidth: '300px',
                }}
            />
            <div style={{
                padding: '1.5rem',
                margin: '0 1rem',
                width: '100%',
                height: 'auto',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                position: 'relative',
                color: 'white'
            }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '2rem', textAlign: 'center', color: 'white' }}>Blockchain Quiz</h1>
                {!account ? (
                    <ConnectButton
                        client={client}
                        accountAbstraction={{
                            chain: baseSepolia,
                            sponsorGas: true
                        }}
                        wallets={[
                            inAppWallet({
                                auth: {
                                    options: ["email", "discord", "farcaster", "x"]
                                }
                            })
                        ]}
                    />
                ) : (
                    <>
                        <div style={{ display: 'flex', justifyContent: 'center', width: '100%', padding: '10px' }}>
                            <div style={{ padding: '20px' }}>
                                <p>{shortenAddress(account.address)}</p>
                                <p>Balance: {tokenbalance?.displayValue}</p>
                            </div>
                            {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
                            <button
                                // biome-ignore lint/style/noNonNullAssertion: <explanation>
                                onClick={() => disconnect(wallet!)}
                                style={{
                                    margin: '40px',
                                    background: '#dc3545',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                            >Logout</button>
                        </div>
                        {!showPrize ? (
                            <div>
                                <h2>Question {currentQuestionIndex + 1}</h2>
                                <p>{currentQuestion.question}</p>
                                {currentQuestion.options.map((option) => (
                                    // biome-ignore lint/a11y/useButtonType: <explanation>
                                    <button
                                        key={option}
                                        onClick={() => handleAnswerClick(option)}
                                        disabled={!!selectedAnswer}
                                        style={{
                                            padding: '10px',
                                            margin: '5px',
                                            backgroundColor: selectedAnswer === option ? "#007bff" : "#f0f0f0",
                                            color: selectedAnswer === option ? "white" : "black",
                                            cursor: 'pointer',
                                        }}
                                    >
                                        {option}
                                    </button>
                                ))}
                                {result && (
                                    <>
                                        <p>{result}</p>
                                        {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
                                        <button onClick={nextQuestion} style={{ padding: "10px", backgroundColor: "#28a745", color: "white" }}>
                                            {currentQuestionIndex < questions.length - 1 ? "Next Question" : "Finish Quiz"}
                                        </button>
                                    </>
                                )}
                            </div>
                        ) : (
                            <div>
                                <h2>Quiz Complete! Your score: {score}</h2>
                                {showPrize && !prizeClaimed && (
                                    // biome-ignore lint/a11y/useButtonType: <explanation>
                                    <button
                                        onClick={claimPrize}
                                        style={{
                                            padding: '0.5rem 1rem',
                                            background: '#fff',
                                            color: 'black',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            marginRight: '10px'
                                        }}
                                    >Claim Prize</button>
                                )}
                                {showModal && (
                                    <div style={{
                                        position: 'fixed',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}>
                                        <div style={{
                                            background: 'black',
                                            padding: '2rem',
                                            borderRadius: '8px',
                                            maxWidth: '300px',
                                            textAlign: 'center',
                                            border: '2px solid white'
                                        }}>
                                            <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Claim {score} Tokens!</h2>

                                            {/* Make sure the claimTo transaction is executed */}
                                            <TransactionButton
                                                transaction={() => claimTo({
                                                    contract: contract,        // The contract instance to send the tokens from
                                                    to: account.address,       // The recipient's wallet address
                                                    quantity: score.toString() // The number of tokens to transfer
                                                })}
                                                onTransactionConfirmed={() => {
                                                    alert('Prize claimed!');
                                                    setShowModal(false);
                                                    setPrizeClaimed(true);
                                                }}
                                                style={{
                                                    padding: '0.5rem 1rem',
                                                    background: '#28a745',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '4px',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                Claim Prize
                                            </TransactionButton>
                                        </div>
                                    </div>
                                )}

                                {showPrize && (
                                    // biome-ignore lint/a11y/useButtonType: <explanation>
                                    <button
                                        onClick={resetQuiz}
                                        style={{
                                            padding: '0.5rem 1rem',
                                            background: '#007bff',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            marginTop: '1rem'
                                        }}
                                    >
                                        Restart Quiz
                                    </button>
                                )}

                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
