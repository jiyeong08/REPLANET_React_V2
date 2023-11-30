import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";


function BubbleList() {
    const callApiResult = useSelector(state => state.supportbotReducer)
    const supportbotDataList = callApiResult.supportbotDataList.results.allSupportData;
    
    const questionContentArray = supportbotDataList.map((question) => question.questionContent)
    const answerArray = supportbotDataList.map((answer) => answer.answerContent) 

    /* 말풍선 리스트 상태 */
    const [bubbles, setBubbles] = useState(supportbotDataList)
    const [madeKey, setMadekey] = useState(6);
    const [anyQuestion, setAnyQuestion] = useState(false)

    const scrollRef = useRef();

    const scrollToBottom = () => {
        if(scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    };

    const scrollToTop = () => {
        if(scrollRef.current) {
            scrollRef.current.scrollTop = 0;
        }
    }

    useEffect(() => {
        scrollToBottom();
    },[bubbles]);
    
    /* 질문을 눌렀을 경우 기존 말풍선 리스트에 답변 말풍선을 추가하고 싶음 */
    let requestCssClass = "requestBoxClass"
    let responseCssClass = "responseBoxClass"
    
    const QuestionClickHandler = (questionCode) => {
        
        const changeBubbles = bubbles.concat({
            key: madeKey,
            questionCode: madeKey,
            questionContent: questionContentArray[questionCode-1],
            cssCondition: requestCssClass
        },
        {
            key: madeKey + 1,
            questionCode: madeKey + 1,
            questionContent: answerArray[questionCode-1],
            cssCondition: responseCssClass
        });
        // console.log(changeBubbles);
        setMadekey(madeKey + 3);
        setBubbles(changeBubbles);
        setAnyQuestion(true);
        scrollToBottom();
    }

    const ResetClickHandler = () => {
        setAnyQuestion(false)
        setBubbles(supportbotDataList)
    }

    const ScrollTopClickHandler = () => {
        scrollToTop();
    }
    
    return(
        <div 
            className="modal-scroll-box"
            ref={scrollRef}
        >
            <div className="modal-intro">
            {`같이의 가치 :) 작은 행동으로도 지구에 변화를 줄 수 있다! 안녕하세요 리플래닛입니다. 무엇을 도와드릴까요?`}
            </div>
            {bubbles.map((question) => (
                <div
                    key={question.questionCode}
                    className={
                        question.cssCondition === requestCssClass ? "requset-box" : 
                        question.cssCondition === responseCssClass ? "response-box" : "click-box"
                    }
                    onClick={() => QuestionClickHandler(question.questionCode)}
                >
                    {question.questionContent}
                </div> 
            ))}
            {anyQuestion && 
                <div
                    className="reset-box"
                    onClick={() => ResetClickHandler()}
                >
                    처음으로
                </div>
            }
            {anyQuestion && 
                <div
                    className="scroll-top-box"
                    onClick={() => ScrollTopClickHandler()}
                >
                    위로 가기
                </div>
            }
        </div>
        
    );

}
export default BubbleList;