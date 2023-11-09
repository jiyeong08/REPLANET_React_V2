import '../../assets/css/reset.css'
import '../../assets/css/common.css';
import '../../assets/css/user.css';
import '../../assets/css/pay.css';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { callGetDonationByPayCodeAPI } from '../../apis/DonationAPI';
import { useLocation } from 'react-router-dom';

function Success() {

    // 뭔가 덕지덕지하긴함 리팩토링 생각해보기
    const dispatch = useDispatch();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const payCode = searchParams.get('number');
    console.log('Success() payCode : ', payCode);

    const pay = useSelector((state) => state.donationReducer);

    const donationDateTime= pay.refDonation ? (pay.refDonation.donationDateTime) : '';
    const formattedDateTime = formatDateTime(donationDateTime);
    const memberId= pay.refDonation ? (pay.refDonation.refMember.memberId) : '';
    const campaignTitle= pay.refDonation ? (pay.refDonation.refCampaign.campaignTitle) : '';
    const donationAmount= pay.refDonation ? formatAmount(pay.payAmount + pay.refDonation.donationPoint) : '';
    const payAmount= pay.refDonation ? formatAmount(pay.payAmount) : '';
    const donationPoint= pay.refDonation ? formatAmount(pay.refDonation.donationPoint) : '';


    function formatDateTime(dateTimeString) {
        const options = { 
                        year: 'numeric', 
                        month: '2-digit', 
                        day: '2-digit',
                        hour: '2-digit', 
                        minute: '2-digit', 
                        second: '2-digit'
                    };
        return new Date(dateTimeString).toLocaleString('ko-KR', options);
    }

    function formatAmount(amount) {
        return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    useEffect(
        () => {

            if (Object.keys(pay).length === 0) {
                dispatch(callGetDonationByPayCodeAPI(payCode));
            }
        },
        []
    );

    return(
        <>
            { Object.keys(pay).length === 0 ? (
                <>
                    <br/>
                    <br/>
                    <br/>
                    <div className="container-first">
                        <h3>로딩중...</h3>
                    </div>
                </>
            ) : (
                <>
                    <br/>
                    <br/>
                    <br/>
                    <div className="container-first">
                        <h1>{memberId}님의 기부 상세 내용</h1>
                        <br/>
                        <h3>캠페인이름 : {campaignTitle}</h3>
                        <h3>기부금액 : {donationAmount} 원</h3>
                        <h4> - 결제금액 : {payAmount} 원</h4>
                        <h4> - 포인트기부 : {donationPoint} 포인트</h4>
                        <h3>기부일자 : {formattedDateTime}</h3>
                        <br/>
                        <button>메인으로 돌아가기</button>
                    </div>
                </>
            )
            }
        </>
    );
}

export default Success;