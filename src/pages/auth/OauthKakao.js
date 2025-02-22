import { useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {callGetFindMemberAPI, callPostKakaoTokenAPI, callPostUserMeAPI} from "../../apis/KaKaoLoginAPI";
import AuthContext from "../../component/auth/AuthContext";
import Swal from "sweetalert2";

function OauthKakao() {

    const location = useLocation();
    const navigate = useNavigate();
    const urlParams = new URLSearchParams(location.search);
    const authorizationCode = urlParams.get('code');
    const authCtx = useContext(AuthContext);

    useEffect(() => {
        if (authorizationCode) {
            callPostKakaoTokenAPI(authorizationCode)
            .then((response) => {
                console.log('토큰 교환 성공:', response);
                const accessToken = response.access_token;
                authCtx.setAccessToken(accessToken);
                console.log('accessToken', accessToken);
                callGetFindMemberAPI(response)
                    .then((findMemberResponse) => {
                        console.log('서버에서 조회된 회원 정보:', findMemberResponse);
                        console.log('authCtx.accessToken : ', authCtx.accessToken);
                        const email = findMemberResponse.email;
                        const providerId = findMemberResponse.providerId;
                        authCtx.socialLogin(email, providerId);
                        navigate('/');
                    })
                    .catch((error) => {
                        console.error('서버에서 회원 조회 오류:', error);
                        let kakaoTokenId, email;
                        if(error.response.data.redirectTo === '/login') {
                            Swal.fire({
                                icon: 'warning',
                                title: '동일한 이메일이 이미 등록되어 있습니다.',
                                text: '비밀번호 찾기를 진행해 주세요.',
                                confirmButtonColor: '#1D7151',
                                iconColor: '#1D7151',
                                confirmButtonText: '확인', // confirm 버튼 텍스트 지정
                                });
                            navigate('/login');
                            return;
                        }

                        callPostUserMeAPI(accessToken)
                            .then((response) => {
                                console.log('사용자 정보 ! ', response);
                                console.log('카카오 id 값 : ',response.id);
                                console.log('카카오 email 값 : ',response.kakao_account.email);

                                kakaoTokenId = response.id;
                                email = response.kakao_account.email;

                            })
                            .catch((error) => {
                                console.error('accessToken 데이터 추출 오류 :', error);
                            })
                            .finally(() => {
                                if (error.response?.data?.redirectTo) {
                                    const redirectToWithCode = `/socialsignup?code=${authorizationCode}&kakaoTokenId=${kakaoTokenId}&email=${email}`;
                                    navigate(redirectToWithCode);
                                }
                            })
                    });
            })
            .catch((error) => {
                console.error('토큰 교환 오류 :', error);
            });
        }
    }, [authorizationCode, authCtx.accessToken]);

    return (
        <>
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Anton&display=swap');
            </style>
            <div className="simple-loader-area">
                <h1>LOADING...</h1>
            </div>
        </>
    );
};

export default OauthKakao;
