import React, { useEffect, useState } from 'react';
import { message } from 'antd';
import { showLoading, hideLoading } from "../../../redux/loaderSlice";
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getExamById } from '../../../apicalls/exams';
import { addReport } from '../../../apicalls/reports';
import Instruction from './Instruction';

function WriteExam() {
    const [examData, setExamData] = React.useState(null);
    const [questions = [], setQuestions] = React.useState([]);
    const [selectedQuestionIndex, setSelectedQuestionIndex] = React.useState(0);
    const [selectedOptions, setSelectedOptions] = React.useState({});
    const [result = {}, setResult] = React.useState({});
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const params = useParams();
    const [view, setView] = useState("instructions");
    const [secondsLeft = 0, setSecondsLeft] = useState(0);
    const [timeUp, setTimeUp] = useState(false);
    const [intervalId, setIntervalId] = useState(null);
    const { user } = useSelector(state => state.users);

    // get exam data by id
    const getExamData = async () => {
        try {
            dispatch(showLoading());
            const response = await getExamById({
                examId: params.id
            });
            dispatch(hideLoading());
            if (response.data) {
                setExamData(response.data);
                setQuestions(response.data.questions);
                setSecondsLeft(response.data.duration);
            } else {
                message.error(response.message);
            }
        } catch (error) {
            dispatch(hideLoading())
            message.error(error.message);
        }
    }

    // calculate result
    const calculateResult = async () => {
        try {
            let correctAnswers = [];
            let wrongAnswers = [];

            questions.forEach((question, index) => {
                if (question.correctOption === selectedOptions[index]) {
                    correctAnswers.push(question);
                } else {
                    wrongAnswers.push(question)
                }
            });

            let verdict = "Pass";
            if (correctAnswers.length < examData.passingMarks) {
                verdict = "Fail";
            }

            const tempResult = {
                correctAnswers,
                wrongAnswers,
                verdict
            }
            setResult(tempResult);
            dispatch(showLoading);
            // Save exam result in to DB
            const response = await addReport({
                exam: params.id,
                result: tempResult,
                user: user._id
            });
            dispatch(hideLoading);
            if (response.success) {
                setView("result");
            } else {
                message.error(response.message);
            }
        } catch (error) {
            dispatch(hideLoading);
            message.error(error.message);
        }
    };

    const startTimer = () => {
        let totalSeconds = examData.duration;
        const intervalId = setInterval(() => {
            if (totalSeconds > 0) {
                totalSeconds = totalSeconds - 1;
                setSecondsLeft(totalSeconds);
            } else {
                setTimeUp(true);
            }
        }, 1000);
        setIntervalId(intervalId);
    }

    useEffect(() => {
        if (timeUp && view === 'questions') {
            clearInterval(intervalId);
            calculateResult();
        }
    }, [timeUp]);

    useEffect(() => {
        if (params.id) {
            getExamData();
        }
    }, []);

    return (
        examData && <div className='mt-2'>
            <div className="divider"></div>
            <h1 className="text-center">
                {examData.name}
            </h1>
            <div className="divider"></div>

            {view === "instructions" && (<Instruction examData={examData} view={view} setView={setView} startTimer={startTimer} />)}

            {view === "questions" && (
                <div className="flex flex-col gap-2">
                    <div className="flex justify-between">
                        <h1 className="text-2xl">
                            {selectedQuestionIndex + 1} : {" "}
                            {questions[selectedQuestionIndex].name}
                        </h1>

                        <div className="timer">
                            <span className="text-2xl">{secondsLeft}</span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        {Object.keys(questions[selectedQuestionIndex].options).map((option, index) => {
                            return <div
                                className={`flex gap-2 flex-col ${selectedOptions[selectedQuestionIndex] === option ? "selected-option" : "question-option"
                                    }`}
                                key={index}
                                onClick={() => {
                                    setSelectedOptions({
                                        ...selectedOptions, [selectedQuestionIndex]: option,
                                    })
                                }}
                            >
                                <h1 className="text-xl">
                                    {option} : {questions[selectedQuestionIndex].options[option]}
                                </h1>
                            </div>
                        })}
                    </div>

                    <div className="flex justify-between">
                        {selectedQuestionIndex > 0 && (
                            <button className="primary-outlined-btn" onClick={() => {
                                setSelectedQuestionIndex(selectedQuestionIndex - 1);
                            }}>
                                Previous
                            </button>
                        )}

                        {selectedQuestionIndex < questions.length - 1 && (
                            <button className="primary-cotained-btn" onClick={() => {
                                setSelectedQuestionIndex(selectedQuestionIndex + 1);
                            }}>
                                Next
                            </button>
                        )}

                        {selectedQuestionIndex === questions.length - 1 && (
                            <button className="success-outlined-btn" onClick={() => {
                                clearInterval(intervalId);
                                setTimeUp(true);
                            }}>
                                Submit
                            </button>
                        )}
                    </div>
                </div>)}

            {view === "result" && (
                <div className="flex items-center mt-2 justify-center result">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-2xl"><strong>RESULT</strong></h1>
                        <div className='divider'></div>
                        <div className="marks">
                            <h1 className="text-md">Total Marks : {examData.totalMarks}</h1>
                            <h1 className="text-md">
                                Obtained Marks : {result.correctAnswers.length}
                            </h1>
                            <h1 className="text-md">
                                Wrong Answers : {result.wrongAnswers.length}
                            </h1>
                            <h1 className="text-md">
                                Passing Marks : {examData.passingMarks}
                            </h1>
                            <h1 className="text-md">VERDICT : <strong><u>{result.verdict}</u></strong></h1>
                            <div className="flex gap-2 mt-2">
                                <button
                                    className="primary-cotained-btn"
                                    onClick={() => {
                                        setView("instructions");
                                        setSelectedQuestionIndex(0);
                                        setSelectedOptions({});
                                        setSecondsLeft(examData.duration);
                                    }}
                                >
                                    Retake Exam
                                </button>
                                <button
                                    className="success-outlined-btn"
                                    onClick={() => {
                                        setView("review");
                                    }}
                                >
                                    Review Answers
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="lootie-animation">
                        {result.verdict == "Pass" && <lottie-player
                            src="https://lottie.host/90af7d0e-6508-4980-9d9d-5e3167d9b9c8/EybUPrwwQw.json" background="#FFFFFF"
                            speed="1"
                            loop
                            autoplay
                            direction="1"
                            mode="normal"
                        >
                        </lottie-player>
                        }

                        {result.verdict == "Fail" && <lottie-player
                            src="https://lottie.host/ffe4ec2d-adb4-4b43-9419-d637f49a7bce/qNV4Rpgk7K.json" background="#FFFFFF"
                            speed="1"
                            loop
                            autoplay
                            direction="1"
                            mode="normal"
                        >
                        </lottie-player>
                        }
                    </div>
                </div>
            )}

            {view === "review" && <div className="flex flex-col gap-2">
                {questions.map((question, index) => {
                    const isCorrect = question.correctOption === selectedOptions[index];
                    return <div className={
                        `flex flex-col gap-1 p-2 ${isCorrect ? "bg-success" : "bg-error"}`
                    }>
                        <h1 className="text-xl">{index + 1} : {question.name}</h1>
                        <h1 className="text-md">Submitted Answer : {selectedOptions[index]} - {question.options[selectedOptions[index]]}</h1>
                        <h1 className="text-md">
                            Correct Answer : {question.correctOption} - {question.options[question.correctOption]}
                        </h1>
                    </div>
                })}

                <div className="flex justify-center gap-2">
                    <button
                        className="primary-outlined-btn"
                        onClick={() => {
                            navigate('/');
                        }}
                    >
                        Close
                    </button>
                    <button
                        className="primary-cotained-btn"
                        onClick={() => {
                            setView("instructions");
                            setSelectedQuestionIndex(0);
                            setSelectedOptions({});
                            setSecondsLeft(examData.duration);
                        }}
                    >
                        Retake Exam
                    </button>
                </div>
            </div>}
        </div>
    )
}

export default WriteExam
