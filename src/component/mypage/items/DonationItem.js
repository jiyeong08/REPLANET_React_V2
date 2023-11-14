import { useNavigate } from "react-router-dom";

function DonationItem({ pay }) {

    const { refDonation } = pay;
    const { refCampaign } = refDonation;

    const { donationCode, donationPoint } = refDonation;
    const { campaignTitle } = refCampaign;
    const { orgName } = refCampaign;
    const totalAmount = pay.payAmount + donationPoint
    const { donationDateTime }= refDonation;

    const formattedTotalAmount = totalAmount.toLocaleString('ko-KR');

    const date = new Date(...donationDateTime);

    const formattedDateTime = date.toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });

    const navigate = useNavigate();

    const handleRowClick = () => {
        console.log('선택한 해당 캠페인 코드 : ', refCampaign.campaignCode);
        navigate(`/campaign/${refCampaign.campaignCode}`);
    }

    return(
        <>
            {/* 해당 캠페인으로 가는 링크 걸기 */}
            <tr onClick={handleRowClick}>
                <td>{ donationCode }</td>
                <td>{ campaignTitle }</td>
                <td>{ orgName }</td>
                <td>{ formattedTotalAmount }원</td>
                <td>{ formattedDateTime }</td>
            </tr>
        </>
    );
}

export default DonationItem;