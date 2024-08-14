const capIcon = document.querySelector('.cap_icon');
const holderIcon = document.querySelector('.holder_icon');
const capIconMoved = document.querySelector('.cap_icon_moved');
const holderIconMoved = document.querySelector('.holder_icon_moved');
const cupIcon = document.querySelector('.cup_icon');
const cup2Icon = document.querySelector('.cup2_icon');
const recycleIcon = document.querySelector('.recycle_icon');
const recycle1Icon = document.querySelector('.recycle1_icon');
const recycle2Icon = document.querySelector('.recycle2_icon');
const recycle3Icon = document.querySelector('.recycle3_icon');
const showerHeadIcon = document.querySelector('.shower_head_icon');
const wash1Icon = document.querySelector('.wash1_icon');
const wash2Icon = document.querySelector('.wash2_icon');
const defaultIcon = document.querySelector('.default_img');


const stageText = document.querySelector('.state_text');


const stateIcon = document.querySelector('.state_icon');
const cupInfoText = document.querySelector('.cup_info_text');

var socket = io('http://localhost:5111');

var cup_info;
var holder_exist;
var entrance_size;
var cup_size;

// 서버로부터 'state update' 이벤트 수신
socket.on('state update', function(data) {
    console.log(data);
    // document.getElementById('state').textContent = data['current main state'];
});

// 서버로부터 'cup update' 이벤트 수신
socket.on('cup update', function(data) {
    cup_info = data.cup;
    
    cup_info = cup_info >> 5;
    
    cup_size = cup_info & 0x03;

    cup_info = cup_info >> 2;
    holder_exist = cup_info & 0x01;

    console.log(holder_exist, cup_size);
    
    // document.getElementById('cup').textContent = data['cup'];
});

// WebSocket 연결 확인
socket.on('connect', function() {
    console.log('WebSocket connected.');
});

// WebSocket 연결 끊김 확인
socket.on('disconnect', function() {
    console.log('WebSocket disconnected.');
});
var current_stage = 0;



document.addEventListener('DOMContentLoaded', function () {
    // setTimeout(()=>{
    //     stage1();
    // }, 5000);
    // setTimeout(()=>{
    //     stage2();
    // }, 8000);
    // setTimeout(()=>{
    //     stage3();
    // }, 14000);
    // setTimeout(()=>{
    //     getBonobono();
    // })

    // next_cup();
});

// document.addEventListener('DOMContentLoaded', function () {

//     async function fetchData() {
//         try {
//             const response = await fetch('http://203.252.136.226:8080/device/test');
//             const data = await response.json();
            
//             if (data.result.stage == 1 && current_stage != 1) {
//                 stage1();
//                 current_stage = 1;

//             }
//         } catch (error) {
//             console.error('Error fetching data:', error);
//         }
//     }

//     setInterval(fetchData, 1000); // 1초마다 fetchData 함수 호출
// });

function stage1(){
    startAnimationStage1();
}

function startAnimationStage1() {
    defaultIcon.classList.add('hidden');
    capIcon.classList.remove('hidden');
    holderIcon.classList.remove('hidden');
    cup2Icon.classList.remove('hidden');

    stageText.textContent = '뚜껑, 홀더 분리 단계';

    capIcon.classList.add('moveUp');
    holderIcon.classList.add('moveDown');

    capIcon.addEventListener('animationend', handleMoveEnd, { once: true });
    holderIcon.addEventListener('animationend', handleMoveEnd, { once: true });
}


function handleBlinkEnd(event) {
    const element = event.target;
    element.classList.remove('blink');
    element.classList.add('hidden');

    cupIcon.classList.remove('hidden');
    cup2Icon.classList.add('hidden');
    stageText.textContent = '뚜껑, 홀더 분리 완료';
}


function handleMoveEnd(event) {
    const element = event.target;
    if (element.classList.contains('moveUp')) {
        element.classList.remove('moveUp');
    } else if (element.classList.contains('moveDown')) {
        element.classList.remove('moveDown');
    }

    element.classList.add('hidden');
    capIconMoved.classList.remove('hidden');
    holderIconMoved.classList.remove('hidden');
    
    setTimeout(() => {
        capIconMoved.classList.add('blink');
        holderIconMoved.classList.add('blink');
    }, 300); // 잠시 멈추고 깜빡임 시작

    capIconMoved.addEventListener('animationend', handleBlinkEnd, { once: true });
    holderIconMoved.addEventListener('animationend', handleBlinkEnd, { once: true });
}


function stage2(){
    startAnimationStage2();
}

function startAnimationStage2(){
    defaultIcon.classList.add('hidden');
    cupIcon.classList.add('moveDownCup');

    cupIcon.addEventListener('animationend', () => {
        showerHeadIcon.classList.remove('hidden');
        stageText.textContent = '컵 세척 중';

        setTimeout(() => {
            wash1Icon.classList.remove('hidden');
            wash2Icon.classList.remove('hidden');
        }, 300)
    }, { once: true });
}

function stage3(){
    startAnimationStage3();
}

function startAnimationStage3(){
    defaultIcon.classList.add('hidden');
    cupIcon.classList.add('hidden');
    showerHeadIcon.classList.add('hidden');
    wash1Icon.classList.add('hidden');
    wash2Icon.classList.add('hidden');

    recycle1Icon.classList.remove('hidden');
    recycle2Icon.classList.remove('hidden');
    recycle3Icon.classList.remove('hidden');
    // recycleIcon.classList.remove('hidden');
    // recycleIcon.classList.add('rotate');

    stageText.textContent = '컵 재활용 분류 중';
}

function next_cup(){
    const currentCupDiv = document.querySelector(".current_cup");
    const nextCupDiv = document.querySelector(".next_cup");
    const iconDiv = document.querySelector(".state_icon_div");

    // 서버에서 값을 받아오는 함수 (예제용으로 랜덤 값을 생성)
    const fetchCupInfos = () => {
        // 이 예제에서는 0, 1, 2를 랜덤하게 반환
        const cupInfos = Math.floor(Math.random() * 3);
        return cupInfos;
    };

    // 애니메이션 및 레이아웃 조정 함수
    const updateLayout = (cupInfos) => {
        if (cupInfos <= 1) {
            // next_cup이 오른쪽으로 사라지는 애니메이션
            nextCupDiv.classList.add("slide-out-right");
            nextCupDiv.classList.remove("slide-in-right");
            // current_cup이 가운데 정렬되고 너비가 확장
            currentCupDiv.classList.add("align-cup-div-center");
            currentCupDiv.classList.remove("align-cup-div-left");
            // icon_div가 가운데 정렬되고 너비가 확장
            iconDiv.classList.add("align-icon-div-center");
            iconDiv.classList.remove("align-icon-div-left");
        } else {
            // next_cup이 오른쪽에서 나오는 애니메이션
            nextCupDiv.classList.remove("slide-out-right");
            nextCupDiv.classList.add("slide-in-right");
            // current_cup이 다시 원래 너비로 축소
            currentCupDiv.classList.remove("align-cup-div-center");
            currentCupDiv.classList.add("align-cup-div-left");
            // iconDiv가 다시 원래 너비로 축소
            iconDiv.classList.remove("align-icon-div-center");
            iconDiv.classList.add("align-icon-div-left");
        }
    };

    setInterval(() => {
        const cupInfos = fetchCupInfos();
        updateLayout(cupInfos);
    }, 2000); // 1초마다 실행
}

function getBonobono(){
    
}