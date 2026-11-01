// @ts-nocheck
/* eslint-disable */
// v23 게임 스크립트 (이름 변경 후 직접 관리). 조금씩 떼어내 src/config, src/engine, src/games 로 옮겨요.
// 주의: scripts/extract_v23.py 로 다시 생성하면 떼어낸 작업이 사라져요.
import { GAMES, TIER_FEATURES, LEVEL_CHALLENGES, INTRO_GUIDES, STATION_LOOKS } from '@/config/games';
import { ISLANDS, REGIONS, STATIONS, WEATHER_MODES } from '@/config/islands';
import { DECOR_CATALOG } from '@/config/decor';
import { gameStore } from '@/store/gameStore';
import { ACCEPTED_VERSIONS, createDefaultState, sanitizeSave, serializeSave as serializeSaveData } from '@/store/saveData';

export function bootV23(opts) {
// 설정 데이터는 src/config 에서 가져와요. 레거시 코드가 값을 바꿔도 원본이 안 바뀌게 복사해요.
const games=structuredClone(GAMES), tierFeatures=structuredClone(TIER_FEATURES), levelChallenges=structuredClone(LEVEL_CHALLENGES);
const introGuides=structuredClone(INTRO_GUIDES), stationLooks=structuredClone(STATION_LOOKS);
const islands=structuredClone(ISLANDS), regions=structuredClone(REGIONS), stations=structuredClone(STATIONS);
const weatherModes=structuredClone(WEATHER_MODES), catalog=structuredClone(DECOR_CATALOG);

const ROSTER_DATA = [{"id":"swimmer","name":"스위미","role":"코스트 챔피언","img":"","ArcadeId":"racing","zoneName":"에메랄드 해변 다이빙대","perkDesc":"해변 조개 채집 시 바나나 코인 +30% 추가 획득","quote":"푸른 바다에서 리듬에 맞춰 물살을 가르는 거야! 내 금메달 기록에 도전해 볼래?","questTitle":"해변의 반짝이는 조개 2개 채집하기","questType":"shell","questTarget":2,"colors":{"hat":"#0284c7","body":"#facc15","outfit":"#dc2626","accent":"#fbbf24","eyes":2,"hair":"swimcap"},"homePos":{"x":19,"y":12}},{"id":"kicko","name":"킥코","role":"축구 코치","img":"","ArcadeId":"soccer","zoneName":"바나나 그린 구장 (서쪽)","perkDesc":"축구 아케이드에서 조준선 속도 안정화 & 코인 +20%","quote":"축구는 정확한 패스와 타이밍이야! 먼저 마을에서 체력(CP)을 모아서 구장으로 와.","questTitle":"섬의 바나나 나무 3번 채집하기","questType":"banana","questTarget":3,"colors":{"hat":null,"body":"#facc15","outfit":"#3f8f4a","stripes":"#f4d35e","accent":"#f59e0b","eyes":2,"hair":"sparse"},"homePos":{"x":6,"y":5}},{"id":"curvy","name":"커비","role":"프리킥 코치","img":"","ArcadeId":"soccer","zoneName":"블루웨이브 스타디움","perkDesc":"스테이션 업그레이드 시 불꽃 슛 게이지 충전 속도 +35%","quote":"내 파란 머리처럼 시원한 프리킥 한 방 어때? 골키퍼의 움직임을 읽고 빈 곳을 노려봐!","questTitle":"마을에 꾸미기 가구 1개 이상 추가 배치하기","questType":"decor","questTarget":1,"colors":{"hat":null,"body":"#facc15","outfit":"#1e40af","accent":"#38bdf8","eyes":2,"hair":"spikyBlue"},"homePos":{"x":10,"y":4}},{"id":"tennis","name":"테니","role":"테니스 코치","img":"","ArcadeId":"racket","zoneName":"선샤인 테니스 코트","perkDesc":"라켓·배팅 미니게임에서 라켓 판정 범위 +25% 확대","quote":"뾰루퉁해 보인다고? 공에 집중하느라 그래! 나랑 불꽃 튀는 랠리 한 판 붙자!","questTitle":"꽃밭이나 야자수 주변 채집물 3개 모으기","questType":"any_harvest","questTarget":3,"colors":{"hat":"#ffffff","headband":"#ef4444","body":"#facc15","outfit":"#f8fafc","accent":"#d97706","eyes":1,"hair":"centerTuft","prop":"racket"},"homePos":{"x":5,"y":12}},{"id":"baseball","name":"슬러거","role":"타격 코치","img":"","ArcadeId":"racket","zoneName":"바나나 배팅 & 피칭 센터","perkDesc":"홈런 타깃 적중 시 보너스 점수 +30% 추가","quote":"글러브 꽉 꼈다! 내가 던지는 직구와 마구를 타이밍 맞춰 시원하게 날려버려!","questTitle":"바나나 나무에서 황금 바나나 2개 수확하기","questType":"banana","questTarget":2,"colors":{"hat":"#dc2626","body":"#facc15","outfit":"#1d4ed8","accent":"#92400e","eyes":1,"hair":"cap","prop":"glove"},"homePos":{"x":9,"y":13}},{"id":"atti","name":"아띠","role":"섬 여행자","img":"","ArcadeId":null,"zoneName":"여행자 광장","perkDesc":"심부름 완료 시 챌린지 포인트(CP) +5 추가 획득","quote":"섬에 온 걸 환영해! 나는 지도와 주민 심부름을 안내해 줄게. 스포츠 도전은 각 구장의 담당 친구에게 찾아가 봐!","questTitle":"주민들과 2번 이상 대화 나누기","questType":"talk","questTarget":2,"colors":{"hat":null,"body":"#facc15","outfit":"#e07a5f","stripes":"#f2cc8f","accent":"#3d405b","eyes":2,"hair":"sparse"},"homePos":{"x":13,"y":7}},{"id":"astro","name":"아스트로","role":"우주 연구원","img":"","ArcadeId":"space","zoneName":"스타라이트 연구소 & 전망대","perkDesc":"모든 스테이션 업그레이드 비용 15% 할인","quote":"우주복 지퍼 완료! 코인과 트로피를 가져오면 스테이션을 업그레이드해 줄게. 새로운 스킬과 기믹을 열어보자!","questTitle":"연구소 주변 별 조각 2개 채집하기","questType":"star","questTarget":2,"colors":{"hat":null,"body":"#facc15","outfit":"#e2e8f0","accent":"#0284c7","eyes":2,"hair":"sparse"},"homePos":{"x":19,"y":5}},{"id":"cyclist","name":"라이더","role":"사이클 코치","img":"","ArcadeId":"racing","zoneName":"해안 일주 사이클 트랙","perkDesc":"섬 탐험 이동 속도 +20% 증가 & 레이싱 부스터 강화","quote":"헬멧 착용 필수! 섬 해안도로를 전속력으로 달리는 사이클 타임어택에 도전해 봐!","questTitle":"해변과 잔디밭을 돌아다니며 자원 4개 채집하기","questType":"any_harvest","questTarget":4,"colors":{"hat":"#f8fafc","body":"#facc15","outfit":"#1d4ed8","accent":"#ef4444","eyes":2,"hair":"helmet","prop":"bike"},"homePos":{"x":15,"y":12}},{"id":"archer","name":"아처","role":"양궁 코치","ArcadeId":"archery","zoneName":"포레스트 양궁","perkDesc":"스테이션 전용 코치","quote":"활을 당긴 뒤 잠깐 숨을 고르고, 바람 반대편을 겨냥해 봐!","questTitle":"별 조각 2개 모으기","questType":"star","questTarget":2,"colors":{"body":"#facc15","outfit":"#398c76","eyes":2},"img":"","transparentSprite":true},{"id":"skier","name":"스키","role":"스키 코치","ArcadeId":"ski","zoneName":"스노우 슬라럼","perkDesc":"스테이션 전용 코치","quote":"깃발 사이를 부드럽게 통과해 봐. 급한 코너에서는 감속!","questTitle":"채집물 3개 모으기","questType":"any_harvest","questTarget":3,"colors":{"body":"#facc15","outfit":"#4984ac","eyes":2},"img":"","transparentSprite":true},{"id":"skater","name":"피겨","role":"피겨 코치","ArcadeId":"figure","zoneName":"아이스 리듬","perkDesc":"스테이션 전용 코치","quote":"판정선에 음표가 닿는 순간! 박자에 맞춰 함께 연기해 보자.","questTitle":"별 조각 2개 모으기","questType":"star","questTarget":2,"colors":{"body":"#facc15","outfit":"#e5e6e1","eyes":2},"img":"","transparentSprite":true},{"id":"taek","name":"태권","role":"태권도 코치","ArcadeId":"taekwondo","zoneName":"태권 콤보","perkDesc":"스테이션 전용 코치","quote":"예고를 읽고 정확하게 방어해. 반격 기회에 발차기를 연결하자!","questTitle":"채집물 3개 모으기","questType":"any_harvest","questTarget":3,"colors":{"body":"#facc15","outfit":"#eee8d9","eyes":1},"img":"","transparentSprite":true}];
'use strict';
const $=id=>document.getElementById(id), clamp=(x,a,b)=>Math.max(a,Math.min(b,x)), hypot=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
const W=1920,H=1280,T=64,SAVE_KEY=opts.saveKey;
for(const n of ROSTER_DATA)n.img=opts.imageUrl(n.id);
const roster=ROSTER_DATA;









const worldNpcs=stations.map(station=>roster.find(n=>n.id===station.npcId));
const basePlayableIds=['atti'];


const trees=[{x:280,y:310},{x:750,y:255},{x:830,y:420},{x:255,y:635},{x:580,y:660},{x:1240,y:300},{x:1690,y:300},{x:1650,y:700},{x:1220,y:800},{x:245,y:950},{x:800,y:1080},{x:1700,y:975},{x:1100,y:1090},{x:480,y:1130}].map((t,i)=>({...t,id:'tree'+i,palm:i>=8,readyAt:0}));
const resourceDefs=[{x:790,y:730,type:'banana'},{x:1060,y:790,type:'banana'},{x:630,y:560,type:'banana'},{x:345,y:680,type:'banana'},{x:1170,y:590,type:'banana'},{x:1695,y:1080,type:'shell'},{x:1580,y:1135,type:'shell'},{x:1250,y:1140,type:'shell'},{x:260,y:1110,type:'shell'},{x:1470,y:530,type:'star'},{x:1690,y:430,type:'star'},{x:1260,y:475,type:'star'},{x:1540,y:650,type:'banana'},{x:750,y:960,type:'banana'},{x:960,y:1000,type:'banana'},{x:1080,y:355,type:'banana'}];
const resources=resourceDefs.map((r,i)=>({...r,id:'resource'+i,readyAt:0}));
trees.push(...[{"id": "cove-tree0", "island": "cove", "x": 300, "y": 650, "palm": true, "readyAt": 0}, {"id": "cove-tree1", "island": "cove", "x": 735, "y": 265, "palm": true, "readyAt": 0}, {"id": "cove-tree2", "island": "cove", "x": 1680, "y": 610, "palm": true, "readyAt": 0}, {"id": "cove-tree3", "island": "cove", "x": 1600, "y": 990, "palm": true, "readyAt": 0}, {"id": "cove-tree4", "island": "cove", "x": 640, "y": 905, "palm": true, "readyAt": 0}, {"id": "cove-tree5", "island": "cove", "x": 1040, "y": 230, "palm": true, "readyAt": 0}, {"id": "cove-tree6", "island": "cove", "x": 1200, "y": 1120, "palm": true, "readyAt": 0}]);
resources.push(...[{"id": "cove-resource0", "island": "cove", "x": 920, "y": 930, "type": "banana", "readyAt": 0}, {"id": "cove-resource1", "island": "cove", "x": 520, "y": 1120, "type": "shell", "readyAt": 0}, {"id": "cove-resource2", "island": "cove", "x": 820, "y": 600, "type": "banana", "readyAt": 0}, {"id": "cove-resource3", "island": "cove", "x": 1180, "y": 650, "type": "banana", "readyAt": 0}, {"id": "cove-resource4", "island": "cove", "x": 1060, "y": 410, "type": "star", "readyAt": 0}, {"id": "cove-resource5", "island": "cove", "x": 1600, "y": 750, "type": "shell", "readyAt": 0}, {"id": "cove-resource6", "island": "cove", "x": 700, "y": 800, "type": "banana", "readyAt": 0}, {"id": "cove-resource7", "island": "cove", "x": 850, "y": 1120, "type": "shell", "readyAt": 0}]);
trees.find(t=>t.id==='cove-tree5').x=1170;
Object.assign(resources.find(t=>t.id==='cove-resource4'),{x:1110,y:550});
resources.push(...[{"id": "snow-resource0", "island": "snow", "x": 650, "y": 690, "type": "banana", "readyAt": 0}, {"id": "snow-resource1", "island": "snow", "x": 1200, "y": 650, "type": "banana", "readyAt": 0}, {"id": "snow-resource2", "island": "snow", "x": 750, "y": 360, "type": "star", "readyAt": 0}, {"id": "snow-resource3", "island": "snow", "x": 1660, "y": 750, "type": "star", "readyAt": 0}, {"id": "snow-resource4", "island": "snow", "x": 700, "y": 1000, "type": "star", "readyAt": 0}, {"id": "snow-resource5", "island": "snow", "x": 1280, "y": 1100, "type": "star", "readyAt": 0}]);
const positions=Object.fromEntries(stations.map(station=>[station.npcId,station.position]));
for(const station of stations)if(station.gameId)games[station.gameId].hosts=[station.npcId];
function npcStation(id){return stations.find(station=>station.npcId===id)||null;}

function isCharUnlocked(id){return roster.some(n=>n.id===id)&&!npcStation(id);}
function unlockedRoster(){return roster.filter(n=>isCharUnlocked(n.id));}
function normalizePlayerId(id){return isCharUnlocked(id)?id:basePlayableIds[0];}

// v4.3.1: distinct level challenges, readable round sections and native arcade art.
const tierNames=['동네 연습장','프로 아레나','마스터 스타디움'];


function upgradeCost(id){const level=state.levels[id];return level>=3?null:{coins:Math.round((level===1?140:280)*(state.char==='astro'?.85:1)),trophies:level===1?1:3};}
function arcadeRecordKey(id,level,champ){return `${id}:${level}:${champ?'champ':'normal'}`;}
function cleanArcadeRecords(raw){const out={};if(!raw||typeof raw!=='object')return out;for(const [key,r]of Object.entries(raw)){if(!/^(soccer|racket|racing|space|cycling|baseball|freekick|archery|ski|figure|taekwondo):[123]:(normal|champ)$/.test(key)||!r||typeof r!=='object')continue;out[key]={};for(const field of ['best','plays','wins','maxCombo','lastScore'])out[key][field]=Math.max(0,Math.floor(Number(r[field])||0));}return out;}
function modeBest(id,level,champ){return state.arcadeRecords?.[arcadeRecordKey(id,level,champ)]?.best||0;}
function renderUpgradeCards(box){if(!setSideHtml(box,'<p class="hint">업그레이드하면 새로운 스킬과 기믹이 열려요. 일반·챔피언 기록은 레벨별로 따로 저장해요.</p>'+activeGameEntries().map(([id,g])=>{const level=state.levels[id],cost=upgradeCost(id),best=modeBest(id,level,false);return `<article class="upgrade-card"><div class="upgrade-heading"><span>${g.icon}</span><div><b>${g.name}</b><small>Lv.${level} · ${tierNames[level-1]}</small></div><span class="tier-badge">${level}/3</span></div><p>${tierFeatures[id][level-1].join(' · ')}</p><p class="station-look-summary">외형 · ${stationLooks[id][level-1]}</p><div class="upgrade-footer"><small>${cost?`다음 단계 ${cost.coins} 🍌 + ${cost.trophies} 🏆`:`일반 ${best}${scoreUnit(id)} · 챔피언 ${modeBest(id,level,true)}${scoreUnit(id)}`}</small><button class="pill-btn" data-upgrade-preview="${id}">${cost?'업그레이드 미리보기':'기록·단계 보기'}</button></div></article>`;}).join('')))return;box.querySelectorAll('[data-upgrade-preview]').forEach(b=>b.onclick=()=>openUpgrade(b.dataset.upgradePreview));}
function openUpgrade(id,previewLevel=null){
  const g=games[id],level=state.levels[id],cost=upgradeCost(id),affordable=cost&&state.coins>=cost.coins&&state.trophies>=cost.trophies;
  showModal(`${g.icon} ${g.name} · 스테이션 업그레이드`,`
    <p class="intro">업그레이드하면 새로운 스킬과 기믹이 열려요. 건물 외형도 함께 달라져요!</p>
    <figure class="station-look"><div class="station-look-heading"><b>스테이션 외형 미리보기</b><small>섬과 미니맵에 그대로 반영돼요</small></div>
      <div class="station-look-tabs">${[1,2,3].map(l=>`<button type="button" data-look-level="${l}" aria-pressed="false">Lv.${l}<small>${l===level?'현재 단계':l<level?'완료':'업그레이드 후'}</small></button>`).join('')}</div>
      <canvas id="stationLookCanvas" width="640" height="420" aria-label="${g.name} 외형 미리보기"></canvas><figcaption id="stationLookCaption"></figcaption>
    </figure>
    <div class="tier-timeline">${[1,2,3].map(l=>`<section class="tier-step ${l===level?'current':''}"><div><b>Lv.${l} · ${tierNames[l-1]}</b><small>${l===level?'현재 단계':l<level?'완료':'다음 목표'}</small></div><p>${tierFeatures[id][l-1].join('<br>')}</p><span>목표 ${g.targets[l-1]}${scoreUnit(id)} · 기본 보상 ×${[1,1.8,3][l-1]}</span></section>`).join('')}</div>
    <p>현재 단계 기록 · 일반 ${modeBest(id,level,false)}점 / 챔피언 ${modeBest(id,level,true)}${scoreUnit(id)}<br>기존 종합 최고 기록 ${state.best[id]||0}${scoreUnit(id)}</p>
    ${cost?`<div class="upgrade-price"><span>필요 ${cost.coins} 🍌 · ${cost.trophies} 🏆</span><small>보유 ${state.coins} 🍌 · ${state.trophies} 🏆</small></div><button class="soft-btn primary wide" id="confirmUpgrade" ${affordable?'':'disabled'}>${affordable?`Lv.${level+1}로 업그레이드`:'코인과 트로피를 더 모아주세요'}</button>`:'<div class="speech">최고 단계예요! 챔피언 모드에서 새로운 기록에 도전하세요.</div>'}`,'upgrade');
  renderStationPreview(id,previewLevel??Math.min(3,level+1));
  if($('confirmUpgrade'))$('confirmUpgrade').onclick=()=>upgrade(id);
}

function arcadeNotice(message,color='#fff0a8'){const a=runtime.arc;if(!a)return;if(a.feedback?.text===message&&a.feedback.life>.25)return;a.feedback={text:message,color,life:.9};}
function arcFloat(x,y,message,color='#ffe18a'){const a=runtime.arc;if(!a)return;a.fx.push({x,y,text:message,color,life:1});if(a.fx.length>5)a.fx.shift();}
function activateBoost(){const a=runtime.arc;if(a?.id==='cycling')return cycleBoost(a);if(a?.id!=='racing'||a.phase!=='playing'||a.energy<3||a.boostCd>0)return false;a.energy-=3;a.boost=a.char==='cyclist'?1.9:1.3;a.boostCd=4.2;a.stats.boosts++;arcadeNotice('BOOST!','#b9f0e5');sound('hit');return true;}
function spawnRacingWave(a,spdMult){
 a.waveIndex++;const section=roundSection(a),safe=Math.floor(Math.random()*3),pattern=a.waveIndex%6;
 a.spawn=([1.15,.98,.85][a.level-1]-(section===2?.06:0))/spdMult;
 if(pattern===0){a.objects.push({x:1.08,lane:safe,type:a.waveIndex%12===0?'pad':'shield'});for(let i=1;i<=2;i++)a.objects.push({x:1.08+i*.12,lane:safe,type:'coin'});return;}
 if(pattern===1||pattern===3){for(let i=0;i<3;i++)a.objects.push({x:1.08+i*.12,lane:a.level===3&&section>0&&pattern===3?clamp(safe+(i===2?1:0),0,2):safe,type:'coin'});return;}
 const blocked=a.level>=2&&section>0?2:1;
 for(let i=1;i<=blocked;i++){const lane=(safe+i)%3;a.objects.push({x:1.08,lane,type:pattern===4?'hurdle':(a.waveIndex+lane)%2?'rock':'hurdle'});}
 a.objects.push({x:1.08,lane:safe,type:'coin'});
}
function renderRunHud(){const a=runtime.arc;if(!a)return;renderStageHud(a);renderChargeHud(a);renderTennisHud(a);const pct=Math.min(100,Math.floor(a.score/a.target*100));$('runGoalBar').style.width=pct+'%';$('runGoalLabel').textContent=a.phase==='result'?(a.endReason==='hits'?'체력 소진 · 다시 도전해 보세요':a.score>=a.target?'클리어 완료!':'목표 미달 · 다시 도전해 보세요'):a.score>=a.target?(usesHealth(a)?'목표 달성 · 끝까지 생존하세요':'목표 달성 · 기록에 도전!'):`목표까지 ${Math.max(0,a.target-Math.floor(a.score))}${scoreUnit(a.id)}`;$('runSkillBar').style.width=(a.level<2?0:(1-Math.min(1,a.skillCd/(a.skillDuration||4)))*100)+'%';$('runSkillLabel').textContent=a.phase==='result'?'경기 종료 · 기록 저장 완료':a.level<2?'Lv.2에서 필살기 해금':a.skillCd>0?`필살기 ${a.skillCd.toFixed(1)}초 후`:'필살기 준비 완료 · E';$('runShield').textContent=usesHealth(a)?a.shield>0?'🛡 보호막 1회':a.invulnerable>0?'피격 후 무적':`남은 하트 ${a.health}개 · 충돌 주의`:a.id==='soccer'?'파워 슛 · 밝은 구간 +6':'자동 리턴 · 강타로 상대 빈 코스 공략';$('runPace').textContent=a.phase==='result'?'RESULT':a.time<=8?'LAST SPURT':a.champ?'CHAMPION':'NORMAL';$('arcAux').classList.toggle('hidden',a.id!=='racing');if(a.id==='racing'){$('arcAction').textContent='점프 · Space';$('arcAux').textContent=`⚡ 부스터 ${a.energy}/3`;$('arcAux').disabled=a.phase!=='playing'||a.energy<3||a.boostCd>0;}$('arcSpecial').disabled=a.phase!=='playing'||a.level<2||a.skillCd>0;renderCoveHud(a);renderExpansionHud(a);}
function drawShotGuide(a,w,h){const dir=(runtime.keys.ArrowRight||runtime.keys.KeyD||runtime.touch.right?1:0)-(runtime.keys.ArrowLeft||runtime.keys.KeyA||runtime.touch.left?1:0),vx=a.char==='kicko'?dir*.06:dir*.18+Math.sin(a.elapsed*2.2)*.05,curve=dir*.25,speed=soccerSpeed(a,a.charging?a.charge:0);ac.save();ac.setLineDash([6,9]);ac.strokeStyle='#fff1af9c';ac.lineWidth=2;ac.beginPath();ac.moveTo(a.x*w,.82*h);let end=a.x;for(let i=1;i<=20;i++){const t=.63/speed*i/20;end=a.x+vx*t+.5*curve*t*t;ac.lineTo(end*w,(.82-speed*t)*h);}ac.stroke();ac.setLineDash([]);ellipse(ac,end*w,.19*h,8,5,end>.22&&end<.78?'#ffe39b':'#e8a48b');ac.restore();}
function drawArcadeFeedback(now){const a=runtime.arc;if(!a)return;const w=ARC_W,h=ARC_H;for(const f of a.fx){ac.save();ac.globalAlpha=Math.min(1,f.life*2);text(ac,f.text,f.x*w,(f.y-(1-f.life)*.07)*h,18,f.color,'center',800);ac.restore();}if(a.feedback?.life>0&&a.id!=='taekwondo'){const message=a.feedback.text,width=Math.min(500,message.length*16+40);const bannerY=a.id==='racket'?h*.49:h*.12;rr(ac,w/2-width/2,bannerY,width,38,13,'#233b42dd');text(ac,message,w/2,bannerY+19,16,a.feedback.color,'center',800);}
 if(a.id==='racing'){for(const e of a.objects)if(['rock','hurdle'].includes(e.type)&&e.x>.8&&e.x<1.1){rr(ac,w-32,(e.lane+.5)*h/3-16,23,30,7,'#e7b27bd9');text(ac,'!',w-20,(e.lane+.5)*h/3,18,'#6f4834','center',800);}}
 
}
// Small game-specific mechanics; all effects stay inside the arcade canvas.
const arcadeMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
function burstArc(x,y,color='#ffe18a',count=10){
  const a=runtime.arc;if(!a||arcadeMotion.matches)return;
  for(let i=0;i<count;i++){const angle=Math.PI*2*i/count;a.particles.push({x,y,vx:Math.cos(angle)*(.08+Math.random()*.08),vy:Math.sin(angle)*.17-.08,life:.55,max:.55,color});}
  if(a.particles.length>100)a.particles.splice(0,a.particles.length-100);
}
function beginArcadeAction(source){
  const a=runtime.arc;if(a?.phase!=='playing')return;
  if(a.id==='archery'&&a.bow.flight)return;
  if(a.id==='ski'){a.braking=true;a.brakeSource=source;return;}
  if(a.id==='soccer'||a.id==='freekick'||a.id==='archery'){if(a.shotCd<=0&&!a.charging){a.charging=true;a.charge=0;a.chargeTime=0;a.chargeSource=source;}}
  else arcadeAction(false);
}
function releaseArcadeAction(source,cancel=false){
  const a=runtime.arc;if(a?.id==='ski'&&a.brakeSource===source){a.braking=false;a.brakeSource=null;return;}if(!a||!a.charging||a.chargeSource!==source)return;
  if(a.id==='archery')a.bow.releaseAim=archeryAim(a);
  const power=a.charge;a.charging=false;a.charge=0;a.chargeSource=null;
  if(!cancel&&a.phase==='playing')arcadeAction(false,power);
}
function soccerSpeed(a,power=0){return(a.char==='curvy'?1.05:.92)*(1+power*.35);}
// Tennis uses one moving opponent. Balls score only through an actual rally or a missed return.
function tennisConfig(a){
  const l=a.level-1,c=a.champ;
  return {speed:[.46,.55,.64][l]*(c?1.1:1),reaction:[.18,.13,.09][l]*(c?.8:1),reach:[.09,.10,.115][l]+(c?.008:0),ballSpeed:[.44,.51,.57][l]};
}
function initTennis(a){
  a.opponent={x:.5,target:.5,think:0,swing:0,recovery:0,moving:false,returns:0,status:'서브 준비',flash:0};
  a.tennis={pointsFor:0,pointsAgainst:0,reserveTimer:2.4,targetLit:-1,targetFlash:0};
  Object.assign(a.stats,{winners:0,opponentReturns:0,longestRally:0});
}
function tennisFold(x){const span=.88,t=((x-.06)%(span*2)+span*2)%(span*2);return .06+(t>span?span*2-t:t);}
function tennisLanding(b,y){return tennisFold(b.x+b.vx*Math.max(0,(y-b.y)/b.vy));}
function tennisTarget(a,serve=false){
  const o=a.opponent;
  if(serve||a.level===1&&!a.champ)return clamp(a.x+Math.sin(o.returns*1.7)*.07,.17,.83);
  if(a.level===2&&!a.champ)return o.returns%3===0?clamp(a.x,.18,.82):o.returns%2?.22:.78;
  return a.x<.5?.82:.18;
}
function serveBall(gold=false){
  const a=runtime.arc;if(!a?.opponent)return;
  a.objects.push({x:a.opponent.x,y:.25,vx:0,vy:tennisConfig(a).ballSpeed,gold,fire:false,power:0,lastTouch:'opponent',rally:0,wait:.65,serve:true,trail:[]});
}
function racketReturn(a,b,manual=false,smash=false){
  const perfect=manual&&b.y>=.72&&b.y<=.84,op=a.opponent;
  const dir=(runtime.keys.ArrowRight||runtime.keys.KeyD||runtime.touch.right?1:0)-(runtime.keys.ArrowLeft||runtime.keys.KeyA||runtime.touch.left?1:0);
  const aim=dir<0?.18:dir>0?.82:manual?(op.x<=.5?.82:.18):.5;
  const speed=smash?1.12:perfect?.90:manual?.75:Math.min(.78,Math.max(.52,Math.abs(b.vy)*1.02));
  b.vy=-speed;b.vx=(aim-b.x)*speed/Math.max(.12,b.y-.22);b.fire=manual||smash;b.power=smash?1:perfect?.7:manual?.3:0;
  b.lastTouch='player';b.rally=(b.rally||0)+1;b.targetChecked=false;b.wasPerfect=perfect;b.smash=false;b.trail=[];
  const pts=smash?24:manual?(perfect?18:6):3+Math.min(8,a.combo);
  a.score+=pts;a.stats.returns++;a.combo++;a.maxCombo=Math.max(a.maxCombo,a.combo);a.stats.longestRally=Math.max(a.stats.longestRally,b.rally);
  a.aimX=aim;a.aimFlash=.7;if(perfect)a.stats.perfects++;
  if(manual)arcFloat(b.x,b.y-.04,smash?'SMASH +24':perfect?'PERFECT +18':'+6',perfect||smash?'#ffe08a':'#b9e7da');
  burstArc(b.x,b.y,perfect||smash?'#ffe18a':'#d3f0cf',perfect?14:7);sound('hit');
}
function tennisCanSwing(a,b,special=false){
  return !b.wait&&b.vy>0&&b.y>(special?.58:.60)&&b.y<(special?.92:.88)&&Math.abs(b.x-a.x)<(special?.20:.17)*(a.wideTimer>0?1.35:1);
}
function opponentReturn(a,b){
  const o=a.opponent,cfg=tennisConfig(a),hard=(a.level>=2||a.champ)&&a.elapsed>=8&&(o.returns+1)%(a.level===3||a.champ?3:4)===0;
  o.returns++;a.stats.opponentReturns++;o.swing=.27;o.flash=.3;o.recovery=.13+(b.power||0)*.2;
  const aim=tennisTarget(a),speed=Math.min(.88,cfg.ballSpeed+Math.min(.12,(b.rally||0)*.012)+(hard?.14:0));
  b.y=.225;b.vy=speed;b.vx=(aim-b.x)*speed/(.84-b.y);b.fire=false;b.power=0;b.lastTouch='opponent';b.rally=(b.rally||0)+1;b.trail=[];b.smash=hard;
  a.stats.longestRally=Math.max(a.stats.longestRally,b.rally);o.status=hard?'스매시! 빈 코스 수비':'리턴 성공';
  const pts=8+(b.rally%6===0?8:0);a.score+=pts;arcFloat(b.x,.25,`+${pts}`,'#d1ece0');burstArc(b.x,.22,'#c2e8e0',8);
  if(hard)arcadeNotice('상대 스매시! 착지 지점을 보세요','#f3c7a3');sound('hit');
}
function tennisPoint(a,b,won){
  if(won){
    a.tennis.pointsFor++;a.stats.winners++;
    const pts=Math.round((35+(b.gold?10:0)+Math.min(12,(b.rally||0)*2))*(a.char==='baseball'?1.3:1)*(a.level===3?1.25:1));
    a.score+=pts;arcFloat(b.x,.15,`WINNER +${pts}`);arcadeNotice('WINNER! 상대 수비를 뚫었어요','#ffe18a');burstArc(b.x,.18,'#ffe18a',18);
    a.opponent.status='놓쳤어요 · 다음 서브';a.opponent.recovery=.32;sound('collect');
    if(a.level===3&&a.tennis.pointsFor%3===0)a.fever=3;
  }else{
    a.tennis.pointsAgainst++;a.stats.misses++;a.combo=0;a.opponent.status='상대 득점';
    arcadeNotice('상대 포인트 · 착지 표시를 따라가세요','#efc5b1');sound('miss');
  }
}
function updateTennis(a,dt,spdMult){
  const cfg=tennisConfig(a),o=a.opponent;
  o.swing=Math.max(0,o.swing-dt);o.flash=Math.max(0,o.flash-dt);o.recovery=Math.max(0,o.recovery-dt);o.think-=dt;
  a.tennis.targetFlash=Math.max(0,a.tennis.targetFlash-dt);
  const threats=a.objects.filter(b=>b.vy<0&&b.y>.20&&!b.wait).sort((p,q)=>(p.y-.22)/-p.vy-(q.y-.22)/-q.vy);
  const threat=threats[0];
  if(o.think<=0){o.think=cfg.reaction;o.target=threat?tennisLanding(threat,.22):.5;}
  const step=cfg.speed*dt*spdMult*(o.recovery>0?.48:1),delta=clamp(o.target-o.x,-step,step);
  o.x=clamp(o.x+delta,.11,.89);o.moving=Math.abs(delta)>.001;
  if(o.swing<=0&&o.recovery<=0)o.status=threat?'공을 따라 수비 중':a.objects.some(b=>b.wait>0)?'서브 준비':'다음 공 대비';
  a.itemSpawn-=dt;
  if(a.itemSpawn<=0&&a.elapsed>=8&&(a.level>=2||a.champ)){
    a.itemSpawn=4.5+Math.random()*2;a.items.push({x:.22+Math.random()*.56,y:.38+Math.random()*.2,type:a.level===3&&a.elapsed>=17&&Math.random()<.5?'multi':'wide',life:5.5});
  }
  for(let i=a.items.length-1;i>=0;i--){a.items[i].life-=dt;if(a.items[i].life<=0)a.items.splice(i,1);}
  const radius=.088*(a.char==='tennis'?1.25:1)*(a.wideTimer>0?1.35:1);
  for(let i=a.objects.length-1;i>=0;i--){
    const b=a.objects[i];
    if(b.wait>0){
      b.wait=Math.max(0,b.wait-dt);b.x=o.x;b.y=.25;
      if(b.wait===0){const aim=tennisTarget(a,true);b.vx=(aim-b.x)*b.vy/(.84-b.y);o.swing=.23;o.status='서브!';b.serve=false;}
      continue;
    }
    const prevY=b.y;b.trail||=[];b.trail.push({x:b.x,y:b.y});if(b.trail.length>8)b.trail.shift();
    b.x+=b.vx*dt*spdMult;b.y+=b.vy*dt*spdMult;
    if(b.x<.06){b.x=.12-b.x;b.vx=Math.abs(b.vx);}else if(b.x>.94){b.x=1.88-b.x;b.vx=-Math.abs(b.vx);}
    for(let j=a.items.length-1;j>=0;j--){
      const cap=a.items[j];if(b.lastTouch==='player'&&Math.hypot(b.x-cap.x,b.y-cap.y)<.065){
        if(cap.type==='wide')a.wideTimer=5;else if(a.objects.length<3)serveBall(true);
        a.score+=15;arcadeNotice(cap.type==='wide'?'WIDE RACKET · 5초':'MULTI BALL!','#b9e9df');sound('collect');a.items.splice(j,1);
      }
    }
    if(b.vy>0&&prevY<.84&&b.y>=.84&&Math.abs(tennisFold(b.x+b.vx*(.84-b.y)/b.vy)-a.x)<radius){racketReturn(a,b);b.y=.83;}
    if(b.vy<0&&b.lastTouch==='player'){
      if(!b.targetChecked&&prevY>=.31&&b.y<=.31){
        b.targetChecked=true;const index=[.18,.5,.82].findIndex(x=>Math.abs(x-b.x)<.08);
        if(index>=0){a.stats.targets++;a.score+=8;a.tennis.targetLit=index;a.tennis.targetFlash=.5;arcFloat(b.x,.31,'TARGET +8');}
      }
      if(prevY>.22&&b.y<=.22){
        const hitX=tennisFold(b.x+b.vx*(.22-b.y)/b.vy),reach=cfg.reach-(b.power||0)*.018;
        if(Math.abs(hitX-o.x)<=reach){b.x=hitX;opponentReturn(a,b);}else{o.status='수비를 벗어났어요!';}
      }
    }
    if(b.y<.06){tennisPoint(a,b,true);a.objects.splice(i,1);}
    else if(b.y>1.03){tennisPoint(a,b,false);a.objects.splice(i,1);}
  }
  if(a.objects.length===0)serveBall();
  a.tennis.reserveTimer-=dt;
  if(a.level===3&&a.elapsed>=17&&a.objects.length<2&&a.tennis.reserveTimer<=0){serveBall(true);a.tennis.reserveTimer=2.4;}
}
function renderTennisHud(a){
  $('tennisHud').classList.toggle('hidden',a.id!=='racket');if(a.id!=='racket')return;
  const rally=Math.max(0,...a.objects.map(b=>b.rally||0));
  const vals={tennisMe:a.tennis.pointsFor,tennisThem:a.tennis.pointsAgainst,tennisRally:rally,tennisOpponentState:a.phase==='result'?'경기 종료':a.phase==='paused'?'일시정지':a.opponent.status};
  for(const [id,value]of Object.entries(vals))if($(id).textContent!==String(value))$(id).textContent=value;
}
function drawTennisOpponent(a,w,h,now){
  const o=a.opponent,x=o.x*w;
  if(o.flash>0)ellipse(ac,x,h*.21,45,26,'#e8f5bf44');
  drawCharacter(ac,roster.find(n=>n.id===games.racket.hosts[0]),x,h*.22,72,o.moving?(o.target<o.x?'left':'right'):'down',o.moving&&a.phase==='playing',now);
  const hand=x+29,sy=h*.19;
  ac.save();ac.translate(hand,sy);ac.rotate(o.swing>0?-1+o.swing*7:-.25);line(ac,[[0,0],[8,15]],'#6e7457',4);ac.strokeStyle=o.swing>0?'#fff0ac':'#f1dfb4';ac.lineWidth=3;ac.beginPath();ac.ellipse(-4,-6,10,14,-.3,0,Math.PI*2);ac.stroke();ac.restore();
  if(o.swing>0){ac.strokeStyle='#f8edb777';ac.lineWidth=5;ac.beginPath();ac.arc(x,h*.20,43,-.1,Math.PI*.7);ac.stroke();}
  const incoming=a.objects.filter(b=>b.vy>0&&!b.wait&&b.y<.82).sort((p,q)=>q.y-p.y)[0];
  if(incoming){const px=tennisLanding(incoming,.84)*w;ac.save();ac.setLineDash([5,6]);ac.strokeStyle=incoming.smash?'#f7bc92':'#e6f1ce';ac.lineWidth=2;ac.beginPath();ac.ellipse(px,h*.84,26,9,0,0,Math.PI*2);ac.stroke();ac.restore();if(incoming.smash)text(ac,'!',px,h*.80,19,'#ffe0a2','center',800);}
}

function spawnConstellation(a){
  const pad=a.pads[a.routeIndex%a.pads.length],id=++a.routeIndex,x=clamp(pad.x+pad.w/2,.2,.8);
  a.routes[id]={left:3};
  for(let i=0;i<3;i++)a.objects.push({x:x+(i-1)*.095,y:pad.y-.20-Math.sin(i*Math.PI/2)*.025,vy:.065,type:'star',route:id});
}
function renderChargeHud(a){
  if(a.id==='archery')return renderArcheryCharge(a);
  if(a.id==='freekick')return renderFreeKickCharge(a);
  $('chargeHud').querySelector('.charge-label span').textContent='밝은 구간에서 놓기 · 골 +6';$('chargeHud').querySelector('.sweet-zone').style.display='';$('chargeMeter').setAttribute('aria-label','슛 파워 · 65에서 85 사이가 정밀 구간');
  $('chargeHud').classList.toggle('hidden',a.id!=='soccer'||a.phase==='result');
  if(a.id!=='soccer')return;
  const power=a.charging?a.charge:0,sweet=power>=.65&&power<=.85;
  $('chargeFill').style.width=power*100+'%';$('chargeHud').classList.toggle('sweet',sweet);
  $('chargeCursor').style.left=power*100+'%';
  $('chargeMeter').setAttribute('aria-valuenow',Math.round(power*100));
  $('chargeLabel').textContent=a.charging?(sweet?'지금 놓으면 정밀 슛!':'놓으면 슛!'):'Space / 버튼을 눌렀다 놓아요';
}
function drawGameDetails(a,w,h){
  if(a.id==='soccer'){
    if(a.charging){
      ac.strokeStyle=a.charge>=.65&&a.charge<=.85?'#ffe18a':'#c1ebd8';ac.lineWidth=5;
      ac.beginPath();ac.arc(a.x*w,h*.84,48,-Math.PI/2,-Math.PI/2+a.charge*Math.PI*2);ac.stroke();
    }
  }else if(a.id==='racket'){
    const reach=.17*(a.wideTimer>0?1.35:1);
    rr(ac,(a.x-reach)*w,h*.72,reach*2*w,h*.12,10,'#fff1ad24','#fff0bc88');
    text(ac,'PERFECT',a.x*w,h*.735,10,'#fff3bd','center',700);
    if(a.aimFlash>0){
      ac.save();ac.globalAlpha=Math.min(1,a.aimFlash*2);ac.setLineDash([5,9]);
      line(ac,[[a.x*w,h*.78],[a.aimX*w,h*.22]],'#fff0a6',2);ac.restore();
      ellipse(ac,a.aimX*w,h*.22,24,8,'#fff0a633');
    }
    rr(ac,22,h-42,320,27,9,'#5d4439c9');text(ac,'방향키+강타 → 좌우 코너 · 중립 강타 → 빈 코스',182,h-28,11,'#fff3d7');
  }else if(a.id==='space'){
    for(const id of Object.keys(a.routes)){
      const stars=a.objects.filter(e=>e.route===Number(id)).sort((p,q)=>p.x-q.x);
      if(stars.length>1){ac.save();ac.setLineDash([4,6]);line(ac,stars.map(e=>[e.x*w,e.y*h]),'#ffe38c99',2);ac.restore();}
    }
    rr(ac,20,h-44,270,28,10,'#202e48d9');text(ac,`별자리 ${a.stats.constellations}개 · 높이 ${a.stats.floors||0}층 · STAGE ${a.stage||1}`,155,h-30,11,'#ffe6a0');
  }
  for(const p of a.particles){ac.save();ac.globalAlpha=p.life/p.max;ellipse(ac,p.x*w,p.y*h,3,3,p.color);ac.restore();}
}
function drawRunnerObject(e,w,h,now){
  const x=e.x*w,y=(e.lane+.5)*h/3;
  ellipse(ac,x,y+24,24,6,'#244c4228');
  if(e.type==='rock'){
    ac.beginPath();ac.moveTo(x-24,y+16);ac.lineTo(x-17,y-17);ac.lineTo(x+5,y-27);ac.lineTo(x+25,y-10);ac.lineTo(x+22,y+17);ac.closePath();ac.fillStyle='#697a7c';ac.fill();
    line(ac,[[x-15,y-15],[x+4,y-23],[x+12,y-5]],'#a7b9b5',4);line(ac,[[x+12,y-5],[x+22,y+13]],'#536969',3);
  }else if(e.type==='hurdle'){
    rr(ac,x-25,y-14,50,30,8,'#71b4c6','#e2f5e9');
    ac.beginPath();ac.moveTo(x-22,y);ac.quadraticCurveTo(x-10,y-15,x,y);ac.quadraticCurveTo(x+10,y+15,x+22,y);ac.strokeStyle='#effce6';ac.lineWidth=4;ac.stroke();
    text(ac,'JUMP',x,y+27,9,'#355c62','center',800);
  }else if(e.type==='pad'){
    rr(ac,x-25,y-20,50,40,9,'#eac86c','#fff0c3');
    for(const dx of [-8,8])line(ac,[[x+dx-5,y-10],[x+dx+5,y],[x+dx-5,y+10]],'#6c774e',4);
  }else if(e.type==='shield'){
    drawShieldPickup(x,y);
  }else{
    const bob=arcadeMotion.matches?0:Math.sin(now*5+e.x*6)*4;
    drawBananaPickup(x,y+bob);
  }
}

function runStatsHtml(a){if(isExpansionGame(a.id))return expansionStatsHtml(a);if(isCoveGame(a.id))return coveStatsHtml(a);const s=a.stats,values=a.id==='soccer'?[['득점',`${s.goals} / ${s.shots}`],['링 통과',s.rings],['구석 / 정밀 슛',`${s.corners} / ${s.charged}`],['최대 콤보',a.maxCombo]]:a.id==='racket'?[['대결 포인트',`${a.tennis.pointsFor} : ${a.tennis.pointsAgainst}`],['최장 랠리',`${s.longestRally}타`],['PERFECT',s.perfects],['상대 리턴',s.opponentReturns]]:a.id==='racing'?[['바나나',s.coins],['회피 / 정밀 점프',`${s.dodges} / ${s.cleanJumps}`],['부스터',s.boosts],['남은 하트',a.health]]:[['별 수집',s.stars],['최고 높이',`${s.floors||0}층 · STAGE ${a.stage||1}`],['별자리 / UFO',`${s.constellations} / ${s.ufos}`],['남은 하트',a.health]];return '<div class="run-results">'+values.map(([label,value])=>`<div><small>${label}</small><b>${value}</b></div>`).join('')+'</div>';}

// Three readable sections per 25-second run; no extra modal or global message.
const roundSections=['워밍업','리듬 업','피날레'];


function roundSection(a){return a.elapsed<8?0:a.elapsed<17?1:2;}
function roundTempo(a){return .92+.08*Math.min(1,a.elapsed/8)+.08*clamp((a.elapsed-17)/8,0,1);}
function soccerKeeper(a){const speed=[1.25,1.65,1.95][a.level-1]*(a.champ?1.15:1);return .5+Math.sin(a.elapsed*speed)*[.18,.21,.22][a.level-1];}
function soccerRing(a){return a.level===1&&!a.champ?.5:.5+Math.cos(a.elapsed*(a.level===3?1.6:1.15))*.18;}
function soccerDefenderActive(a){return (a.level>=2||a.champ)&&a.elapsed>=8;}
function goldenCorner(a){return a.level===3&&a.elapsed>=8?Math.floor((a.elapsed-8)/3)%2:-1;}
function renderStageHud(a){
 const section=roundSection(a),challenge=levelChallenges[a.id][a.level-1];
 $('runStageName').textContent=`Lv.${a.level} · ${challenge[0]}`;
 $('runStageTip').textContent=a.phase==='result'?'경기 종료':challenge[1];
 const steps=$('runSections').children;
 for(let i=0;i<3;i++){const progress=clamp((a.elapsed-[0,8,17][i])/[8,9,8][i],0,1);steps[i].classList.toggle('active',section===i);steps[i].classList.toggle('done',progress===1);steps[i].style.setProperty('--section-progress',`${Math.round(progress*100)}%`);steps[i].setAttribute('aria-current',section===i?'step':'false');}
}
function spaceFloor(a,pad){
 if(!pad.floor||pad.floor<=(a.stats.floors||0))return;a.stats.floors=pad.floor;
 const bonus=4+pad.floor*2;a.score+=bonus;arcFloat(a.x,a.y-.05,`${pad.floor}층 +${bonus}`,'#bfe9e3');
 if(pad.floor%5===0){const stage=pad.floor/5+1,pts=20+stage*10;a.score+=pts;a.stage=stage;arcadeNotice(`STAGE ${stage}! 높이 보너스 +${pts}`,'#ffe18a');burstArc(a.x,a.y,'#ffe18a',18);sound('win');}
}
function spaceClimb(a){
 const shift=Math.max(0,.42-a.y);
 if(shift>0){a.climb=(a.climb||0)+shift;a.y+=shift;for(const p of a.pads)p.y+=shift;for(const e of a.objects)e.y+=shift;if(a.ufo)a.ufo.y=Math.min(a.ufo.y+shift,.18);}
 a.pads=a.pads.filter(p=>p.y<1.08);
 let top=a.pads.reduce((m,p)=>p.y<m.y?p:m,a.pads[0]);
 while(!top||top.y>-.04){
  const stage=Math.floor((a.stats.floors||0)/5),gap=Math.min(.21,.155+stage*.012+(a.level-1)*.01),w=Math.max(.11,.16-stage*.008-(a.level-1)*.01);
  const x=clamp((top?top.x+top.w/2:.5)+(Math.random()<.5?-1:1)*(.14+Math.random()*.2),.15,.85)-w/2;
  const pad={x,y:(top?top.y:.82)-gap,w,baseX:x,touched:false,phase:Math.random()*6,floor:(a.padCount=(a.padCount||3)+1)};
  a.pads.push(pad);top=pad;
 }
}
function spawnSpaceWave(a,spdMult){
 a.spaceWave=(a.spaceWave||0)+1;const index=a.spaceWave,section=roundSection(a);
 a.spawn=(a.level===1?.72:a.level===2?.64:.56)/spdMult;
 // A predictable recovery pickup follows every danger cycle. New hazards wait visibly.
 const hazardEvery=a.level===1?6:a.level===2?5:4;
 const meteor=index%hazardEvery===0&&a.elapsed>3;
 const shield=index%hazardEvery===1&&index>hazardEvery;
 const x=.12+Math.random()*.76;
 a.objects.push({x,y:-.06,vy:(a.level===1?.20:.24+section*.018)*spdMult,type:meteor?'meteor':shield?'shield':'star',warn:meteor?(a.level===1?1.05:a.champ?.75:.9):0});
}

// Code-native arcade artwork; decorative objects stay outside collision geometry.
const arcadeBackdropCache=new Map();
function arenaPalette(a){return a.id==='soccer'?[
 {rim:'#496d54',field:'#68996c',stripe:'#73a574',line:'#ecf0d0'},
 {rim:'#324f4c',field:'#44886c',stripe:'#509679',line:'#e2edcf'},
 {rim:'#1b3443',field:'#28635d',stripe:'#327268',line:'#d6ede0'}
 ][a.level-1]:[
 {rim:'#7d6352',field:'#bd8866',stripe:'#ce9a75',line:'#fff0ce'},
 {rim:'#385d54',field:'#527e68',stripe:'#61947c',line:'#edf0ce'},
 {rim:'#233c59',field:'#3a688c',stripe:'#457899',line:'#e5f1e9'}
 ][a.level-1];}
function drawArenaFloor(a,w,h){
 const p=arenaPalette(a);ac.fillStyle=p.rim;ac.fillRect(0,0,w,h);
 rr(ac,w*.055,h*.045,w*.89,h*.91,14,p.field);
 ac.save();ac.beginPath();ac.roundRect(w*.055,h*.045,w*.89,h*.91,14);ac.clip();
 if(a.id==='soccer')for(let i=0;i<10;i++){ac.fillStyle=i%2?p.field:p.stripe;ac.fillRect(w*.055+i*w*.089,h*.045,w*.089,h*.91);}
 else{rr(ac,w*.09,h*.10,w*.82,h*.8,4,p.stripe);}
 for(let i=0;i<95;i++){const x=(.07+seed(i+65)*.86)*w,y=(.06+seed(i+170)*.88)*h;line(ac,[[x,y],[x+2,y-1]],'#ffffff0b',1);}
 if(a.level===3){const glow=ac.createLinearGradient(0,0,0,h);glow.addColorStop(0,'#bde5eb18');glow.addColorStop(.65,'#bde5eb00');ac.fillStyle=glow;ac.fillRect(0,0,w,h);}
 ac.restore();
 // Seating remains on the narrow border, away from the keeper and play lines.
 for(let side=0;side<2;side++)for(let row=0;row<(a.level>=2?3:2);row++)for(let j=0;j<15;j++){
  const x=side?w-9-row*12:9+row*12,y=34+j*(h-75)/14;
  rr(ac,x-4,y-3,8,6,2,['#e3c579','#a4c7ad','#b0c6d0','#d6a58b'][(j+row)%4]);
 }
 if(a.level>=2)for(const x of [16,w-16]){line(ac,[[x,h*.04],[x,h*.14]],'#c0cfc47a',3);rr(ac,x-8,h*.04,16,7,2,'#fff0b5');}
 const label=a.id==='soccer'?['MEADOW FIELD','PALM ARENA','GOLDEN NIGHT'][a.level-1]:['CLAY CLUB','GARDEN COURT','BLUE CENTER COURT'][a.level-1];
 text(ac,label,w*.5,h*.979,10,a.level===3?'#e5ca83':'#f0e1c2','center',800);
}
function drawFootball(x,y,r=12,fire=false){
 ellipse(ac,x+3,y+8,r*.9,r*.35,'#102d3339');
 const g=ac.createRadialGradient(x-r*.35,y-r*.4,1,x,y,r);g.addColorStop(0,fire?'#fff2a5':'#fffdf0');g.addColorStop(1,fire?'#e1a948':'#c1d5cf');ellipse(ac,x,y,r,r,g);
 const pts=[];for(let i=0;i<5;i++){const t=-Math.PI/2+i*Math.PI*2/5;pts.push([x+Math.cos(t)*r*.4,y+Math.sin(t)*r*.4]);}
 ac.beginPath();pts.forEach(([px,py],i)=>i?ac.lineTo(px,py):ac.moveTo(px,py));ac.closePath();ac.fillStyle=fire?'#a96b29':'#344f57';ac.fill();
 for(let i=0;i<5;i++){const t=-Math.PI/2+i*Math.PI*2/5;line(ac,[pts[i],[x+Math.cos(t)*r*.9,y+Math.sin(t)*r*.9]],fire?'#a96b2980':'#5b747380',1);}
 ellipse(ac,x-r*.36,y-r*.4,r*.15,r*.12,'#ffffffbb');
}
function drawTennisBall(b,w,h){
 const x=b.x*w,y=b.y*h,r=b.gold?12:9;
 if(b.gold||b.smash)ellipse(ac,x,y,r+6,r+6,b.smash?'#ffbd7433':'#ffe57730');
 const g=ac.createRadialGradient(x-3,y-4,1,x,y,r);g.addColorStop(0,b.smash?'#ffe7aa':b.gold?'#fff3a0':'#f4ffa1');g.addColorStop(1,b.smash?'#e9974b':b.gold?'#e7bb45':'#bfd45d');ellipse(ac,x,y,r,r,g);
 ac.save();ac.beginPath();ac.arc(x,y,r,0,Math.PI*2);ac.clip();ac.strokeStyle='#fffde5';ac.lineWidth=1.5;for(const sign of [-1,1]){ac.beginPath();ac.arc(x+sign*r*1.15,y,r*.95,0,Math.PI*2);ac.stroke();}ac.restore();
}
function drawShieldPickup(x,y,r=21){
 ellipse(ac,x,y,r+4,r+4,'#b5fbfa25');
 ac.beginPath();ac.moveTo(x,y-r);ac.lineTo(x+r*.8,y-r*.55);ac.lineTo(x+r*.65,y+r*.3);ac.quadraticCurveTo(x+r*.5,y+r*.75,x,y+r);ac.quadraticCurveTo(x-r*.5,y+r*.75,x-r*.65,y+r*.3);ac.lineTo(x-r*.8,y-r*.55);ac.closePath();ac.fillStyle='#82d9df';ac.fill();ac.strokeStyle='#e8ffed';ac.lineWidth=2;ac.stroke();line(ac,[[x-r*.35,y],[x-r*.05,y+r*.28],[x+r*.38,y-r*.3]],'#fffce6',3);
}
function drawBananaPickup(x,y){
 ellipse(ac,x,y,23,23,'#fff4b822');ac.save();ac.translate(x,y);ac.rotate(-.35);
 ac.beginPath();ac.moveTo(-13,-15);ac.bezierCurveTo(-20,8,-1,25,18,6);ac.bezierCurveTo(1,15,-8,2,-9,-13);ac.closePath();const g=ac.createLinearGradient(-15,-10,15,20);g.addColorStop(0,'#fff1a5');g.addColorStop(.6,'#ffd66b');g.addColorStop(1,'#dbaa41');ac.fillStyle=g;ac.fill();ac.strokeStyle='#876f37';ac.lineWidth=1.3;ac.stroke();line(ac,[[-13,-15],[-10,-18]],'#84643b',4);line(ac,[[16,7],[19,5]],'#84643b',3);ac.restore();
}
function drawCoastArena(a,w,h){
 const palettes=[['#9dbb87','#ebd5a5','#6fb8ba'],['#98b08b','#ecc997','#75aeb4'],['#537e78','#b6ab8c','#467d95']],colors=palettes[a.level-1];
 const scroll=a.elapsed*(a.boost>0?210:140);
 for(let lane=0;lane<3;lane++){
  const y=lane*h/3,g=ac.createLinearGradient(0,y,0,y+h/3);g.addColorStop(0,colors[lane]);g.addColorStop(1,lane===2?['#95cebf','#a5c9be','#598da0'][a.level-1]:colors[lane]);ac.fillStyle=g;ac.fillRect(0,y,w,h/3);
  for(let j=0;j<18;j++){const x=((j*83-scroll*(lane===2?.5:1))%(w+100)+(w+100))%(w+100)-50,yy=y+23+seed(j+lane*60)*(h/3-40);
   if(lane===0)line(ac,[[x,yy+3],[x+2,yy-3],[x+5,yy+2]],'#ecf1c52d',2);
   else if(lane===1)ellipse(ac,x,yy,2,1,'#917f5c33');
   else{ac.beginPath();ac.moveTo(x,yy);ac.quadraticCurveTo(x+10,yy-5,x+22,yy);ac.strokeStyle='#d6f1e46e';ac.lineWidth=2;ac.stroke();}
  }
  for(let j=0;j<10;j++){const x=((j*125-scroll)%(w+125)+(w+125))%(w+125)-60;line(ac,[[x,y+h/3-2],[x+52,y+h/3-2]],'#fff7dd8a',3);}
 }
 line(ac,[[0,h*.012],[w,h*.012]],a.level===3?'#dfc17b':'#65895e',8);
 line(ac,[[0,h*.985],[w,h*.985]],'#d5e4c852',6);
 if(a.level===3)for(const x of [28,w-28]){ellipse(ac,x,14,15,5,'#fff1b7');const light=ac.createRadialGradient(x,14,2,x,14,100);light.addColorStop(0,'#e4f1d029');light.addColorStop(1,'#e4f1d000');ac.fillStyle=light;ac.fillRect(x-100,0,200,120);}
}
function spaceBackdrop(a,w,h){
 const key=`${a.level}:${w}:${h}`;if(arcadeBackdropCache.has(key))return arcadeBackdropCache.get(key);
 const bg=document.createElement('canvas');bg.width=w;bg.height=h;const c=bg.getContext('2d'),sky=[['#223f5a','#425773'],['#282f54','#51416c'],['#17283f','#343761']][a.level-1];
 const g=c.createLinearGradient(0,0,w,h);g.addColorStop(0,sky[0]);g.addColorStop(1,sky[1]);c.fillStyle=g;c.fillRect(0,0,w,h);
 for(let i=0;i<3;i++){const mist=c.createRadialGradient(w*(.15+i*.35),h*.35,10,w*(.15+i*.35),h*.35,w*.35);mist.addColorStop(0,i%2?'#a38ec91a':'#69b5ca1a');mist.addColorStop(1,'#769fca00');c.fillStyle=mist;c.fillRect(0,0,w,h);}
 for(let i=0;i<85;i++){const x=seed(i+10)*w,y=seed(i+300)*h*.86,r=.6+seed(i)*1.3;ellipse(c,x,y,r,r,i%5?'#d3e4de77':'#fff3b8');}
 const px=w*.84,py=h*.18,r=[44,50,58][a.level-1];
 if(a.level>=2){c.save();c.translate(px,py);c.rotate(-.35);c.strokeStyle='#b4bbd455';c.lineWidth=8;c.beginPath();c.ellipse(0,0,r*1.55,r*.37,0,0,Math.PI*2);c.stroke();c.restore();}
 const planet=c.createRadialGradient(px-r*.3,py-r*.35,2,px,py,r);planet.addColorStop(0,['#e7debb','#a0caca','#c4b2d4'][a.level-1]);planet.addColorStop(1,['#8b998e','#5e859d','#6c648f'][a.level-1]);ellipse(c,px,py,r,r,planet);ellipse(c,px-r*.25,py-r*.2,r*.18,r*.13,'#3e577526');ellipse(c,px+r*.25,py+r*.3,r*.25,r*.18,'#3e577526');
 c.fillStyle='#818e9e';c.beginPath();c.moveTo(0,h);c.lineTo(0,h*.89);for(let i=0;i<=20;i++)c.lineTo(i*w/20,h*(.89+Math.sin(i*1.7)*.012));c.lineTo(w,h);c.fill();
 line(c,[[0,h*.9],[w,h*.9]],'#d8e0dd55',2);for(let i=0;i<12;i++)ellipse(c,seed(i+20)*w,h*(.92+seed(i+90)*.07),12+seed(i)*12,3,'#4b627833');
 arcadeBackdropCache.set(key,bg);return bg;
}
function drawSpacePad(pad,w,h,a){
 const x=pad.x*w,y=pad.y*h+(pad.spring||0)*12,pw=pad.w*w,active=pad.spring>0;
 ellipse(ac,x+pw/2,y+13,pw*.44,9,active?'#f7e9a833':'#87e2df20');rr(ac,x,y,pw,13,6,active?'#e5db98':'#7aa5b2','#cae6df');rr(ac,x+6,y+3,pw-12,3,2,active?'#fff5b8':'#afe7e3');
 line(ac,[[x+pw*.45,y+8],[x+pw*.5,y+4],[x+pw*.55,y+8]],'#f5ffe8',2);
 for(const xx of [x+12,x+pw-12]){rr(ac,xx-4,y+13,8,6,2,'#49667c');ellipse(ac,xx,y+20,3,2,'#8df1e8');}
 if(a.level>=2){text(ac,'‹',x-7,y+5,14,'#bce5e6');text(ac,'›',x+pw+7,y+5,14,'#bce5e6');}
}
function drawMeteor(e,w,h,now){
 const x=e.x*w,y=e.y*h;
 if(e.warn>0){const yy=h*.065;ac.save();ac.globalAlpha=arcadeMotion.matches?.85:.65+Math.sin(now*8)*.2;line(ac,[[x,yy+20],[x,yy+60]],'#ffbb7955',2);ac.strokeStyle='#ffc589';ac.lineWidth=2;ac.beginPath();ac.arc(x,yy,17,0,Math.PI*2);ac.stroke();text(ac,'!',x,yy,20,'#ffdb9c','center',800);ac.restore();return;}
 line(ac,[[x+8,y-44],[x,y]],'#f5b36b30',20);line(ac,[[x+5,y-25],[x,y]],'#ffc38277',9);
 ac.beginPath();for(let i=0;i<7;i++){const t=i*Math.PI*2/7,r=i%2?15:18;const xx=x+Math.cos(t)*r,yy=y+Math.sin(t)*r;i?ac.lineTo(xx,yy):ac.moveTo(xx,yy);}ac.closePath();ac.fillStyle='#9d7868';ac.fill();ac.strokeStyle='#f5bc82';ac.lineWidth=2;ac.stroke();ellipse(ac,x-5,y-4,5,4,'#725d59');ellipse(ac,x+6,y+6,3,3,'#725d59');
}

const plazaIds=['soccer','racket','racing','space'];
let plazaSiteCache=null;
function plazaProgress(){const ids=plazaIds.filter(id=>state.stamps.includes(id));return {ids,count:ids.length,complete:ids.length===4,name:ids.length===4?'그랜드 챔피언 광장':ids.length?'축제가 시작된 광장':'작은 바나나 광장'};}
function plazaSites(){
  if(plazaSiteCache?.owner===state)return plazaSiteCache.sites;
  const bases=[{x:840,y:610},{x:815,y:800},{x:1140,y:800},{x:1080,y:610}],sites=[];
  for(let i=0;i<4;i++){
    const base=bases[i],choices=[base];
    for(const r of [40,75,110])for(let j=0;j<8;j++)choices.push({x:base.x+Math.cos(j*Math.PI/4)*r,y:base.y+Math.sin(j*Math.PI/4)*r});
    const p=choices.find(p=>p.x>=770&&p.x<=1190&&p.y>=565&&p.y<=875&&Math.hypot(p.x-960,p.y-670)>125&&
      ![...state.decors.filter(d=>islandOf(d)==='banana'),...resources.filter(d=>islandOf(d)==='banana'),...trees.filter(d=>islandOf(d)==='banana'),...stations.filter(d=>islandOf(d)==='banana').map(d=>d.position)].some(d=>hypot(p,d)<60)&&!sites.some(d=>hypot(p,d)<80))||base;
    sites.push({...p,id:plazaIds[i]});
  }
  plazaSiteCache={owner:state,sites};return sites;
}
function plazaRecommendation(){
  if(state.cp<10)return {kind:'rest',title:'다음 경기 전에 잠깐 쉬어요',message:'경기 입장에는 10 CP가 필요해요. 벤치에서 쉬거나 나무를 수확해 CP를 모아보세요.',button:'CP 모으러 가기'};
  const missing=plazaIds.filter(id=>!state.stamps.includes(id));
  if(missing.length){
    const id=missing.sort((p,q)=>(state.best[q]||0)/games[q].targets[state.levels[q]-1]-(state.best[p]||0)/games[p].targets[state.levels[p]-1])[0],g=games[id],target=g.targets[state.levels[id]-1],best=state.best[id]||0;
    const tip={soccer:'밝은 파워 구간에서 놓고 골대의 빈 곳을 노려봐요.',racket:'밝은 구간에서 강타해 상대 선수의 빈 코스를 노려봐요.',racing:'높은 바위는 레인 변경, 낮은 허들은 점프로 피할 수 있어요.',space:'연결된 별 3개와 발판 첫 착지 보너스를 노려봐요.'}[id];
    return {kind:'game',id,champ:false,title:`${g.name} 트로피에 도전!`,message:best>=target&&usesHealth({id})?'목표 점수에는 도달했어요! 이번에는 하트가 남은 채로 25초를 버텨보세요.':`${best?`최고 ${best}점이에요. `:''}목표 ${target}점을 달성하면 ${g.icon} 트로피가 광장에 전시돼요. ${tip}`,button:state.discovered.includes(id)?'도전 준비':'구장 입구로 안내'};
  }
  const next=plazaIds.filter(id=>state.levels[id]<3).sort((p,q)=>state.levels[p]-state.levels[q]);
  const affordable=next.find(id=>{const c=upgradeCost(id);return state.coins>=c.coins&&state.trophies>=c.trophies;});
  if(affordable){const id=affordable;return {kind:'upgrade',id,title:`${games[id].name} 업그레이드 준비!`,message:`네 개의 트로피를 모두 모았어요! 이제 Lv.${state.levels[id]+1} 외형과 새로운 스킬을 열어볼까요?`,button:'업그레이드 미리보기'};}
  const id=[...plazaIds].sort((p,q)=>{const n=id=>[1,2,3].reduce((sum,l)=>sum+(state.arcadeRecords[arcadeRecordKey(id,l,true)]?.plays||0),0);return n(p)-n(q);})[0];
  return {kind:'game',id,champ:true,title:`${games[id].name} 챔피언 도전`,message:next.length?'황금 분수가 완성됐어요! 챔피언 도전으로 코인과 트로피를 모아 다음 스테이션 업그레이드를 준비해봐요.':'모든 스테이션이 최고 단계예요! 챔피언 모드에서 새로운 기록을 광장에 남겨봐요.',button:'챔피언 도전 준비'};
}
function followPlazaRecommendation(rec=plazaRecommendation()){
  if(runtime.mode!=='world')return;
  if(rec.id&&islandOf(games[rec.id])!==state.island)switchIsland(islandOf(games[rec.id]));
  if(rec.kind==='upgrade')return openUpgrade(rec.id);
  if(rec.kind==='rest'){
    const target=activeDecors().filter(d=>d.id==='bench').sort((p,q)=>hypot(p,state.player)-hypot(q,state.player))[0]||activeTrees().filter(t=>t.readyAt<=Date.now()).sort((p,q)=>hypot(p,state.player)-hypot(q,state.player))[0];
    closeModal();if(target){pathTo({x:target.x,y:target.y+55});toast('도착하면 E / Space로 쉬거나 수확해 보세요.');}else toast('나무가 다시 열매를 맺으면 수확해 CP를 모아보세요.');return;
  }
  runtime.champMode=rec.champ;
  if(!state.discovered.includes(rec.id)){closeModal();pathTo(games[rec.id].door);toast(`${games[rec.id].name} 입구로 안내할게요.`);return;}
  const r=regions.find(r=>r.id===rec.id);state.player={...r.arrival};runtime.camera={...state.player};dirty();gameIntro(rec.id);
}
function plazaRecommendationHtml(){
  const rec=plazaRecommendation();return `<section class="plaza-advice"><div class="plaza-advice-label">광장의 다음 도전</div><b>${rec.title}</b><p>${rec.message}</p><button class="soft-btn primary wide" id="plazaFollow">${rec.button}</button></section>`;
}
function bindPlazaRecommendation(){if($('plazaFollow'))$('plazaFollow').onclick=()=>followPlazaRecommendation();}
function openPlaza(){
  if(runtime.mode!=='world')return;
  const p=plazaProgress();showModal('바나나 페스티벌 광장',`<div class="plaza-summary ${p.complete?'complete':''}"><span>${p.complete?'🏆':'⛲'}</span><div><b>${p.name}</b><p>챔피언 스탬프 ${p.count} / 4 · ${p.complete?'황금 바나나 분수 완성!':'새 트로피를 얻을 때마다 분수와 광장 장식이 자라나요.'}</p></div></div><div class="plaza-growth">${[0,1,2,3,4].map(n=>`<span class="${n<=p.count?'earned':''}">${n===4?'🏆':n}<small>${n===0?'시작':n===4?'황금 분수':`${n}개`}</small></span>`).join('')}</div><div class="plaza-exhibits">${plazaIds.map(id=>`<button class="plaza-exhibit ${p.ids.includes(id)?'earned':''}" data-plaza-record="${id}"><span>${p.ids.includes(id)?'🏆':games[id].icon}</span><b>${games[id].name}</b><small>${p.ids.includes(id)?'트로피 획득':'스탬프를 모아 전시해요'} · Lv.${state.levels[id]}</small></button>`).join('')}</div>${plazaRecommendationHtml()}<div class="dialog-actions"><button class="soft-btn" id="plazaQuizBook">지식 수첩</button><button class="soft-btn primary" id="plazaVisit">분수 앞으로 이동</button></div>`,'plaza');
  document.querySelectorAll('[data-plaza-record]').forEach(b=>b.onclick=()=>openPlazaRecord(b.dataset.plazaRecord));bindPlazaRecommendation();$('plazaVisit').onclick=visitPlaza;$('plazaQuizBook').onclick=()=>openQuizNotebook(null);
}
function openPlazaRecord(id){
  if(runtime.mode!=='world'||!games[id])return;
  const g=games[id],earned=state.stamps.includes(id),plays=[1,2,3].reduce((s,l)=>s+(state.arcadeRecords[arcadeRecordKey(id,l,false)]?.plays||0)+(state.arcadeRecords[arcadeRecordKey(id,l,true)]?.plays||0),0);
  showModal(`${g.icon} ${g.name} · ${islandOf(g)==='banana'?'광장':islands[islandOf(g)].name} 트로피`,`<div class="plaza-summary ${earned?'complete':''}"><span>${earned?'🏆':g.icon}</span><div><b>${earned?islandOf(g)!=='banana'?'섬 챔피언 트로피':'광장에 전시된 트로피':'아직 비어 있는 전시대'}</b><p>${earned?islandOf(g)!=='banana'?'섬의 도전 기록이 수첩에 남았어요.':'클리어의 순간이 광장에 남았어요.':`목표 ${g.targets[state.levels[id]-1]}${scoreUnit(id)}을 달성하면 트로피가 나타나요.${usesHealth({id})?' 하트가 남은 채로 25초를 버텨야 해요.':''}`}</p></div></div><p>현재 Lv.${state.levels[id]} · ${tierNames[state.levels[id]-1]}<br>종합 최고 ${state.best[id]||0}${scoreUnit(id)} · 기록된 도전 ${plays}회</p><table class="plaza-records"><thead><tr><th>단계</th><th>일반 최고</th><th>챔피언 최고</th></tr></thead><tbody>${[1,2,3].map(l=>`<tr class="${l===state.levels[id]?'current':''}"><th>Lv.${l}<small>목표 ${g.targets[l-1]}${scoreUnit(id)}</small></th><td>${modeBest(id,l,false)||'—'}</td><td>${modeBest(id,l,true)||'—'}</td></tr>`).join('')}</tbody></table><div class="dialog-actions"><button class="soft-btn primary" id="plazaGame">${state.discovered.includes(id)?'도전 준비':'구장 입구로 안내'}</button><button class="soft-btn" id="plazaUpgrade">스테이션 업그레이드</button><button class="soft-btn" id="plazaBack">${islandOf(g)==='banana'?'광장':islands[islandOf(g)].name} 수첩</button></div>`,'plaza-record');
  $('plazaGame').onclick=()=>followPlazaRecommendation({kind:'game',id,champ:false});$('plazaUpgrade').onclick=()=>openUpgrade(id);$('plazaBack').onclick=()=>islandOf(g)==='banana'?openPlaza():islandPassport(islandOf(g));
}
function visitPlaza(){
  if(runtime.mode!=='world')return;if(state.island!=='banana')switchIsland('banana',{x:960,y:760});endDecor();closeModal();state.player={x:960,y:760};runtime.camera={...state.player};dirty();toast('분수와 네 개의 전시대를 눌러 광장의 기록을 살펴보세요.');
}
function plazaHitTest(p){
  if(state.island!=='banana')return null;
  for(const s of [...plazaSites()].sort((p,q)=>q.y-p.y))if(Math.abs(p.x-s.x)<35&&p.y>s.y-78&&p.y<s.y+19)return {kind:'plazaTrophy',id:s.id};
  if(Math.abs(p.x-960)<77&&p.y>558&&p.y<706)return {kind:'plazaFountain'};
  return null;
}
function drawPlazaBanana(c,x,y,complete){
  c.save();c.translate(x,y);c.rotate(-.28);c.strokeStyle=complete?'#a47e32':'#b39c4a';c.lineWidth=18;c.beginPath();c.moveTo(-16,-14);c.quadraticCurveTo(-18,18,17,14);c.stroke();c.strokeStyle=complete?'#ffe19a':'#ebd574';c.lineWidth=13;c.stroke();c.strokeStyle='#fff2b8';c.lineWidth=3;c.beginPath();c.moveTo(-17,-10);c.quadraticCurveTo(-14,11,10,13);c.stroke();line(c,[[-16,-17],[-17,-21]],'#786c41',4);line(c,[[18,14],[22,12]],'#786c41',3);c.restore();
}
function drawPlazaFountain(c,now){
  const p=plazaProgress(),x=960,y=670,night=['night','sunset'].includes(currentWeather().id),gold=p.complete;
  c.save();
  if(night){c.globalCompositeOperation='screen';ellipse(c,x,y-15,100,68,gold?'#ffe19942':'#b9efdf24');c.globalCompositeOperation='source-over';}
  ellipse(c,x,y+10,85,40,'#647b4f2b');ellipse(c,x,y,77,39,gold?'#c2a259':'#abb7a1');ellipse(c,x,y-6,70,35,gold?'#f3deb0':'#e4dfc6');ellipse(c,x,y-10,61,28,gold?'#7fccc0':'#8bc1b4');ellipse(c,x,y-13,51,21,'#b3e0cf');
  for(let i=0;i<(gold?8:4+p.count);i++){
    const a=i*Math.PI*2/(gold?8:4+p.count),bob=arcadeMotion.matches?0:Math.sin(now*2+i)*3;
    c.strokeStyle=gold?'#fff1b399':'#d7f2dfaa';c.lineWidth=2.5;c.beginPath();c.moveTo(x,y-58);c.quadraticCurveTo(x+Math.cos(a)*38,y-80+bob,x+Math.cos(a)*49,y-14+Math.sin(a)*12);c.stroke();
  }
  line(c,[[x,y-10],[x,y-66]],gold?'#c7a25b':'#c9c79f',17);ellipse(c,x,y-65,24,12,gold?'#efdaa1':'#e5ddbc');drawPlazaBanana(c,x,y-94,gold);
  for(const [i,id]of plazaIds.entries())if(p.ids.includes(id)){
    const a=-Math.PI*.77+i*Math.PI*.52,bx=x+Math.cos(a)*83,by=y+Math.sin(a)*37;
    ellipse(c,bx,by,17,13,'#faf0c8');text(c,games[id].icon,bx,by-1,17,games[id].color);
    stadiumFlag(c,x+(i%2?1:-1)*(89+(i>1?13:0)),y-35+(i>1?32:0),games[id].color);
  }
  rr(c,x-96,y-146,192,25,9,gold?'#eedb9ddd':'#fff9e2e8',gold?'#c4a25a':'#c6d0ae');text(c,gold?'바나나 페스티벌 · GRAND OPEN':p.count?'바나나 페스티벌 준비 중':'바나나 페스티벌 광장',x,y-133,10,gold?'#81612a':'#6a825e','center',800);
  rr(c,x-37,y+28,74,21,8,gold?'#e7ce83':'#f3efd6');text(c,`🏆 ${p.count} / 4`,x,y+39,10,'#6e7751','center',800);
  if(gold){
    const sparkle=arcadeMotion.matches?1:.7+.3*Math.sin(now*2);c.globalAlpha=sparkle;
    for(let i=0;i<5;i++)text(c,'✦',x-61+i*30,y-113-(i%2)*9,11,'#fff0af');c.globalAlpha=1;
  }
  c.restore();
}
function drawPlazaTrophy(c,s,now){
  const g=games[s.id],earned=state.stamps.includes(s.id),near=hypot(state.player,s)<125,hover=runtime.hover&&plazaHitTest(runtime.hover)?.id===s.id;
  c.save();ellipse(c,s.x+3,s.y+6,35,13,'#486b4126');
  if(earned&&['night','sunset'].includes(currentWeather().id))ellipse(c,s.x,s.y-34,39,45,'#ffe8a52b');
  rr(c,s.x-28,s.y-30,56,34,7,earned?'#b8bea0':'#a5b59b',hover||near?'#f8e7ad':'#7e9678');rr(c,s.x-31,s.y-35,62,12,4,earned?'#e7d49b':'#ced8b9');
  if(earned){
    const ty=s.y-56;rr(c,s.x-13,ty-15,26,22,5,'#e0b958','#fff1b6');ellipse(c,s.x,ty+5,11,7,'#e0b958');line(c,[[s.x,ty+9],[s.x,ty+20]],'#c5a050',5);rr(c,s.x-12,ty+18,24,6,3,'#d3b268');
    c.strokeStyle='#d3ad55';c.lineWidth=3;c.beginPath();c.arc(s.x-12,ty-3,9,Math.PI*.5,Math.PI*1.5);c.stroke();c.beginPath();c.arc(s.x+12,ty-3,9,-Math.PI*.5,Math.PI*.5);c.stroke();text(c,g.icon,s.x,ty-5,14,g.color);
  }else{ellipse(c,s.x,s.y-51,17,17,'#c1ceb172');text(c,g.icon,s.x,s.y-52,19,'#8a9f7f');}
  text(c,earned?'★'.repeat(state.levels[s.id]):'스탬프 대기',s.x,s.y-14,earned?10:8,earned?'#f8e9b2':'#edf2de');
  rr(c,s.x-44,s.y+7,88,20,7,'#fff9e6e8');text(c,{soccer:'축구',racket:'테니스',racing:'바나나 런',space:'스타라이트'}[s.id]+' 기록',s.x,s.y+17,9,'#607b5d','center',700);
  if(near||hover)text(c,'클릭 · E',s.x,s.y+38,9,'#6e805d');c.restore();
}
function drawPlazaFestival(c,now){
  const p=plazaProgress();if(!p.count)return;
  for(let i=0;i<2;i++){
    const sx=794,ex=1166,yy=582+i*251;line(c,[[sx,yy],[sx+100,yy+9],[ex-100,yy+9],[ex,yy]],'#a9a581',1.5);
    for(let j=0;j<10;j++){
      const id=plazaIds[j%4];if(!p.ids.includes(id))continue;const x=sx+15+j*37,y=yy+4;
      c.fillStyle=p.complete?j%2?'#dfc16b':games[id].color:games[id].color;c.beginPath();c.moveTo(x,y);c.lineTo(x+17,y+1);c.lineTo(x+8,y+17);c.closePath();c.fill();
    }
  }
  if(runtime.plazaCelebration>0&&!arcadeMotion.matches){
    c.save();c.globalAlpha=Math.min(1,runtime.plazaCelebration);for(let i=0;i<18;i++){const x=815+seed(i+93)*300,y=575+((now*35+seed(i+32)*210)%240);rr(c,x,y,4,7,1,['#efd17a','#dce5bc','#9ecac1'][i%3]);}c.restore();
  }
}
function updatePlaza(dt){
  runtime.plazaCelebration=Math.max(0,(runtime.plazaCelebration||0)-dt);
  if(runtime.plazaNewStamp&&hypot(state.player,{x:960,y:690})<260){
    const id=runtime.plazaNewStamp;runtime.plazaNewStamp=null;runtime.plazaCelebration=4;
    toast(plazaProgress().complete?'🏆 네 개의 트로피와 황금 바나나 분수 완성!':`${games[id].icon} 새 트로피가 광장에 전시됐어요!`);sound('win');
  }
}

// Stable question IDs keep learning progress intact when the bank grows.
const quizTopics={soccer:{name:'축구',icon:'⚽',color:'#719a78',intro:'슈팅 규칙부터 실제 축구의 판정까지'},racket:{name:'테니스',icon:'🎾',color:'#c18e6d',intro:'랠리 조작부터 점수와 경기 규칙까지'},racing:{name:'달리기',icon:'👟',color:'#70aeb1',intro:'바나나런 규칙부터 육상과 페이스 계산까지'},space:{name:'천문학',icon:'✦',color:'#9185b3',intro:'점프 규칙부터 태양계와 우주 과학까지'}};
const quizLevelNames=['게임 규칙','기초 상식','도전 지식'];
const quizSources={
 game:{name:'미니 월드 · 현재 게임 규칙'},
 players:{name:'IFAB · Law 3',url:'https://www.theifab.com/laws/latest/the-players/'},
 duration:{name:'IFAB · Law 7',url:'https://www.theifab.com/laws/latest/the-duration-of-the-match/'},
 out:{name:'IFAB · Law 9',url:'https://www.theifab.com/laws/latest/the-ball-in-and-out-of-play/'},
 throw:{name:'IFAB · Law 15',url:'https://www.theifab.com/laws/latest/the-throw-in/'},
 foul:{name:'IFAB · Law 12',url:'https://www.theifab.com/laws/latest/fouls-and-misconduct/'},
 offside:{name:'IFAB · Law 11',url:'https://www.theifab.com/laws/latest/offside/'},
 free:{name:'IFAB · Law 13',url:'https://www.theifab.com/laws/latest/free-kicks/'},
 field:{name:'IFAB · Law 1',url:'https://www.theifab.com/laws/latest/the-field-of-play/'},
 tennis:{name:'ITF · Rules of Tennis 2026',url:'https://www.itftennis.com/media/7221/2026-rules-of-tennis-english.pdf'},
 score:{name:'USTA · Tennis Scoring',url:'https://www.usta.com/en/home/improve/tips-and-instruction/national/tennis-scoring-rules.html'},
 point:{name:'USTA · Playing Tennis Points',url:'https://www.usta.com/en/home/improve/tips-and-instruction/national/playing-points-tennis.html'},
 serve:{name:'ITF · Tennis Glossary',url:'https://www.itftennis.com/en/about-us/organisation/tennis-glossary/'},
 marathon:{name:'World Athletics · Marathon',url:'https://worldathletics.org/disciplines/race-walks/marathon'},
 sprint:{name:'World Athletics · 200 Metres',url:'https://worldathletics.org/disciplines/sprint-event/200-metres'},
 hundred:{name:'World Athletics · 100 Metres',url:'https://worldathletics.org/disciplines/sprint-event/100-metres'},
 relay:{name:'World Athletics · 4×100 Metres Relay',url:'https://worldathletics.org/disciplines/relays/4x100-metres-relay'},
 hurdles:{name:'World Athletics · 400 Metres Hurdles',url:'https://worldathletics.org/disciplines/sprints/400-metres-hurdles'},
 athletics:{name:'World Athletics · Technical Rules',url:'https://worldathletics.org/about-iaaf/documents/book-of-rules'},
 math:{name:'직접 계산 · 거리 × 1km당 걸린 시간'},
 moon:{name:'NASA · Top Moon Questions',url:'https://science.nasa.gov/moon/top-moon-questions/'},
 sun:{name:'NASA · Solar System Facts',url:'https://science.nasa.gov/solar-system/solar-system-facts/'},
 jupiter:{name:'NASA · Jupiter Facts',url:'https://science.nasa.gov/jupiter/jupiter-facts/'},
 mars:{name:'NASA · Mars Facts',url:'https://science.nasa.gov/mars/facts/'},
 seasons:{name:'NASA Space Place · Seasons',url:'https://spaceplace.nasa.gov/seasons/en/'},
 light:{name:'NASA Space Place · Light-Year',url:'https://spaceplace.nasa.gov/light-year/en/'}
};
function quizQ(id,q,options,explain,source='game'){return{id,q,options,answer:0,explain,source};}
const quizBank={
 soccer:{
 1:[
 quizQ('s1-shot','슈퍼 스트라이커에서 파워 슛을 차는 방법은?',['Space를 눌렀다 놓는다','Space를 누른 채 끝까지 기다린다','위쪽 방향키만 누른다'],'Space나 슛 버튼을 누르면 파워가 차고, 놓는 순간 공을 차요.'),
 quizQ('s1-ring','황금 링을 통과한 공이 골에 들어가면 기본 득점 계산에 어떤 효과가 있나요?',['링 배수 ×2가 적용된다','무조건 100점을 얻는다','남은 시간이 두 배가 된다'],'황금 링을 통과하고 골까지 성공해야 링 배수가 적용돼요. 링 통과만으로 골 점수를 받지는 않아요.'),
 quizQ('s1-sweet','밝은 파워 구간에서 놓은 정밀 슛이 골에 들어가면 추가되는 점수는?',['6점','1점','30점'],'밝은 구간은 파워 65~85%예요. 이때 놓은 슛이 골에 들어가면 정밀 파워 보너스 6점이 더해져요.'),
 quizQ('s1-keeper','골키퍼에게 계속 막힌다면 어떤 슛이 좋을까요?',['골키퍼가 비운 코너를 노린다','항상 골키퍼 정면으로 찬다','골대 밖으로 찬다'],'좌우로 이동하며 조준선을 확인해요. 골키퍼가 비운 쪽과 골대 안쪽 코너가 좋은 목표예요.'),
 quizQ('s1-time','슈퍼 스트라이커 한 경기의 제한 시간은?',['25초','10초','90분'],'이 미니게임은 25초 동안 점수를 모아요. 실제 축구 경기의 시간 규칙과는 달라요.')],
 2:[
 quizQ('s2-players','일반적인 성인 11인제 축구에서 한 팀의 최대 출전 선수 수는?',['골키퍼 포함 11명','골키퍼 포함 6명','골키퍼 포함 15명'],'한 팀은 골키퍼 한 명을 포함해 최대 11명으로 경기해요. 풋살이나 유소년 경기는 별도 규칙을 쓸 수 있어요.','players'),
 quizQ('s2-duration','일반적인 성인 축구의 정규 경기 시간은 추가시간을 빼면?',['전후반 각 45분','전후반 각 25분','총 25초'],'일반적인 성인 경기는 전후반 각 45분이에요. 주심이 각 하프의 손실 시간을 추가하고, 대회에 따라 연장전도 있어요.','duration'),
 quizQ('s2-out','공이 터치라인을 넘어 아웃이 되는 기준은?',['공 전체가 라인을 완전히 넘는다','공의 절반만 넘는다','공이 라인에 닿기만 한다'],'지면이나 공중에서 공 전체가 터치라인 또는 골라인을 넘어야 아웃이에요. 라인에 일부가 걸쳐 있으면 아직 인플레이예요.','out'),
 quizQ('s2-throw','A팀 선수가 마지막으로 건드린 공이 터치라인 밖으로 나가면 누구의 스로인일까요?',['B팀','A팀','항상 홈팀'],'스로인은 마지막으로 공을 건드린 선수의 상대 팀에게 주어져요. 골라인 밖으로 나갔을 때는 다른 재개 규칙을 적용해요.','throw'),
 quizQ('s2-hands','골키퍼가 일반적으로 손을 사용할 수 있는 구역은?',['자기 팀 페널티 에어리어 안','상대 팀 페널티 에어리어 안','운동장 어디서나'],'골키퍼도 자기 페널티 에어리어 밖에서는 다른 선수와 같은 핸드볼 제한을 받아요. 안쪽에서도 백패스 등 별도 제한이 있어요.','foul')],
 3:[
 quizQ('s3-position','오프사이드 위치에 서 있기만 해도 반드시 반칙일까요?',['아니다. 플레이 관여 여부도 판단한다','그렇다. 위치만으로 항상 반칙이다','골키퍼만 오프사이드가 된다'],'오프사이드 위치 자체는 반칙이 아니에요. 동료가 공을 플레이한 순간의 위치와, 공을 건드리거나 상대를 방해하는 등 실제 관여를 함께 판단해요.','offside'),
 quizQ('s3-throw','동료의 스로인을 직접 받은 경우 오프사이드가 적용될까요?',['직접 받은 경우에는 적용되지 않는다','항상 적용된다','공중에서 받으면 적용된다'],'스로인, 골킥, 코너킥에서 공을 직접 받을 때에는 오프사이드 반칙이 없어요. 이후 동료의 패스에는 다시 일반 규칙을 적용해요.','offside'),
 quizQ('s3-backpass','동료가 의도적으로 발로 골키퍼에게 보낸 공을 골키퍼가 곧바로 손으로 잡으면?',['원칙적으로 상대의 간접 프리킥','자동으로 페널티킥','항상 정상 플레이'],'자기 페널티 에어리어 안이라도 의도적인 동료의 킥을 곧바로 손으로 잡는 것은 제한돼요. 공을 차서 내보내려다 실패한 경우 등 예외는 별도로 판단해요.','foul'),
 quizQ('s3-indirect','간접 프리킥을 찬 공이 아무에게도 닿지 않고 상대 골에 들어가면?',['득점이 아니며 상대 골킥으로 재개','두 골로 인정','그대로 한 골로 인정'],'간접 프리킥은 득점 전에 다른 선수에게 닿아야 해요. 곧바로 상대 골에 들어가면 상대의 골킥이에요.','free'),
 quizQ('s3-penalty','정규 축구장에서 페널티 마크는 골라인 중앙에서 몇 m 떨어져 있나요?',['11m','5m','20m'],'페널티 마크는 두 골포스트 사이의 중앙점에서 11m 떨어진 곳에 표시돼요.','field')]
 },
 racket:{
 1:[
 quizQ('t1-move','선샤인 랠리에서 공의 착지 표시가 오른쪽에 있다면?',['오른쪽으로 이동해 공을 맞이한다','왼쪽 끝에서 기다린다','이동 없이 항상 점프한다'],'좌우 방향키로 공이 도착할 위치를 따라가요. 내 앞의 타격 구간에 공이 오면 리턴할 수 있어요.'),
 quizQ('t1-swing','타이밍 강타를 직접 치는 버튼은?',['Space 또는 강타 버튼','Shift만 누르기','아래 방향키만 누르기'],'Space나 강타 버튼으로 직접 강타해요. 공이 내 타격 구간에 들어왔을 때 눌러야 해요.'),
 quizQ('t1-perfect','PERFECT 강타를 노리기 좋은 순간은?',['공이 내 앞의 밝은 타격 구간에 왔을 때','공이 상대 뒤로 나갔을 때','공이 아직 상대 손에 있을 때'],'내 앞의 밝은 구간에서 타이밍을 맞추면 PERFECT 보너스를 얻어요. 멀리 있는 공에 미리 휘두르면 맞지 않아요.'),
 quizQ('t1-neutral','방향키를 누르지 않고 수동 강타하면 어떤 코스를 노리나요?',['상대 선수의 반대편 코너','항상 상대 정면','항상 코트 밖'],'중립 강타는 상대 위치를 보고 반대편 코너를 노려요. 방향키를 함께 누르면 직접 좌우 코너를 선택해요.'),
 quizQ('t1-winner','이 미니게임에서 위너 보너스를 얻는 상황은?',['상대가 리턴에 실패해 공이 뒤로 빠진다','내가 공을 놓친다','상대가 공을 정상 리턴한다'],'상대 수비를 뚫고 공이 상대 뒤로 지나가면 위너 보너스를 받아요. 실제 테니스의 세트 점수 대신 25초 목표 점수로 클리어를 판단해요.')],
 2:[
 quizQ('t2-love','실제 테니스에서 0점을 부르는 말은?',['러브(Love)','골(Goal)','이글(Eagle)'],'테니스의 일반 게임 점수에서 0점은 러브라고 불러요.','score'),
 quizQ('t2-score','테니스 일반 게임에서 첫 세 포인트를 차례로 따면 점수는?',['15 → 30 → 40','10 → 20 → 30','1 → 2 → 3'],'일반 게임은 러브, 15, 30, 40 순서로 세요. 타이브레이크는 1, 2, 3처럼 다르게 셉니다.','score'),
 quizQ('t2-deuce','어드밴티지 방식의 일반 게임에서 40 대 40을 무엇이라 하나요?',['듀스','매치 포인트','러브'],'40 대 40은 듀스예요. 일반적인 어드밴티지 방식에서는 이후 두 포인트를 연속으로 따야 그 게임을 이겨요.','score'),
 quizQ('t2-line','테니스에서 유효한 코트 경계선에 공이 닿아 바운드하면?',['인으로 인정된다','무조건 아웃이다','반드시 재경기한다'],'경계선에 닿은 공은 그 선이 속한 코트 안에 떨어진 것으로 봐요. 단식과 복식은 유효한 경계가 달라요.','point'),
 quizQ('t2-second','첫 서브가 폴트였다면 일반적으로 다음 기회는?',['두 번째 서브를 넣는다','즉시 상대에게 한 게임을 준다','서브 기회가 다섯 번 남는다'],'첫 서브가 폴트면 같은 쪽에서 두 번째 서브를 해요. 두 번째 서브도 폴트면 더블 폴트로 포인트를 잃어요.','tennis')],
 3:[
 quizQ('t3-tie','7점제 타이브레이크에서 6 대 6 이후 가능한 종료 점수는?',['8 대 6','7 대 6','6 대 6'],'7점제 타이브레이크는 7점 이상이면서 두 점 차가 필요해요. 7 대 6에서는 계속하며 8 대 6이면 끝나요.','tennis'),
 quizQ('t3-diagonal','정상적인 서브는 어느 서비스 박스에 들어가야 하나요?',['네트 너머 대각선 반대편','서버와 같은 쪽의 모든 구역','상대 코트 어디든 상관없다'],'서브는 네트를 넘어 대각선 반대편 서비스 박스에 들어가야 해요. 포인트마다 좌우 서브 위치를 번갈아 사용해요.','serve'),
 quizQ('t3-bounce','일반 테니스에서 상대 공을 두 번 연속 바운드한 뒤에 돌려주면?',['그 포인트를 잃는다','정상 리턴이다','두 점을 얻는다'],'일반 테니스에서는 두 번째 바운드 전에 공을 돌려줘야 해요. 휠체어 테니스의 두 번 바운드 규칙은 별도예요.','tennis'),
 quizQ('t3-receive','상대의 서브를 리턴할 때 바운드 전에 발리로 받아도 되나요?',['안 된다. 먼저 한 번 바운드해야 한다','항상 가능하다','라켓 두 개로 받으면 가능하다'],'리시버는 서브를 한 번 바운드시킨 뒤에 쳐야 해요. 일반 랠리에서의 발리와 구분해야 해요.','point'),
 quizQ('t3-double','첫 서브와 두 번째 서브가 모두 폴트이면 어떻게 되나요?',['서버가 그 포인트를 잃는다','서버가 한 세트를 바로 잃는다','무조건 첫 서브부터 다시 한다'],'두 번 연속 서브 폴트는 더블 폴트예요. 서버가 그 포인트를 잃지만, 게임이나 세트 전체를 자동으로 잃는 것은 아니에요.','tennis')]
 },
 racing:{
 1:[
 quizQ('r1-rock','바나나런에서 높은 바위를 피하는 기본 방법은?',['다른 레인으로 이동한다','항상 정면으로 달린다','가만히 기다린다'],'높은 바위는 레인을 바꿔 피해요. 낮은 파도 허들은 점프로 넘을 수 있어요.'),
 quizQ('r1-hurdle','낮은 파도 허들을 넘는 버튼은?',['Space 또는 점프 버튼','지도 버튼','설정 버튼'],'허들이 가까워질 때 점프해요. 점프 정점에서 깔끔하게 넘으면 정밀 점프 보너스를 얻어요.'),
 quizQ('r1-boost','일반 부스터 한 번에 필요한 바나나 에너지는?',['3개','1개','10개'],'바나나를 모아 에너지 3개를 충전하면 Shift나 부스터 버튼으로 사용할 수 있어요.'),
 quizQ('r1-health','보호막과 무적 효과 없이 장애물에 총 몇 번 부딪히면 종료되나요?',['3번','1번','10번'],'하트는 3개예요. 피격 후 짧은 무적 시간에는 연속 피해를 받지 않고, 보호막은 한 번의 충돌을 막아요.'),
 quizQ('r1-clear','목표 점수를 먼저 모은 뒤 클리어하려면?',['25초가 끝날 때까지 생존한다','즉시 나가기 버튼을 누른다','일부러 하트를 모두 잃는다'],'목표 점수와 생존을 함께 달성해야 해요. 목표를 넘겼어도 세 번째 피해로 하트를 모두 잃으면 클리어가 아니에요.')],
 2:[
 quizQ('r2-marathon','공식 마라톤의 거리는?',['42.195km','21km','100km'],'마라톤의 공식 거리는 42.195km예요. 이름이 비슷한 하프 마라톤은 그 절반인 21.0975km예요.','marathon'),
 quizQ('r2-track','표준 야외 육상 트랙의 1레인 한 바퀴는 정해진 측정선 기준으로?',['400m','100m','1km'],'표준 야외 트랙의 1레인 한 바퀴는 400m예요. 바깥 레인은 곡선 반지름이 커서 한 바퀴 길이가 더 길어요.','sprint'),
 quizQ('r2-relay','4×100m 계주에서 주자들이 다음 주자에게 넘기는 것은?',['배턴','라켓','축구공'],'계주는 배턴을 다음 주자에게 넘기며 이어 달려요. 4×100m는 네 명이 각 100m 구간을 맡아요.','relay'),
 quizQ('r2-sprint','다음 중 대표적인 단거리 달리기 종목은?',['100m','마라톤','10000m'],'100m는 대표적인 단거리 종목이에요. 짧은 거리에서 빠르게 가속하고 속도를 유지하는 경기예요.','hundred'),
 quizQ('r2-laps','400m를 한 바퀴로 계산하면 800m는 몇 바퀴일까요?',['2바퀴','4바퀴','8바퀴'],'800 ÷ 400 = 2예요. 표준 야외 트랙 기준 거리 계산이며, 실제 출발 방식과 레인 규칙은 종목에 따라 달라요.','math')],
 3:[
 quizQ('r3-stagger','200m처럼 곡선을 달리는 레인 경기에서 출발선이 계단식인 이유는?',['레인마다 같은 거리를 달리게 하려고','바깥 선수가 더 멀리 달리게 하려고','관중에게 잘 보이려고만'],'바깥 레인의 곡선 길이가 더 길어요. 출발 위치를 앞으로 옮겨 각 선수가 달릴 거리를 같게 맞춰요.','sprint'),
 quizQ('r3-finish','육상 달리기의 결승 순위에서 기준이 되는 신체 부위는?',['몸통','손끝','머리카락 끝'],'몸통이 결승선의 수직면에 도달한 순서로 판단해요. 머리, 목, 팔, 다리, 손, 발은 몸통 기준에서 제외돼요.','athletics'),
 quizQ('r3-baton','계주에서 배턴이 인계 구역 안에서 전달됐는지 판단하는 핵심은?',['배턴의 위치','관중의 위치','받는 선수의 머리 위치만'],'인계 구역 판정에서 결정적인 것은 배턴의 위치예요. 선수의 몸만 구역 안에 있다고 유효한 인계가 되는 것은 아니에요.','athletics'),
 quizQ('r3-pace','1km를 5분에 달리는 일정한 페이스라면 10km 예상 시간은?',['50분','5분','100분'],'1km당 5분 × 10km = 50분이에요. 중간에 쉬지 않고 같은 페이스를 유지한다고 가정한 계산이에요.','math'),
 quizQ('r3-hurdles','400m 허들 경기에서 한 선수가 넘어야 하는 허들의 개수는?',['10개','4개','20개'],'400m 허들은 한 바퀴를 달리며 10개의 허들을 넘어요. 허들 사이 간격은 35m예요.','hurdles')]
 },
 space:{
 1:[
 quizQ('a1-stars','스타라이트 점프에서 기본 점수를 모으는 밝은 수집물은?',['노란 별','유성','어두운 바위'],'밝은 노란 별을 모아 점수를 얻어요. 유성은 피해야 하는 장애물이에요.'),
 quizQ('a1-route','점선으로 연결된 별 3개를 모두 모으면 별 점수 외에 받는 보너스는?',['20점','1점','1000점'],'같은 별자리에 속한 연결별 3개를 모으면 별자리 완성 보너스 20점을 받아요.'),
 quizQ('a1-shield','보호막 아이템이 해주는 일은?',['유성 충돌 한 번을 막는다','유성을 전부 없앤다','시간을 무한대로 늘린다'],'보호막은 한 번의 충돌을 막고 사라져요. 추가 충돌에 대비해 계속 움직여야 해요.'),
 quizQ('a1-pad','발판을 밟고 위로 올라가려면 어떤 움직임이 좋을까요?',['좌우 이동으로 발판 위에 내려앉는다','발판 아래에서 계속 가만히 있는다','유성에 일부러 부딪힌다'],'공중에서 좌우로 이동해 발판 위에 착지해요. 발판은 캐릭터를 다시 튀어 오르게 하고, 첫 착지에는 보너스도 있어요.'),
 quizQ('a1-health','이 미니게임에서 하트가 모두 사라지는 피해 횟수는?',['보호받지 않은 충돌 3회','별 수집 3회','발판 착지 3회'],'별을 모으고 발판에 착지하는 것은 안전해요. 보호막이나 무적이 없는 상태의 유성 충돌로 하트를 3개 잃으면 종료돼요.')],
 2:[
 quizQ('a2-sun','태양계에서 스스로 빛을 내는 항성은?',['태양','달','지구'],'태양은 항성이고 지구 등 여덟 행성이 그 주위를 돌아요. 달과 행성은 태양빛을 반사해 보여요.','sun'),
 quizQ('a2-moon','지구의 자연 위성은?',['달','화성','목성'],'달은 지구 주위를 도는 자연 위성이에요. 화성과 목성은 태양 주위를 도는 행성이에요.','moon'),
 quizQ('a2-reflect','밤하늘에서 달이 밝게 보이는 주된 이유는?',['태양빛을 반사하기 때문','달 표면이 불타기 때문','지구의 가로등을 모으기 때문'],'달은 태양처럼 스스로 빛을 내지 않아요. 달 표면에 닿은 태양빛이 반사돼 우리 눈에 들어와요.','moon'),
 quizQ('a2-jupiter','태양계에서 가장 큰 행성은?',['목성','수성','지구'],'목성은 태양계에서 가장 큰 행성이에요. 태양은 목성보다 크지만 행성이 아니라 항성이에요.','jupiter'),
 quizQ('a2-mars','화성이 붉게 보이는 주된 이유는?',['표면의 철 성분이 산화했기 때문','표면 전체가 용암이기 때문','빨간 구름만 있기 때문'],'화성의 암석과 먼지 속 철 성분이 산화해 붉은빛을 띠어요. 그래서 붉은 행성이라고 불려요.','mars')],
 3:[
 quizQ('a3-phase','달의 모양이 초승달·반달·보름달로 달라 보이는 주된 이유는?',['태양빛을 받은 부분 중 보이는 비율이 달라져서','매일 지구 그림자가 달을 가려서','달 자체의 크기가 매일 변해서'],'달이 지구 주위를 돌면서 태양빛을 받은 반구 중 우리가 보는 부분이 달라져요. 지구 그림자가 달을 가리는 월식과는 달라요.','moon'),
 quizQ('a3-seasons','지구의 계절이 생기는 주된 이유는?',['기울어진 자전축 때문에 햇빛을 받는 조건이 달라져서','여름마다 태양이 갑자기 커져서','지구와 태양의 거리 변화만으로'],'자전축이 기울어진 채 공전하므로 지역별 햇빛의 각도와 낮 길이가 바뀌어요. 그래서 북반구와 남반구의 계절도 반대예요.','seasons'),
 quizQ('a3-light','천문학의 광년은 무엇을 나타내는 단위일까요?',['빛이 1년 동안 가는 거리','별의 나이만 재는 시간','행성의 무게'],'광년은 시간처럼 들리지만 거리 단위예요. 빛이 지구의 1년 동안 이동하는 거리를 뜻해요.','light'),
 quizQ('a3-gravity','달 표면의 중력은 지구 표면과 비교해 대략 어느 정도인가요?',['약 6분의 1','약 6배','완전히 같다'],'달의 표면 중력은 지구의 약 6분의 1이에요. 같은 물체의 질량은 그대로지만 달에서 받는 무게는 더 작아져요.','moon'),
 quizQ('a3-lookback','10광년 떨어진 별의 빛을 지금 본다면 대략 언제 출발한 빛일까요?',['10년 전','10초 전','미래 10년 뒤'],'빛이 오는 데에도 시간이 걸려요. 10광년 떨어진 별을 지금 본다는 것은 대략 10년 전에 출발한 빛을 보는 것이에요.','light')]
 }
};

function quizKey(topic,level){return `${topic}:${level}`;}
function emptyQuizRecord(){return{best:0,rounds:0,claimed:false,mastered:[],recent:[]};}
function cleanQuizRecords(raw,legacy=[]){
 const out={};for(const topic of Object.keys(quizTopics))for(const level of [1,2,3]){
  const key=quizKey(topic,level),r=raw?.[key],host=games[topic].hosts[0],oldReward=level===1&&legacy.includes(host);
  if(!r&&!oldReward)continue;const valid=new Set(quizBank[topic][level].map(q=>q.id));
  const ids=value=>Array.isArray(value)?[...new Set(value.filter(id=>valid.has(id)))]:[];
  out[key]={best:clamp(Math.floor(Number(r?.best)||0),0,3),rounds:clamp(Math.floor(Number(r?.rounds)||0),0,999999),claimed:Boolean(r?.claimed||oldReward),mastered:ids(r?.mastered),recent:ids(r?.recent).slice(0,3)};
 }return out;
}
function quizRecord(topic,level){return state.quizRecords[quizKey(topic,level)]||emptyQuizRecord();}
function quizLevelOpen(topic,level){return level===1||state.levels[topic]>=level||quizRecord(topic,level-1).best>=2;}
function quizCleared(topic){return [1,2,3].filter(level=>quizRecord(topic,level).best>=2).length;}
function shuffleQuiz(rows){const a=[...rows];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function quizSourceHtml(q){const source=quizSources[q.source];return source.url?`<a class="quiz-source" href="${source.url}" target="_blank" rel="noopener noreferrer">출처 · ${source.name} ↗</a>`:`<span class="quiz-source">${source.name}</span>`;}
function openQuiz(id){
 if(runtime.mode!=='world')return;const station=npcStation(id);if(!station)return;runtime.quiz=null;
 if(station.gameId&&quizTopics[station.gameId])openQuizTopic(station.gameId,id);else openQuizNotebook(id);
}
function openQuizNotebook(returnNpc=null){
 runtime.quiz=null;const clear=Object.keys(quizTopics).reduce((n,id)=>n+quizCleared(id),0);
 showModal('작은 지식 수첩',`<div class="quiz-intro"><span class="quiz-eyebrow">LEARN & PLAY</span><h3>규칙을 알고, 세상을 넓혀요</h3><p>게임 규칙 → 기초 상식 → 도전 지식<br>관심 있는 주제를 골라 가볍게 풀어보세요.</p></div><div class="quiz-facts"><span>한 번에 3문제</span><span>2정답이면 통과</span><span>CP 소모 없음</span></div><div class="quiz-topics">${Object.entries(quizTopics).map(([id,t])=>`<button class="quiz-topic" data-quiz-topic="${id}"><span class="quiz-topic-icon" style="--quiz-color:${t.color}">${t.icon}</span><div><b>${t.name}</b><small>${t.intro}</small><em>단계 통과 ${quizCleared(id)} / 3</em></div><span aria-hidden="true">›</span></button>`).join('')}</div><p class="quiz-note">전체 ${clear} / 12단계 통과 · 스테이션을 업그레이드해도 해당 단계가 열려요.</p><div class="dialog-actions"><button id="plazaBonusQuiz" class="soft-btn">광장 보너스 ${state.quizDone.includes('atti')?'· 복습':'· 첫 정답 +20 🍌'}</button><button id="quizReturnNpc" class="soft-btn">${returnNpc&&npcStation(returnNpc)?'담당 친구에게':'광장 수첩으로'}</button></div>`,'quiz');
 $('modalBody').querySelectorAll('[data-quiz-topic]').forEach(b=>b.onclick=()=>openQuizTopic(b.dataset.quizTopic,returnNpc));
 $('plazaBonusQuiz').onclick=()=>openPlazaQuiz(returnNpc);$('quizReturnNpc').onclick=()=>returnFromQuiz(returnNpc);
}
function openQuizTopic(topic,returnNpc=games[topic]?.hosts[0]){
 if(!quizTopics[topic]||runtime.mode!=='world')return;runtime.quiz=null;const t=quizTopics[topic];
 showModal(`${t.icon} ${t.name} · 단계별 퀴즈`,`<div class="quiz-intro"><span class="quiz-eyebrow">THREE SMALL STEPS</span><h3>${t.intro}</h3><p>천천히 생각해도 괜찮아요. 답을 고르면 바로 해설을 볼 수 있어요.</p></div><div class="quiz-facts"><span>3문제 · 시간 제한 없음</span><span>2정답이면 통과</span><span>CP 소모 없음</span></div><div class="quiz-levels">${[1,2,3].map(level=>{const r=quizRecord(topic,level),open=quizLevelOpen(topic,level),passed=r.best>=2;return `<article class="quiz-level ${open?'':'locked'}"><span class="quiz-step">${passed?'✓':level}</span><div class="quiz-level-copy"><b>Lv.${level} · ${quizLevelNames[level-1]}</b><p>${level===1?games[topic].name+'의 조작과 득점':level===2?t.name+'의 기본 개념을 배워요':({soccer:'오프사이드·백패스 판정을 익혀요',racket:'서브·타이브레이크를 이해해요',racing:'트랙 판정과 페이스를 계산해요',space:'달의 위상·계절·광년을 이해해요'})[topic]}</p><small>${open?`최고 ${r.best}/3 · 익힌 문제 ${r.mastered.length}/5`:`Lv.${level-1} 퀴즈 통과 또는 스테이션 Lv.${level}`}</small><em>${r.claimed?'첫 보상 수령 완료 · 복습 가능':`첫 통과 +${[20,30,40][level-1]} 🍌 · 친밀도 +1`}</em></div><button class="soft-btn ${open?'primary':''}" data-quiz-level="${level}" ${open?'':'disabled'}>${open?passed?'다시 풀기':'도전하기':'잠김'}</button></article>`;}).join('')}</div><p class="quiz-note">단계별 5문항 중 3문제를 골라 출제해요. 아직 익히지 않은 문제와 최근에 보지 않은 문제를 먼저 만나요.</p><div class="dialog-actions"><button class="soft-btn" id="quizAllTopics">전체 주제</button><button class="soft-btn" id="quizReturnNpc">친구에게 돌아가기</button></div>`,'quiz');
 $('modalBody').querySelectorAll('[data-quiz-level]').forEach(b=>b.onclick=()=>startQuizRound(topic,Number(b.dataset.quizLevel),returnNpc));
 $('quizAllTopics').onclick=()=>openQuizNotebook(returnNpc);$('quizReturnNpc').onclick=()=>returnFromQuiz(returnNpc);
}
function startQuizRound(topic,level,returnNpc=games[topic]?.hosts[0],reviewIds=null){
 if(runtime.mode!=='world'||!quizTopics[topic]||![1,2,3].includes(level)||!quizLevelOpen(topic,level))return false;
 const record=quizRecord(topic,level),bank=quizBank[topic][level];
 let chosen;
 if(reviewIds)chosen=bank.filter(q=>reviewIds.includes(q.id));
 else chosen=shuffleQuiz(bank).sort((a,b)=>((record.mastered.includes(a.id)?1:0)+(record.recent.includes(a.id)?2:0))-((record.mastered.includes(b.id)?1:0)+(record.recent.includes(b.id)?2:0))).slice(0,3);
 if(!chosen.length)return false;
 runtime.quiz={topic,level,returnNpc,practice:Boolean(reviewIds),questions:chosen.map(q=>({...q,choices:shuffleQuiz(q.options.map((label,index)=>({label,index})))})),index:0,picks:[],answered:false,finished:false};
 renderQuizQuestion();return true;
}
function renderQuizQuestion(){
 const session=runtime.quiz;if(!session||session.finished)return;const t=quizTopics[session.topic],q=session.questions[session.index];session.answered=false;
 showModal(`${t.icon} ${t.name} · Lv.${session.level}`,`<div class="quiz-run-meta"><span>${session.practice?'놓친 문제 복습':quizLevelNames[session.level-1]}</span><b>${session.index+1} / ${session.questions.length}</b></div><div class="quiz-run-dots" aria-label="문제 진행">${session.questions.map((_,i)=>`<i class="${i<session.index?session.picks[i].correct?'right':'wrong':i===session.index?'current':''}"></i>`).join('')}</div><h3 class="quiz-question" id="quizQuestion" tabindex="-1">${q.q}</h3><div class="quiz-answers" role="group" aria-labelledby="quizQuestion">${q.choices.map((c,i)=>`<button class="quiz-answer" data-quiz-answer="${i}"><span>${i+1}</span><b>${c.label}</b><em aria-hidden="true"></em></button>`).join('')}</div><div id="quizFeedback" class="quiz-feedback hidden" role="status" aria-live="polite"></div><div class="quiz-round-footer"><span>버튼 또는 숫자 1 · 2 · 3</span><button id="quizNext" class="soft-btn primary" disabled>${session.index===session.questions.length-1?'결과 보기':'다음 문제'}</button></div><button class="quiz-text-button" id="quizLeaveRound">단계 목록으로</button>`,'quiz-round');
 $('modalBody').querySelectorAll('[data-quiz-answer]').forEach(b=>b.onclick=()=>answerQuiz(Number(b.dataset.quizAnswer)));
 $('quizNext').onclick=()=>{if(runtime.quiz!==session||!session.answered||session.finished)return;if(session.index<session.questions.length-1){session.index++;renderQuizQuestion();}else finishQuizRound(session);};
 $('quizLeaveRound').onclick=()=>openQuizTopic(session.topic,session.returnNpc);$('quizQuestion').focus();
}
function answerQuiz(choiceIndex){
 const session=runtime.quiz;if(!session||session.finished||session.answered||runtime.modal!=='quiz-round')return false;
 const q=session.questions[session.index],choice=q.choices[choiceIndex];if(!choice)return false;
 session.answered=true;const correct=choice.index===q.answer;session.picks.push({id:q.id,choice:choice.index,correct});
 $('modalBody').querySelectorAll('[data-quiz-answer]').forEach(b=>{const c=q.choices[Number(b.dataset.quizAnswer)],right=c.index===q.answer;b.disabled=true;b.classList.toggle('is-correct',right);b.classList.toggle('is-wrong',Number(b.dataset.quizAnswer)===choiceIndex&&!correct);b.querySelector('em').textContent=right?'✓':Number(b.dataset.quizAnswer)===choiceIndex?'×':'';});
 const box=$('quizFeedback');box.classList.remove('hidden');box.classList.toggle('missed',!correct);box.innerHTML=`<b>${correct?'정답이에요!':'이번에 기억해 두면 돼요'}</b>${correct?'':`<strong>정답 · ${q.options[q.answer]}</strong>`}<p>${q.explain}</p>${quizSourceHtml(q)}`;
 $('quizNext').disabled=false;sound(correct?'collect':'talk');$('quizNext').focus();return true;
}
function finishQuizRound(session=runtime.quiz){
 if(!session||runtime.quiz!==session||session.finished||session.picks.length!==session.questions.length)return false;
 session.finished=true;const score=session.picks.filter(p=>p.correct).length,key=quizKey(session.topic,session.level),record=quizRecord(session.topic,session.level),passed=!session.practice&&score>=2;
 record.mastered=[...new Set([...record.mastered,...session.picks.filter(p=>p.correct).map(p=>p.id)])];let reward=0;
 if(!session.practice){record.best=Math.max(record.best,score);record.rounds++;record.recent=session.questions.map(q=>q.id);if(passed&&!record.claimed){reward=[20,30,40][session.level-1];record.claimed=true;state.coins+=reward;state.friendship[games[session.topic].hosts[0]]++;}}
 state.quizRecords[key]=record;dirty();save();sound(passed?'win':'talk');
 const missed=session.picks.filter(p=>!p.correct).map(p=>p.id),nextLevel=session.level+1;
 showModal(session.practice?'복습을 마쳤어요':passed?'새 지식 한 걸음!':'조금씩 익혀가요',`<div class="quiz-result-top"><span>${quizTopics[session.topic].icon}</span><h3>${score} / ${session.questions.length} 정답</h3><p>${session.practice?'복습은 보상과 단계 기록에 영향을 주지 않아요.':passed?`Lv.${session.level} · ${quizLevelNames[session.level-1]} 통과!`:'3문제 중 2문제를 맞히면 통과해요. 해설을 보고 다시 도전해 보세요.'}</p></div>${reward?`<div class="quiz-reward">첫 통과 보상 +${reward} 🍌 · 친밀도 +1</div>`:passed?'<p class="quiz-note">첫 통과 보상은 이미 받았어요. 새로 맞힌 문제는 수첩에 남아요.</p>':''}<div class="quiz-review">${session.questions.map((q,i)=>`<details ${!session.picks[i].correct?'open':''}><summary><span class="${session.picks[i].correct?'right':'wrong'}">${session.picks[i].correct?'✓':'↺'}</span>${q.q}</summary><div><b>정답 · ${q.options[q.answer]}</b><p>${q.explain}</p>${quizSourceHtml(q)}</div></details>`).join('')}</div><div class="dialog-actions">${missed.length?'<button class="soft-btn gold" id="quizReviewMissed">놓친 문제 복습</button>':''}${passed&&nextLevel<=3?`<button class="soft-btn primary" id="quizNextLevel">Lv.${nextLevel} 도전</button>`:''}<button class="soft-btn" id="quizLevelsBack">단계 목록</button></div>`,'quiz-result');
 if($('quizReviewMissed'))$('quizReviewMissed').onclick=()=>startQuizRound(session.topic,session.level,session.returnNpc,missed);
 if($('quizNextLevel'))$('quizNextLevel').onclick=()=>startQuizRound(session.topic,nextLevel,session.returnNpc);
 $('quizLevelsBack').onclick=()=>openQuizTopic(session.topic,session.returnNpc);return true;
}
function openPlazaQuiz(returnNpc=null){
 runtime.quiz=null;let answered=false;const options=['10초','30초','60초'];
 showModal('광장 보너스 퀴즈',`<h3 class="quiz-question">나무를 한 번 수확한 뒤 다시 수확하기까지 기본 대기 시간은?</h3><div class="quiz-answers">${options.map((o,i)=>`<button class="quiz-answer" data-plaza-answer="${i}"><span>${i+1}</span><b>${o}</b><em></em></button>`).join('')}</div><div id="plazaQuizFeedback" class="quiz-feedback hidden" role="status"></div><p class="quiz-note">${state.quizDone.includes('atti')?'첫 보상 수령 완료 · 복습 가능':'첫 정답 +20 🍌'}</p><button class="soft-btn wide" id="plazaQuizBack">수첩으로 돌아가기</button>`,'quiz');
 $('modalBody').querySelectorAll('[data-plaza-answer]').forEach(b=>b.onclick=()=>{if(answered||runtime.modal!=='quiz')return;answered=true;const correct=Number(b.dataset.plazaAnswer)===1,first=correct&&!state.quizDone.includes('atti');if(first){state.quizDone.push('atti');state.coins+=20;dirty();save();}for(const btn of $('modalBody').querySelectorAll('[data-plaza-answer]')){btn.disabled=true;btn.classList.toggle('is-correct',Number(btn.dataset.plazaAnswer)===1);}const box=$('plazaQuizFeedback');box.classList.remove('hidden');box.innerHTML=`<b>${correct?'정답이에요!':'정답은 30초예요'}</b><p>나무는 수확 후 기본 30초를 쉬어요. 산들비 날씨에는 회복이 빨라질 수 있어요.</p>${first?'<strong>+20 🍌</strong>':''}`;sound(correct?'collect':'talk');});
 $('plazaQuizBack').onclick=()=>openQuizNotebook(returnNpc);
}
window.addEventListener('keydown',e=>{if(e.repeat||e.ctrlKey||e.metaKey||e.altKey||runtime.modal!=='quiz-round'||!['Digit1','Digit2','Digit3','Numpad1','Numpad2','Numpad3'].includes(e.code))return;e.preventDefault();answerQuiz(Number(e.code.slice(-1))-1);});




const coveIds=['cycling','baseball','freekick','archery'];
const expansionIds=['archery','ski','figure','taekwondo'];
function isExpansionGame(id){return expansionIds.includes(id);}
function islandGameIds(island){return Object.keys(games).filter(id=>islandOf(games[id])===island);}
function islandOf(o){return islands[o?.island]?o.island:'banana';}
function activeGameEntries(){return Object.entries(games).filter(([,g])=>islandOf(g)===state.island);}
function activeGames(){return activeGameEntries().map(([,g])=>g);}
function activeTrees(){return trees.filter(t=>islandOf(t)===state.island);}
function activeResources(){return resources.filter(t=>islandOf(t)===state.island);}
function activeDecors(){return state.decors.filter(t=>islandOf(t)===state.island);}
function activeNpcs(){return worldNpcs.filter(n=>islandOf(npcStation(n.id))===state.island);}
function activeRegions(){return regions.filter(t=>islandOf(t)===state.island);}
function isCoveGame(id){return coveIds.includes(id);}
function championOpen(id){const ids=islandGameIds(islandOf(games[id]));return state.levels[id]===3||ids.every(key=>state.stamps.includes(key));}
function scoreUnit(id){return games[id].unit||'점';}
function coveStampCount(){return coveIds.filter(id=>state.stamps.includes(id)).length;}
function switchIsland(id,destination=null){
 if(runtime.mode!=='world'||!islands[id])return false;
 endDecor();closeModal();clearInput();runtime.path=[];runtime.hover=null;runtime.particles=[];runtime.floaters=[];runtime.quiz=null;runtime.stationReveal=null;
 state.island=id;state.player={...(destination||islands[id].arrival)};
 const home=id==='snow'?'snowharbor':id==='cove'?'harbor':'plaza';if(!state.discovered.includes(home))state.discovered.push(home);
 buildGround();if(blocked(state.player.x,state.player.y))state.player={...islands[id].arrival};runtime.camera={...state.player};runtime.lastUi=0;
 $('location').textContent=islands[id].icon+' '+islands[id].name;
 renderHud();renderSidebar();save();sound('talk');toast(`${islands[id].name}에 도착했어요. ⛴ 섬 여행으로 언제든 돌아갈 수 있어요.`);return true;
}
function openFerry(){
 if(runtime.mode!=='world')return;
 showModal('⛴ 세 섬을 잇는 작은 항로',`<p class="intro">배는 언제든 탈 수 있어요. 왕복 무료 · 코인과 CP, 동료와 기록은 세 섬에서 함께 사용해요.</p><div class="island-voyages">${Object.entries(islands).map(([id,island])=>`<article class="island-voyage ${state.island===id?'current':''}"><div class="island-postcard ${id}"><span>${island.icon}</span><b>${island.name}</b><small>${id==='snow'?'SNOW PEAK':id==='cove'?'CHAMPION COVE':'BANANA ISLAND'}</small></div><p>${island.tag}</p><div class="island-sports">${Object.entries(games).filter(([,g])=>islandOf(g)===id).map(([key,g])=>`<span title="${g.name}">${g.icon} ${state.stamps.includes(key)?'✓':''}</span>`).join('')}</div><button class="soft-btn primary wide" data-sail="${id}" ${id===state.island?'disabled':''}>${id===state.island?'지금 머무는 섬':'배 타고 이동 · 무료'}</button></article>`).join('')}</div>`,'ferry');
 $('modalBody').querySelectorAll('[data-sail]').forEach(b=>b.onclick=()=>switchIsland(b.dataset.sail));
}
function covePassport(){return islandPassport('cove');}
function drawFerry(c,now){
 const port=islands[state.island].port,x=port.x,y=port.y+72,bob=arcadeMotion.matches?0:Math.sin(now*1.8)*2;
 rr(c,x-39,port.y-20,78,136,6,'#bd9973');for(let yy=port.y-12;yy<port.y+110;yy+=13)line(c,[[x-35,yy],[x+35,yy]],'#8b79594d',2);
 for(const dx of [-37,37])line(c,[[x+dx,port.y-18],[x+dx,port.y+108]],'#e0c19a',5);
 c.save();c.translate(x,y+bob);ellipse(c,9,13,74,20,'#37575e25');c.beginPath();c.moveTo(-70,-3);c.lineTo(70,-3);c.quadraticCurveTo(46,35,-47,26);c.closePath();c.fillStyle='#f7eed7';c.fill();line(c,[[-62,7],[57,7]],'#d69e79',5);rr(c,-35,-36,69,33,9,'#e7d29f');rr(c,-30,-45,60,14,5,'#607f83');for(const xx of [-22,0,22])rr(c,xx-7,-30,14,14,4,'#739eaa');ellipse(c,-46,0,8,8,'#dfaa6d');ellipse(c,-46,0,4,4,'#f6ecd3');c.restore();
 rr(c,x-63,port.y-62,126,29,9,'#fff8df');text(c,'⛴ 다른 섬으로',x,port.y-47,12,'#5a7664','center',800);
}
function buildCoveGround(){
 const c=gc;c.fillStyle='#70b6bb';c.fillRect(0,0,W,H);for(let i=0;i<120;i++){const x=seed(i+70)*W,y=seed(i+190)*H;line(c,[[x,y],[x+22,y]],'#d1ede343',2);}
 rr(c,99,109,W-198,H-170,135,'#b9ddd0');rr(c,119,126,W-238,H-200,125,'#ead2ac');rr(c,155,156,W-310,H-245,100,'#a7c4a0');rr(c,167,165,W-334,H-270,95,'#b7ccab');
 for(let i=0;i<650;i++){const x=195+seed(i+800)*1530,y=190+seed(i+2100)*940;line(c,[[x,y],[x+3,y-4],[x+6,y]],'#769b7138',1);}
 for(const road of [[[530,490],[530,650],[1400,650],[1400,545]],[[960,490],[960,650],[960,1060],[400,1060],[400,1095]],[[530,650],[530,1060]]]){line(c,road,'#95ae8b',61);line(c,road,'#e4c6a0',51);line(c,road,'#efd9b6',40);}
 ellipse(c,960,650,111,66,'#92ad92');ellipse(c,960,650,99,58,'#e8d9be');ellipse(c,960,650,79,43,'#f5e9ce');rr(c,935,599,50,53,8,'#6e9190');text(c,'🏆',960,603,54);text(c,'CHAMPION COVE',960,680,15,'#57796b','center',800);
 for(const [i,id]of coveIds.entries()){ellipse(c,847.5+i*75,716,28,20,state.stamps.includes(id)?'#ecd086':'#94ae94');text(c,games[id].icon,847.5+i*75,714,23);}
 for(const [id,g]of activeGameEntries())drawStadium(c,id,g);
 for(const p of [{x:300,y:920},{x:1620,y:810},{x:1180,y:690}]){ellipse(c,p.x,p.y,38,18,'#8db18b');drawFlower(c,p.x,p.y-8,'#e8ae93',1.6);drawFlower(c,p.x+19,p.y-3,'#f2dfb4',1.2);}
}
function drawCoveStation(c,id,g,level){
 const{x,y,w,h}=g.building,l=clamp(level,1,3),gold=l===3;c.save();rr(c,x+8,y+13,w,h,20,'#3c665226');rr(c,x-6,y-6,w+12,h+12,21,gold?'#c4a55d':'#7d9e94');rr(c,x,y,w,h,17,'#e8dfc5');
 if(id==='cycling'){
  const cx=x+w/2,cy=y+h/2;ellipse(c,cx,cy,w*.45,h*.43,'#b77f68');ellipse(c,cx,cy,w*.36,h*.31,l===1?'#8eaf7f':l===2?'#76a5a0':'#568a98');for(const z of [.39,.43]){c.strokeStyle='#f7e8d1';c.lineWidth=2;c.beginPath();c.ellipse(cx,cy,w*z,h*(z-.05),0,0,Math.PI*2);c.stroke();}line(c,[[cx,y+h*.08],[cx,y+h*.24]],'#f8edda',5);text(c,'🚲',cx,cy,40);
 }else if(id==='baseball'){
  rr(c,x+15,y+15,w-30,h-30,12,l===3?'#47847b':'#79a477');const bx=x+w*.5,by=y+h*.84;c.fillStyle='#d9b48a';c.beginPath();c.moveTo(bx,by);c.arc(bx,by,w*.37,Math.PI*1.22,Math.PI*1.78);c.closePath();c.fill();line(c,[[x+w*.19,y+h*.29],[bx,by],[x+w*.81,y+h*.29]],'#fff1d7',2);const bases=[[bx,by],[bx-w*.16,by-h*.22],[bx,by-h*.44],[bx+w*.16,by-h*.22]];line(c,[...bases,bases[0]],'#f4e5c8',2);for(const [xx,yy]of bases)rr(c,xx-4,yy-4,8,8,1,'#fff4de');ellipse(c,bx,by-h*.23,8,5,'#ebd3ad');
 }else{
  rr(c,x+14,y+15,w-28,h-30,9,l===3?'#568e85':'#81a47c');for(let i=0;i<7;i++)rr(c,x+16+i*(w-32)/7,y+17,(w-32)/14,h-34,0,'#c7d9ac22');c.strokeStyle='#f6edcf';c.lineWidth=2;c.strokeRect(x+w*.2,y+22,w*.6,h*.27);c.strokeRect(x+w*.31,y+8,w*.38,h*.14);for(const dx of [.38,.62]){c.strokeStyle=gold?'#f5d477':'#f5e5ae';c.beginPath();c.arc(x+w*dx,y+39,12,0,Math.PI*2);c.stroke();}text(c,'⚽',x+w*.5,y+h*.72,26);
 }
 if(l>=2){stadiumSeats(c,x+18,y-5,w-36,2,gold?'#cbb671':'#91b9af');stadiumLight(c,x+3,y+18,l);stadiumLight(c,x+w-3,y+18,l);stadiumBoard(c,x+w/2,y-33,gold?'COVE FINAL':'SPORTS CLUB',l);}
 if(gold){stadiumFlag(c,x+10,y-3,'#e3c67a');stadiumFlag(c,x+w-26,y-3,'#e3c67a');text(c,'✦',x+w-19,y+h-16,22,'#f5d888');}
 rr(c,x+w/2-110,y+h+8,220,36,10,gold?'#f6e9bb':'#fff7de','#c6c6a5');text(c,g.icon+' '+g.name,x+w/2,y+h+20,12,'#4b6d5d','center',800);text(c,`Lv.${l} · ${tierNames[l-1]}`,x+w/2,y+h+34,8,'#8b947d');c.restore();
}

function freeTargetRadius(a){return [.083,.072,.064][a.level-1]*(a.champ?.86:1);}
function freeTargetAt(a,t){return{x:.5+Math.sin(t*(a.level===3?1.3:.8)*(a.champ?1.18:1))*.20,y:.20+Math.cos(t*.7*(a.champ?1.18:1))*.065};}
function initCoveArcade(a){
 a.focus=0;Object.assign(a.stats,{pedals:0,overtakes:0,homeRuns:0,baseHits:0,swings:0,outs:0,fouls:0,targetHits:0,bullseyes:0});
 if(a.id==='cycling'){const others=roster.filter(n=>n.id!==a.char);a.cycle={distance:0,stamina:100,speed:18,draft:false,road:.5,cadence:0,pedalQ:1,lastPedal:-9,crank:0,hill:0,finish:a.target,finished:false,rivals:[{distance:18,speed:18.8,lane:.35,color:'#e8b288',char:others[0]?.id,crank:0},{distance:36,speed:19.5,lane:.65,color:'#91bfca',char:others[1]?.id,crank:.5}]};}
 if(a.id==='baseball')a.baseball={pitch:null,next:.8,strikes:0,outs:0,aim:.5,flight:null,bat:0,targetLane:1,pitchCount:0};
 if(a.id==='freekick'){a.free={target:{x:.5,y:.18},hitCount:0,wallX:.5};a.x=.5;}
}
function cycleBoost(a){if(a.phase!=='playing'||a.cycle.stamina<25||a.boostCd>0)return false;a.cycle.stamina-=25;a.boost=2;a.boostCd=4.5;a.stats.boosts++;arcadeNotice('SPRINT!','#c2eee5');sound('hit');return true;}
function coveAction(a,special=false,power=0){
 if(special){if(a.level<2||a.skillCd>0)return;a.skillCd=6;a.skillDuration=6;a.focus=3;if(a.id==='cycling'){a.boost=2.5;a.invulnerable=Math.max(a.invulnerable,1.2);}arcadeNotice({cycling:'스프린트! · 잠깐 충돌 보호',baseball:'집중 타격 · 타이밍 범위 확대',freekick:'정밀 조준 · 표적 잠시 정지'}[a.id],'#c7e8e7');sound('build');return;}
 if(a.shotCd>0)return;
 if(a.id==='cycling'){const c=a.cycle,gap=a.elapsed-c.lastPedal,q=gap<.28?.45:gap<=.62?1:gap<=1.1?.75:.6,cost=(q===1?2.4:q===.45?4.5:3)*(c.hill>.3?1.35:1);if(c.stamina<cost)return;c.lastPedal=a.elapsed;c.cadence=q;c.pedalQ=q;a.shotCd=.12;c.stamina-=cost;c.pedal=.42;c.crank+=.5;a.stats.pedals++;return;}
 if(a.id==='baseball'){
  const b=a.baseball,p=b.pitch;a.shotCd=.3;b.bat=.28;a.stats.swings++;
  if(!p||p.wait>0){a.stats.swings--;arcadeNotice('투구를 기다렸다가 스윙해요','#e4dfbd');return;}
  const error=Math.abs(p.progress-1),extra=a.focus>0?.055:0;
  const signed=p.progress-1;
  if(error<.075+extra){baseballHit(a,true,signed);}
  else if(error<.18+extra){baseballHit(a,false,signed);}
  else if(error<.26+extra){a.score+=4;a.stats.fouls++;b.strikes=Math.min(2,b.strikes+1);b.pitch=null;b.next=1;b.flight={t:0,angle:(signed<0?-1:1)*(1.22+Math.random()*.15),kind:'foul',dist:Math.round(40+Math.random()*25),dur:.95};arcadeNotice('FOUL · 타이밍을 조금 더 맞춰요','#e8d5ad');}
  else{b.pitch=null;b.next=.65;baseballStrike(a,'헛스윙 · 밝은 구간을 노려요');}
  return;
 }
 a.shotCd=.55;a.charging=false;a.charge=0;a.chargeSource=null;a.stats.shots++;
 a.shots.push({sx:.5,sy:.85,tx:a.x,ty:.33-clamp(power,0,1)*.24,power,progress:0,checked:false});sound('hit');
}
function baseballStrike(a,message){
 const b=a.baseball;b.strikes++;a.stats.misses++;a.combo=0;sound('miss');
 if(b.strikes>=3){b.strikes=0;b.outs++;a.stats.outs=b.outs;arcadeNotice(`OUT · ${b.outs}/3 아웃`,'#e9c1ab');if(b.outs===3){finishArcade('outs');return;}}
 else arcadeNotice(`${message} · 스트라이크 ${b.strikes}/3`,'#e9c1ab');
}
function baseballFlightPos(f,t,w,h){
 const e=Math.min(1,t),phi=f.angle*.72,hr=f.kind==='hr',R=hr?h*(.8+(f.dist-105)/30*.18):f.dist/130*h*.85,prog=f.kind==='grounder'?1-Math.pow(1-e,1.7):e;
 const z=f.kind==='grounder'?Math.abs(Math.sin(e*Math.PI*3))*h*.05*(1-e):Math.sin(e*Math.PI)*h*({hr:.34,liner:.09,popup:.44,foul:.2}[f.kind]||.1);
 return{gx:w*.5+Math.sin(phi)*R*1.15*prog,gy:h*.83-Math.cos(phi)*R*prog,z};
}
function baseballHit(a,homeRun,signed=0){
 const b=a.baseball,aimDir=(b.aim-.5)/.3,angle=clamp(aimDir*.65+signed*4,-1,1),lane=angle<-.33?0:angle>.33?2:1,bonus=lane===b.targetLane?10:0;
 const kind=homeRun?'hr':Math.abs(signed)<.12?'liner':signed<0?'grounder':'popup';
 const dist=Math.round({hr:105+Math.random()*30,liner:62+Math.random()*25,grounder:32+Math.random()*15,popup:45+Math.random()*15}[kind]),dur={hr:1.5,liner:.8,grounder:1.05,popup:1.3}[kind];
 const pts=(homeRun?55+Math.round((dist-105)/3):25)+bonus+(a.level===3?Math.min(15,a.combo*3):0);a.score+=pts;a.combo++;a.maxCombo=Math.max(a.maxCombo,a.combo);a.stats.baseHits++;if(homeRun)a.stats.homeRuns++;b.strikes=0;b.pitch=null;b.next=Math.max(.8,dur+.2);b.flight={t:0,lane,angle,kind,dist,dur,homeRun,landed:false};
 arcadeNotice(`${{hr:'홈런!',liner:'라인드라이브 안타',grounder:'땅볼 안타',popup:'뜬공 안타'}[kind]} · ${dist}m${bonus?' · 코스 보너스':''}`,homeRun?'#f6e3a8':'#c7e8e7');
 arcFloat(.5,.77,`${homeRun?'HOME RUN':'HIT'} +${pts}`);burstArc(.5,.8,homeRun?'#ffe18a':'#c2e9da',homeRun?18:10);sound(homeRun?'win':'hit');
}
function updateCoveArcade(a,dt,spdMult,dx){
 if(a.id==='cycling'){
  const c=a.cycle;c.road=.5+(a.level>=2?Math.sin(a.elapsed*.5)*.09:0);c.pedal=Math.max(0,(c.pedal||0)-dt);
  const seg=a.elapsed%9,grade=(seg>=5&&seg<7.5?1:seg>=7.5?-1:0)*(a.level===1?.6:1);c.hill+=(grade-c.hill)*Math.min(1,dt*2);if(a.elapsed-c.lastPedal>1.3)c.cadence=0;
  for(const r of c.rivals)r.crank+=dt*2.6;
  if(!c.finished&&c.distance>=c.finish){c.finished=true;const rank=1+c.rivals.filter(r=>r.distance>c.distance).length;arcadeNotice(`결승선 통과! ${rank}위`,'#f6e3a8');burstArc(a.x,.7,'#f6e3a8',16);sound('win');}
  for(const r of c.rivals){r.distance+=r.speed*dt*(a.champ?1.08:1);if(!r.passed&&c.distance>r.distance){r.passed=true;a.stats.overtakes++;arcFloat(a.x,.72,'추월!','#c2eee5');}}
  c.draft=c.rivals.some(r=>r.distance>c.distance&&r.distance-c.distance<18&&Math.abs(a.x-(c.road+r.lane-.5))<.10);
  c.stamina=clamp(c.stamina+dt*(c.draft?13:5)*(c.hill>.3?.5:1),0,100);
  const offroad=Math.abs(a.x-c.road)>.34,wind=a.level===3&&a.elapsed>17?1.3:0;
  c.speed=(18+(c.pedal>0?6*c.pedalQ:0)+(a.boost>0?8:0)+(c.draft?2:0)-wind-(c.stamina<10?3:0)-c.hill*3.5)*(offroad?.65:1);c.distance+=c.speed*dt;a.score=c.distance;
  a.spawn-=dt;if(a.spawn<=0){a.waveIndex++;a.spawn=1.45/spdMult;const safe=Math.floor(Math.random()*3),count=a.level===3&&a.elapsed>8?2:1;
   if(a.waveIndex%4===0)a.objects.push({x:c.road+(safe-1)*.22,y:-.08,type:'bottle',vy:.45});
   else for(let i=1;i<=count;i++)a.objects.push({x:c.road+(((safe+i)%3)-1)*.22,y:-.08,type:'cone',vy:.40+(a.level-1)*.025});
  }
  for(let i=a.objects.length-1;i>=0;i--){const e=a.objects[i];e.y+=e.vy*dt*(c.speed/18)*spdMult;
   if(Math.abs(e.y-.80)<.065&&Math.abs(e.x-a.x)<.055){if(e.type==='bottle'){c.stamina=Math.min(100,c.stamina+24);arcFloat(a.x,.75,'체력 +24','#bceee7');sound('collect');}else{damageArcade();if(a.phase!=='playing')return;}a.objects.splice(i,1);}
   else if(e.y>1.1){if(e.type==='cone')a.stats.dodges++;a.objects.splice(i,1);}
  }
 }else if(a.id==='baseball'){
  const b=a.baseball;b.aim=clamp(b.aim+dx*.65*dt,.20,.80);b.bat=Math.max(0,b.bat-dt);b.targetLane=a.level===1?1:Math.floor(a.elapsed/4)%3;
  b.shake=Math.max(0,(b.shake||0)-dt);
  if(b.flight){const f=b.flight;f.t+=dt/(f.dur||1);if(f.t>=1&&!f.landed){f.landed=true;if(f.kind==='hr'){b.shake=.35;const w=arcCanvas.width,h=arcCanvas.height,q=baseballFlightPos(f,1,w,h);for(let i=0;i<3;i++)burstArc(clamp(q.gx/w+(i-1)*.08,.05,.95),clamp(q.gy/h,.06,.5)+i%2*.05,['#f6e3a8','#f2a7a0','#a7d8f0'][i],14);sound('win');}}if(f.t>1.45)b.flight=null;}
  if(!b.pitch){b.next-=dt;if(b.next<=0){b.pitchCount++;b.pitch={progress:0,duration:([1.18,1.02,.88][a.level-1])/(a.champ?1.15:1),curve:a.level>=2&&b.pitchCount%3===0};}}
  else{b.pitch.progress+=dt/b.pitch.duration;if(b.pitch.progress>1.24){b.pitch=null;b.next=.45;baseballStrike(a,'스트라이크 · 타격 기회를 놓쳤어요');}}
 }else{
  const f=a.free;if(a.focus<=0){if(a.level===1){f.target=[{x:.5,y:.18},{x:.32,y:.13},{x:.68,y:.26}][f.hitCount%3];}else f.target=freeTargetAt(a,a.elapsed);}
  f.wallX=.5+Math.sin(a.elapsed*.9)*.17;
  for(let i=a.shots.length-1;i>=0;i--){const b=a.shots[i];b.progress+=dt/.65;
   if(a.level===3&&!b.checked&&b.progress>=.48){b.checked=true;const crossX=b.sx+(b.tx-b.sx)*.5;if(b.power<.55&&Math.abs(crossX-f.wallX)<.09){a.shots.splice(i,1);a.combo=0;arcadeNotice('수비벽! · 높이를 더 올려요','#e9c6af');continue;}}
   if(b.progress>=1){const distance=Math.hypot(b.tx-f.target.x,b.ty-f.target.y),radius=freeTargetRadius(a);
    if(distance<radius){const perfect=distance<radius*.45,gold=a.level===3&&(f.hitCount+1)%3===0,pts=(perfect?50:30)*(gold?2:1)+Math.min(12,a.combo*2);a.score+=pts;a.stats.targetHits++;if(perfect)a.stats.bullseyes++;a.combo++;f.hitCount++;arcFloat(b.tx,b.ty,`${perfect?'BULLSEYE':'TARGET'} +${pts}`);burstArc(b.tx,b.ty,'#ffe18a',18);sound('collect');}
    else if(b.tx>.17&&b.tx<.83&&b.ty>.08&&b.ty<.34){a.score+=6;a.combo=0;arcFloat(b.tx,b.ty,'GOAL +6','#c7e9d9');sound('hit');}
    else{a.combo=0;arcadeNotice('OUT · 조준점과 높이를 확인해요','#e9c6af');}
    a.shots.splice(i,1);
   }
  }
 }
}
function renderCoveHud(a){
 if(!isCoveGame(a.id))return;
 $('runShield').textContent=a.id==='cycling'?`체력 ${Math.round(a.cycle.stamina)}% · ${a.cycle.draft?'바람막기 회복 중':'Space 페달 · 뒤따르면 체력 회복'}`:a.id==='baseball'?`스트라이크 ${a.baseball.strikes}/3 · 아웃 ${a.baseball.outs}/3 · ${a.focus>0?'집중 타격 중':'밝은 타이밍에서 강타'}`:`높이 ${Math.round(a.charge*100)}% · ${a.focus>0?'표적 정지 중':'목표 중심을 맞히면 최대 50점'}`;
 $('arcAux').classList.toggle('hidden',a.id!=='cycling');if(a.id==='cycling'){$('arcAux').textContent=`스프린트 · 체력 25`;$('arcAux').disabled=a.phase!=='playing'||a.cycle.stamina<25||a.boostCd>0;}
}
function coveStatsHtml(a){
 const s=a.stats,rows=a.id==='cycling'?[['주행 거리',`${Math.floor(a.cycle.distance)}m`],['최종 순위',`${1+a.cycle.rivals.filter(r=>r.distance>a.cycle.distance).length} / 3`],['추월 / 스프린트',`${s.overtakes} / ${s.boosts}`],['남은 하트',a.health]]:a.id==='baseball'?[['안타',s.baseHits],['홈런',s.homeRuns],['스윙 / 파울',`${s.swings} / ${s.fouls}`],['아웃',s.outs]]:[['표적 명중',s.targetHits],['정중앙 명중',s.bullseyes],['슛',s.shots],['최대 콤보',a.maxCombo]];
 return '<div class="run-results">'+rows.map(([label,value])=>`<div><small>${label}</small><b>${value}</b></div>`).join('')+'</div>';
}
function renderFreeKickCharge(a){
 $('chargeHud').classList.toggle('hidden',a.phase==='result');const value=a.charging?a.charge:0;$('chargeFill').style.width=value*100+'%';$('chargeCursor').style.left=value*100+'%';$('chargeHud').classList.remove('sweet');$('chargeMeter').setAttribute('aria-valuenow',Math.round(value*100));$('chargeMeter').setAttribute('aria-label','프리킥 높이 · 오래 누를수록 높게');$('chargeLabel').textContent=a.charging?'놓으면 슛! · 오래 누를수록 높게':'Space / 슛 버튼을 눌러 높이 조절';$('chargeHud').querySelector('.charge-label span').textContent='좌우 조준 + 누르는 시간으로 높이 선택';$('chargeHud').querySelector('.sweet-zone').style.display='none';
}
function drawBike(c,x,y,size,color='#88aeb2',player=false){
 c.save();c.translate(x,y);const s=size/60;c.scale(s,s);ellipse(c,2,19,24,8,'#16394530');for(const xx of [-16,16]){c.strokeStyle='#35566a';c.lineWidth=3;c.beginPath();c.ellipse(xx,12,7,14,0,0,Math.PI*2);c.stroke();}line(c,[[-16,12],[0,-2],[16,12],[-16,12]],'#d7d8b5',3);line(c,[[0,-2],[5,-20],[18,-15]],'#567a85',4);rr(c,-13,-30,26,30,9,color);ellipse(c,0,-34,13,14,'#e8cb65');rr(c,-14,-45,28,12,7,player?'#e5bd63':color);line(c,[[-10,-29],[10,-29]],'#6a797b',4);for(const xx of [-5,5]){ellipse(c,xx,-28,5,5,'#a6b8b7');ellipse(c,xx,-28,3.7,3.7,'#fff8da');ellipse(c,xx,-28,1.5,2.3,'#514f3a');}line(c,[[-10,-17],[-19,-9]],'#e8cc70',4);line(c,[[10,-17],[19,-9]],'#e8cc70',4);ellipse(c,-19,-8,4,3,'#486073');ellipse(c,19,-8,4,3,'#486073');c.restore();
}
function drawRider(c,x,y,size,charId,color,crank,player,now){
 const img=charId&&images[charId],s=size/60,leg=Math.sin(crank*Math.PI*2);
 if(!(img?.complete&&img.naturalWidth))return drawBike(c,x,y,size,color,player);
 c.save();c.translate(x,y);
 ellipse(c,0,22*s,20*s,7*s,'#16394530');
 c.strokeStyle='#2f4a5c';c.lineWidth=6*s;c.beginPath();c.ellipse(0,14*s,6.5*s,17*s,0,0,Math.PI*2);c.stroke();
 c.strokeStyle='#e9e4cc';c.lineWidth=1.5*s;const sp=(now*8+crank)%1;c.beginPath();c.moveTo(-4*s,12*s+(sp-.5)*20*s);c.lineTo(4*s,12*s+(sp-.5)*20*s);c.stroke();
 rr(c,-3*s,-6*s,6*s,18*s,2*s,color);
 for(const side of [-1,1]){const up=side*leg;rr(c,side*9*s-3*s,(2+up*4)*s,6*s,4*s,1.5*s,'#3c5566');}
 if(player){c.strokeStyle='#fff5ba';c.lineWidth=2.5;c.beginPath();c.ellipse(0,22*s,24*s,8*s,0,0,Math.PI*2);c.stroke();}
 const sz=size*1.15;c.translate(Math.sin(crank*Math.PI*2)*1.6*s,0);c.rotate(Math.sin(crank*Math.PI*2)*.035);
 c.drawImage(img,-sz/2,-sz*.98+4*s,sz,sz);
 line(c,[[-22*s,-16*s],[-8*s,-12*s],[8*s,-12*s],[22*s,-16*s]],'#c9d2d6',4*s);ellipse(c,-23*s,-16*s,3.5*s,3.5*s,'#2b3a44');ellipse(c,23*s,-16*s,3.5*s,3.5*s,'#2b3a44');
 c.restore();
}
function drawCoveArcade(a,w,h,now){
 if(a.id==='cycling'){
  const c=a.cycle;ac.fillStyle=a.level===3?'#6896a1':'#98bdac';ac.fillRect(0,0,w,h);ac.fillStyle='#86bdc5';ac.fillRect(w*.84,0,w*.16,h);
  ac.beginPath();ac.moveTo((c.road-.36)*w,0);ac.lineTo((c.road+.36)*w,0);ac.lineTo((c.road+.36)*w,h);ac.lineTo((c.road-.36)*w,h);ac.closePath();ac.fillStyle=a.level===3?'#4b6372':'#6d8186';ac.fill();
  for(const side of [-1,1])line(ac,[[(c.road+side*.35)*w,0],[(c.road+side*.35)*w,h]],'#eae4cd',4);
  for(let lane=1;lane<3;lane++)for(let i=0;i<13;i++){const y=((i*65+c.distance*9)%(h+65))-65;line(ac,[[(c.road-.36+lane*.24)*w,y],[(c.road-.36+lane*.24)*w,y+26]],'#c8d3d35a',2);}
  for(let i=0;i<10;i++){const y=((i*83+c.distance*4)%(h+80))-40;ellipse(ac,35,y,24,16,'#7aa587');ellipse(ac,w*.94,y,22,3,'#d3eeec88');}
  if(Math.abs(c.hill)>.15){ac.fillStyle=c.hill>0?`rgba(120,80,60,${c.hill*.12})`:`rgba(120,190,210,${-c.hill*.12})`;ac.fillRect(0,0,w,h);rr(ac,w*.5-70,14,140,30,10,'#203e4fcc');text(ac,c.hill>0?'▲ 오르막 · 체력 아껴요':'▼ 내리막 · 가속!',w*.5,29,13,c.hill>0?'#f2c9a8':'#bfeaf2','center',800);}
  {const gapF=c.finish-c.distance,fy=h*(.80-gapF/100);if(fy>-20&&fy<h+20){for(let i=0;i<12;i++)for(let j=0;j<2;j++)rr(ac,(c.road-.35)*w+i*(w*.7/12),fy+j*10,w*.7/12,10,0,(i+j)%2?'#203e4f':'#f6f1df');text(ac,'FINISH',c.road*w,fy-14,16,'#fff4cf','center',800);}}
  for(const r of c.rivals){const gap=r.distance-c.distance,y=h*(.80-gap/100),x=(c.road+r.lane-.5)*w;if(gap>0&&y<h*1.1){ac.fillStyle=c.draft&&gap<18&&Math.abs(a.x-(c.road+r.lane-.5))<.10?'#bcefe140':'#bcefe11a';ac.beginPath();ac.moveTo(x-w*.03,y+12);ac.lineTo(x+w*.03,y+12);ac.lineTo(x+w*.07,y+h*.18);ac.lineTo(x-w*.07,y+h*.18);ac.closePath();ac.fill();}if(y>-.1*h&&y<h*1.2)drawRider(ac,x,y,50,r.char,r.color,r.crank,false,now);}
  for(const e of a.objects){const x=e.x*w,y=e.y*h;if(e.type==='bottle'){rr(ac,x-10,y-18,20,36,6,'#9ed5d9','#eff7de');rr(ac,x-6,y-24,12,8,2,'#e7d7a1');text(ac,'+',x,y,17,'#e9ffef');}else{ellipse(ac,x,y+13,24,7,'#2d475c40');ac.beginPath();ac.moveTo(x,y-22);ac.lineTo(x+18,y+15);ac.lineTo(x-18,y+15);ac.closePath();ac.fillStyle='#deaa79';ac.fill();line(ac,[[x-9,y-2],[x+9,y-2]],'#fff0d0',5);}}
  if(c.draft)ellipse(ac,a.x*w,h*.78,43,70,'#bcefe124');drawRider(ac,a.x*w,h*.80,76,a.char,roster.find(n=>n.id===a.char).colors.outfit,c.crank+(c.pedal>0?(1-c.pedal/.42)*.5:0),true,now);
  {const q=c.cadence,label=q===1?'적정 박자':q===.45?'너무 빨라요':q===0?'—':'조금 느려요';text(ac,`케이던스 · ${label}`,w-128,84,12,q===1?'#bfeedd':q===.45?'#f2c9a8':'#e8e2c8','center',800);}
  rr(ac,18,16,212,55,12,'#203e4fdc');text(ac,`${Math.floor(c.distance)} m · ${Math.round(c.speed)} m/s`,124,35,17,'#f3eccf','center',800);text(ac,`순위 ${1+c.rivals.filter(r=>r.distance>c.distance).length} / 3`,124,55,11,'#bce9df');rr(ac,w-235,18,215,30,9,'#eff3dbdd');rr(ac,w-225,28,195*c.stamina/100,10,5,c.stamina<20?'#d4a079':'#8aaf8d');text(ac,c.draft?'바람막기 · 체력 회복':'Space로 페달을 밟아요',w-128,66,12,'#f7efda');
 }else if(a.id==='baseball'){
  const b=a.baseball;ac.save();if(b.shake>0)ac.translate((Math.random()-.5)*b.shake*40,(Math.random()-.5)*b.shake*26);ac.fillStyle=a.level===3?'#275c64':'#759d77';ac.fillRect(-30,-30,w+60,h+60);for(let i=0;i<10;i++){ac.fillStyle='#b8d38b12';ac.fillRect(i*w/10,0,w/20,h);}
  ac.fillStyle='#caa279';ac.beginPath();ac.moveTo(w*.5,h*.85);ac.lineTo(w*.12,h*.22);ac.quadraticCurveTo(w*.5,-h*.09,w*.88,h*.22);ac.closePath();ac.fill();
  ac.strokeStyle='#f3ead1';ac.lineWidth=3;ac.beginPath();ac.moveTo(w*.5,h*.85);ac.lineTo(w*.14,h*.23);ac.moveTo(w*.5,h*.85);ac.lineTo(w*.86,h*.23);ac.stroke();
  for(let i=0;i<3;i++){const x=w*(.25+i*.25);ellipse(ac,x,h*.20,70,33,i===b.targetLane?'#f6dc994f':'#344b4e12');text(ac,i===b.targetLane?'+10':'',x,h*.20,15,'#ffebaa','center',800);}
  ellipse(ac,w*.5,h*.34,52,17,'#e1c29b');drawCharacter(ac,roster.find(n=>n.id===games.baseball.hosts[0]),w*.5,h*.32,77,'down',Boolean(b.pitch),now);
  line(ac,[[w*.36,h*.83],[w*.64,h*.83]],'#d6edc470',35);rr(ac,w*.37,h*.80,w*.26,h*.08,10,'#f3ecc834','#f9edb3');text(ac,'HIT ZONE',w*.5,h*.89,10,'#f8ecd1','center',800);
  if(b.pitch){const p=b.pitch,t=p.progress,x=.5+(p.curve?Math.sin(Math.min(1,t)*Math.PI)*.09:0),y=.34+t*.49;line(ac,[[x*w,y*h-24],[x*w,y*h]],'#fff1cb60',4);drawBaseball(x*w,y*h,6+Math.min(1,t)*7);text(ac,p.curve?'커브':a.level===3?'강속구':'직구',w*.5,h*.12,13,'#f5edcc','center',800);}
  drawCharacter(ac,activeChar(),w*.36,h*.94,95,'up',false,now,true);line(ac,[[w*.40,h*.82],[w*(b.bat>0?.60:.44),h*(b.bat>0?.75:.64)]],'#e8c48d',9);
  {const f=b.flight,land=f&&f.kind!=='hr'&&f.kind!=='foul'?baseballFlightPos(f,1,w,h):null;for(const [fx,fy]of [[.27,.36],[.5,.24],[.73,.36]]){let x=fx*w,y=fy*h;if(land){const d=Math.hypot(land.gx-x,land.gy-y);if(d<w*.3){const k=Math.min(1,f.t)*.75;x+=(land.gx-x)*k;y+=(land.gy-y)*k;}}ellipse(ac,x,y+7,10,4,'#23445130');ellipse(ac,x,y,8,8,'#e8cb65');rr(ac,x-8,y-9,16,6,3,'#2f5e6a');}}
  if(b.flight){const f=b.flight;
   if(f.kind==='foul'){ac.save();ac.globalAlpha=.5;text(ac,'FOUL',w*(.5+Math.sign(f.angle)*.33),h*.6,22,'#f6e9c8','center',800);ac.restore();}
   for(let k=4;k>=1;k--){const q=baseballFlightPos(f,Math.max(0,f.t-k*.035),w,h);ac.globalAlpha=.12*(5-k);ellipse(ac,q.gx,q.gy-q.z,5,5,'#fff7df');}ac.globalAlpha=1;
   const q=baseballFlightPos(f,f.t,w,h);ellipse(ac,q.gx,q.gy+2,8,3,'#1e3a3a40');drawBaseball(q.gx,q.gy-q.z,7+q.z/h*16);
   if(f.t>=1&&f.kind!=='foul'){ac.globalAlpha=clamp((1.45-f.t)/.3,0,1);rr(ac,clamp(q.gx,60,w-60)-38,clamp(q.gy-q.z,40,h)-38,76,24,8,f.kind==='hr'?'#f6e3a8':'#fff7dfdd');text(ac,`${f.dist}m`,clamp(q.gx,60,w-60),clamp(q.gy-q.z,40,h)-26,14,'#4b5b3e','center',800);ac.globalAlpha=1;}
  }
  const aim=b.aim<.36?'왼쪽':b.aim>.64?'오른쪽':'중앙';rr(ac,20,16,190,46,11,'#284b43db');text(ac,`아웃 ${b.outs}/3 · S ${b.strikes}/3`,115,33,15,'#f6ebc8','center',800);text(ac,`타구 방향 · ${aim}`,115,51,11,'#c7e5ca');ac.restore();
 }else{
  const f=a.free;drawArenaFloor({...a,id:'soccer'},w,h);rr(ac,w*.17,h*.08,w*.66,h*.26,4,'#e1e8d21a','#f4efcf');for(let i=0;i<17;i++)line(ac,[[w*(.17+i*.04125),h*.08],[w*(.17+i*.04125),h*.34]],'#e9f1db38',1);for(let i=1;i<6;i++)line(ac,[[w*.17,h*(.08+i*.0433)],[w*.83,h*(.08+i*.0433)]],'#e9f1db38',1);
  const r=freeTargetRadius(a),gold=a.level===3&&(f.hitCount+1)%3===0;for(const [radius,color]of [[r,'#f5d77c'],[r*.58,'#e9af79'],[r*.22,'#fff3b5']]){ac.strokeStyle=color;ac.lineWidth=radius===r?5:3;ac.beginPath();ac.ellipse(f.target.x*w,f.target.y*h,radius*w,radius*h,0,0,Math.PI*2);ac.stroke();}if(gold)text(ac,'×2',f.target.x*w,f.target.y*h,14,'#ffeb9e','center',800);
  if(a.level===3){rr(ac,(f.wallX-.09)*w,h*.49,w*.18,30,8,'#6b8890','#d8e3c5');text(ac,'높게 차면 넘어가요',f.wallX*w,h*.59,11,'#e9edcc');}
  const aimY=.33-(a.charging?a.charge:.5)*.24;line(ac,[[a.x*w-12,aimY*h],[a.x*w+12,aimY*h]],'#fff7c7',2);line(ac,[[a.x*w,aimY*h-12],[a.x*w,aimY*h+12]],'#fff7c7',2);ac.save();ac.setLineDash([5,9]);line(ac,[[w*.5,h*.85],[a.x*w,aimY*h]],'#fff0b359',2);ac.restore();
  for(const b of a.shots){const t=clamp(b.progress,0,1),x=b.sx+(b.tx-b.sx)*t,y=b.sy+(b.ty-b.sy)*t-Math.sin(t*Math.PI)*.12;drawFootball(x*w,y*h,13-t*5);}
  drawCharacter(ac,activeChar(),w*.5,h*.93,95,'up',false,now,true);drawFootball(w*.5,h*.85,13);drawCharacter(ac,roster.find(n=>n.id===games.freekick.hosts[0]),w*.12,h*.70,65,'right',false,now);rr(ac,20,15,230,31,10,'#234e43da');text(ac,`표적 ${a.stats.targetHits} · 정중앙 ${a.stats.bullseyes}`,135,31,12,'#f5edc9','center',800);
 }
}
function drawBaseball(x,y,r){ellipse(ac,x+2,y+5,r,r*.4,'#23445130');ellipse(ac,x,y,r,r,'#fff7df');ac.save();ac.strokeStyle='#c38570';ac.lineWidth=1.4;for(const sign of [-1,1]){ac.beginPath();ac.ellipse(x+sign*r*.75,y,r*.42,r*.8,0,-Math.PI/2,Math.PI/2);ac.stroke();}ac.restore();}

// v4.3.1 — one more sport in the cove, three distinct sports on Snow Peak.





function islandPassport(island=state.island){
 if(runtime.mode!=='world'||!islands[island])return;
 if(island==='banana')return openPlaza();
 const ids=islandGameIds(island),count=ids.filter(id=>state.stamps.includes(id)).length,i=islands[island];
 showModal(`${i.icon} ${i.name} · 기록 수첩`,`<div class="plaza-summary ${count===ids.length?'complete':''}"><span>${count===ids.length?'🏆':i.icon}</span><div><b>${i.name}의 ${ids.length}가지 도전</b><p>스탬프 ${count} / ${ids.length} · 모두 클리어하면 이 섬의 챔피언 모드가 열려요. 스테이션 Lv.3에서도 개별 해금돼요.</p></div></div><div class="plaza-exhibits">${ids.map(id=>`<button class="plaza-exhibit ${state.stamps.includes(id)?'earned':''}" data-island-record="${id}"><span>${games[id].icon}</span><b>${games[id].name}</b><small>Lv.${state.levels[id]} · 최고 ${state.best[id]||0}${scoreUnit(id)}</small></button>`).join('')}</div><div class="dialog-actions"><button class="soft-btn" id="islandQuiz">작은 지식 수첩</button><button class="soft-btn" id="islandSail">⛴ 다른 섬으로 여행</button></div>`,'island-passport');
 $('modalBody').querySelectorAll('[data-island-record]').forEach(b=>b.onclick=()=>openPlazaRecord(b.dataset.islandRecord));$('islandSail').onclick=openFerry;$('islandQuiz').onclick=()=>openQuizNotebook();
}
function initExpansionArcade(a){
 Object.assign(a.stats,{bullseyes:0,arrows:0,gatePasses:0,centerGates:0,perfects:0,goods:0,misses:0,blocks:0,counters:0});
 a.braking=false;a.chargeTime=0;
 if(a.id==='archery')a.bow={x:.5,y:.40,target:{x:.5,y:.35},wind:0,flight:null,marks:[],round:0};
 if(a.id==='ski')a.ski={x:.5,vx:0,gates:[],rocks:[],next:.7,index:0,distance:0};
 if(a.id==='figure'){
  const gap0=[.85,.72,.60][a.level-1]/(a.champ?1.15:1);
  a.figure={notes:[],beats:[],beatIdx:0,stages:[],stage:0,stageFlash:0,stageMiss:0,flash:0,judgement:'',judgeLife:0,timing:'',gap:gap0,start:2,lanePulse:[0,0,0],pose:'',poseT:0,hits:[]};
  const F=a.figure,phrases=[['space','left','space','right'],['left','right','left','right'],['space','space','left','right'],['right','left','space','space']];
  for(let k=1;k<=4;k++)F.beats.push({t:2-gap0*2+gap0/2*(k-1),i:k-1});
  let t=2,index=0;
  while(t<24.5){
   const stage=Math.floor(index/8),gap=Math.max(.38,gap0*Math.pow(.92,stage)),bar=Math.floor(index/4),beat=index%4;
   if(index%8===0)F.stages.push({t,gap,n:stage+1});
   F.beats.push({t,i:F.beats.length,gap},{t:t+gap/2,i:F.beats.length+1,gap});
   if(a.level===1&&index<3)F.notes.push({t,type:'space',done:false,stage});
   else if(!(a.level===1&&stage===0&&beat===3&&bar%2===1)){
    const type=phrases[(bar+(a.level>1?bar>>1:0))%phrases.length][beat];
    F.notes.push({t,type,done:false,stage});
    const dbl=(stage+a.level>=3&&beat===1&&bar%2===1)||(stage+a.level>=4&&beat===3)||(stage+a.level>=5&&beat===1);
    if(dbl&&t+gap/2<24.5)F.notes.push({t:t+gap/2,type:type==='left'?'right':'left',done:false,stage});
   }
   t+=gap;index++;
  }
 }
 if(a.id==='taekwondo')initTaekwondo(a);
}
function expansionPoints(a,points,x=.5,y=.4,message=null){a.score+=points;a.combo++;a.maxCombo=Math.max(a.maxCombo,a.combo);arcFloat(x,y,message||`+${points}`);sound('collect');}
function archeryAim(a){
 const b=a.bow,t=a.chargeTime||0,amp=a.focus>0?0:a.charging?(t<.5?.018:t<=1.3?.004:.026+Math.min(.035,(t-1.3)*.025)):.024;
 return{x:b.x+Math.sin(a.elapsed*8.4)*amp,y:b.y+Math.cos(a.elapsed*6.6)*amp,wind:a.focus>0?0:b.wind};
}
function rhythmTick(){
 if(!state.sound)return;try{audio||=new(window.AudioContext||window.webkitAudioContext)();if(audio.state==='suspended')audio.resume();const o=audio.createOscillator(),g=audio.createGain(),t=audio.currentTime;o.frequency.value=520;g.gain.setValueAtTime(.022,t);g.gain.exponentialRampToValueAtTime(.001,t+.035);o.connect(g);g.connect(audio.destination);o.start();o.stop(t+.04);}catch{}
}
function figureAudio(){if(!state.sound)return null;try{audio||=new(window.AudioContext||window.webkitAudioContext)();if(audio.state==='suspended')audio.resume();return audio;}catch{return null;}}
function figureVoice(freq,wave,vol,dur,slide){const au=figureAudio();if(!au)return;try{const o=au.createOscillator(),g=au.createGain(),t=au.currentTime;o.type=wave;o.frequency.setValueAtTime(freq,t);if(slide)o.frequency.exponentialRampToValueAtTime(slide,t+dur);g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.001,t+dur);o.connect(g);g.connect(au.destination);o.start(t);o.stop(t+dur+.02);}catch{}}
function figureBeat(i){
 const root=[261.6,220,174.6,196][Math.floor(i/8)%4];
 if(i%2===0){figureVoice(120,'sine',i%8===0?.1:.065,.13,45);if(i%4===0)figureVoice(root/2,'triangle',.05,.32);}
 else figureVoice(4800,'square',.007,.03);
}
function figureTone(lane,perfect){const f=[523.3,659.3,784][lane];figureVoice(f,'triangle',perfect?.07:.05,.22);if(perfect)figureVoice(f*2,'sine',.025,.15);}
function figureHit(a,type){
 if(a.phase!=='playing'||a.id!=='figure'||a.shotCd>0)return;
 const f=a.figure,lane={left:0,space:1,right:2}[type],extra=a.focus>0?.07:0,win=.25+extra;
 a.shotCd=.1;f.lanePulse[lane]=.18;
 const near=f.notes.filter(n=>!n.done&&Math.abs(n.t-a.elapsed)<=win).sort((x,y)=>Math.abs(x.t-a.elapsed)-Math.abs(y.t-a.elapsed));
 if(!near.length)return;
 const n=near.find(n=>n.type===type);
 if(!n){near[0].done=true;a.combo=0;a.stats.misses++;f.judgement='MISS';f.timing='다른 줄이에요';f.judgeLife=.5;sound('miss');return;}
 n.done=true;const err=n.t-a.elapsed,perfect=Math.abs(err)<=.105+extra;
 let points=perfect?20:10;a.stats[perfect?'perfects':'goods']++;
 if(a.level===3&&(a.combo+1)%5===0)points+=15;
 a.score+=points;a.combo++;a.maxCombo=Math.max(a.maxCombo,a.combo);
 const y=.165+.095*(lane+.5);arcFloat(.2,y-.04,`+${points}`);figureTone(lane,perfect);
 f.judgement=perfect?'PERFECT':'GOOD';f.timing=perfect?'':err>0?'조금 빨라요':'조금 느려요';f.judgeLife=.55;f.flash=.38;f.pose=type;f.poseT=.35;
 f.hits.push({lane,life:.35,perfect});burstArc(.2,y,perfect?'#e6c97e':'#b8e3ed',perfect?10:6);
 if(a.combo%10===0)arcadeNotice(`${a.combo} COMBO!`,'#f6e3a8');
}
function expansionAction(a,special,power){
 if(a.id==='taekwondo')return taekAction(a,special);
 if(special){
  if(a.level<2||a.skillCd>0)return;
  if(a.id==='taekwondo'&&a.taek.phase!=='opening'){arcadeNotice('방어 성공 후 반격 기회에 사용해요');return;}
  a.skillCd=6;a.skillDuration=6;a.focus=3;
  if(a.id==='ski'){a.invulnerable=Math.max(a.invulnerable,2);arcadeNotice('보호 활강 · 2초 충돌 방어');return;}
  if(a.id!=='taekwondo'){arcadeNotice(a.id==='archery'?'집중 · 바람과 흔들림 제거':'리듬 집중 · 판정 범위 확대');sound('build');return;}
 }
 if(a.shotCd>0)return;
 if(a.id==='archery'){
  const b=a.bow;if(b.flight)return;
  const aim=b.releaseAim||archeryAim(a),weak=a.chargeTime<.25;b.releaseAim=null;
  a.shotCd=.48;a.stats.arrows++;b.flight={x:clamp(aim.x+aim.wind,.04,.96),y:clamp(aim.y+(weak?.12:0),.12,.72),tx:b.target.x,ty:b.target.y,age:0};
  a.chargeTime=0;sound('hit');
 }else if(a.id==='figure')figureHit(a,'space');
}

function updateExpansionArcade(a,dt,speed,dx){
 if(a.id==='taekwondo')return updateTaekwondo(a,dt);
 if(a.id==='archery'){
  const b=a.bow,dy=(runtime.keys.ArrowDown||runtime.keys.KeyS||runtime.touch.down?1:0)-(runtime.keys.ArrowUp||runtime.keys.KeyW||runtime.touch.up?1:0);
  b.x=clamp(b.x+dx*.40*dt,.10,.90);b.y=clamp(b.y+dy*.40*dt,.15,.67);
  b.wind=(a.level>=2||a.champ)?Math.sin(a.elapsed*.6+1.2)*[0,.042,.065][a.level-1]+(a.champ?.025:0):0;
  if(!b.flight&&a.focus<=0){b.target.x=a.level===3?.5+Math.sin(a.elapsed*.85*speed)*.19:[.5,.36,.64][b.round%3];b.target.y=a.level===3?.35+Math.cos(a.elapsed*.65)*.055:.35;}
  if(b.flight){const f=b.flight;f.age+=dt;if(f.age>=.30){
   const distance=Math.hypot((f.x-f.tx)*ARC_W/ARC_H,f.y-f.ty),ring=distance<.025?10:distance<.065?7:distance<.11?4:distance<.17?2:0,gold=a.level===3&&(b.round+1)%3===0;
   b.marks.push({x:f.x,y:f.y,life:2.5});if(b.marks.length>6)b.marks.shift();
   if(ring){a.stats.targets++;if(ring===10)a.stats.bullseyes++;expansionPoints(a,ring*5*(gold?2:1),f.x,f.y);burstArc(f.x,f.y,'#f4d482',7);}else{a.stats.misses++;a.combo=0;arcadeNotice('빗나갔어요 · 점선 착탄점을 확인해요');sound('miss');}
   b.round++;b.flight=null;
  }}for(const m of b.marks)m.life-=dt;b.marks=b.marks.filter(m=>m.life>0);
 }else if(a.id==='ski'){
  const s=a.ski,ice=a.level===3&&a.elapsed>=8;
  s.vx+=(dx*(ice?1.7:2.7)-s.vx*(ice?2.3:5))*dt;s.x=clamp(s.x+s.vx*dt,.10,.90);
  const pace=(a.braking?.65:1)*speed;s.distance+=dt*pace*15;s.next-=dt*pace;
  if(s.next<=0){s.next=1.12;s.index++;const x=.5+Math.sin(s.index*1.7)*[.21,.26,.29][a.level-1];s.gates.push({x,y:-.1,gap:[.24,.20,.17][a.level-1]});
   if(s.index%3===0)s.rocks.push({x:clamp(x+(s.index%2?.26:-.26),.16,.84),y:-.31});
  }
  for(const gate of s.gates){gate.y+=dt*.43*pace;if(!gate.done&&gate.y>=.78){gate.done=true;
   const off=Math.abs(s.x-gate.x);if(off<=gate.gap/2){const perfect=off<gate.gap*.22;a.stats.gatePasses++;if(perfect)a.stats.centerGates++;expansionPoints(a,(perfect?20:15)+(a.level===3&&a.combo>=4?5:0),s.x,.72);}else{a.combo=0;a.stats.misses++;arcadeNotice('깃발을 놓쳤어요 · 감속해서 회전해요');}
  }}
  for(const rock of s.rocks){rock.y+=dt*.43*pace;if(!rock.done&&Math.abs(rock.y-.78)<.045&&Math.abs(s.x-rock.x)<.06){rock.done=true;damageArcade();if(a.phase!=='playing')return;}}
  s.gates=s.gates.filter(g=>g.y<1.1);s.rocks=s.rocks.filter(g=>g.y<1.1);
 }else if(a.id==='figure'){
  const f=a.figure;f.flash=Math.max(0,f.flash-dt);f.judgeLife=Math.max(0,f.judgeLife-dt);f.poseT=Math.max(0,f.poseT-dt);
  for(let i=0;i<3;i++)f.lanePulse[i]=Math.max(0,f.lanePulse[i]-dt);for(const h of f.hits)h.life-=dt;f.hits=f.hits.filter(h=>h.life>0);
  f.stageFlash=Math.max(0,f.stageFlash-dt);
  while(f.beatIdx<f.beats.length&&f.beats[f.beatIdx].t<=a.elapsed){const b=f.beats[f.beatIdx];figureBeat(b.i);f.lastBeatT=b.t;if(b.gap)f.gap=b.gap;f.beatIdx++;}
  const st=f.stages.filter(s=>s.t<=a.elapsed+.01).length-1;
  if(st>f.stage){if(f.stageMiss===a.stats.misses){a.score+=30;arcFloat(.5,.5,'클린 스테이지 +30','#f6e3a8');}f.stage=st;f.stageMiss=a.stats.misses;f.stageFlash=1.3;arcadeNotice(`STAGE ${st+1} · 템포 UP!`,'#f6e3a8');sound('build');}
  for(const n of f.notes)if(!n.done&&a.elapsed>n.t+.25+(a.focus>0?.07:0)){n.done=true;a.stats.misses++;a.combo=0;f.judgement='MISS';f.timing='';f.judgeLife=.45;}
 }
}

function renderArcheryCharge(a){
 const t=a.chargeTime||0,p=clamp(t/2,0,1),sweet=a.charging&&t>=.5&&t<=1.3;
 $('chargeHud').classList.toggle('hidden',a.phase==='result');$('chargeHud').classList.toggle('sweet',sweet);
 $('chargeHud').querySelector('.sweet-zone').style.display='none';$('chargeHud').querySelector('.charge-label span').textContent='0.5~1.3초 안정 · 오래 버티면 흔들려요';
 $('chargeFill').style.width=p*100+'%';$('chargeCursor').style.left=p*100+'%';$('chargeMeter').setAttribute('aria-label','활 당기기 · 0.5초에서 1.3초 사이가 안정 구간');$('chargeMeter').setAttribute('aria-valuenow',Math.round(p*100));
 $('chargeLabel').textContent=a.charging?(sweet?'안정 구간 · 지금 놓아요':t<.5?'활을 조금 더 당겨요':'팔이 떨려요 · 놓아서 발사'):'Space / 발사 버튼을 눌러 활을 당겨요';
}
function renderExpansionHud(a){
 for(const id of ['arcLeft','arcRight'])$(id).classList.remove('hidden');
 for(const id of ['arcUp','arcDown']){$(id).classList.toggle('hidden',a.id!=='archery');$(id).classList.remove('guard-held','guard-cue');$(id).removeAttribute('aria-pressed');$(id).disabled=false;}
 $('arcUp').textContent='▲';$('arcDown').textContent='▼';$('arcUp').setAttribute('aria-label','위로 조준');$('arcDown').setAttribute('aria-label','아래로 조준');
 $('arcAction').disabled=a.phase!=='playing';$('arcAction').classList.remove('counter-ready');$('runSections').classList.remove('hidden');
 if(a.id==='taekwondo')return renderTaekHud(a);
 $('arcLeft').textContent=a.id==='taekwondo'?'상단 방어':'◀';$('arcRight').textContent=a.id==='taekwondo'?'하단 방어':'▶';
 $('arcLeft').setAttribute('aria-label',a.id==='taekwondo'?'누르는 동안 상단 방어':'왼쪽');$('arcRight').setAttribute('aria-label',a.id==='taekwondo'?'누르는 동안 하단 방어':'오른쪽');
 if(!isExpansionGame(a.id))return;
 $('arcAux').classList.add('hidden');
 $('runShield').textContent=a.id==='archery'?`바람 ${a.bow.wind<0?'←':'→'} ${Math.abs(Math.round(a.bow.wind*100))} · 명중 ${a.stats.targets} / ${a.stats.arrows}`:a.id==='ski'?`${a.braking?'감속 중':'자동 활강'} · 깃발 ${a.stats.gatePasses}개 · 하트 ${a.health}`:a.id==='figure'?`PERFECT ${a.stats.perfects} · GOOD ${a.stats.goods} · 놓친 동작 ${a.stats.misses}`:`${a.taek.phase==='opening'?'반격 기회!':a.taek.phase==='telegraph'?(a.taek.shown==='high'?'상단 예고 · ← 방어':'하단 예고 · → 방어'):'공방 중'} · 하트 ${a.health}`;
}
function expansionStatsHtml(a){
 const s=a.stats,rows=a.id==='archery'?[['발사 / 명중',`${s.arrows} / ${s.targets}`],['중심 명중',s.bullseyes],['빗나감',s.misses],['최대 콤보',a.maxCombo]]:a.id==='ski'?[['깃발 통과',s.gatePasses],['정중앙 통과',s.centerGates],['놓친 깃발',s.misses],['남은 하트',a.health]]:a.id==='figure'?[['PERFECT',s.perfects],['GOOD',s.goods],['놓친 동작',s.misses],['최대 콤보',a.maxCombo]]:[['방어 성공',s.blocks],['반격 성공',s.counters],['피격',s.hits],['남은 하트',a.health]];
 return '<div class="run-results">'+rows.map(([k,v])=>`<div><small>${k}</small><b>${v}</b></div>`).join('')+'</div>';
}

// Canvas-native scenery and characters keep the world light and background-free.
function snowPine(c,x,y,s=1){
 c.save();c.translate(x,y);c.scale(s,s);line(c,[[0,-10],[0,13]],'#9c8b7c',9);
 for(let j=0;j<3;j++){const yy=-65+j*21;c.fillStyle='#75998f';c.beginPath();c.moveTo(0,yy-22);c.lineTo(-27-j*5,yy+25);c.lineTo(27+j*5,yy+25);c.closePath();c.fill();line(c,[[-18-j*4,yy+14],[0,yy-15],[18+j*4,yy+14]],'#f0f7f2',7);}
 c.restore();
}
function buildSnowGround(){
 const c=gc;c.fillStyle='#83adbf';c.fillRect(0,0,W,H);
 rr(c,99,109,W-198,H-170,135,'#bed4db');rr(c,123,132,W-246,H-204,120,'#d5e6e9');rr(c,163,165,W-326,H-270,100,'#edf3f0');
 for(let i=0;i<100;i++){const x=210+seed(i+981)*1500,y=190+seed(i+707)*900;ellipse(c,x,y,14,3,'#bed3dc33');}
 for(const road of [[[510,550],[510,650],[1400,650],[1400,560]],[[960,650],[960,1055],[400,1055],[400,1095]],[[510,650],[510,1055]]]){line(c,road,'#d2dbd9',62);line(c,road,'#e6d9c3',48);line(c,road,'#f3e9d5',36);}
 for(const [x,y,s]of [[245,370,1.1],[790,240,.9],[1140,290,.9],[1670,650,1.1],[300,850,1],[1400,1080,1],[720,870,.75]])snowPine(c,x,y,s);
 for(const [x,y,s]of [[820,190,1],[1000,200,1.3],[1140,180,.85]]){c.fillStyle='#bdd0d5';c.beginPath();c.moveTo(x-80*s,y);c.lineTo(x,y-90*s);c.lineTo(x+85*s,y);c.closePath();c.fill();c.fillStyle='#fffdf3';c.beginPath();c.moveTo(x-35*s,y-50*s);c.lineTo(x,y-90*s);c.lineTo(x+40*s,y-47*s);c.closePath();c.fill();}
 ellipse(c,960,650,110,65,'#c5d9df');ellipse(c,960,650,96,54,'#f8f5e9');text(c,'❄',960,628,68,'#89b2c2');text(c,'SNOW PEAK',960,684,16,'#638695','center',800);
 const ids=islandGameIds('snow');for(const [i,id]of ids.entries()){ellipse(c,847.5+i*75,716,26,19,state.stamps.includes(id)?'#ecd18c':'#c4d9df');text(c,games[id].icon,847.5+i*75,714,23);}
 for(const [id,g]of activeGameEntries())drawStadium(c,id,g);
}
function drawExpansionStation(c,id,g,level){
 const{x,y,w,h}=g.building,l=clamp(level,1,3),gold=l===3;c.save();
 rr(c,x+7,y+13,w,h,22,'#35596925');rr(c,x-6,y-6,w+12,h+12,22,gold?'#c5ad6d':'#9ab4b5');rr(c,x,y,w,h,17,id==='archery'?'#c6d3a8':'#dce9e9');
 if(id==='archery'){
  rr(c,x+17,y+15,w-34,h-32,10,'#90ad80');for(const dx of [.25,.5,.75]){line(c,[[x+w*dx,y+40],[x+w*dx,y+h-30]],'#dfdcb940',2);for(const [r,col]of [[24,'#f9f4df'],[18,'#687e9b'],[12,'#cf8e79'],[5,'#f0ce71']])ellipse(c,x+w*dx,y+50,r,r,col);}line(c,[[x+18,y+h-36],[x+w-18,y+h-36]],'#f4ecd2',3);
  if(l>=2){rr(c,x+15,y+h-34,w-30,17,4,'#a18566');stadiumFlag(c,x+w-12,y+32,'#e9c97d');}
 }else if(id==='ski'){
  rr(c,x+15,y+15,w-30,h-30,14,'#f9faf0');line(c,[[x+w*.4,y+20],[x+w*.6,y+h*.35],[x+w*.35,y+h*.65],[x+w*.6,y+h-18]],'#d3e5ea',55);
  for(let i=0;i<4;i++){const yy=y+30+i*(h-55)/4,cx=x+w*(i%2?.62:.38);for(const dx of [-34,34]){line(c,[[cx+dx,yy],[cx+dx,yy-22]],'#668c9b',2);rr(c,cx+dx,yy-22,dx<0?13:-13,9,1,i%2?'#7ba8ba':'#cf8d7e');}}
  if(l>=2)line(c,[[x+20,y+20],[x+w-25,y+h-20]],'#778b9540',3);
 }else if(id==='figure'){
  rr(c,x+14,y+14,w-28,h-28,48,l===3?'#b4dce4':'#c9e5e8','#f8faf1');
  c.strokeStyle='#fffef2';c.lineWidth=2;for(const r of [26,47]){c.beginPath();c.ellipse(x+w*.5,y+h*.5,r*1.5,r,0,0,Math.PI*2);c.stroke();}line(c,[[x+w*.5,y+18],[x+w*.5,y+h-18]],'#e3b4bd88',2);text(c,'✦',x+w*.5,y+h*.5,27,'#fdfaf0');
 }else{
  rr(c,x+12,y+12,w-24,h-24,7,'#c4a27f');rr(c,x+45,y+28,w-90,h-56,7,'#86aebb');rr(c,x+75,y+50,w-150,h-100,5,'#ce9b92');
  line(c,[[x+12,y+12],[x+w/2,y-24],[x+w-12,y+12]],l===3?'#4e6571':'#7c8b8c',13);text(c,'태권',x+w/2,y+14,12,'#f7e5bf');
 }
 if(l>=2){stadiumSeats(c,x+18,y-5,w-36,2,gold?'#d1be7f':'#9cbcc5');stadiumLight(c,x+4,y+20,l);stadiumLight(c,x+w-4,y+20,l);stadiumBoard(c,x+w/2,y-35,gold?'CHAMPION':'TRAINING CLUB',l);}
 if(gold){stadiumFlag(c,x+8,y+10,'#e4c97b');stadiumFlag(c,x+w-24,y+10,'#e4c97b');}
 rr(c,x+w/2-113,y+h+8,226,36,10,gold?'#f6e9bb':'#fffaf0','#c6d4cd');text(c,g.icon+' '+g.name,x+w/2,y+h+21,12,'#506b70','center',800);text(c,`Lv.${l} · ${tierNames[l-1]}`,x+w/2,y+h+35,8,'#7e9296');c.restore();
}

function drawTarget(c,x,y,r,gold=false){
 for(const [scale,col]of [[1,'#fffaf0'],[.77,'#536e88'],[.52,'#c28173'],[.27,gold?'#ffe28a':'#efcc78']])ellipse(c,x,y,r*scale,r*scale,col);
 c.strokeStyle='#fff9dc99';c.lineWidth=1;c.beginPath();c.arc(x,y,r,0,Math.PI*2);c.stroke();
}
function drawExpansionArcade(a,w,h,now){
 if(a.id==='archery'){
  ac.fillStyle='#c4d7b2';ac.fillRect(0,0,w,h);rr(ac,w*.08,h*.12,w*.84,h*.68,22,'#90ad83');
  for(let i=0;i<8;i++)snowPine(ac,(i+.5)*w/8,h*.20,.45);
  const b=a.bow,t=b.target,gold=a.level===3&&(b.round+1)%3===0;line(ac,[[t.x*w,t.y*h],[t.x*w,h*.63]],'#a78c68',13);drawTarget(ac,t.x*w,t.y*h,h*.17,gold);
  for(const m of b.marks){ac.save();ac.globalAlpha=clamp(m.life,0,1);line(ac,[[m.x*w-5,m.y*h+9],[m.x*w,m.y*h]],'#544f40',3);ellipse(ac,m.x*w,m.y*h,3,3,'#f4e5bb');ac.restore();}
  const aim=archeryAim(a);ac.strokeStyle=a.charging&&a.chargeTime>=.5&&a.chargeTime<=1.3?'#fff1a7':'#ecf5e7';ac.lineWidth=2;ac.beginPath();ac.arc(aim.x*w,aim.y*h,12,0,Math.PI*2);ac.stroke();line(ac,[[aim.x*w-20,aim.y*h],[aim.x*w+20,aim.y*h]],'#fff3ba',1);line(ac,[[aim.x*w,aim.y*h-20],[aim.x*w,aim.y*h+20]],'#fff3ba',1);
  ac.save();ac.setLineDash([3,4]);ac.strokeStyle='#f6dd92';ac.beginPath();ac.arc((aim.x+aim.wind)*w,aim.y*h,7,0,Math.PI*2);ac.stroke();ac.restore();
  if(b.flight){const f=b.flight,p=clamp(f.age/.3,0,1);line(ac,[[w*.5+(f.x*w-w*.5)*p,h*.9+(f.y*h-h*.9)*p+16],[w*.5+(f.x*w-w*.5)*p,h*.9+(f.y*h-h*.9)*p]],'#534e3e',4);}
  drawCharacter(ac,roster.find(n=>n.id===a.char),w*.5,h*.98,70,'up',false,now,true);
  ac.strokeStyle='#9b7951';ac.lineWidth=4;ac.beginPath();ac.ellipse(w*.5+30,h*.89,13,31,0,-Math.PI/2,Math.PI/2);ac.stroke();line(ac,[[w*.5+30,h*.89-31],[w*.5+30-(a.charging?12:0),h*.89],[w*.5+30,h*.89+31]],'#f7edce',1.5);
  rr(ac,16,16,230,35,10,'#314c42e6');text(ac,a.focus>0?'집중 · 바람 영향 없음':`바람 ${b.wind<0?'←':'→'} ${Math.abs(Math.round(b.wind*100))}`,130,34,15,'#fff2c9');
  if(gold){rr(ac,w-195,16,177,35,10,'#e9c97c');text(ac,'황금 과녁 ×2',w-106,34,14,'#675a36');}
 }else if(a.id==='ski'){
  const s=a.ski;ac.fillStyle='#d7e8ec';ac.fillRect(0,0,w,h);rr(ac,w*.08,-20,w*.84,h+40,20,'#f9faf3');
  for(let i=0;i<8;i++){const y=(i*h/5+a.elapsed*160*(a.braking?.65:1))%(h+130)-80;snowPine(ac,w*.04,y,.7);snowPine(ac,w*.96,y+h*.12,.7);}
  if(a.level===3&&a.elapsed>=8){rr(ac,w*.14,h*.25,w*.72,h*.24,34,'#c9e5ee88');text(ac,'ICE',w*.5,h*.35,24,'#9fc7d5');}
  for(const gate of s.gates){const y=gate.y*h;for(const side of [-1,1]){const x=(gate.x+side*gate.gap/2)*w;line(ac,[[x,y+14],[x,y-29]],'#567c94',3);rr(ac,x,y-29,side<0?20:-20,15,2,side<0?'#cd887c':'#77a7c1');}if(!gate.done)line(ac,[[(gate.x-gate.gap/2)*w,y],[(gate.x+gate.gap/2)*w,y]],'#c1d8da80',2);}
  for(const rock of s.rocks)if(!rock.done){ellipse(ac,rock.x*w,rock.y*h,23,15,'#93a6ae');ellipse(ac,rock.x*w-5,rock.y*h-6,15,9,'#c0cdd0');}
  for(const d of [-1,1])line(ac,[[s.x*w+d*13-s.vx*35,h*.84],[s.x*w+d*13,h*.94]],'#7999ac',5);
  drawSurvivalPlayer(ac,a,s.x*w,h*.83,72,s.vx<0?'left':'right',false,now);
  rr(ac,w/2-85,17,170,32,10,a.braking?'#c8dee9':'#466c80df');text(ac,a.braking?'감속 · 코너를 돌아요':'자동 활강 · 깃발 사이로',w/2,33,13,a.braking?'#56778d':'#fff8e2');
 }else if(a.id==='figure'){
  const f=a.figure,colors=['#b4d7e3','#e8cf8c','#d9bbd5'],labels=['←','●','→'],judgeX=w*.2,top=h*.165,laneH=h*.095,speed=w*.36,fever=a.combo>=10;
  const since=a.elapsed-(f.lastBeatT??-9),beatPulse=f.lastBeatT!=null&&a.elapsed<24.6?Math.max(0,1-since/(f.gap*.45)):0,tint=['#d5e7eb','#dcdff0','#e8dcec','#efe3d6','#dbeee2'][f.stage%5];
  ac.fillStyle=tint;ac.fillRect(0,0,w,h);stadiumSeats(ac,20,5,w-40,3,'#a5b0c3');
  if(fever){ac.save();for(let i=0;i<3;i++){const x=w*(.25+i*.25)+Math.sin(now*1.3+i*2)*w*.06;ac.globalAlpha=.13+beatPulse*.1;ac.fillStyle=['#f6e3a8','#c7e8e7','#e8c9e2'][i];ac.beginPath();ac.moveTo(x-w*.02,h*.45);ac.lineTo(x+w*.02,h*.45);ac.lineTo(x+w*.1,h);ac.lineTo(x-w*.1,h);ac.fill();}ac.restore();}
  rr(ac,w*.08,h*.5,w*.84,h*.47,55,'#eaf5f2','#fffaf0');
  ac.strokeStyle=fever?'#e4cf91':'#bed9e1';ac.lineWidth=2+beatPulse*2;ac.beginPath();ac.ellipse(w*.5,h*.82,w*.25*(1+beatPulse*.03),h*.12*(1+beatPulse*.03),0,0,Math.PI*2);ac.stroke();
  const lean=f.poseT>0&&f.pose!=='space'?(f.pose==='left'?-1:1)*(f.poseT/.35):0,hop=f.poseT>0&&f.pose==='space'?Math.sin(f.poseT/.35*Math.PI)*h*.07:0;
  drawCharacter(ac,roster.find(n=>n.id===a.char),w*.5+lean*w*.06,h*.93-hop,100+f.flash*15+beatPulse*4,lean<0?'left':lean>0?'right':(Math.floor(a.elapsed/f.gap)%2?'left':'right'),false,now,true);if(f.flash>0)drawGoldenStar(ac,w*.61,h*.66,15+f.flash*20);
  rr(ac,w*.06,top-h*.025,w*.88,laneH*3+h*.05,18,'#374961ec');
  for(let i=0;i<3;i++){const y=top+laneH*(i+.5);ac.fillStyle=f.lanePulse[i]>0?colors[i]+'55':i%2?'#ffffff12':'#ffffff08';ac.fillRect(w*.08,y-laneH*.44,w*.84,laneH*.88);text(ac,labels[i],w*.105,y,15,'#c9d6e2','center',800);}
  ac.save();ac.beginPath();ac.rect(w*.13,top-h*.02,w*.79,laneH*3+h*.04);ac.clip();
  for(const b of f.beats){if(b.i%2||!b.gap)continue;const x=judgeX+(b.t-a.elapsed)*speed;if(x<w*.1||x>w*.95)continue;const bar=f.stages.some(s=>Math.abs(s.t-b.t)<.001);ac.strokeStyle=bar?'#f6e3a8aa':(b.i/2)%4===0?'#ffffff40':'#ffffff18';ac.lineWidth=bar?3:(b.i/2)%4===0?2:1;ac.beginPath();ac.moveTo(x,top);ac.lineTo(x,top+laneH*3);ac.stroke();}
  ac.strokeStyle='#f2d38b';ac.lineWidth=3+beatPulse*3;ac.beginPath();ac.moveTo(judgeX,top);ac.lineTo(judgeX,top+laneH*3);ac.stroke();
  for(let i=0;i<3;i++){const y=top+laneH*(i+.5);if(f.lanePulse[i]>0)ellipse(ac,judgeX,y,laneH*.38,laneH*.38,colors[i]+'99');ac.strokeStyle=colors[i];ac.lineWidth=3;ac.beginPath();ac.arc(judgeX,y,laneH*.36,0,Math.PI*2);ac.stroke();}
  for(const n of f.notes)if(!n.done){const x=judgeX+(n.t-a.elapsed)*speed;if(x<w*.1||x>w*.97)continue;const i={left:0,space:1,right:2}[n.type],y=top+laneH*(i+.5);ellipse(ac,x,y,laneH*.32,laneH*.32,colors[i]);ac.strokeStyle='#fffaf0';ac.lineWidth=2;ac.stroke();text(ac,labels[i],x,y,Math.round(laneH*.34),'#46596e','center',800);}
  for(const hit of f.hits){const p=1-hit.life/.35,y=top+laneH*(hit.lane+.5);ac.globalAlpha=1-p;ac.strokeStyle=hit.perfect?'#f6e3a8':'#c7e8e7';ac.lineWidth=4;ac.beginPath();ac.arc(judgeX,y,laneH*(.36+p*.5),0,Math.PI*2);ac.stroke();ac.globalAlpha=1;}
  ac.restore();
  text(ac,`STAGE ${f.stage+1}`,w*.9,top-h*.045,14,'#4f6a80','right',800);
  if(f.stageFlash>0){ac.globalAlpha=Math.min(1,f.stageFlash);text(ac,`STAGE ${f.stage+1}`,w*.5,h*.56,Math.round(34+(1.3-f.stageFlash)*8),'#a88c4c','center',800);text(ac,'템포 UP!',w*.5,h*.63,16,'#7a8ea2','center',800);ac.globalAlpha=1;}
  else if(f.judgeLife>0){const s=1+Math.max(0,f.judgeLife-.4)*1.5;text(ac,f.judgement,w*.5,h*.58,Math.round(30*s),f.judgement==='PERFECT'?'#a88c4c':f.judgement==='MISS'?'#b07a78':'#5f86a0','center',800);if(f.timing)text(ac,f.timing,w*.5,h*.64,14,'#6d8296','center',700);}
  else if(a.elapsed<f.start+1)text(ac,'음표가 판정선에 닿을 때 그 줄의 키!',w*.5,h*.58,20,'#657b94','center',800);
 }else if(a.id==='taekwondo')drawTaekwondo(a,w,h,now);
}

// One readable exchange: hold the matching guard, block the impact, then counter.
function taekSetPhase(k,phase,duration){k.phase=phase;k.timer=duration;k.duration=duration;}
function initTaekwondo(a){
 a.taek={phase:'telegraph',timer:1.8,duration:1.8,index:0,side:'high',shown:'high',feint:false,blocked:false,kick:0,kickType:'body',guard:null,guardAt:-9,buffer:null,bufferTime:0,message:'',messageTime:0,wrongGuard:false,
  parry:false,parryFlash:0,chain:0,double:false,secondHit:false,delay:0,history:[],shake:0,hitStop:0};
 a.stats.parries=0;a.stats.kicks=0;
}
function taekGuard(){
 const up=Boolean(runtime.keys.ArrowUp||runtime.keys.KeyW||runtime.touch.up),down=Boolean(runtime.keys.ArrowDown||runtime.keys.KeyS||runtime.touch.down);
 return up&&!down?'high':down&&!up?'low':null;
}
function taekCue(k){return k.shown==='high'?{key:'↑',name:'상단',color:'#79abc7'}:{key:'↓',name:'하단',color:'#ca9a80'};}
function taekMessage(k,message){k.message=message;k.messageTime=1.1;}
function taekKick(a,type,special=false){
 const k=a.taek;if(a.phase!=='playing'||k.phase!=='opening')return;
 if(special&&(a.level<2||a.skillCd>0))return;
 if(special){a.skillCd=6;a.skillDuration=6;}
 k.chain++;if(k.chain===1)a.stats.counters++;a.stats.kicks++;
 let points=special?40:(type==='head'?15:10)+(k.chain===3?10:0);
 if(a.level===3&&k.chain===1&&a.stats.counters%3===0)points+=10;
 if(k.parry)points=Math.round(points*1.5);
 a.shotCd=.1;k.kick=.32;k.kickType=special?'special':type;k.hitStop=.07;k.shake=special?.28:.14;k.buffer=null;k.bufferTime=0;
 const y=type==='head'?.52:.64;expansionPoints(a,points,.7,y,`${k.chain}타 +${points}`);burstArc(.70,y,special||k.parry?'#efd27f':'#fff1b5',special?16:9);sound('hit');
 if(special||k.chain>=3){taekSetPhase(k,'recover',a.practice?.7:.45);taekMessage(k,special?`강한 반격 +${points}`:`3연타 피니시! +${points}`);}
 else{taekSetPhase(k,'opening',a.practice?1.3:[.75,.65,.58][a.level-1]);taekMessage(k,`${k.chain}타! 이어서 한 번 더`);}
}
function taekAction(a,special=false){
 const k=a.taek;if(a.phase!=='playing'||a.shotCd>0)return;
 if(special&&(a.level<2||a.skillCd>0))return;
 if(k.phase==='block'){k.buffer=special?'special':'normal';k.bufferTime=.55;taekMessage(k,'반격 준비 완료 · 곧 발차기!');return;}
 if(k.phase!=='opening'){if(k.messageTime<=0)taekMessage(k,'공격을 막으면 반격 기회가 열려요');return;}
 taekKick(a,'body',special);
}
function taekNext(a){
 const k=a.taek;k.index++;k.chain=0;k.parry=false;k.secondHit=false;
 if(a.practice)k.side=k.index%2?'low':'high';
 else{const h=k.history;k.side=Math.random()<.5?'high':'low';if(h.length>=2&&h.at(-1)===h.at(-2)&&h.at(-1)===k.side)k.side=k.side==='high'?'low':'high';h.push(k.side);if(h.length>4)h.shift();}
 k.double=!a.practice&&a.level>=2&&k.index%4===3;
 k.delay=!a.practice&&a.level===3&&k.index%5===1?.4:0;
 k.feint=!a.practice&&a.level===3&&a.elapsed>=8&&k.index%3===2&&!k.delay;
 k.shown=k.feint?(k.side==='high'?'low':'high'):k.side;k.blocked=false;k.buffer=null;k.bufferTime=0;k.wrongGuard=false;
 taekSetPhase(k,'telegraph',a.practice?1.8:[1.3,1.12,.98][a.level-1]/(a.champ?1.15:1));k.timer+=k.delay;
}
function updateTaekwondo(a,dt){
 const k=a.taek,g=taekGuard();
 if(g!==k.guard&&g){k.guardAt=a.elapsed;if(k.phase==='opening'&&a.shotCd<=0)taekKick(a,g==='high'?'head':'body');}
 k.guard=g;k.shake=Math.max(0,k.shake-dt);k.parryFlash=Math.max(0,k.parryFlash-dt);
 if(k.hitStop>0){k.hitStop-=dt;return;}
 k.kick=Math.max(0,k.kick-dt);k.messageTime=Math.max(0,k.messageTime-dt);k.bufferTime=Math.max(0,k.bufferTime-dt);if(k.bufferTime===0)k.buffer=null;
 k.timer-=dt;
 if(k.phase==='telegraph'&&k.feint&&k.timer<=.65)k.shown=k.side;
 if(a.practice&&k.phase==='opening'&&k.timer<.3){k.timer=.3;return;}
 if(k.timer>0)return;
 if(k.phase==='telegraph'){taekSetPhase(k,'attack',a.champ?.28:.36);return;}
 if(k.phase==='attack'){
  k.blocked=k.guard===k.side;k.wrongGuard=!k.blocked;
  if(k.blocked){
   const parry=!a.practice&&a.elapsed-k.guardAt<=.26;a.stats.blocks++;
   if(parry){k.parry=true;a.stats.parries++;a.score+=15;k.parryFlash=.4;k.hitStop=.1;k.shake=.16;taekSetPhase(k,'block',.32);taekMessage(k,'PERFECT 막기 +15 · 반격 1.5배!');sound('build');}
   else{a.score+=8;taekSetPhase(k,'block',.32);taekMessage(k,'방어 성공 +8');sound('hit');}
  }
  else if(a.practice){taekSetPhase(k,'telegraph',1.8);k.shown=k.side;taekMessage(k,`${taekCue(k).key} 버튼을 공격이 닿을 때까지 누르세요`);}
  else{k.double=false;damageArcade();if(a.phase!=='playing')return;k.shake=.2;taekSetPhase(k,'recover',.5);taekMessage(k,'방어 실패 · 공격이 닿을 때까지 누르세요');}
  return;
 }
 if(k.phase==='block'){
  if(k.double&&!k.secondHit){k.secondHit=true;k.side=k.side==='high'?'low':'high';k.shown=k.side;k.feint=false;k.delay=0;taekSetPhase(k,'telegraph',.62/(a.champ?1.1:1));taekMessage(k,'연속 공격! 반대쪽을 막아요');return;}
  taekSetPhase(k,'opening',a.practice?1.3:[1.1,1,.9][a.level-1]);
  if(k.buffer&&k.bufferTime>0){const special=k.buffer==='special';k.buffer=null;taekAction(a,special);}return;
 }
 if(k.phase==='opening'){if(k.chain===0){a.combo=0;a.stats.misses++;taekMessage(k,'기회를 놓쳤어요 · 다음엔 ↑ 또는 Space');}else taekMessage(k,`${k.chain}연타 성공`);taekSetPhase(k,'recover',.4);return;}
 if(a.practice&&a.stats.counters>=2){finishTaekPractice();return;}
 taekNext(a);
}
function finishTaekPractice(){
 const a=runtime.arc;if(!a?.practice||a.phase==='result')return;
 a.phase='result';a.paid=true;clearInput();$('arcade').classList.add('is-result');$('pauseArcade').disabled=true;
 showArcadeCover('<div class="medal">🥋</div><h3>이제 준비됐어요!</h3><p>↑ 상단 방어 · ↓ 하단 방어<br><b>방어 성공 후 Space로 반격</b></p><p class="hint">무료 연습 완료 · CP 소모와 기록 반영이 없어요.</p><div class="dialog-actions"><button class="soft-btn primary" id="taekRealGame">실전 도전 준비</button><button class="soft-btn" id="taekPracticeAgain">한 번 더 연습</button><button class="soft-btn" id="returnWorld">섬으로 돌아가기</button></div>');
 $('taekRealGame').onclick=()=>{leaveArcade();gameIntro('taekwondo');};$('taekPracticeAgain').onclick=()=>{leaveArcade();startArcade('taekwondo',{practice:true});};$('returnWorld').onclick=leaveArcade;$('taekRealGame').focus();renderTaekHud(a);
}
function taekStateCopy(a){
 const k=a.taek,cue=taekCue(k);
 if(k.phase==='opening')return{title:k.chain?`${k.chain}타! 한 번 더`:k.parry?'강한 반격 찬스!':'지금 반격!',detail:'↑ 머리 차기 15 · Space/↓ 몸통 차기 10 · 3타째 +10',color:'#efd079',step:2};
 if(k.phase==='block')return{title:'방어 성공!',detail:'곧 반격 기회 · Space를 준비해요',color:'#a8d9c9',step:1};
 if(k.phase==='telegraph'||k.phase==='attack')return{title:`${cue.key} ${cue.name} 방어`,detail:k.phase==='attack'?'지금 누르면 PERFECT 막기!':`상대의 ${cue.name} 공격 · 닿기 직전에 누르면 PERFECT`,color:cue.color,step:0};
 return{title:k.kick>0?'반격 성공!':'다음 공격 준비',detail:k.messageTime>0?k.message:'손을 떼고 다음 예고를 기다려요',color:'#c6d6ce',step:2};
}
function renderTaekHud(a){
 const k=a.taek,cue=taekCue(k),copy=taekStateCopy(a),counter=k.phase==='opening'||k.phase==='block';
 $('arcLeft').classList.add('hidden');$('arcRight').classList.add('hidden');
 $('arcUp').classList.remove('hidden');$('arcDown').classList.remove('hidden');
 $('arcUp').textContent='↑ 상단 방어';$('arcDown').textContent='↓ 하단 방어';
 $('arcUp').setAttribute('aria-label','위 방향키 · 누르는 동안 상단 방어');$('arcDown').setAttribute('aria-label','아래 방향키 · 누르는 동안 하단 방어');
 for(const [id,side]of [['arcUp','high'],['arcDown','low']]){
  const button=$(id);button.classList.toggle('guard-held',k.guard===side);button.classList.toggle('guard-cue',['telegraph','attack'].includes(k.phase)&&k.shown===side);button.setAttribute('aria-pressed',String(k.guard===side));button.disabled=a.phase!=='playing';
 }
 $('arcAction').disabled=a.phase!=='playing'||!counter;$('arcAction').classList.toggle('counter-ready',k.phase==='opening'&&a.phase==='playing');$('arcAction').textContent=k.phase==='opening'?'지금 반격 · Space':k.phase==='block'?'반격 준비 · Space':'방어 후 반격';
 $('arcSpecial').disabled=a.phase!=='playing'||a.level<2||a.skillCd>0||!counter;
 $('runShield').textContent=a.practice?`무료 연습 ${Math.min(2,a.stats.counters)} / 2 · ${copy.title}`:`${copy.title} · 방어 ${a.stats.blocks}회 · 반격 ${a.stats.counters}회`;
 $('runStageTip').textContent=k.messageTime>0?k.message:copy.detail;
 $('runSections').classList.toggle('hidden',a.practice);
 if(a.practice){$('arcadeTime').textContent='—';$('arcadeTarget').textContent='연습';$('arcadeScore').textContent=a.stats.counters+'/2';$('arcScoreTitle').textContent='반격 성공';$('runStageName').textContent='무료 조작 연습';$('runPace').textContent='PRACTICE';$('runGoalLabel').textContent='상단 방어와 하단 방어를 한 번씩 익혀요';$('runGoalBar').style.width=Math.min(100,a.stats.counters/2*100)+'%';$('runSkillLabel').textContent='시간 제한 없이 천천히 연습해요';}
 else if(a.level>=2&&a.skillCd<=0)$('runSkillLabel').textContent=counter?'강한 반격 준비 · E':'방어 성공 후 E로 강한 반격';
}
function drawTaekwondo(a,w,h,now){
 const k=a.taek,copy=taekStateCopy(a),cue=taekCue(k),px=w*.25,ox=w*.76,yy=h*.85,size=122,highY=yy-96,lowY=yy-40;
 ac.save();if(k.shake>0)ac.translate((Math.random()-.5)*k.shake*44,(Math.random()-.5)*k.shake*30);
 ac.fillStyle='#ede6d9';ac.fillRect(-30,-30,w+60,h+60);
 rr(ac,w*.055,h*.49,w*.89,h*.46,18,'#8db1bb');rr(ac,w*.12,h*.55,w*.76,h*.32,12,'#c99e96');
 const labels=['1  방어 준비','2  방어 성공','3  반격'];for(let i=0;i<3;i++){const x=w*(.06+i*.30);rr(ac,x,h*.035,w*.28,h*.065,9,i===copy.step?copy.color:'#d9dfd8');text(ac,labels[i],x+w*.14,h*.068,14,i===copy.step?'#294c50':'#7e8d86','center',800);}
 rr(ac,w*.2,h*.135,w*.6,h*.17,16,'#fffaf0');text(ac,copy.title,w*.5,h*.19,26,'#375c68','center',800);text(ac,copy.detail,w*.5,h*.26,14,'#708780');
 const meterX=w*.20,meterW=w*.60,meterY=h*.335;
 rr(ac,meterX,meterY,meterW,8,4,'#d6ded7');
 if(k.phase==='telegraph'||k.phase==='attack'){const zx=meterX+meterW*(1-.26/(k.duration+.36));rr(ac,zx,meterY-3,meterX+meterW-zx,14,5,'#efd07955');}
 const progress=k.phase==='telegraph'?1-Math.max(0,k.timer-k.delay)/k.duration:k.phase==='attack'?1:k.phase==='opening'?k.timer/k.duration:0;
 if(progress>0)rr(ac,meterX,meterY,meterW*clamp(progress,0,1),8,4,copy.color);
 text(ac,k.phase==='opening'?'반격 기회가 끝나기 전에 누르세요':k.phase==='attack'?'공격 도착!':k.phase==='telegraph'?(k.delay&&k.timer<=k.delay?'한 박자 늦게 와요 · 기다렸다 막기!':'노란 구간에서 누르면 PERFECT 막기'):'',w*.5,h*.39,13,'#6e8486');
 if(k.chain>0&&(k.phase==='opening'||k.kick>0))text(ac,`${k.chain} HIT${k.parry?' ×1.5':''}`,w*.76,h*.47,24,'#b08a3c','center',800);
 // Keep the exact supplied character photographs. Action effects move around them.
 drawSurvivalPlayer(ac,a,px+(k.kick>0?18:0),yy,size,'right',false,now);
 const stance=k.phase==='telegraph'||k.phase==='attack'?(k.shown==='high'?-8:7):0,recoil=k.kick>0?Math.sin(k.kick/.32*Math.PI)*14:0;drawCharacter(ac,roster.find(n=>n.id==='taek'),ox-(k.phase==='attack'?12:0)+recoil,yy+stance,size,'left',false,now);
 text(ac,'나',px,yy+25,15,'#425f68','center',800);text(ac,'태권',ox,yy+25,15,'#425f68','center',800);
 for(const [side,y,key]of [['high',highY,'↑'],['low',lowY,'↓']]){
  const held=k.guard===side,expected=['telegraph','attack'].includes(k.phase)&&k.shown===side;
  ellipse(ac,px+82,y,22,22,held?'#a3d8dd':expected?'#e2ecdf':'#d9d9c7');
  text(ac,key,px+82,y,24,held?'#315f70':'#7f9291','center',800);
  if(held){ac.strokeStyle='#a9edf0';ac.lineWidth=6;ac.beginPath();ac.arc(px+54,y,29,-Math.PI/2,Math.PI/2);ac.stroke();}
 }
 if(k.phase==='telegraph'||k.phase==='attack'){
  const y=k.shown==='high'?highY:lowY,progress=k.phase==='attack'?clamp(1-k.timer/k.duration,0,1):0;
  ac.save();ac.setLineDash([8,9]);line(ac,[[ox-67,y],[px+110,y]],cue.color+'80',3);ac.restore();
  const x=ox-68+(px+95-(ox-68))*progress;rr(ac,x-25,y-16,50,32,9,cue.color);text(ac,'←',x,y,27,'#fffaf0','center',800);
  if(k.feint&&k.timer<=.65&&k.phase==='telegraph')text(ac,'방향 전환!',ox,h*.53,15,'#a77e55','center',800);
 }
 if(k.phase==='block'){drawShieldPickup(px+76,k.side==='high'?highY:lowY,28);text(ac,'막았어요!',px+40,h*.55,18,'#3c8377','center',800);}
 if(k.parryFlash>0){ac.globalAlpha=k.parryFlash/.4;ac.strokeStyle='#f6e3a8';ac.lineWidth=7;ac.beginPath();ac.arc(px+70,k.side==='high'?highY:lowY,30+(1-k.parryFlash/.4)*40,0,Math.PI*2);ac.stroke();ac.globalAlpha=1;text(ac,'PERFECT!',px+70,h*.5,20,'#a88c4c','center',800);}
 if(k.phase==='opening'){const p=.5+Math.sin(now*10)*.5;ellipse(ac,ox-70,highY,26+p*3,26+p*3,'#f1d98d77');text(ac,'↑',ox-70,highY,20,'#7a6233','center',800);ellipse(ac,ox-70,lowY+8,26+p*3,26+p*3,'#f1d98d55');text(ac,'Space',ox-70,lowY+8,13,'#7a6233','center',800);}
 if(k.kick>0){const t=1-k.kick/.32,y=k.kickType==='head'?highY:k.kickType==='special'?yy-75:lowY+8,reach=px+65+(ox-px-145)*Math.min(1,t*3);ac.globalAlpha=1-t*.6;ac.strokeStyle=k.kickType==='special'?'#f6d77a':'#fff1b5';ac.lineWidth=k.kickType==='special'?16:11;ac.lineCap='round';ac.beginPath();ac.moveTo(px+45,y+24);ac.quadraticCurveTo((px+reach)/2,y-26,reach,y);ac.stroke();ac.globalAlpha=1;drawGoldenStar(ac,ox-70,y,14+Math.sin(t*Math.PI)*9);}
 ac.restore();
}


function defaults(){return createDefaultState();}
let state=defaults();gameStore.getState().replace(state);let storageWorks=true,loadWarning='',hadSave=false,loadedDecorCooldowns={};
const BACKUP_KEY=SAVE_KEY+'-backup';
const asArray=v=>Array.isArray(v)?v:[];
function backupSave(raw){if(typeof raw!=='string'||!raw)return false;try{localStorage.setItem(BACKUP_KEY,raw);return localStorage.getItem(BACKUP_KEY)===raw;}catch(e){return false;}}
function serializeSave(space){return serializeSaveData(state,Object.fromEntries([...trees,...resources].map(n=>[n.id,n.readyAt])),runtime.decorCooldowns,Date.now(),space);}
function load(){
  try{
    loadedDecorCooldowns={};var raw;try{raw=localStorage.getItem(SAVE_KEY);}catch(e){storageWorks=false;loadWarning='이 브라우저에서는 저장이 차단되어 있어요. 설정에서 기록을 내보내 보관하세요.';return;}if(!raw)return;
    const loaded=sanitizeSave(JSON.parse(raw),{normalizeChar:normalizePlayerId,cleanQuizRecords});hadSave=true;
    loadedDecorCooldowns=loaded.decorCooldowns;
    state=loaded.state;gameStore.getState().replace(state);
    const s={cooldowns:loaded.cooldowns};
    for(const t of trees)t.readyAt=Math.min(Date.now()+30000,Number(s.cooldowns?.[t.id])||0);
    for(const r of resources)r.readyAt=Math.min(Date.now()+45000,Number(s.cooldowns?.[r.id])||0);
  }catch(e){hadSave=false;loadedDecorCooldowns={};loadWarning=backupSave(raw)?'이전 저장을 읽지 못해 백업해 두었어요. 설정에서 백업을 내보낼 수 있어요.':'이전 저장을 읽지 못했어요. 새 모험으로 시작합니다.';}
}
load();

const runtime={mode:'world',tab:'quests',modal:null,npc:null,decor:null,removeDecor:false,target:null,keys:{},touch:{},camera:{x:state.player.x,y:state.player.y},walk:0,dir:'down',moving:false,particles:[],floaters:[],lastInteract:0,arc:null,lastFocus:null,lastUi:0,saveTimer:0,now:0,hover:null,decorCooldowns:loadedDecorCooldowns,weatherTimer:0,champMode:false};

function currentWeather(){return weatherModes[state.weatherIdx||0]||weatherModes[0];}
function cycleWeather(){
  state.weatherIdx=((state.weatherIdx||0)+1)%weatherModes.length;
  const w=currentWeather();
  sound('talk');
  toast(`${w.name}으로 바뀌었어요! (${w.desc})`);
  dirty();
}

function save(){
  try{
    state.savedAt=Date.now();
    localStorage.setItem(SAVE_KEY,serializeSave());
    storageWorks=true;gameStore.getState().setSaveStatus('saved');$('saveStatus').textContent='✓ 자동 저장됨';
  }catch(e){storageWorks=false;gameStore.getState().setSaveStatus('blocked');$('saveStatus').textContent='저장 불가 · 설정에서 내보내기';}
  return storageWorks;
}
function dirty(){gameStore.getState().touch();clearTimeout(runtime.saveTimer);runtime.saveTimer=setTimeout(save,400);renderHud();renderSidebar();}
function toast(message,bad=false,options={}){
  const key=options.key||message.replace(/\d+(?:\.\d+)?초/g,'#초');
  const kind=options.kind||(bad?'warning':/완료|완성|새로운 장소 발견|새 트로피|동료 합류/.test(message)?'milestone':'info');
  const priority={info:1,milestone:2,warning:3}[kind]||1,now=performance.now(),old=runtime.notice;
  if(old&&((old.key===key&&now-old.shownAt<2600)||(old.until>now&&old.priority>priority)))return;
  if(old?.timer)clearTimeout(old.timer);
  const stack=$('toasts');stack.replaceChildren();const el=document.createElement('div');
  el.className='toast toast-'+kind+(bad?' bad':'');
  const dot=document.createElement('span');dot.className='toast-mark';dot.textContent=kind==='warning'?'!':kind==='milestone'?'✓':'·';dot.setAttribute('aria-hidden','true');
  const label=document.createElement('span');label.className='toast-copy';label.textContent=message;el.append(dot,label);stack.appendChild(el);
  const duration=kind==='info'?2200:3200;
  runtime.notice={key,shownAt:now,until:now+duration,priority,timer:setTimeout(()=>{el.remove();},duration)};
}

let audio;function sound(kind){if(!state.sound)return;try{audio||=new (window.AudioContext||window.webkitAudioContext)();if(audio.state==='suspended')audio.resume();const o=audio.createOscillator(),g=audio.createGain(),t=audio.currentTime;o.type='sine';o.frequency.setValueAtTime(({collect:660,hit:440,win:880,miss:160,talk:520,build:740})[kind]||500,t);o.frequency.exponentialRampToValueAtTime(kind==='miss'?80:1100,t+.12);g.gain.setValueAtTime(.055,t);g.gain.exponentialRampToValueAtTime(.001,t+.18);o.connect(g);g.connect(audio.destination);o.start();o.stop(t+.2);}catch(e){}}
function appeal(){return 100+activeDecors().reduce((a,d)=>a+(catalog.find(c=>c.id===d.id)?.appeal||0),0)+activeGameEntries().reduce((a,[id])=>a+(state.levels[id]-1)*80,0);}
function activeChar(){return roster.find(n=>n.id===state.char)||roster[0];}
function bonus(){return 1+(appeal()-100)/300;}
function particles(x,y,color='#efcc65'){for(let i=0;i<10;i++)runtime.particles.push({x,y,vx:(Math.random()-.5)*115,vy:-35-Math.random()*75,life:1,color});}
function floating(x,y,text){runtime.floaters.push({x,y,text,life:1.8});}
function clearInput(){runtime.keys={};runtime.touch={};runtime.target=null;runtime.moving=false;if(runtime.arc){runtime.arc.braking=false;runtime.arc.charging=false;runtime.arc.charge=0;runtime.arc.chargeSource=null;renderChargeHud(runtime.arc);}}
function showModal(title,html,kind='generic'){runtime.lastFocus=document.activeElement;runtime.modal=kind;clearInput();$('modalTitle').textContent=title;$('modalBody').innerHTML=html;$('modal').classList.remove('hidden');$('modalClose').focus();}
function closeModal(){const old=runtime.modal;runtime.modal=null;runtime.npc=null;$('modal').classList.add('hidden');clearInput();if(old==='quit'&&runtime.arc?.phase==='paused')resumeArcade();runtime.lastFocus?.focus?.();}
function renderHud(){
  for(const k of ['coins','cp','trophies'])$(k).textContent=state[k].toLocaleString('ko-KR');
  $('islandLevel').textContent=`매력 ${appeal()} · 채집 ×${bonus().toFixed(2)}`;
  $('playerName').textContent=activeChar().name;
  $('playerPortrait').src=activeChar().img;
  $('rosterCountLabel').innerHTML=`나의 캐릭터${unlockedRoster().length>1?' · '+unlockedRoster().length+'명':''} &nbsp; ▾`;
  const w=currentWeather();
  $('weatherText').textContent=`${w.name} · ${w.desc}`;
  $('audioBtn').textContent=state.sound?'♪':'♩';
  $('audioBtn').setAttribute('aria-pressed',String(state.sound));
  $('discoveryCount').textContent=`발견한 장소 ${state.discovered.length} / ${regions.length}`;
  $('islandName').textContent=islands[state.island].name;
  $('stampCount').textContent=`${state.stamps.length} / ${Object.keys(games).length}`;
  $('stamps').innerHTML=Object.entries(games).map(([id,g])=>`<div class="stamp ${state.stamps.includes(id)?'earned':''}" title="${g.name}${state.stamps.includes(id)?' 클리어':' 미완료'}">${g.icon}</div>`).join('');
  $('stampCaption').textContent=`바나나 ${plazaProgress().count}/4 · 코브 ${coveStampCount()}/4 · 스노우 ${islandGameIds('snow').filter(id=>state.stamps.includes(id)).length}/3`;
  $('plazaOverviewBtn').textContent=state.island==='banana'?'🏆 광장 수첩 · 트로피와 기록':`🏆 ${islands[state.island].name} · 기록 수첩`;
  renderMission();
}
const missions=[
  {title:'섬의 작은 선물 찾기',desc:'반짝이는 바나나·조개·별, 또는 나무에서 자원 3개를 모아보세요.',type:'any_harvest',target:3,reward:'보상 🍌 30',coins:30},
  {title:'우리, 먼저 인사할까요?',desc:'미니맵의 친구에게 다가가 말을 걸어보세요. 각 구장의 전용 코치를 만나보세요.',type:'talk',target:1,reward:'보상 ⚡ 10',cp:10},
  {title:'마을 가구 체험하기',desc:'광장 주변의 벤치·꽃밭·분수 등 배치된 가구 앞에서 E 또는 Space를 눌러 체험해 보세요.',type:'decor_use',target:1,reward:'보상 🍌 35 + ⚡ 10',coins:35,cp:10},
  {title:'두근두근, 첫 스포츠 도전',desc:'새 구역을 발견하고 구장 입구에서 미니게임을 한 번 끝까지 즐겨보세요.',type:'played',target:1,reward:'보상 🍌 50',coins:50},
  {title:'첫 번째 챔피언 스탬프',desc:'미니게임 목표 점수를 달성해 첫 챔피언 스탬프를 모으세요!',type:'passed',target:1,reward:'보상 🏆 1',trophies:1}
];
function checkMissions(){
  let advanced=false;
  while(state.tutorial<missions.length){
    const m=missions[state.tutorial];
    if((state.history[m.type]||0)<m.target)break;
    state.coins+=m.coins||0;state.cp+=m.cp||0;state.trophies+=m.trophies||0;state.tutorial++;advanced=true;
    toast(`모험 미션 완료! ${m.reward}`);sound('win');
  }
  if(state.tutorial===missions.length&&!state.tutorialDone){
    state.tutorialDone=true;toast('모든 튜토리얼 완료! 세 섬을 여행하며 열한 개의 챔피언 스탬프를 모아보세요!');
  }
  if(advanced)dirty();
}
function renderMission(){
  const m=missions[state.tutorial];
  if(!m){
    $('missionStep').textContent='GRAND EXPLORER';
    $('missionTitle').textContent=state.stamps.length===Object.keys(games).length?'세 섬의 그랜드 챔피언!':'세 섬의 열한 스탬프 수집';
    $('missionDesc').textContent='⛴ 챔피언 코브의 양궁과 스노우 피크의 스키·피겨·태권도에 도전해 보세요.';
    $('missionBar').style.width=`${state.stamps.length/Object.keys(games).length*100}%`;
    $('missionProgress').textContent=`챔피언 스탬프 ${state.stamps.length} / ${Object.keys(games).length} · 세 섬의 스포츠 도전`;
    $('missionReward').textContent='전체 기록 달성 도전';
    return;
  }
  const n=Math.min(m.target,state.history[m.type]||0);
  $('missionStep').textContent=`0${state.tutorial+1} / 0${missions.length}`;
  $('missionTitle').textContent=m.title;
  $('missionDesc').textContent=m.desc;
  $('missionBar').style.width=`${n/m.target*100}%`;
  $('missionProgress').textContent=`진행 ${n} / ${m.target}`;
  $('missionReward').textContent=m.reward;
}
function questStatus(n){
  const last=state.questClaims[n.id]||{at:0,base:0};
  return {progress:Math.max(0,(state.history[n.questType]||0)-(Number(last.base)||0)),wait:Math.max(0,Math.ceil(((Number(last.at)||0)+60000-Date.now())/1000))};
}
function setSideHtml(box,html){
  if(box._html===html)return false;
  const f=document.activeElement,attr=f&&box.contains(f)?['data-npc','data-decor','data-upgrade-preview'].find(a=>f.hasAttribute(a)):null,key=attr?`[${attr}="${f.getAttribute(attr)}"]`:f&&box.contains(f)&&f.id?'#'+f.id:null;
  box.innerHTML=html;box._html=html;box._stable=null;if(key)box.querySelector(key)?.focus({preventScroll:true});return true;
}
function renderSidebar(){
  const box=$('sidePanel');
  if(runtime.tab==='quests'){
    const featured=activeNpcs();
    const html=featured.map(n=>{
      const q=questStatus(n);
      return `<div class="quest-row"><img class="portrait" src="${n.img}" alt="${n.name}"><div class="quest-info"><b>${n.name}</b><small>${n.questTitle}<br>${q.wait?`<span data-quest-wait="${n.id}">${q.wait}</span>초 후 새 심부름`:`${Math.min(q.progress,n.questTarget)} / ${n.questTarget} · 보상 45🍌 +${questRewardCP()}⚡`}</small></div><button class="pill-btn" data-npc="${n.id}">${q.progress>=n.questTarget&&!q.wait?'보상 받기':'찾아가기'}</button></div>`;
    }).join('');const stable=html.replace(/(data-quest-wait="[^"]+">)\d+/g,'$1');
    for(const el of box.querySelectorAll('[data-quest-wait]')){const t=String(questStatus(roster.find(n=>n.id===el.dataset.questWait)).wait);if(el.textContent!==t)el.textContent=t;}
    if(box._stable===stable)return;box._html=null;setSideHtml(box,html);box._stable=stable;
    box.querySelectorAll('[data-npc]').forEach(b=>b.onclick=()=>{const n=roster.find(n=>n.id===b.dataset.npc),q=questStatus(n);if(q.progress>=n.questTarget&&!q.wait)claimQuest(n);else locateNpc(n);});
  }else if(runtime.tab==='decor'){
    if(!setSideHtml(box,'<p class="hint">빈 곳을 누르면 배치, 놓인 가구를 누르면 회수해요. 배치된 가구 앞에서 <b>E / Space</b>를 누르면 특별 상호작용 보너스를 받아요!</p><div class="store-grid">'+catalog.map(c=>`<button class="store-item ${runtime.decor===c.id?'active':''}" data-decor="${c.id}"><span>${c.icon}</span><b>${c.name}</b><small>${c.cost} 🍌 · 매력 +${c.appeal}<br>${c.actionDesc}</small></button>`).join('')+'</div><button class="soft-btn wide" id="removeFurniture" style="margin-top:10px">가구 회수 모드</button>'))return;
    box.querySelectorAll('[data-decor]').forEach(b=>b.onclick=()=>setDecor(b.dataset.decor));
    $('removeFurniture').onclick=()=>setDecor('remove');
  }else{renderUpgradeCards(box);}
}
function setTab(tab){runtime.tab=tab;document.querySelectorAll('[data-tab]').forEach(b=>b.classList.toggle('active',b.dataset.tab===tab));renderSidebar();}
function claimQuest(n){
  const q=questStatus(n);
  if(q.wait)return toast(`${q.wait}초 뒤 다시 부탁할게요.`);
  if(q.progress<n.questTarget)return toast('심부름을 조금 더 진행해 주세요.');
  state.questClaims[n.id]={at:Date.now(),base:state.history[n.questType]};
  const cp=questRewardCP();
  state.coins+=45;state.cp+=cp;state.friendship[n.id]++;
  sound('win');toast(`심부름 완료! +45 🍌 +${cp} ⚡`);dirty();
  if(runtime.modal==='npc')openNpc(n.id,false);
}
function upgrade(id){
  if(runtime.mode!=='world')return toast('경기가 끝난 뒤 스테이션을 업그레이드할 수 있어요.');
  const lv=state.levels[id];if(lv>=3)return;
  const {coins:c,trophies:t}=upgradeCost(id);
  if(state.coins<c||state.trophies<t)return toast(`업그레이드에 ${c} 코인과 트로피 ${t}개가 필요해요.`,true);
  state.coins-=c;state.trophies-=t;state.levels[id]++;buildGround();runtime.stationReveal={id,life:2.4};
  sound('build');particles(games[id].door.x,games[id].door.y);
  const unlockedMessages={
    soccer:['불꽃 관통슛이 열렸어요.','멀티볼 피버와 챔피언 모드가 열렸어요.'],
    racket:['파워 스매시가 열렸어요.','황금 공 랠리와 챔피언 모드가 열렸어요.'],
    racing:['무적 대시가 열렸어요.','바나나 자석과 챔피언 모드가 열렸어요.'],
    space:['더블 점프와 제트팩이 열렸어요.','별 흡입 피버와 챔피언 모드가 열렸어요.'],cycling:['보호 스프린트와 커브 코스가 열렸어요.','역풍과 코브 챔피언 모드가 열렸어요.'],baseball:['집중 타격과 커브볼이 열렸어요.','강속구와 코브 챔피언 모드가 열렸어요.'],freekick:['표적 정지 스킬이 열렸어요.','수비벽과 황금 표적이 열렸어요.'],archery:['바람 코스와 집중 스킬이 열렸어요.','이동 과녁·황금 과녁과 챔피언 모드가 열렸어요.'],ski:['좁은 코너와 보호 활강이 열렸어요.','빙판 코스와 챔피언 모드가 열렸어요.'],figure:['빠른 박자와 리듬 집중이 열렸어요.','복합 연기와 챔피언 모드가 열렸어요.'],taekwondo:['연속 공방과 강한 반격이 열렸어요.','페인트 공격과 챔피언 모드가 열렸어요.']
  };
  toast(`${tierNames[lv]} 완성! 외형이 바뀌었어요. ${unlockedMessages[id]?.[lv-1]||'새로운 스킬과 기믹이 열렸어요.'}`);
  dirty();
  if(runtime.modal==='upgrade')openUpgrade(id,state.levels[id]);
  if(runtime.modal==='npc')openNpc(runtime.npc,false);
}
function locateNpc(n){if(!positions[n.id])return;if(islandOf(npcStation(n.id))!==state.island)switchIsland(islandOf(npcStation(n.id)));closeModal();pathTo(positions[n.id]);toast(`${n.name}에게 안내할게요. 장애물 앞에서는 방향키로 돌아가세요.`);}
function openNpc(id,count=true){
  if(runtime.mode!=='world')return;
  if(id==='atti')return openPlaza();
  const n=roster.find(n=>n.id===id),station=npcStation(id);if(!n||!station)return;
  if(count){state.history.talk++;checkMissions();sound('talk');dirty();}
  const q=questStatus(n),g=station.gameId?games[station.gameId]:null;
  const actions=g?`<button class="soft-btn primary" id="npcGame">${g.icon} ${g.name} · 10 CP</button><button class="soft-btn" id="npcUpgrade">스테이션 업그레이드 · Lv.${state.levels[station.gameId]}</button>`:`<button class="soft-btn primary" id="npcPlaza">🏆 광장 수첩</button><button class="soft-btn" id="npcMap">🧭 섬 지도 보기</button><button class="soft-btn" id="npcHelp">모험 안내</button>`;
  showModal(g?'구장의 담당 친구':'중앙 광장 매니저',`<div class="npc-intro"><img src="${n.img}" alt="${n.name}"><div><h3>${n.name}</h3><span class="npc-role">${n.role}</span><small>전용 코치 · ♥ 친밀도 ${state.friendship[id]}</small></div></div><div class="speech">“${g?n.quote:plazaProgress().complete?'네 종목의 트로피가 모두 모였어! 황금 분수를 함께 완성해줘서 고마워.':`지금 광장에는 ${plazaProgress().count}개의 트로피가 있어. 다음 도전을 함께 골라볼까?`}”</div>${g?'':plazaRecommendationHtml()}<p><b>📮 ${n.questTitle}</b><br>${q.wait?'다음 심부름까지 '+q.wait+'초':`진행 ${Math.min(q.progress,n.questTarget)} / ${n.questTarget}`} · 보상 45 🍌 +${questRewardCP()} ⚡</p><div class="dialog-actions"><button class="soft-btn" id="claimQuest" ${q.wait||q.progress<n.questTarget?'disabled':''}>심부름 보상</button><button class="soft-btn gold" id="npcQuiz">퀴즈 수첩 · ${g&&quizTopics[station.gameId]?quizCleared(station.gameId)+'/3단계':'네 가지 주제'}</button></div><div class="dialog-actions">${actions}</div>`,'npc');
  runtime.npc=id;
  $('claimQuest').onclick=()=>claimQuest(n);
  $('npcQuiz').onclick=()=>openQuiz(id);
  if(g){$('npcGame').onclick=()=>{closeModal();gameIntro(station.gameId);};$('npcUpgrade').onclick=()=>openUpgrade(station.gameId);}
  else{$('npcPlaza').onclick=openPlaza;$('npcMap').onclick=travelModal;$('npcHelp').onclick=help;bindPlazaRecommendation();}
}

function selectPlayer(id){
  if(!isCharUnlocked(id)){toast('이 친구는 스테이션을 담당하고 있어요.',true);return false;}
  state.char=id;dirty();sound('talk');closeModal();toast(`${activeChar().name}과 함께 모험을 출발해요!`);return true;
}
function unlockHint(id){return npcStation(id)?'스테이션 담당 친구':'플레이어 캐릭터';}
function characterModal(){
  const players=unlockedRoster();
  showModal('나의 캐릭터',`<p class="intro character-intro">함께 섬을 산책할 여행 친구예요.</p><div class="player-gallery">${players.map(n=>`<button class="playable-card ${state.char===n.id?'selected':''}" data-char="${n.id}" aria-pressed="${state.char===n.id}"><span class="playable-portrait"><img src="${n.img}" alt="${n.name}"></span><span class="playable-copy"><b>${n.name}</b><span>${n.role}</span><small>${perkText(n.id)||'세 섬을 함께 탐험해요.'}</small></span><em>${state.char===n.id?'선택됨':'선택'}</em></button>`).join('')}</div><details class="staff-guide"><summary tabindex="0">스테이션 담당 친구 <span>${worldNpcs.length}</span></summary><p>담당 친구들은 각 구장에서 만날 수 있어요.</p><div class="staff-grid">${worldNpcs.map(n=>`<article><img src="${n.img}" alt="${n.name}"><b>${n.name}</b><small>${n.role}</small></article>`).join('')}</div></details>`,'characters');
  $('modalBody').querySelectorAll('[data-char]').forEach(b=>b.onclick=()=>selectPlayer(b.dataset.char));
}
function questRewardCP(){return state.char==='atti'?20:15;}
function returnFromQuiz(id){if(id&&npcStation(id))openNpc(id,false);else openPlaza();}

function perkText(id){
  return {
    swimmer:'조개 채집 코인 +30% · 레이싱 시작 시 기본 보호막 부여',
    kicko:'축구 조준선 안정화 & 커브슛 보정 · 축구 보상 코인 +20%',
    curvy:'축구 불꽃 관통슛 재사용 대기시간 35% 감소 & 슛 속도 강화',
    tennis:'테니스 랠리 라켓 판정 범위 +25% 확대',
    baseball:'테니스 위너 보너스 점수 +30%',
    atti:'모든 주민 심부름 완료 보상 CP +5 추가 획득',
    astro:'모든 스테이션 업그레이드 비용 15% 할인 · 우주 점프 체공력 강화',
    cyclist:'섬 탐험 이동 속도 +20% · 레이싱 부스터 지속시간 +50%'
  }[id];
}
function travelModal(preview=state.island){
  if(!islands[preview])preview=state.island;
  const choices=regions.filter(r=>islandOf(r)===preview),totalBest=Object.values(state.best).reduce((sum,v)=>sum+(v||0),0);
  showModal('세 개의 섬, 열한 가지 도전',`<div class="island-map-tabs">${Object.entries(islands).map(([id,i])=>`<button class="soft-btn ${preview===id?'primary':''}" data-map-island="${id}">${i.icon} ${i.name}</button>`).join('')}</div><p class="intro">발견한 장소로 즉시 이동할 수 있어요. 세 섬의 도전 기록을 한곳에서 확인해요.</p><div class="grid2">${choices.map(r=>{const n=stations.find(n=>n.id===r.id),known=state.discovered.includes(r.id);return `<div class="region-card"><b>${r.icon} ${r.name}</b><p>${known?'발견한 장소':'산책으로 찾아보세요'}<br>${n?'담당 · '+roster.find(p=>p.id===n.npcId).name:'무료 왕복선 선착장'}</p><button class="soft-btn wide ${known?'primary':''}" data-travel="${r.id}" ${known?'':'disabled'}>${known?'여기로 이동':'아직 발견하지 못했어요'}</button></div>`;}).join('')}</div><button class="soft-btn wide" id="mapFerry" style="margin-top:12px">⛴ 섬 여행 · 왕복 무료</button>`,'map');
  $('modalBody').querySelectorAll('[data-map-island]').forEach(b=>b.onclick=()=>travelModal(b.dataset.mapIsland));$('mapFerry').onclick=openFerry;
  $('modalBody').querySelectorAll('[data-travel]').forEach(b=>b.onclick=()=>{const r=regions.find(r=>r.id===b.dataset.travel);if(!r||!state.discovered.includes(r.id))return;if(islandOf(r)!==state.island)return switchIsland(islandOf(r),r.arrival);state.player={...r.arrival};runtime.camera={...state.player};closeModal();dirty();});
}
function setDecor(id){
  if(runtime.mode!=='world')return;
  if(id==='remove'?runtime.removeDecor:runtime.decor===id&&!runtime.removeDecor){endDecor();return;}
  runtime.decor=id==='remove'?null:id;runtime.removeDecor=id==='remove';clearInput();
  $('decorBanner').classList.remove('hidden');
  $('decorBanner').textContent=id==='remove'?'♻ 회수할 가구를 클릭하세요 · Esc 종료':`${catalog.find(c=>c.id===id).icon} 빈 곳 클릭으로 배치 · 놓인 가구 클릭으로 회수`;
  $('decorateBtn').textContent='✓ 꾸미기 종료';setTab('decor');
}
function endDecor(){runtime.decor=null;runtime.removeDecor=false;$('decorBanner').classList.add('hidden');$('decorateBtn').textContent='🪴 꾸미기';renderSidebar();}
function validDecor(x,y){
  if(x<185||x>W-185||y<185||y>H-150)return false;
  if((state.island==='banana'&&(Math.hypot(x-960,y-670)<110||plazaSites().some(s=>Math.hypot(x-s.x,y-s.y)<60)))||(state.island!=='banana'&&Math.hypot(x-960,y-650)<125)||Math.hypot(x-islands[state.island].port.x,y-islands[state.island].port.y)<80)return false;
  if(activeGames().some(g=>x>g.building.x-35&&x<g.building.x+g.building.w+35&&y>g.building.y-30&&y<g.building.y+g.building.h+65))return false;
  if(activeTrees().some(t=>Math.hypot(t.x-x,t.y-y)<60))return false;
  if(activeNpcs().some(n=>Math.hypot(positions[n.id].x-x,positions[n.id].y-y)<60))return false;
  if(activeResources().some(n=>Math.hypot(n.x-x,n.y-y)<45))return false;
  if(activeDecors().some(n=>Math.hypot(n.x-x,n.y-y)<56))return false;
  if(Math.hypot(state.player.x-x,state.player.y-y)<48)return false;
  return true;
}
function placeDecor(pos){
  const x=Math.round(pos.x/50)*50,y=Math.round(pos.y/50)*50;
  const existing=state.decors.findIndex(d=>islandOf(d)===state.island&&Math.hypot(d.x-pos.x,d.y-pos.y)<40);
  if(runtime.removeDecor||existing!==-1){
    const i=existing;if(i<0)return toast('회수할 가구를 선택해 주세요.');
    const [d]=state.decors.splice(i,1),c=catalog.find(c=>c.id===d.id);
    const refund=Math.floor(c.cost*.8);state.coins+=refund;toast(`${c.name} 회수 · +${refund} 🍌`);dirty();return;
  }
  const c=catalog.find(c=>c.id===runtime.decor);if(!c)return;
  if(!validDecor(x,y))return toast('길목·건물·친구와 조금 떨어진 곳에 놓아주세요.',true);
  if(state.coins<c.cost)return toast('바나나 코인이 부족해요.',true);
  state.coins-=c.cost;state.decors.push({id:c.id,x,y,island:state.island});state.history.decor++;
  particles(x,y,'#83a878');sound('build');checkMissions();toast(`${c.name} 배치 · 섬 매력 +${c.appeal}`);dirty();
}
function blocked(x,y){
  if(x<174||x>W-174||y<174||y>H-115)return true;
  if(activeGames().some(g=>x>g.building.x-16&&x<g.building.x+g.building.w+16&&y>g.building.y+20&&y<g.building.y+g.building.h+12))return true;
  if((state.island==='banana'&&(Math.hypot(x-960,y-670)<60||plazaSites().some(s=>Math.abs(x-s.x)<27&&Math.abs(y-s.y)<18)))||(state.island!=='banana'&&Math.hypot(x-960,y-650)<48))return true;
  if(activeTrees().some(t=>Math.hypot(t.x-x,t.y-y)<26))return true;
  if(activeDecors().some(d=>Math.hypot(d.x-x,d.y-y)<(d.id==='bench'?27:20)))return true;
  return false;
}
function nearestAction(){
  const p=state.player,candidates=state.island==='banana'?[{kind:'plazaFountain',x:960,y:730,dist:hypot(p,{x:960,y:730})},...plazaSites().map(s=>({...s,kind:'plazaTrophy',dist:hypot(p,{x:s.x,y:s.y+25})}))]:[];
  if(state.island!=='banana')candidates.push({kind:'islandMonument',x:960,y:730,dist:hypot(p,{x:960,y:730})});
  const port=islands[state.island].port;candidates.push({kind:'ferry',...port,dist:hypot(p,port)});
  for(const r of activeResources())if(r.readyAt<=Date.now())candidates.push({...r,kind:'resource',dist:hypot(p,r)});
  for(const t of activeTrees())candidates.push({...t,kind:'tree',dist:hypot(p,t)});
  for(const n of activeNpcs()){
    if(n.id===state.char)continue;
    candidates.push({kind:'npc',id:n.id,...positions[n.id],dist:hypot(p,positions[n.id])});
  }
  for(const [id,g]of activeGameEntries())candidates.push({kind:'game',id,...g.door,dist:hypot(p,g.door)});
  activeDecors().forEach((d,idx)=>candidates.push({...d,idx,kind:'decor',dist:hypot(p,d)}));
  return candidates.filter(c=>c.dist<(c.kind==='npc'?105:c.kind.startsWith('plaza')?68:92)).sort((a,b)=>a.dist-b.dist)[0]||null;
}
function interactDecor(d){
  if(d.id==='arcade')return travelModal();
  const key=state.island+'_'+d.id+'_'+d.x+'_'+d.y;
  const readyAt=runtime.decorCooldowns[key]||0;
  if(readyAt>Date.now()){
    return toast(`방금 체험한 가구예요. ${Math.ceil((readyAt-Date.now())/1000)}초 뒤에 다시 이용해 보세요!`);
  }
  runtime.decorCooldowns[key]=Date.now()+20000;
  state.history.decor_use=(state.history.decor_use||0)+1;
  const c=catalog.find(item=>item.id===d.id);
  let coinGain=0,cpGain=0;
  if(d.id==='bench'){cpGain=12;}
  else if(d.id==='fountain'){coinGain=25;}
  else if(d.id==='goal'){coinGain=15;}
  else if(d.id==='trophy_stand'){cpGain=15;}
  else if(d.id==='hammock'){coinGain=10;cpGain=10;}
  else if(d.id==='lamp'){cpGain=6;}
  else{coinGain=10;}
  state.coins+=coinGain;state.cp+=cpGain;
  sound('collect');particles(d.x,d.y,'#f2d572');
  floating(d.x,d.y-32,(coinGain?`+${coinGain} 🍌 `:'')+(cpGain?`+${cpGain} ⚡`:''));
  checkMissions();dirty();
}
function interact(){
  if(runtime.mode!=='world'||runtime.modal||runtime.decor||runtime.removeDecor)return;
  const time=performance.now();if(time-runtime.lastInteract<280)return;runtime.lastInteract=time;
  const a=nearestAction();
  if(!a)return toast('반짝이는 자원, 가구, 또는 친구에게 조금 더 다가가세요.');
  if(a.kind==='islandMonument')return islandPassport(state.island);
  if(a.kind==='ferry')return openFerry();
  if(a.kind==='plazaFountain')return openPlaza();
  if(a.kind==='plazaTrophy')return openPlazaRecord(a.id);
  if(a.kind==='npc')return openNpc(a.id);
  if(a.kind==='game')return gameIntro(a.id);
  if(a.kind==='decor')return interactDecor(a);
  if(a.kind==='tree'){
    const tree=trees.find(t=>t.id===a.id);
    if(tree.readyAt>Date.now())return toast(`나무가 쉬고 있어요. ${Math.ceil((tree.readyAt-Date.now())/1000)}초 뒤에 다시 만나요.`);
    const cd=currentWeather().id==='rain'?18000:30000;
    tree.readyAt=Date.now()+cd;harvest('banana',tree,14,5);return;
  }
  const r=resources.find(r=>r.id===a.id);
  r.readyAt=Date.now()+(currentWeather().id==='rain'?30000:45000);
  harvest(r.type,r,{banana:18,shell:20,star:24}[r.type],{banana:6,shell:6,star:7}[r.type]);
}
function harvest(type,pos,coin,cp){
  const w=currentWeather();
  const weatherBoost=w.bonusType===type?w.mult:1;
  const c=Math.round(coin*bonus()*weatherBoost*(type==='shell'&&state.char==='swimmer'?1.3:1));
  state.coins+=c;state.cp+=cp;state.history[type]++;state.history.any_harvest++;
  sound('collect');particles(pos.x,pos.y);
  floating(pos.x,pos.y-30,`+${c} 🍌  +${cp} ⚡`);
  checkMissions();dirty();
}
function survivalNote(id){return id==='racing'||id==='space'?' · 하트 3개 · 쉴드 아이템 방어 가능 · 25초 생존 시 클리어':'';}



function gameIntro(id){
  const g=games[id],lv=state.levels[id],guide=introGuides[id],canChamp=championOpen(id);
  runtime.champMode=Boolean(runtime.champMode&&canChamp);
  showModal(`${g.icon} ${g.name}`,`<div class="game-intro">
    <div class="intro-heading"><span class="intro-level">Lv.${lv} · ${tierNames[lv-1]}</span><p>${guide.brief}</p></div>
    <div class="mode-toggle intro-tabs" role="tablist" aria-label="도전 모드">
      <button type="button" id="modeNormal" role="tab" aria-controls="introModePanel">일반 모드</button>
      <button type="button" id="modeChamp" role="tab" aria-controls="introModePanel" ${canChamp?'':'disabled'}>챔피언 모드${canChamp?'':'<span class="intro-lock" aria-hidden="true">🔒</span>'}</button>
    </div>
    <p class="intro-mode-hint" id="introModeHint"></p>
    <section id="introModePanel" class="intro-mode-panel" role="tabpanel" tabindex="0">
      <dl class="intro-facts"><div><dt>목표 점수</dt><dd><b id="introTarget"></b><small>${scoreUnit(id)}</small></dd></div><div><dt>제한 시간</dt><dd><b>25</b><small>초</small></dd></div><div><dt>입장 비용</dt><dd><b>10</b><small>CP</small></dd></div></dl>
      <p class="intro-rule">${g.rule|| (usesHealth({id})?'하트 3개 · 목표 점수를 달성하고 끝까지 생존하세요.':'제한 시간 안에 목표 점수를 달성하면 클리어해요.')}</p>
    </section>
    <section class="intro-controls"><h3>이렇게 플레이해요</h3>${guide.controls.map(([key,label,skill])=>`<div class="intro-control-row"><kbd>${key}</kbd><span>${label}${skill&&lv<2?'<small class="intro-skill-lock">Lv.2 해금</small>':''}</span></div>`).join('')}<p class="intro-tip">${guide.tip}</p></section>
${id==='taekwondo'?'<div class="taek-intro-flow"><span>1 공격 확인</span><span>2 ↑ / ↓ 방어</span><span>3 ↑·Space 3연타</span></div><button class="soft-btn wide taek-practice-btn" id="taekPractice">처음이라면 조작 연습 · 무료</button>':''}
    <div class="intro-records"><span>선택 모드 최고 <b id="introBest"></b></span><span>종합 최고 <b>${state.best[id]||0}${scoreUnit(id)}</b></span></div>
    <button class="soft-btn primary wide intro-start" id="startGame" ${state.cp<10?'disabled':''}></button>
    <p class="intro-balance">${state.cp<10?'CP가 부족해요. 채집하거나 벤치에서 쉬어보세요.':`보유 ${state.cp} CP · 모드를 바꿔 목표와 기록을 비교해 보세요.`}</p>
  </div>`,'game');
  const normal=$('modeNormal'),champ=$('modeChamp');
  function selectMode(selected){
    runtime.champMode=Boolean(selected&&canChamp);
    for(const [button,active]of [[normal,!runtime.champMode],[champ,runtime.champMode]]){button.classList.toggle('active',active);button.setAttribute('aria-selected',String(active));button.tabIndex=active?0:-1;}
    $('introModePanel').setAttribute('aria-labelledby',runtime.champMode?'modeChamp':'modeNormal');
    $('introTarget').textContent=runtime.champMode?g.champTarget:g.targets[lv-1];
    $('introBest').textContent=modeBest(id,lv,runtime.champMode)+scoreUnit(id);
    $('introModeHint').textContent=!canChamp?`챔피언 모드는 Lv.3 또는 이 섬의 스탬프 ${islandGameIds(islandOf(g)).length}개를 모으면 열려요.`:runtime.champMode?'더 빠른 경기와 높은 목표 · 기본 보상 ×1.6':'기본 속도로 즐기는 도전 · 기본 보상 ×1.0';
    $('startGame').textContent=`${runtime.champMode?'챔피언':'일반'} 모드 시작 · 10 CP`;
  }
  normal.onclick=()=>selectMode(false);champ.onclick=()=>selectMode(true);
  normal.onkeydown=champ.onkeydown=e=>{
    if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.code))return;e.preventDefault();
    const next=canChamp&&(e.code==='End'||e.code!=='Home'&&!runtime.champMode);selectMode(next);(next?champ:normal).focus();
  };
  selectMode(runtime.champMode);
  $('startGame').onclick=()=>{closeModal();startArcade(id);};
  if($('taekPractice'))$('taekPractice').onclick=()=>{closeModal();startArcade('taekwondo',{practice:true});};
}

const canvas=$('world'),ctx=canvas.getContext('2d'),mini=$('minimap').getContext('2d'),arcCanvas=$('arcadeCanvas'),ac=arcCanvas.getContext('2d');
const ARC_W=960,ARC_H=540;
function sizeArcCanvas(){const d=Math.min(window.devicePixelRatio||1,2);if(arcCanvas.width!==ARC_W*d){arcCanvas.width=ARC_W*d;arcCanvas.height=ARC_H*d;}ac.setTransform(d,0,0,d,0,0);}
sizeArcCanvas();
let view={w:1000,h:650,dpr:1};const images={};for(const n of roster){const img=new Image();img.src=n.img;images[n.id]=img;}
function rr(c,x,y,w,h,r,fill,stroke){c.beginPath();c.roundRect(x,y,w,h,r);if(fill){c.fillStyle=fill;c.fill();}if(stroke){c.strokeStyle=stroke;c.lineWidth=1.5;c.stroke();}}
function ellipse(c,x,y,rx,ry,fill){c.fillStyle=fill;c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.fill();}
function line(c,points,color,width){c.strokeStyle=color;c.lineWidth=width;c.lineCap='round';c.lineJoin='round';c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.stroke();}
function text(c,str,x,y,size=14,color='#36533a',align='center',weight=600){c.font=`${weight} ${size}px "World Sans","World Sans","Apple SD Gothic Neo","Malgun Gothic",system-ui,"World Emoji",sans-serif`;c.textAlign=align;c.textBaseline='middle';c.fillStyle=color;c.fillText(str,x,y);}
function seed(i){const x=Math.sin(i*127.1+311.7)*43758.5453;return x-Math.floor(x);}
function drawFlower(c,x,y,color='#f7e4b9',s=1){for(let i=0;i<5;i++){const a=i*Math.PI*2/5;ellipse(c,x+Math.cos(a)*4*s,y+Math.sin(a)*4*s,3*s,3*s,color);}ellipse(c,x,y,2*s,2*s,'#d9ad53');}
function drawTree(c,t,now){
  const{x,y}=t;ellipse(c,x+7,y+5,43,15,'#3d724426');
  if(t.palm){
    line(c,[[x,y],[x-5,y-52],[x+5,y-93]],'#ab8e5c',13);line(c,[[x-2,y-2],[x-8,y-55]],'#c7a56c',5);
    for(let i=0;i<6;i++){const a=i*Math.PI/3;const ex=x+Math.cos(a)*62,ey=y-92+Math.sin(a)*27;c.strokeStyle=i%2?'#4b8f66':'#67a578';c.lineWidth=14;c.beginPath();c.moveTo(x+4,y-92);c.quadraticCurveTo(x+Math.cos(a)*35,y-130+Math.sin(a)*30,ex,ey);c.stroke();}
    ellipse(c,x,y-91,10,9,'#728a45');
  }else{
    rr(c,x-8,y-57,16,63,6,'#a28b59');line(c,[[x,y-15],[x+3,y-45]],'#bba276',5);
    ellipse(c,x-24,y-63,34,29,'#54834f');ellipse(c,x+23,y-66,35,30,'#588a51');ellipse(c,x,y-86,40,35,'#6f9c5e');ellipse(c,x-12,y-97,25,22,'#80ab6d');ellipse(c,x+25,y-83,15,15,'#709f5c');
  }
  if(t.readyAt<=Date.now()){text(c,'🍌',x+18,y-(t.palm?78:65),20);if(hypot(state.player,t)<100)text(c,'✦',x-27,y-85,18,'#fff2aa');}
  else if(hypot(state.player,t)<130){rr(c,x-25,y-115,50,19,8,'#fffae7df');text(c,Math.ceil((t.readyAt-Date.now())/1000)+'s',x,y-106,10,'#78916b');}
}
function drawFurniture(c,d,ghost=false){
  const{x,y}=d;c.save();if(ghost)c.globalAlpha=.65;ellipse(c,x+4,y+5,28,9,'#34523b20');
  if(d.id==='flower'){rr(c,x-26,y-17,52,32,10,'#8eaa6a');for(let i=0;i<6;i++)drawFlower(c,x-18+(i%3)*18,y-9+Math.floor(i/3)*15,['#f5e6b6','#eab5a8','#fff5d8'][i%3],.9);}
  else if(d.id==='bench'){rr(c,x-29,y-11,58,17,5,'#b99b6e');rr(c,x-29,y-25,58,10,4,'#cdb382');line(c,[[x-21,y+3],[x-23,y+14]],'#6f775b',4);line(c,[[x+21,y+3],[x+23,y+14]],'#6f775b',4);}
  else if(d.id==='lamp'){line(c,[[x,y],[x,y-55]],'#5a6e58',5);rr(c,x-13,y-69,26,25,6,'#f1d99a','#a98f59');rr(c,x-16,y-74,32,7,3,'#6d7b59');ellipse(c,x,y-57,6,8,'#fff0b3');if(currentWeather().id==='night'||currentWeather().id==='sunset')ellipse(c,x,y-52,32,26,'#ffe89444');}
  else if(d.id==='goal'){line(c,[[x-25,y],[x-25,y-28],[x+25,y-28],[x+25,y]],'#f5f1dd',5);for(let i=0;i<5;i++)line(c,[[x-23+i*11,y-27],[x-23+i*11,y]],'#e8e8d3',1);line(c,[[x-25,y-14],[x+25,y-14]],'#f5f1dd',1);}
  else if(d.id==='arcade'){rr(c,x-19,y-47,38,54,5,'#d3b16e','#937951');rr(c,x-14,y-40,28,25,3,'#344f53');text(c,'★',x,y-27,17,'#edd37c');rr(c,x-14,y-10,28,8,2,'#708667');}
  else if(d.id==='fountain'){ellipse(c,x,y,32,17,'#c7c5ac');ellipse(c,x,y-3,26,12,'#8bc3bd');line(c,[[x,y-5],[x,y-33]],'#ddd1a6',9);text(c,'🍌',x,y-41,26);}
  else if(d.id==='trophy_stand'){rr(c,x-25,y-17,50,28,5,'#a9b599');rr(c,x-12,y-31,24,18,4,'#c2cdb1');text(c,'🏆',x,y-45,29);}
  else{line(c,[[x,y],[x,y-52]],'#a38d69',4);c.fillStyle='#eac57f';c.beginPath();c.arc(x,y-52,34,Math.PI,Math.PI*2);c.closePath();c.fill();line(c,[[x-32,y-52],[x+32,y-52]],'#f5dca0',4);}
  c.restore();
}
const ground=document.createElement('canvas');ground.width=W;ground.height=H;const gc=ground.getContext('2d');
function buildGround(){
  if(state.island==='snow'){buildSnowGround();return;}
  if(state.island==='cove'){buildCoveGround();return;}
  gc.fillStyle='#84bdb4';gc.fillRect(0,0,W,H);
  for(let i=0;i<120;i++){const x=seed(i+77)*W,y=seed(i+190)*H;line(gc,[[x,y],[x+18,y],[x+27,y-3]],'#add3c633',2);}
  rr(gc,99,109,W-198,H-170,135,'#b4d7c2');rr(gc,119,126,W-238,H-200,125,'#e8d4a3');rr(gc,155,156,W-310,H-245,100,'#b2c88a');rr(gc,167,165,W-334,H-270,95,'#b8cd90');
  for(let i=0;i<1000;i++){const x=190+seed(i)*1540,y=190+seed(i+2000)*940;if(i%5===0)drawFlower(gc,x,y,['#f8ebbb','#f1d2b2','#dbe5ba'][i%3],.5);else{line(gc,[[x,y+3],[x+2,y-1],[x+4,y+3]],i%2?'#8ca9704a':'#d0de9d77',1);}}
  const roads=[[[480,435],[480,575],[960,575],[960,1080]],[[485,1015],[485,1080],[1435,1080],[1435,1015]],[[960,575],[1465,575],[1465,445]],[[480,575],[480,740],[960,740],[1435,740],[1435,1080]]];
  for(const road of roads){line(gc,road,'#a6b97b',54);line(gc,road,'#e0cba0',46);line(gc,road,'#e8d6b2',38);}
  rr(gc,775,570,410,310,50,'#a4b480');rr(gc,785,578,390,290,43,'#dedbc4');
  for(let x=797;x<1160;x+=32)for(let y=590;y<862;y+=26)rr(gc,x,y,29,23,4,(x+y)%3?'#e9e6d3':'#d4d4bb');
  for(const b of [{x:735,y:575},{x:1180,y:575},{x:790,y:840},{x:1155,y:875},{x:1390,y:1140},{x:395,y:740},{x:1690,y:575}]){ellipse(gc,b.x,b.y,32,17,'#89a76b');ellipse(gc,b.x-16,b.y-7,18,16,'#95b575');ellipse(gc,b.x+12,b.y-5,20,17,'#9bb878');drawFlower(gc,b.x+6,b.y-12,'#f2ddaf',.7);}
  for(let i=0;i<8;i++){const x=205+i*205;ellipse(gc,x,1171+(i%2)*8,13,6,'#c1b995');}
  rr(gc,1440,1112,75,126,6,'#c4a279');for(let y=1120;y<1230;y+=13)line(gc,[[1443,y],[1512,y]],'#b29168',2);line(gc,[[1445,1110],[1445,1228]],'#d8bc91',5);line(gc,[[1510,1110],[1510,1228]],'#d8bc91',5);
  for(const [id,g]of activeGameEntries())drawStadium(gc,id,g);
}
// The same renderer drives the island, minimap and upgrade appearance preview.



function stadiumLight(c,x,y,level){
  line(c,[[x,y+24],[x,y-12]],'#526d68',4);rr(c,x-12,y-19,24,12,3,'#657c79','#dbe6cb');
  for(let i=0;i<3;i++)rr(c,x-9+i*7,y-16,5,5,1,level===3?'#ffe4a0':'#f4efc9');
}
function stadiumSeats(c,x,y,w,rows,color){
  rr(c,x,y,w,rows*9+6,5,'#687d73');
  for(let r=0;r<rows;r++)for(let i=0;i<Math.max(1,Math.floor((w-10)/13));i++)rr(c,x+6+i*13,y+4+r*9,9,5,2,(i+r)%3===0?'#efe2b2':color);
}
function stadiumFlag(c,x,y,color){line(c,[[x,y],[x,y-25]],'#637a65',2);c.fillStyle=color;c.beginPath();c.moveTo(x,y-25);c.lineTo(x+18,y-21);c.lineTo(x,y-15);c.closePath();c.fill();}
function stadiumBoard(c,x,y,label,level){
  line(c,[[x-18,y+15],[x-18,y+27]],'#586f68',4);line(c,[[x+18,y+15],[x+18,y+27]],'#586f68',4);
  rr(c,x-48,y-3,96,28,6,level===3?'#d4b55e':'#77938b');rr(c,x-43,y+1,86,20,3,'#304f50');
  text(c,label,x,y+11,10,level===3?'#ffe6a4':'#e6f0cc','center',800);
}
function drawCoastGate(c,x,top,bottom,label,gold,right=false){
  const frame=gold?'#c9a351':'#6f9284',light=gold?'#f3dfa0':'#e0ebd0';
  for(const yy of [top,bottom]){ellipse(c,x+2,yy+3,10,5,'#526c5428');rr(c,x-7,yy-5,14,11,3,frame);rr(c,x-4,yy-7,8,6,2,light);}
  line(c,[[x,top],[x,bottom]],frame,5);line(c,[[x-1,top+4],[x-1,bottom-4]],light,2);
  c.save();c.translate(x+(right?9:-9),(top+bottom)/2);c.rotate(-Math.PI/2);
  rr(c,-29,-8,58,16,4,frame);text(c,label,0,0,8,gold?'#fff3c7':'#f3f6df','center',800);c.restore();
}
function drawCoastTrack(c,x,y,w,h,level){
  const pro=level>=2,master=level===3,tx=x+38,ty=y+30,tw=w-76,th=h-48,lh=th/3;
  const colors=master?['#8fab79','#d9be89','#65a5aa']:['#a4b686','#e5cda0','#79b4b7'];
  // Three land-to-coast lanes match the actual runner. Props stay along the outer rim.
  c.save();c.beginPath();c.roundRect(tx,ty,tw,th,12);c.clip();
  for(let lane=0;lane<3;lane++){
    c.fillStyle=colors[lane];c.fillRect(tx,ty+lane*lh,tw,lh);
    for(let i=0;i<4;i++){
      const px=tx+51+i*39,py=ty+(lane+.5)*lh;
      if(lane===0){line(c,[[px-3,py+2],[px-1,py-2],[px+2,py+2]],'#78935d55',1);}
      else if(lane===1){ellipse(c,px,py+2,1.3,1.1,'#b99f6b77');ellipse(c,px+7,py-3,1,1,'#f9e9bd');}
      else{c.strokeStyle='#c5e3d588';c.lineWidth=1.5;c.beginPath();c.moveTo(px-7,py);c.quadraticCurveTo(px-3,py-3,px+1,py);c.quadraticCurveTo(px+5,py+3,px+9,py);c.stroke();}
    }
    text(c,String(lane+1),tx+14,ty+(lane+.5)*lh,11,'#f8f4da','center',800);
  }
  for(let lane=1;lane<3;lane++){c.save();c.setLineDash([8,7]);line(c,[[tx,ty+lane*lh],[tx+tw,ty+lane*lh]],'#fbf5d5b3',1.5);c.restore();}
  for(const finish of [false,true])for(let i=0;i<Math.ceil(th/7);i++){
    const bx=finish?tx+tw-9:tx+27;rr(c,bx,ty+i*7,4,7,0,i%2?'#fbf5d6':'#63816c');rr(c,bx+4,ty+i*7,4,7,0,i%2?'#63816c':'#fbf5d6');
  }
  c.restore();
  c.strokeStyle=master?'#b39d5f':'#8ba184';c.lineWidth=1.5;c.beginPath();c.roundRect(tx,ty,tw,th,12);c.stroke();
  // Entry deck and side rails share the original building footprint.
  for(const xx of [x+13,x+w-29]){rr(c,xx,y+h-30,16,40,4,'#c9b185');for(let j=0;j<4;j++)line(c,[[xx+2,y+h-24+j*8],[xx+14,y+h-24+j*8]],'#b49d75',1);}
  if(pro){
    stadiumSeats(c,x+48,y-3,w-96,2,master?'#ddc47e':'#a3c2a1');
    drawCoastGate(c,x+32,ty-4,ty+th+4,'START',master);
    if(master){
      drawCoastGate(c,x+w-32,ty-4,ty+th+4,'FINISH',true,true);
      const best=state.best.racing||0,label=best>99999?(best/1000).toFixed(1)+'K':String(best);
      stadiumBoard(c,x+w/2,y-32,'BEST '+label,3);
      stadiumLight(c,x+5,y+8,3);stadiumLight(c,x+w-5,y+8,3);
      stadiumFlag(c,x+53,y-4,'#d8b657');stadiumFlag(c,x+w-69,y-4,'#d8b657');
    }else{
      stadiumFlag(c,x+w-23,y+5,'#8fb7a3');
    }
  }else{
    for(const xx of [x+18,x+w-23])for(let i=0;i<3;i++)rr(c,xx,y+42+i*29,5,14,2,'#b7a17a');
  }
}

function drawStadium(c,id,g,level=state.levels[id]){
  if(isExpansionGame(id))return drawExpansionStation(c,id,g,level);
  if(isCoveGame(id))return drawCoveStation(c,id,g,level);
  const {x,y,w,h}=g.building,l=clamp(level,1,3),pro=l>=2,master=l===3;
  const rim=master?'#c6ad62':pro?'#6e8b83':'#93a17b',base=master?'#e8dfba':pro?'#d1dcd0':'#d5d2ad';
  c.save();
  rr(c,x+8,y+13,w,h,21,'#44664425');rr(c,x-6,y-6,w+12,h+12,23,rim);rr(c,x,y,w,h,18,base);
  if(id==='soccer'){
    const inset=pro?26:13;
    rr(c,x+inset,y+inset,w-inset*2,h-inset*2,10,master?'#518e72':'#79a36a');
    for(let i=0;i<6;i++)rr(c,x+inset+2+i*(w-inset*2)/6,y+inset+2,(w-inset*2)/12,h-inset*2-4,0,'#b6d59038');
    c.strokeStyle='#edf1cf';c.lineWidth=2;c.strokeRect(x+inset+10,y+inset+8,w-inset*2-20,h-inset*2-16);
    line(c,[[x+w/2,y+inset+8],[x+w/2,y+h-inset-8]],'#edf1cf',2);
    c.beginPath();c.arc(x+w/2,y+h/2,22,0,Math.PI*2);c.stroke();
    c.strokeRect(x+inset+10,y+h/2-21,26,42);c.strokeRect(x+w-inset-36,y+h/2-21,26,42);
    if(!pro){for(let i=0;i<8;i++)rr(c,x+20+i*32,y-10,22,10,3,i%2?'#d6ae7c':'#a9bb88');stadiumFlag(c,x+18,y+h-12,'#e0b878');stadiumFlag(c,x+w-20,y+h-12,'#e0b878');}
    else{
      stadiumSeats(c,x+16,y+1,w-32,2,master?'#80acac':'#8eaf8b');stadiumSeats(c,x+16,y+h-24,w-32,2,master?'#80acac':'#8eaf8b');
      stadiumBoard(c,x+w/2,y-25,master?'CHAMPIONS':'HOME  0 : 0',l);
      for(const dx of [6,w-6]){stadiumLight(c,x+dx,y+12,l);stadiumLight(c,x+dx,y+h-16,l);}
      if(master){
        for(const yy of [y-8,y+h-21]){c.fillStyle='#f2e8c7';c.beginPath();c.moveTo(x+20,yy+7);c.quadraticCurveTo(x+w/2,yy-32,x+w-20,yy+7);c.lineTo(x+w-28,yy+14);c.quadraticCurveTo(x+w/2,yy-12,x+28,yy+14);c.closePath();c.fill();line(c,[[x+26,yy+8],[x+w-26,yy+8]],'#bc9d54',2);}
        stadiumBoard(c,x+w/2,y-35,'CHAMPIONS',l);text(c,'🏆',x+w/2,y+h-7,20);
      }
    }
  }else if(id==='racket'){
    const court=master?'#568da2':pro?'#639c95':'#bf916e',edge=pro?26:13;
    rr(c,x+edge,y+12,w-edge*2,h-24,10,court);
    c.strokeStyle='#f4eccf';c.lineWidth=2;c.strokeRect(x+edge+18,y+24,w-edge*2-36,h-48);
    line(c,[[x+w/2,y+24],[x+w/2,y+h-24]],'#f4eccf',3);line(c,[[x+edge+18,y+h/2],[x+w-edge-18,y+h/2]],'#f4eccf',2);
    c.strokeRect(x+edge+47,y+24,w-edge*2-94,h-48);
    for(let j=0;j<8;j++)line(c,[[x+w/2-3,y+23+j*16],[x+w/2+3,y+23+j*16]],'#536e60',1);
    if(!pro){rr(c,x+5,y+37,15,45,3,'#ae946d');rr(c,x+w-20,y+85,15,45,3,'#ae946d');}
    else{
      for(const dx of [3,w-23]){stadiumSeats(c,x+dx,y+33,20,10,master?'#d7c68a':'#a0bc9c');rr(c,x+dx-3,y+19,26,13,4,master?'#f1deb0':'#f1e8c6');}
      stadiumBoard(c,x+w/2,y-24,master?'CENTER COURT':'SET  0 : 0',l);
      stadiumLight(c,x+5,y+8,l);stadiumLight(c,x+w-5,y+8,l);
      if(master){
        for(const dx of [0,w-40]){c.fillStyle='#ece3c2';c.beginPath();c.moveTo(x+dx-5,y+31);c.quadraticCurveTo(x+dx+20,y-7,x+dx+45,y+31);c.lineTo(x+dx+42,y+h-12);c.quadraticCurveTo(x+dx+20,y+h-30,x+dx-2,y+h-12);c.closePath();c.fill();line(c,[[x+dx+19,y+24],[x+dx+19,y+h-20]],'#bda05f',2);}
        stadiumFlag(c,x+52,y-3,'#dfc36f');stadiumFlag(c,x+w-67,y-3,'#dfc36f');text(c,'🏆',x+w/2,y+h-5,19);
      }
    }
  }else if(id==='racing'){
    drawCoastTrack(c,x,y,w,h,l);
  }else{
    rr(c,x+18,y+45,w-36,h-52,15,master?'#8ca7b2':pro?'#a1b6b6':'#b6b6bd');
    rr(c,x+45,y+70,w-90,h-80,6,master?'#c1d7d3':'#ded9c9');
    const radius=pro?89:77,cx=x+w/2,dy=y+82;
    c.fillStyle=master?'#527b92':pro?'#71999f':'#8f9ba4';c.beginPath();c.arc(cx,dy,radius,Math.PI,Math.PI*2);c.fill();
    c.fillStyle=master?'#8db9bf':pro?'#a5c8c3':'#aebcc0';c.beginPath();c.arc(cx-10,dy,radius*.75,Math.PI,Math.PI*1.82);c.fill();
    line(c,[[cx,dy-radius+4],[cx,dy]],pro?'#dbe5cb':'#85969c',3);
    line(c,[[cx+15,y+16],[cx+49,y-8]],'#687b7f',12);
    rr(c,cx-25,y+120,50,75,8,'#657b7d');rr(c,cx-18,y+130,36,51,6,'#9bc2b7');
    if(!pro){text(c,'✦',x+40,y+108,24,'#e3d799');text(c,'✦',x+w-36,y+108,24,'#e3d799');}
    else{
      for(const dx of [2,w-43]){rr(c,x+dx,y+86,41,63,4,'#557c96','#c3d9c9');for(let j=1;j<4;j++)line(c,[[x+dx+2,y+86+j*15],[x+dx+39,y+86+j*15]],'#8ebbc6',1);line(c,[[x+dx+20,y+88],[x+dx+20,y+147]],'#8ebbc6',1);}
      line(c,[[x+w-28,y+34],[x+w-28,y-17]],'#687f87',4);ellipse(c,x+w-28,y-18,13,6,'#e3e4c6');line(c,[[x+w-34,y-18],[x+w-17,y-31]],'#637f86',3);
      rr(c,x+66,y+99,w-132,17,5,'#385d67');text(c,master?'MISSION CONTROL':'STAR LAB',cx,y+108,9,'#cce7d2','center',800);
      if(master){
        c.strokeStyle='#ddc676';c.lineWidth=5;c.beginPath();c.ellipse(cx,dy-5,104,30,-.16,Math.PI*.96,Math.PI*2.06);c.stroke();
        const rx=x+39,ry=y+50;rr(c,rx-25,ry+54,50,12,4,'#6c8185');
        rr(c,rx-12,ry-10,24,67,12,'#f2ecd6','#b6b69f');c.fillStyle='#dfb56b';c.beginPath();c.moveTo(rx-12,ry+1);c.lineTo(rx,ry-25);c.lineTo(rx+12,ry+1);c.fill();
        ellipse(c,rx,ry+14,6,8,'#74acb7');line(c,[[rx-13,ry+32],[rx-23,ry+54],[rx-11,ry+48]],'#c1a45d',6);line(c,[[rx+13,ry+32],[rx+23,ry+54],[rx+11,ry+48]],'#c1a45d',6);
        for(let j=0;j<3;j++)rr(c,x+w-57+j*14,y+163,9,13,2,'#d9d19c');
      }
    }
  }
  if(master){
    stadiumFlag(c,x+5,y+1,'#dfbe66');stadiumFlag(c,x+w-22,y+1,'#dfbe66');
    for(const dx of [12,w-13])text(c,'✦',x+dx,y+h-8,12,'#f8e7a6');
  }
  rr(c,x+w/2-95,y+h+7,190,36,10,master?'#f8edc3':'#fff8df',master?'#c7aa58':'#c8c7a5');
  text(c,g.icon+' '+g.name,x+w/2,y+h+19,11,'#4b6859','center',800);
  text(c,`Lv.${l} · ${tierNames[l-1]}`,x+w/2,y+h+33,8,master?'#92702d':'#849078');
  c.restore();
}
function renderStationPreview(id,level){
  const el=$('stationLookCanvas');if(!el)return;
  el.dataset.stationId=id;el.dataset.level=String(level);
  el.setAttribute('aria-label',`${games[id].name} Lv.${level} · ${stationLooks[id][level-1]}`);
  const c=el.getContext('2d'),g=games[id],w=el.width,h=el.height;
  c.clearRect(0,0,w,h);rr(c,0,0,w,h,18,'#e9eedf');
  for(let i=0;i<18;i++)ellipse(c,20+seed(i+8)*(w-40),20+seed(i+31)*(h-40),2,2,'#d0dcbf');
  const scale=Math.min((w-75)/(g.building.w+30),(h-50)/(g.building.h+110));
  c.save();c.translate((w-g.building.w*scale)/2,62*scale);c.scale(scale,scale);
  drawStadium(c,id,{...g,building:{...g.building,x:0,y:0}},level);c.restore();
  $('stationLookCaption').textContent=`${level===state.levels[id]?'현재 외형':level>state.levels[id]?'업그레이드 후 외형':'이전 단계 외형'} · ${stationLooks[id][level-1]}`;
  document.querySelectorAll('[data-look-level]').forEach(b=>{const selected=Number(b.dataset.lookLevel)===level;b.classList.toggle('active',selected);b.setAttribute('aria-pressed',String(selected));b.onclick=()=>renderStationPreview(id,Number(b.dataset.lookLevel));});
}
function drawStationAtmosphere(c,now){
  if(!['night','sunset'].includes(currentWeather().id))return;
  for(const [id,g]of activeGameEntries()){
    const l=state.levels[id];if(l<2)continue;const {x,y,w,h}=g.building;
    c.save();c.globalCompositeOperation='screen';
    if(id==='space'){ellipse(c,x+w/2,y+70,l===3?105:85,36,l===3?'#b1e8e51f':'#aadac414');}
    else for(const xx of [x+7,x+w-7])ellipse(c,xx,y+10,l===3?50:34,38,l===3?'#ffdb8f2b':'#efedb51c');
    c.restore();
  }
}

buildGround();
document.fonts.ready.then(buildGround);
document.fonts.addEventListener('loadingdone',()=>{
  buildGround();const preview=$('stationLookCanvas');
  if(preview?.dataset.stationId)renderStationPreview(preview.dataset.stationId,Number(preview.dataset.level));
});
function resize(){const r=canvas.getBoundingClientRect();view={w:r.width,h:r.height,dpr:Math.min(window.devicePixelRatio||1,2)};canvas.width=Math.round(view.w*view.dpr);canvas.height=Math.round(view.h*view.dpr);ctx.setTransform(view.dpr,0,0,view.dpr,0,0);}
function screenToWorld(x,y){return {x:(x-view.w/2)/state.zoom+runtime.camera.x,y:(y-view.h/2)/state.zoom+runtime.camera.y};}
function drawCharacter(c,n,x,y,size,dir,walking,now,isPlayer=false,label=false){
  const bob=Math.sin(now*(walking?11:2.8)+(isPlayer?0:x))*(walking?3:1.3);
  ellipse(c,x,y+3,size*.27,size*.085,'#33583a2b');
  if(isPlayer){c.strokeStyle='#fff5ba';c.lineWidth=3;c.beginPath();c.ellipse(x,y+2,size*.32,size*.11,0,0,Math.PI*2);c.stroke();}
  const img=images[n.id];c.save();c.translate(x,y-size*.49+bob);if(dir==='left')c.scale(-1,1);if(walking)c.rotate(Math.sin(now*11)*.025);
  if(img?.complete&&img.naturalWidth)c.drawImage(img,-size/2,-size*.52,size,size);
  else{rr(c,-size*.2,-size*.38,size*.4,size*.65,size*.2,'#e8c950');rr(c,-size*.23,-size*.19,size*.46,size*.13,5,'#b3bdb6');ellipse(c,-size*.08,-size*.12,size*.07,size*.06,'#fff');ellipse(c,size*.08,-size*.12,size*.07,size*.06,'#fff');rr(c,-size*.2,size*.06,size*.4,size*.21,5,n.colors.outfit);}
  c.restore();
  if(dir==='up'&&isPlayer){text(c,'↑',x,y-size-8,11,'#fff5cf');}
  if(label){const name=n.name;const w=Math.min(180,name.length*10+18);rr(c,x-w/2,y-size-23,w,22,9,isPlayer?'#fff3c9ee':'#fffdf1ed');text(c,name,x,y-size-12,10,isPlayer?'#7b6a3b':'#627052');}
}
function drawWorld(now){
  ctx.setTransform(view.dpr,0,0,view.dpr,0,0);ctx.clearRect(0,0,view.w,view.h);ctx.save();
  ctx.translate(view.w/2,view.h/2);ctx.scale(state.zoom,state.zoom);ctx.translate(-runtime.camera.x,-runtime.camera.y);
  ctx.drawImage(ground,0,0);
  drawStationAtmosphere(ctx,now);
  for(let i=0;i<12;i++){const x=240+i*130,y=1195+Math.sin(now*.8+i)*9;line(ctx,[[x,y],[x+24,y]],'#d5e7d370',2);}
  if(state.island==='banana')drawPlazaFestival(ctx,now);drawFerry(ctx,now);
  for(const [id,g]of activeGameEntries()){
    const p=g.door;ellipse(ctx,p.x,p.y,22,8,'#e5ce8270');text(ctx,'⌄',p.x,p.y-6+Math.sin(now*2)*3,25,'#fff8d1');
    if(runtime.stationReveal?.id===id){
      const b=g.building;ctx.save();ctx.globalAlpha=Math.min(1,runtime.stationReveal.life);ctx.strokeStyle='#fff2b5';ctx.lineWidth=4;ctx.strokeRect(b.x-10,b.y-10,b.w+20,b.h+20);
      if(!arcadeMotion.matches)for(let i=0;i<6;i++)text(ctx,'✦',b.x+20+i*(b.w-40)/5,b.y-20-Math.sin(now*3+i)*6,17,'#fff1ab');ctx.restore();
    }
  }
  for(const r of activeResources()){
    if(r.readyAt>Date.now())continue;
    const y=r.y+Math.sin(now*3+r.x)*3;ellipse(ctx,r.x,r.y+5,17,7,'#c1a75720');ellipse(ctx,r.x,y,20+Math.sin(now*2+r.y)*2,20,'#fff8c13b');
    if(r.type==='star')drawGoldenStar(ctx,r.x,y,14);else text(ctx,{banana:'🍌',shell:'🐚'}[r.type],r.x,y,25);
    text(ctx,'✦',r.x+16,y-16,10,'#fff5c5');
  }
  const list=[...(state.island==='banana'?[{y:670,fn:()=>drawPlazaFountain(ctx,now)},...plazaSites().map(s=>({y:s.y,fn:()=>drawPlazaTrophy(ctx,s,now)}))]:[]),...activeTrees().map(t=>({y:t.y,fn:()=>drawTree(ctx,t,now)})),...activeDecors().map(d=>({y:d.y,fn:()=>drawFurniture(ctx,d)}))];
  for(const n of activeNpcs()){
    if(n.id===state.char)continue;
    const p=positions[n.id],near=hypot(p,state.player)<180,q=questStatus(n);
    list.push({y:p.y,fn:()=>{
      drawCharacter(ctx,n,p.x,p.y,85,'down',false,now,false,near);
      if(near||q.progress>=n.questTarget&&!q.wait){
        ellipse(ctx,p.x+26,p.y-75,11,12,q.progress>=n.questTarget&&!q.wait?'#e8c979':'#fff7df');
        text(ctx,q.progress>=n.questTarget&&!q.wait?'!':'…',p.x+26,p.y-76,13,'#7e7952');
      }
    }});
  }
  list.push({y:state.player.y,fn:()=>drawCharacter(ctx,activeChar(),state.player.x,state.player.y,88,runtime.dir,runtime.moving,now,true,true)});
  list.sort((a,b)=>a.y-b.y).forEach(o=>o.fn());
  if(runtime.target){ellipse(ctx,runtime.target.x,runtime.target.y,9,4,'#fff5bf99');}
  if(runtime.decor&&runtime.hover){const x=Math.round(runtime.hover.x/50)*50,y=Math.round(runtime.hover.y/50)*50;ellipse(ctx,x,y,31,15,validDecor(x,y)?'#e5edb299':'#df9b8999');drawFurniture(ctx,{id:runtime.decor,x,y},true);}
  for(const p of runtime.particles){ctx.globalAlpha=Math.max(0,p.life);ellipse(ctx,p.x,p.y,3,3,p.color);}ctx.globalAlpha=1;
  for(const f of runtime.floaters){ctx.globalAlpha=Math.min(1,f.life);text(ctx,f.text,f.x,f.y,14,'#fff9d4','center',800);}ctx.globalAlpha=1;
  ctx.restore();
  // Weather atmospheric overlay in screen space
  const wMode=currentWeather();
  if(wMode.tint){ctx.fillStyle=wMode.tint;ctx.fillRect(0,0,view.w,view.h);}
  if(wMode.id==='rain'){
    ctx.strokeStyle='#d8eef880';ctx.lineWidth=1.5;
    for(let i=0;i<36;i++){
      const rx=((seed(i)*view.w)+now*180*(i%2?.7:1))%view.w;
      const ry=((seed(i+99)*view.h)+now*420)%view.h;
      ctx.beginPath();ctx.moveTo(rx,ry);ctx.lineTo(rx-8,ry+16);ctx.stroke();
    }
  }else if(wMode.id==='night'){
    for(let i=0;i<24;i++){
      const sx=seed(i*3)*view.w,sy=seed(i*7)*view.h*.6;
      const alpha=.35+.55*Math.sin(now*2.5+i);
      ctx.fillStyle=`rgba(255,244,180,${alpha})`;
      ctx.beginPath();ctx.arc(sx,sy,2,0,Math.PI*2);ctx.fill();
    }
  }
  drawMinimap();
}
function drawMinimap(){
  const mw=256,mh=170;mini.clearRect(0,0,mw,mh);mini.save();mini.scale(mw/W,mh/H);mini.drawImage(ground,0,0);
  if(state.island==='banana'){ellipse(mini,960,670,63,38,plazaProgress().complete?'#e7c66a':'#8dbfb0');for(const site of plazaSites())ellipse(mini,site.x,site.y,19,19,state.stamps.includes(site.id)?'#e9cc74':'#8b9f7d');}else ellipse(mini,960,650,55,35,'#e4c58a');
  const port=islands[state.island].port;ellipse(mini,port.x,port.y,27,27,'#edc89b');
  for(const n of activeNpcs())if(n.id!==state.char)ellipse(mini,positions[n.id].x,positions[n.id].y,19,19,'#f3d77d');
  ellipse(mini,state.player.x,state.player.y,28,28,'#fffef1');ellipse(mini,state.player.x,state.player.y,17,17,'#507e55');
  mini.strokeStyle='#fff9ddc0';mini.lineWidth=9;mini.strokeRect(runtime.camera.x-view.w/(2*state.zoom),runtime.camera.y-view.h/(2*state.zoom),view.w/state.zoom,view.h/state.zoom);
  mini.restore();
}
function pathTo(destination){
  const cell=40,cols=48,rows=32;let dest={...destination};
  for(const g of activeGames()){const b=g.building;if(dest.x>b.x&&dest.x<b.x+b.w&&dest.y>b.y&&dest.y<b.y+b.h)dest={...g.door};}
  if(blocked(dest.x,dest.y)){toast('장애물을 피해 가까운 빈 곳을 선택하세요.');return;}
  const start={x:Math.floor(state.player.x/cell),y:Math.floor(state.player.y/cell)},end={x:Math.floor(dest.x/cell),y:Math.floor(dest.y/cell)};
  const key=(x,y)=>x+','+y;const open=[{...start,g:0,f:0}],seen=new Map([[key(start.x,start.y),{g:0,prev:null}]]);let found=null;
  for(let iter=0;open.length&&iter<1800;iter++){
    open.sort((a,b)=>a.f-b.f);const cur=open.shift();if(cur.x===end.x&&cur.y===end.y){found=cur;break;}
    for(const [dx,dy]of [[0,1],[0,-1],[1,0],[-1,0]]){
      const x=cur.x+dx,y=cur.y+dy;if(x<0||x>=cols||y<0||y>=rows||blocked(x*cell+20,y*cell+20))continue;
      const k=key(x,y),ng=cur.g+1;if(seen.has(k)&&seen.get(k).g<=ng)continue;
      seen.set(k,{g:ng,prev:key(cur.x,cur.y)});open.push({x,y,g:ng,f:ng+Math.abs(end.x-x)+Math.abs(end.y-y)});
    }
  }
  if(!found){runtime.target=null;runtime.path=[];toast('그곳으로 가는 길을 찾지 못했어요. 가까운 길 위를 눌러 보세요.');return;}
  let k=key(found.x,found.y),path=[];while(k){const [x,y]=k.split(',').map(Number);path.push({x:x*cell+20,y:y*cell+20});k=seen.get(k)?.prev;}
  path.reverse();path.shift();path.push(dest);runtime.path=path;runtime.target=dest;
}
function updateWorld(dt,now){
  if(state.island==='banana')updatePlaza(dt);
  if(runtime.stationReveal){runtime.stationReveal.life-=dt;if(runtime.stationReveal.life<=0)runtime.stationReveal=null;}
  let dx=(runtime.keys.ArrowRight||runtime.keys.KeyD||runtime.touch.right?1:0)-(runtime.keys.ArrowLeft||runtime.keys.KeyA||runtime.touch.left?1:0),
      dy=(runtime.keys.ArrowDown||runtime.keys.KeyS||runtime.touch.down?1:0)-(runtime.keys.ArrowUp||runtime.keys.KeyW||runtime.touch.up?1:0);
  if(dx||dy){runtime.target=null;runtime.path=[];}
  else if(runtime.target){
    const t=runtime.path?.[0]||runtime.target,dist=hypot(t,state.player);
    if(dist<8){if(runtime.path?.length)runtime.path.shift();else runtime.target=null;}
    else{dx=(t.x-state.player.x)/dist;dy=(t.y-state.player.y)/dist;}
  }
  const len=Math.hypot(dx,dy),speed=210*(runtime.keys.ShiftLeft||runtime.keys.ShiftRight?1.4:1)*(state.char==='cyclist'?1.2:1);
  runtime.moving=false;
  if(len){
    dx/=len;dy/=len;const nx=state.player.x+dx*speed*dt,ny=state.player.y+dy*speed*dt;let moved=false;
    if(!blocked(nx,state.player.y)){state.player.x=nx;moved=true;}
    if(!blocked(state.player.x,ny)){state.player.y=ny;moved=true;}
    runtime.moving=moved;if(!moved){runtime.target=null;runtime.path=[];}
    runtime.dir=Math.abs(dx)>Math.abs(dy)?dx>0?'right':'left':dy>0?'down':'up';
  }
  for(const r of activeRegions())if(hypot(r,state.player)<275&&!state.discovered.includes(r.id)){state.discovered.push(r.id);toast(`🧭 새로운 장소 발견! ${r.name}`);sound('win');dirty();}
  const nearest=activeRegions().reduce((a,b)=>hypot(a,state.player)<hypot(b,state.player)?a:b);
  $('location').textContent=`${nearest.icon} ${nearest.name}`;
  const marginX=view.w/(2*state.zoom),marginY=view.h/(2*state.zoom);
  const cx=clamp(state.player.x,Math.min(marginX,W/2),Math.max(W-marginX,W/2)),cy=clamp(state.player.y,Math.min(marginY,H/2),Math.max(H-marginY,H/2));
  const lerp=1-Math.exp(-dt*8);runtime.camera.x+=(cx-runtime.camera.x)*lerp;runtime.camera.y+=(cy-runtime.camera.y)*lerp;
  for(const p of runtime.particles){p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=60*dt;p.life-=dt*1.4;}runtime.particles=runtime.particles.filter(p=>p.life>0);
  for(const f of runtime.floaters){f.y-=22*dt;f.life-=dt;}runtime.floaters=runtime.floaters.filter(f=>f.life>0);
  if(now-runtime.lastUi>250){
    runtime.lastUi=now;const a=nearestAction();let t='클릭해서 이동하거나 가구·친구를 찾아가세요';
    if(a){
      if(a.kind==='islandMonument')t='섬 기록 수첩 · 트로피와 도전 보기';
      else if(a.kind==='ferry')t='배 타기 · 다른 섬으로 무료 여행';
      else if(a.kind==='plazaFountain')t='바나나 분수 · 광장 성장과 추천 도전 보기';
      else if(a.kind==='plazaTrophy')t=`${games[a.id].name} 트로피 · 기록 보기`;
      else if(a.kind==='npc')t=`${roster.find(n=>n.id===a.id).name}에게 말 걸기`;
      else if(a.kind==='game')t=`${games[a.id].name} 입장 · 10 CP`;
      else if(a.kind==='tree')t=a.readyAt>Date.now()?`나무 휴식 중 · ${Math.ceil((a.readyAt-Date.now())/1000)}초`:'나무 흔들기 · 바나나 수확';
      else if(a.kind==='decor'){const item=catalog.find(c=>c.id===a.id);t=`${item.name} · ${item.actionDesc}`;}
      else t=`${{banana:'바나나',shell:'조개',star:'별 조각'}[a.type]} 채집하기`;
    }
    if(runtime.decor||runtime.removeDecor)t='빈 곳 배치 · 가구 클릭 회수 · 같은 버튼으로 종료';
    $('contextText').textContent=t;
  }
}

function drawGoldenStar(c,x,y,r=15){
  c.save();c.shadowColor='#ffcb3d';c.shadowBlur=15;c.beginPath();
  for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,rad=i%2?r*.46:r;const px=x+Math.cos(a)*rad,py=y+Math.sin(a)*rad;i?c.lineTo(px,py):c.moveTo(px,py);}
  c.closePath();c.fillStyle='#ffd54a';c.fill();c.shadowBlur=0;c.strokeStyle='#fff0a8';c.lineWidth=2;c.stroke();
  c.beginPath();c.moveTo(x,y-r*.6);c.lineTo(x-r*.14,y+r*.06);c.lineTo(x+r*.27,y-r*.14);c.closePath();c.fillStyle='#fff5c4';c.fill();c.restore();
}
function usesHealth(a){return ['racing','space','cycling','ski','taekwondo'].includes(a.id);}
function renderArcadeHealth(){
  const a=runtime.arc,visible=Boolean(a&&usesHealth(a)&&!a.practice);$('arcadeHealth').classList.toggle('hidden',!visible);if(!visible)return;
  const health=clamp(a.health,0,3);$('arcadeHearts').setAttribute('aria-label',`남은 체력 ${health} / 3`);
  $('arcadeHearts').innerHTML=Array.from({length:3},(_,i)=>`<svg viewBox="0 0 24 24" aria-hidden="true" class="${i<health?'':'empty'}"><path d="M12 20.5 3.7 12.6C-1.3 7.8 5.7.5 12 6.2 18.3.5 25.3 7.8 20.3 12.6Z"/></svg>`).join('');
}
function damageArcade(){
  const a=runtime.arc;if(!a||a.phase!=='playing'||!usesHealth(a)||a.invulnerable>0||a.fever>0||a.boost>0)return false;
  if(a.shield>0){a.shield=0;a.invulnerable=.8;sound('hit');arcadeNotice('보호막이 충격을 막았어요!','#a6e4ed');return false;}
  a.health=Math.max(0,a.health-1);a.stats.hits++;arcadeNotice(`${a.id==='taekwondo'?'피격':'충돌'}! 남은 하트 ${a.health}`,'#ffc1a5');a.invulnerable=1;a.hitFlash=.22;a.combo=0;sound('miss');renderArcadeHealth();
  if(a.health===0)finishArcade('hits');return true;
}
function drawSurvivalPlayer(c,a,x,y,size,dir,walking,now){
  c.save();if(a.invulnerable>0&&Math.floor(a.elapsed*12)%2===0)c.globalAlpha=.35;
  if(a.shield>0){
    c.strokeStyle='#7ee8fa';c.lineWidth=3.5;c.fillStyle='#7ee8fa28';
    c.beginPath();c.arc(x,y-size*.45,size*.52,0,Math.PI*2);c.fill();c.stroke();
  }
  drawCharacter(c,roster.find(n=>n.id===a.char),x,y,size,dir,walking,now,true);c.restore();
}

function startArcade(id,options={}){
  const practice=id==='taekwondo'&&options.practice===true;
  if(runtime.mode!=='world'||!games[id])return;
  if(!practice&&state.cp<10){toast('도전에는 10 CP가 필요해요. 섬에서 채집하거나 가구에서 쉬어보세요.',true);return;}
  state.char=normalizePlayerId(state.char);endDecor();closeModal();runtime.mode='arcade';
  const lv=practice?1:state.levels[id],canChamp=championOpen(id),champ=!practice&&Boolean(runtime.champMode&&canChamp);
  const target=champ?games[id].champTarget:games[id].targets[lv-1];
  const pads=id==='space'?[{x:.25,y:.68,w:.16,floor:1},{x:.62,y:.52,w:.16,floor:2},{x:.38,y:.36,w:.16,floor:3}]:[];
  runtime.arc={
    id,level:lv,champ,practice,char:state.char,phase:'ready',time:25,score:0,target,
    x:.5,y:.82,vy:0,lane:1,jumpZ:0,jumpVz:0,
    objects:[],shots:[],pads,items:[],
    spawn:.25,itemSpawn:3.2,elapsed:0,shotCd:0,skillCd:0,boostCd:0,boost:0,fever:0,
    combo:0,maxCombo:0,energy:0,swing:0,jumps:0,paid:false,hitFlash:0,
    health:3,invulnerable:0,shield:state.char==='swimmer'&&id==='racing'?1:0,
    focus:0,waveIndex:0,spaceWave:0,feedback:null,fx:[],particles:[],charging:false,charge:0,laneVisual:1,routeTimer:.8,routeIndex:0,routes:{},aimFlash:0,aimX:.5,stats:{goldenGoals:0,shots:0,goals:0,rings:0,corners:0,returns:0,perfects:0,targets:0,misses:0,coins:0,dodges:0,boosts:0,stars:0,bounces:0,ufos:0,hits:0,charged:0,cleanJumps:0,constellations:0},netFlash:0,wideTimer:0,ringX:.5,defX:.5,ufo:{x:.2,y:.18,vx:.22,active:true},endReason:null
  };
  sizeArcCanvas();runtime.arc.entryPaid=false;if(isExpansionGame(id))initExpansionArcade(runtime.arc);else if(isCoveGame(id))initCoveArcade(runtime.arc);
  for(const pad of runtime.arc.pads){pad.baseX=pad.x;pad.touched=false;}
  renderArcadeHealth();if(id==='racket'){initTennis(runtime.arc);serveBall();}clearInput();renderRunHud();
  $('arcade').dataset.game=id;$('arcade').classList.remove('hidden','is-result');
  $('arcadeTitle').textContent=games[id].icon+' '+games[id].name+(practice?' · 무료 조작 연습':` · Lv.${lv}${champ?' (챔피언 모드)':''}`);
  $('arcadeDesc').textContent=introGuides[id].brief;
  $('arcadeNote').textContent=games[id].controls;
  $('arcadeTarget').textContent=runtime.arc.target;
  $('arcadeCombo').textContent='0';
  $('arcadeTime').textContent='25.0';
  $('arcadeScore').textContent='0';$('arcScoreTitle').textContent=id==='cycling'?'주행 거리(m)':'나의 점수';
  $('arcAction').textContent={soccer:'길게 눌러 슛',racket:'강타 · Space',racing:'점프 · Space',space:'점프 · Space',cycling:'페달 · Space',baseball:'스윙 · Space',freekick:'높이 조절 · 슛',archery:'눌렀다 놓아 발사',ski:'길게 눌러 감속',figure:'점프 · Space',taekwondo:'반격 · Space'}[id];
  $('arcSpecial').disabled=lv<2;
  $('arcSpecial').textContent=lv<2?'🔒 Lv.2 필살기':'필살기 · E';
  $('pauseArcade').disabled=false;$('pauseArcade').textContent='Ⅱ';
  showArcadeCover(`<div class="medal">${games[id].icon}</div><h3>${champ?'🔥 그랜드 챔피언 도전!':'준비됐나요?'}</h3><p>${champ?'챔피언 모드':'일반 모드'} · Lv.${lv}<br>목표 ${runtime.arc.target}${scoreUnit(id)} · 25초${usesHealth(runtime.arc)?' · 하트 3개':''}</p><button class="soft-btn primary wide" id="beginArcade">시작하기</button>`);
  if(practice)showArcadeCover('<div class="medal">🥋</div><h3>막고, 반격해 볼까요?</h3><p>↑ 상단 방어 → Space 반격<br>↓ 하단 방어 → Space 반격</p><p class="hint">시간 제한·CP 소모 없이 천천히 연습해요.</p><button class="soft-btn primary wide" id="beginArcade">무료 연습 시작</button>');
  $('beginArcade').onclick=()=>{const a=runtime.arc;if(a?.phase!=='ready'||a.entryPaid)return;if(!a.practice){if(state.cp<10)return;a.entryPaid=true;state.cp-=10;}a.phase='playing';hideArcadeCover();clearInput();renderRunHud();save();renderHud();};
  if(id==='taekwondo')renderTaekHud(runtime.arc);
  save();renderHud();renderSidebar();$('beginArcade').focus();
}
function showArcadeCover(html){$('arcadeCover').innerHTML='<div class="result-card">'+html+'</div>';$('arcadeCover').classList.remove('hidden');}
function hideArcadeCover(){$('arcadeCover').classList.add('hidden');}

function arcadeAction(special=false,power=0){
  const a=runtime.arc;if(runtime.mode!=='arcade'||a?.phase!=='playing')return;
  if(isExpansionGame(a.id))return expansionAction(a,special,power);
  if(isCoveGame(a.id))return coveAction(a,special,power);
  if(special&&(a.level<2||a.skillCd>0))return;
  const id=a.id;
  if(special&&id==='racket'&&!a.objects.some(b=>tennisCanSwing(a,b,true))){arcadeNotice('공이 내 타격 구간에 올 때 스매시!','#e4dfbd');return;}
  if(special){a.charging=false;a.charge=0;a.chargeSource=null;arcadeNotice('SPECIAL SKILL!','#c7e8e7');a.skillCd=id==='soccer'&&a.char==='curvy'?2.5:4;a.skillDuration=a.skillCd;a.fever=id==='racing'?2.6:3;sound('build');}
  if(id==='soccer'){
    if(!special&&a.shotCd>0)return;
    a.shotCd=a.char==='curvy'?.26:.34;
    const moveDir=(runtime.keys.ArrowRight||runtime.keys.KeyD||runtime.touch.right?1:0)-(runtime.keys.ArrowLeft||runtime.keys.KeyA||runtime.touch.left?1:0);
    const vx=a.char==='kicko'?moveDir*.06:moveDir*.18+Math.sin(a.elapsed*2.2)*.05;
    const sweet=!special&&power>=.65&&power<=.85;
    const shot={x:a.x,y:.82,vx,vy:special?-1.28:-soccerSpeed(a,power),fire:special,curve:moveDir*.25,ringHit:false,sweet,power};
    if(sweet){a.stats.charged++;arcadeNotice('정밀 파워 슛! 골 성공 시 +6','#ffe18a');burstArc(a.x,.82);}
    a.shots.push(shot);
    if(a.level===3&&(special||a.fever>0))for(const v of [-.19,.19])a.shots.push({...shot,vx:v,curve:0});
    a.stats.shots+=a.level===3&&(special||a.fever>0)?3:1;sound('hit');
  }else if(id==='racket'){
    if(special){a.swing=.28;for(const b of a.objects)if(tennisCanSwing(a,b,true))racketReturn(a,b,true,true);}
    else if(a.shotCd<=0){
      a.shotCd=.36;a.swing=.2;
      for(const b of a.objects)if(tennisCanSwing(a,b)){racketReturn(a,b,true);}
      
    }
  }else if(id==='racing'){
    if(special){a.boost=2.6;}
    else if(a.jumpZ<=0){a.jumpVz=2.4;sound('hit');}
  }else if(id==='space'){
    const maxJumps=a.level>=2?2:1;
    if(special){a.vy=-.85;a.jumps=1;}
    else if(a.jumps<maxJumps){a.vy=a.char==='astro'?-.74:-.68;a.jumps++;sound('hit');}
  }
}
function changeLane(delta){const a=runtime.arc;if(a?.phase!=='playing'||a.id!=='racing')return;a.lane=clamp(a.lane+delta,0,2);}
function updateArcade(dt){
  const a=runtime.arc;if(!a||a.phase!=='playing')return;
  if(!a.practice){a.time=Math.max(0,a.time-dt);if(a.time===0){finishArcade();return;}}
  a.elapsed+=dt;
  if(a.charging){a.charge=Math.min(1,a.charge+dt/.9);a.chargeTime=(a.chargeTime||0)+dt;}
  a.aimFlash=Math.max(0,a.aimFlash-dt);
  for(const p of a.particles){p.life-=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=.25*dt;}a.particles=a.particles.filter(p=>p.life>0);
  for(const k of ['shotCd','skillCd','boostCd','boost','fever','swing','hitFlash','invulnerable','wideTimer','netFlash','focus'])a[k]=Math.max(0,a[k]-dt);
  let dx=(runtime.keys.ArrowRight||runtime.keys.KeyD||runtime.touch.right?1:0)-(runtime.keys.ArrowLeft||runtime.keys.KeyA||runtime.touch.left?1:0);
  if(!isExpansionGame(a.id)&&a.id!=='racing'&&a.id!=='baseball')a.x=clamp(a.x+dx*.62*dt,.09,.91);
  if(a.feedback)a.feedback.life=Math.max(0,a.feedback.life-dt);for(const f of a.fx)f.life-=dt;a.fx=a.fx.filter(f=>f.life>0);
  if(a.time<=8&&!a.lastSpurt){a.lastSpurt=true;arcadeNotice('LAST SPURT!','#ffe08a');}
  const spdMult=(a.champ?1.18:1)*roundTempo(a)*(a.id==='racing'&&a.time<=8?1+(8-a.time)/8*.3:1);

  if(isExpansionGame(a.id)){updateExpansionArcade(a,dt,spdMult,dx);if(a.phase!=='playing')return;}else if(isCoveGame(a.id)){updateCoveArcade(a,dt,spdMult,dx);if(a.phase!=='playing')return;}else if(a.id==='soccer'){
    const goalkeeper=soccerKeeper(a);
    a.ringX=soccerRing(a);
    a.defX=.5+Math.sin(a.elapsed*1.1*spdMult+1.5)*.22;
    for(let i=a.shots.length-1;i>=0;i--){
      const b=a.shots[i];
      b.vx+=(b.curve||0)*dt;
      b.x+=b.vx*dt;b.y+=b.vy*dt;
      if(!b.ringHit&&Math.abs(b.y-.38)<.045&&Math.abs(b.x-a.ringX)<.065){
        b.ringHit=true;a.stats.rings++;arcFloat(b.x,b.y,'RING ×2!');sound('collect');
      }
      let stopped=false;
      if(!b.fire){
        if(Math.abs(b.y-.24)<.044&&Math.abs(b.x-goalkeeper)<.065)stopped=true;
        if(soccerDefenderActive(a)&&Math.abs(b.y-.48)<.038&&Math.abs(b.x-a.defX)<.065)stopped=true;
      }
      if(stopped){a.shots.splice(i,1);a.combo=0;arcadeNotice('BLOCKED! 빈 곳을 노려보세요','#efc5b1');sound('miss');continue;}
      if(b.y<.19){
        const goal=b.x>.22&&b.x<.78;
        if(goal){
          const corner=b.x<.31||b.x>.69;
          let pts=(corner?22:15)+(b.fire?6:0)+(b.sweet?6:0);
          if(b.ringHit)pts*=2;
          pts+=Math.min(15,a.combo*3);
          const golden=goldenCorner(a),goldenHit=golden===0&&b.x<.34||golden===1&&b.x>.66;
          if(goldenHit){pts+=12;a.stats.goldenGoals++;arcFloat(b.x,.28,'GOLDEN CORNER +12');}
          burstArc(b.x,.19,'#ffe18a',18);a.netFlash=.45;a.score+=pts;a.stats.goals++;if(corner)a.stats.corners++;arcFloat(b.x,.2,`GOAL +${pts}`);if(b.ringHit||corner)arcadeNotice(b.ringHit?'RING GOAL ×2!':'CORNER GOAL!');a.combo++;a.maxCombo=Math.max(a.maxCombo,a.combo);
          if(a.level===3&&a.combo%3===0)a.fever=3;
          sound('collect');
        }else{a.combo=0;arcadeNotice('OUT! 조준선을 확인하세요','#efc5b1');sound('miss');}
        a.shots.splice(i,1);
      }else if(b.x<0||b.x>1)a.shots.splice(i,1);
    }
  }else if(a.id==='racket'){
    updateTennis(a,dt,spdMult);
  }else if(a.id==='racing'){
    a.laneVisual+=(a.lane-a.laneVisual)*Math.min(1,dt*18);
    if(a.jumpZ>0||a.jumpVz>0){
      a.jumpZ+=a.jumpVz*dt;a.jumpVz-=5.2*dt;
      if(a.jumpZ<=0){a.jumpZ=0;a.jumpVz=0;burstArc(.19,(a.laneVisual+.5)/3,'#ede1b7',6);}
    }
    a.spawn-=dt;
    if(a.spawn<=0)spawnRacingWave(a,spdMult);
    const speed=(a.boost>0?.68:.42)*(1+(a.level-1)*.18)*spdMult;
    for(let i=a.objects.length-1;i>=0;i--){
      const e=a.objects[i];e.x-=speed*dt;
      if(a.level===3&&(a.boost>0||a.fever>0)&&e.type==='coin'&&e.x<.38)e.lane=a.lane;
      if(Math.abs(e.x-.19)<.055&&Math.abs(e.lane-a.laneVisual)<.38){
        if(e.type==='coin'){burstArc(.19,(e.lane+.5)/3);a.stats.coins++;a.score+=20+Math.min(12,a.combo*2);a.combo++;a.maxCombo=Math.max(a.maxCombo,a.combo);a.energy=Math.min(6,a.energy+1);sound('collect');}
        else if(e.type==='pad'){arcadeNotice('SPEED PAD!','#b9e9df');a.boost=Math.max(a.boost,1.4);a.score+=15;a.combo++;sound('build');}
        else if(e.type==='shield'){a.shield=1;arcadeNotice('SHIELD READY','#a6e4ed');a.score+=15;sound('collect');}
        else if(e.type==='hurdle'&&a.jumpZ>.12){const clean=a.jumpZ>.4;a.stats.dodges++;if(clean)a.stats.cleanJumps++;const pts=clean?18:12;arcFloat(.19,(a.laneVisual+.5)/3,clean?'CLEAN JUMP +18':'JUMP +12');burstArc(.19,(a.laneVisual+.5)/3);a.score+=pts;a.combo++;sound('hit');}
        else if(a.boost>0||a.fever>0){a.stats.dodges++;a.score+=12;sound('hit');}
        else{damageArcade();}
        a.objects.splice(i,1);if(a.phase!=='playing')return;
      }else if(e.x<-.07){if(e.type==='hurdle'||e.type==='rock')a.stats.dodges++;a.objects.splice(i,1);}
    }
  }else if(a.id==='space'){
    a.routeTimer-=dt;if(a.routeTimer<=0){a.routeTimer=a.level===3&&a.elapsed>=17?2.7:3.3;spawnConstellation(a);}
    const prevY=a.y;for(let i=0;i<a.pads.length;i++){const pad=a.pads[i];pad.spring=Math.max(0,(pad.spring||0)-dt);if(a.level>=2)pad.x=clamp(pad.baseX+Math.sin(a.elapsed*.8+(pad.phase??i*1.8))*(a.level===3?.10:.065),.1,.75);}
    a.vy+=(a.char==='astro'?1.02:1.15)*dt;a.y+=a.vy*dt;
    // Check moon bounce pads
    if(a.vy>0){
      for(const pad of a.pads){
        if(prevY<=pad.y&&a.y>=pad.y&&Math.abs(a.x-(pad.x+pad.w/2))<pad.w*.6){
          a.y=pad.y;a.vy=-.72;a.jumps=0;pad.spring=.35;burstArc(a.x,pad.y,'#b8ede5',8);a.stats.bounces++;if(!pad.touched){pad.touched=true;a.score+=8;arcFloat(a.x,a.y,'FIRST LAND +8');spaceFloor(a,pad);}sound('hit');
        }
      }
    }
    spaceClimb(a);const ground=.82+(a.climb||0);
    if(ground<1.02&&a.y>=ground){a.y=ground;a.vy=0;a.jumps=0;}
    else if(a.y>1.04){const pad=[...a.pads].sort((p,q)=>q.y-p.y).find(p=>p.y<.95);damageArcade();if(a.phase!=='playing')return;if(pad){a.x=pad.x+pad.w/2;a.y=pad.y;}else a.y=.6;a.vy=-.72;a.jumps=0;a.invulnerable=Math.max(a.invulnerable,1.2);arcadeNotice('추락! 아래 발판에서 다시 출발','#ffc1a5');}
    if(a.y<.09){a.y=.09;a.vy=.05;}
    // Update UFO bonus target
    if(a.ufo){
      a.ufo.cooldown=Math.max(0,(a.ufo.cooldown||0)-dt);a.ufo.x+=a.ufo.vx*dt*spdMult;
      if(a.ufo.x>.88||a.ufo.x<.12)a.ufo.vx*=-1;
      if(a.ufo.cooldown===0&&Math.hypot(a.x-a.ufo.x,a.y-a.ufo.y)<.085){
        a.ufo.cooldown=1.2;burstArc(a.ufo.x,a.ufo.y,'#ffe18a',18);a.stats.ufos++;arcFloat(a.ufo.x,a.ufo.y,'UFO +45');a.score+=45;a.combo+=2;a.maxCombo=Math.max(a.maxCombo,a.combo);a.vy=-.55;a.ufo.x=a.ufo.x<.5?.82:.18;sound('win');
      }
    }
    a.spawn-=dt;
    if(a.spawn<=0){
      spawnSpaceWave(a,spdMult);
    }
    for(let i=a.objects.length-1;i>=0;i--){
      const e=a.objects[i];if(e.warn>0){e.warn=Math.max(0,e.warn-dt);continue;}e.y+=e.vy*dt;
      if(a.level===3&&e.type==='star'&&a.fever>0){e.x+=(a.x-e.x)*4.2*dt;e.y+=(a.y-e.y)*4.2*dt;}
      if(Math.hypot(e.x-a.x,(e.y-a.y)*.75)<.072){
        if(e.type==='star'){burstArc(e.x,e.y);if(e.route&&a.routes[e.route]){const route=a.routes[e.route];if(--route.left===0){a.score+=20;a.stats.constellations++;arcadeNotice('별자리 완성! +20','#ffe18a');burstArc(e.x,e.y,'#ffe18a',18);delete a.routes[e.route];}}a.stats.stars++;a.score+=(a.level===3?30:22)+Math.min(14,a.combo*2);a.combo++;a.maxCombo=Math.max(a.maxCombo,a.combo);sound('collect');}
        else if(e.type==='shield'){a.shield=1;arcadeNotice('SHIELD READY','#a6e4ed');a.score+=15;sound('collect');}
        else{damageArcade();}
        a.objects.splice(i,1);if(a.phase!=='playing')return;
      }else if(e.y>1.05){if(e.route)delete a.routes[e.route];a.objects.splice(i,1);}
    }
  }
  a.maxCombo=Math.max(a.maxCombo,a.combo);
  $('arcadeCombo').textContent=a.combo;
  $('arcadeTime').textContent=a.time.toFixed(1);
  $('arcadeScore').textContent=Math.floor(a.score);
  $('arcSpecial').textContent=a.level<2?'🔒 Lv.2 필살기':a.skillCd>0?`필살기 ${a.skillCd.toFixed(1)}s`:'필살기 · E';
  renderRunHud();
}
function finishArcade(reason='time'){
  const a=runtime.arc;if(a?.practice)return;if(!a||a.paid||a.phase==='result')return;
  a.phase='result';a.endReason=reason;a.paid=true;$('arcade').classList.add('is-result');clearInput();
  const score=Math.floor(a.score),passed=reason==='time'&&(!usesHealth(a)||a.health>0)&&score>=a.target,record=score>modeBest(a.id,a.level,a.champ);
  const key=arcadeRecordKey(a.id,a.level,a.champ),previous=state.arcadeRecords[key]||{best:0,plays:0,wins:0,maxCombo:0};
  state.arcadeRecords[key]={best:Math.max(previous.best,score),plays:previous.plays+1,wins:previous.wins+(passed?1:0),maxCombo:Math.max(previous.maxCombo,a.maxCombo),lastScore:score};
  const wasUnlocked=state.stamps.includes(a.id);
  state.best[a.id]=Math.max(state.best[a.id]||0,score);
  if(a.id==='racing'&&record)buildGround();
  state.history.played++;
  if(passed){state.history.passed++;if(!state.stamps.includes(a.id)){state.stamps.push(a.id);if(plazaIds.includes(a.id))runtime.plazaNewStamp=a.id;}}
  if(!plazaIds.includes(a.id))buildGround();
  const mult=[1,1.8,3][a.level-1]*(a.champ?1.6:1)*(currentWeather().id==='sunset'?1.2:1);
  const coin=Math.round(((passed?55:25)*mult+Math.min(score,1500)*.22)*(a.id==='soccer'&&a.char==='kicko'?1.2:1));
  const trophy=passed?(score>=a.target*1.35?(a.champ?3:2):1):0;
  state.coins+=coin;state.trophies+=trophy;
  for(const id of games[a.id].hosts)state.friendship[id]++;
  const hostName=roster.find(n=>n.id===games[a.id].hosts[0])?.name||'담당 친구';
  checkMissions();sound(passed?'win':'collect');
  $('arcadeTime').textContent=a.time.toFixed(1);$('arcadeScore').textContent=score;
  renderArcadeHealth();renderRunHud();$('pauseArcade').disabled=true;
  showArcadeCover(`<div class="medal">${passed?'🏆':'🌱'}</div><h3>${reason==='outs'?'3아웃! 타격 도전 종료':reason==='hits'?(a.id==='taekwondo'?'세 번 피격! 도전 종료':'세 번 충돌! 도전 종료'):passed?'멋진 도전이었어요!':'다음엔 더 잘할 수 있어요!'}</h3><p>${reason==='hits'?'체력을 모두 소진했어요. 모은 점수의 코인은 받을 수 있어요.<br>':''}${score}${scoreUnit(a.id)} / 목표 ${a.target}${scoreUnit(a.id)} · 최대 ${a.maxCombo}콤보 ${record?'· 새 기록 ✨':''}<br>+${coin} 🍌 &nbsp; +${trophy} 🏆 ${passed&&!wasUnlocked?`<br><b>🎉 ${!plazaIds.includes(a.id)?islands[islandOf(games[a.id])].name+' 스탬프 획득!':hostName+' 구장 스탬프 · 광장 트로피 전시!'}</b>`:''}</p>${runStatsHtml(a)}<p class="record-caption">Lv.${a.level} ${a.champ?'챔피언':'일반'} · 이 단계 최고 ${state.arcadeRecords[key].best}${scoreUnit(a.id)}</p><div class="dialog-actions"><button id="retryArcade" class="soft-btn gold">다시 도전 · 10 CP</button><button id="returnWorld" class="soft-btn primary">섬으로 돌아가기</button>${passed&&!wasUnlocked?'<button id="visitPlaza" class="soft-btn">🏆 광장에서 트로피 보기</button>':''}</div>`);
  $('retryArcade').onclick=()=>{if(state.cp<10){$('retryArcade').textContent='CP 부족 · 섬에서 채집하세요';return;}const id=a.id;leaveArcade();startArcade(id);};
  $('returnWorld').onclick=leaveArcade;if($('visitPlaza'))$('visitPlaza').onclick=()=>{leaveArcade();if(!plazaIds.includes(a.id))islandPassport(islandOf(games[a.id]));else visitPlaza();};if(!plazaIds.includes(a.id)&&$('visitPlaza'))$('visitPlaza').textContent='🏆 섬 기록 수첩 보기';
  dirty();save();$('returnWorld').focus();
}
function pauseArcade(){const a=runtime.arc;if(!a||a.phase!=='playing')return;a.phase='paused';clearInput();$('pauseArcade').textContent='▶';showArcadeCover('<div class="medal">☕</div><h3>잠깐 쉬어가요</h3><p>시간과 점수가 멈춰 있어요.</p><button class="soft-btn primary wide" id="resumeArcade">계속하기</button>');$('resumeArcade').onclick=resumeArcade;$('resumeArcade').focus();}
function resumeArcade(){const a=runtime.arc;if(!a||a.phase!=='paused')return;a.phase='playing';clearInput();hideArcadeCover();$('pauseArcade').textContent='Ⅱ';}
function leaveArcade(){runtime.mode='world';runtime.arc=null;clearInput();$('arcade').classList.add('hidden');save();renderHud();renderSidebar();$('world').focus();}
function exitArcade(){
  const a=runtime.arc;if(!a)return;
  if(a.practice)return leaveArcade();
  if(a.phase==='result'||a.phase==='ready')return leaveArcade();
  if(a.phase==='playing')pauseArcade();
  showArcadeCover('<div class="medal">🏝️</div><h3>섬으로 돌아갈까요?</h3><p>진행 중인 점수는 기록되지 않으며<br>사용한 입장 CP는 반환되지 않아요.</p><div class="dialog-actions"><button class="soft-btn" id="keepPlaying">계속하기</button><button class="soft-btn primary" id="quitGame">돌아가기</button></div>');
  $('keepPlaying').onclick=resumeArcade;$('quitGame').onclick=leaveArcade;
}
function drawArcade(now){
  const a=runtime.arc;if(!a)return;
  const w=ARC_W,h=ARC_H;ac.clearRect(0,0,w,h);
  if(isExpansionGame(a.id))drawExpansionArcade(a,w,h,now);else if(isCoveGame(a.id))drawCoveArcade(a,w,h,now);else if(a.id==='soccer'){
    drawArenaFloor(a,w,h);
    line(ac,[[w*.08,h*.94],[w*.08,h*.07],[w*.92,h*.07],[w*.92,h*.94]],'#d2e0b7',3);
    if(a.netFlash>0)rr(ac,w*.22,h*.06,w*.56,h*.14,5,'#fff0a655');
    ac.strokeStyle='#e5e7c7';ac.lineWidth=3;ac.strokeRect(w*.22,h*.06,w*.56,h*.14);
    for(let i=0;i<=14;i++)line(ac,[[w*(.22+i*.04),h*.06],[w*(.22+i*.04),h*.2]],'#d4ddbe60',1);
    line(ac,[[w*.22,h*.13],[w*.78,h*.13]],'#d4ddbe60',1);
    const corner=goldenCorner(a);if(corner>=0){const gx=corner===0?.22:.66;rr(ac,w*gx,h*.065,w*.12,h*.13,4,'#ffe38b40','#f5d97e');text(ac,'+12',w*(gx+.06),h*.095,12,'#fff0af','center',800);}
    // Golden multiplier ring
    ellipse(ac,a.ringX*w,h*.38,33,33,'#ffdf6620');
    ac.strokeStyle='#ffd54a';ac.lineWidth=4;ac.beginPath();ac.arc(a.ringX*w,h*.38,28,0,Math.PI*2);ac.stroke();
    text(ac,'×2',a.ringX*w,h*.38,13,'#fff7c2','center',800);
    // Moving defender wall on Lv.2+ or Champ
    if(soccerDefenderActive(a)){
      rr(ac,a.defX*w-42,h*.46,84,22,8,'#425b46','#d5e3c8');
      text(ac,'🛡 수비벽',a.defX*w,h*.48,11,'#fff');
    }
    drawCharacter(ac,roster.find(n=>n.id===games.soccer.hosts[0]),soccerKeeper(a)*w,h*.24,68,'down',a.phase==='playing',now);
    drawShotGuide(a,w,h);
    for(const b of a.shots){
      line(ac,[[b.x*w-b.vx*35,b.y*h+24],[b.x*w,b.y*h]],b.fire?'#ffc77b88':'#fff4cf77',b.fire?8:4);if(b.fire)ellipse(ac,b.x*w,b.y*h+10,10,20,'#efb15a80');
      drawFootball(b.x*w,b.y*h,12,b.fire);
    }
    drawCharacter(ac,roster.find(n=>n.id===a.char),a.x*w,h*.88,85,'up',false,now,true);
  }else if(a.id==='racket'){
    drawArenaFloor(a,w,h);
    const courtLine=arenaPalette(a).line;
    for(const p of [.14,.5,.84])line(ac,[[w*.09,h*p],[w*.91,h*p]],courtLine,2);
    for(const p of [.22,.78])line(ac,[[w*p,h*.09],[w*p,h*.91]],courtLine,2);
    line(ac,[[w*.06,h*.45],[w*.94,h*.45]],'#e4ddbd',5);
    for(let i=0;i<35;i++)line(ac,[[w*(.06+i*.025),h*.44],[w*(.06+i*.025),h*.49]],'#8d80625c',1);
    for(const [i,x]of [.18,.5,.82].entries()){const lit=a.tennis.targetFlash>0&&a.tennis.targetLit===i;ellipse(ac,x*w,h*.31,23,14,lit?'#ffdf8c99':'#f6df9a26');text(ac,'★',x*w,h*.31,18,lit?'#ffecaa':'#efd99c88');}
    for(const cap of a.items){
      ellipse(ac,cap.x*w,cap.y*h,20,20,cap.type==='wide'?'#8bd4c7':'#f2cf78');
      text(ac,cap.type==='wide'?'↔':'✦✦',cap.x*w,cap.y*h,15,'#273f35','center',800);
    }
    drawTennisOpponent(a,w,h,now);
    for(const b of a.objects){
      if(!arcadeMotion.matches&&b.trail?.length>1)line(ac,b.trail.map(p=>[p.x*w,p.y*h]),b.smash?'#eab18a99':b.fire?'#ffe1a17a':'#f4f1bd44',b.fire?6:3);
      ellipse(ac,b.x*w+4,b.y*h+9,8,3,'#635e4438');
      drawTennisBall(b,w,h);
    }
    if(a.wideTimer>0)ellipse(ac,a.x*w,h*.84,84,14,'#8bd4c755');
    drawCharacter(ac,roster.find(n=>n.id===a.char),a.x*w,h*.87,80,'up',false,now,true);
    if(a.swing>0){ac.strokeStyle='#fff4b0';ac.lineWidth=5;ac.beginPath();ac.arc(a.x*w,h*.77,50,-Math.PI*.8,-Math.PI*.15);ac.stroke();}
  }else if(a.id==='racing'){
    drawCoastArena(a,w,h);
    for(const e of a.objects)drawRunnerObject(e,w,h,now);
    const baseY=(a.laneVisual+.5)*h/3,y=baseY-a.jumpZ*95;
    ellipse(ac,w*.19,baseY+32,32-a.jumpZ*15,8,'#355b4140');
    if(a.boost>0||a.fever>0){ellipse(ac,w*.19-28,y-20,55,32,'#f6e3a259');text(ac,'✦',w*.19-55,y-25,35,'#ffe4a1');}
    drawSurvivalPlayer(ac,a,w*.19,y+28,90,'right',a.phase==='playing',now);
    rr(ac,w-185,16,165,35,12,'#fff8e1db');text(ac,`⚡ 부스터 ${a.energy} / 3`,w-103,34,13,'#6b7653');
  }else{
    ac.drawImage(spaceBackdrop(a,w,h),0,0);if(a.climb>0){const sky=['#425773','#51416c','#343761'][a.level-1],g=ac.createLinearGradient(0,h*.8,0,h);g.addColorStop(0,sky+'00');g.addColorStop(.35,sky);g.addColorStop(1,sky);ac.save();ac.globalAlpha=Math.min(1,a.climb*2.5);ac.fillStyle=g;ac.fillRect(0,h*.8,w,h*.2);ac.restore();}
    for(const pad of a.pads)drawSpacePad(pad,w,h,a);
    // Bonus UFO
    if(a.ufo){
      ac.save();if(a.ufo.cooldown>0)ac.globalAlpha=.35;
      ellipse(ac,a.ufo.x*w,a.ufo.y*h,28,12,'#e8c668');
      text(ac,'🛸 +45',a.ufo.x*w,a.ufo.y*h-2,14,'#fff8dc','center',800);ac.restore();
    }
    for(const e of a.objects){
      if(e.type==='star'){if(e.route)ellipse(ac,e.x*w,e.y*h,22,22,'#ffe78c24');ac.save();ac.translate(e.x*w,e.y*h);if(!arcadeMotion.matches)ac.rotate(Math.sin(now*2+e.x*9)*.15);drawGoldenStar(ac,0,0,e.route?17:16);ac.restore();}
      else if(e.type==='shield')drawShieldPickup(e.x*w,e.y*h,19);
      else drawMeteor(e,w,h,now);
    }
    if(a.fever>0)ellipse(ac,a.x*w,a.y*h-25,48,48,'#dfebbc38');
    drawSurvivalPlayer(ac,a,a.x*w,a.y*h+20,80,'down',false,now);
  }
  if(a.hitFlash>0){ac.fillStyle='#edb19a55';ac.fillRect(0,0,w,h);}
  if(a.fever>0){rr(ac,18,17,124,30,10,'#f0d890e8');text(ac,'✦ FEVER TIME',80,32,12,'#6b6647');}
  if(a.combo>=2){rr(ac,18,54,115,28,9,'#fff5c8e5');text(ac,`🔥 ${a.combo} COMBO`,75,68,12,'#7a5417','center',800);}
  drawGameDetails(a,w,h);
  drawArcadeFeedback(now);
}
function help(){
  showModal('간단 도움말',`<div class="help-list"><p><b>이동</b> · WASD / 방향키 / 화면 클릭 (Shift 달리기)</p><p><b>상호작용</b> · E / Space로 채집, 대화, 가구 체험</p><p><b>경기</b> · 구장 입구에서 10 CP로 도전, 목표 점수를 넘기면 스탬프</p><p><b>성장</b> · 코인과 트로피로 구장 업그레이드, 가구로 섬 꾸미기</p><p><b>섬 여행</b> · ⛴ 버튼으로 세 섬을 무료 왕복</p></div><button class="soft-btn primary wide" id="helpDone">확인</button>`,'help');
  $('helpDone').onclick=settings;
}
function hasBackup(){try{return Boolean(localStorage.getItem(BACKUP_KEY));}catch(e){return false;}}
function downloadJson(text,name){const blob=new Blob([text],{type:'application/json'}),u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);}
function settings(){
  showModal('모험 기록과 설정',`<div class="speech">${storageWorks?'✓ 이 브라우저에 모험이 자동 저장되고 있어요.':'이 브라우저에서는 저장이 차단되어 있어요. 기록을 내보내 보관할 수 있어요.'}</div><div class="dialog-actions"><button class="soft-btn" id="soundToggle">효과음 · ${state.sound?"켜짐":"꺼짐"}</button><button class="soft-btn" id="openHelp">도움말</button></div><p>캐릭터, 재화, 스테이션 업그레이드, 가구, 주민 관계, 스탬프, 퀴즈 수첩, 날씨 상태를 함께 저장해요.</p><div class="dialog-actions"><button class="soft-btn primary" id="saveNow">지금 저장</button><button class="soft-btn" id="exportSave">기록 내보내기</button></div><div class="dialog-actions"><button class="soft-btn" id="importSave">기록 가져오기</button><button class="soft-btn" id="resetSave">새 모험 시작</button></div>${hasBackup()?'<div class="dialog-actions"><button class="soft-btn" id="exportBackup">읽지 못한 이전 저장 내보내기</button></div>':''}<input type="file" id="importInput" accept="application/json,.json" class="hidden"><p id="settingsMessage" class="hint">새 모험 시작은 한 번 더 확인 후 진행됩니다.</p>`,'settings');
  $('soundToggle').onclick=()=>{state.sound=!state.sound;dirty();sound('talk');$('soundToggle').textContent='효과음 · '+(state.sound?'켜짐':'꺼짐');};$('openHelp').onclick=help;
  $('saveNow').onclick=()=>{$('settingsMessage').textContent=save()?'지금까지의 모험을 저장했어요.':'저장이 차단되어 있어요. 기록 내보내기를 이용해 주세요.';};
  $('exportSave').onclick=()=>downloadJson(serializeSave(2),'mini-world-save.json');
  if($('exportBackup'))$('exportBackup').onclick=()=>{try{downloadJson(localStorage.getItem(BACKUP_KEY),'mini-world-backup.json');}catch(e){$('settingsMessage').textContent='백업을 읽지 못했어요.';}};
  $('importSave').onclick=()=>$('importInput').click();
  $('importInput').onchange=async e=>{
    const file=e.target.files[0];if(!file)return;
    try{
      if(file.size>1024*1024)throw Error('파일이 너무 커요.');
      const s=JSON.parse(await file.text());
      if(!ACCEPTED_VERSIONS.includes(s.version)||!s.history||!s.levels||!Array.isArray(s.decors)||!Array.isArray(s.discovered))throw Error('미니 월드 저장 파일이 아니에요.');
      clearTimeout(runtime.saveTimer);localStorage.setItem(SAVE_KEY,JSON.stringify(s));load();if(!hadSave)throw Error('기록 내용을 읽지 못했어요.');runtime.decorCooldowns=loadedDecorCooldowns;save();location.reload();
    }catch(err){$('settingsMessage').textContent='가져오지 못했어요. '+err.message;}
  };
  let confirmed=false;
  $('resetSave').onclick=()=>{
    if(!confirmed){confirmed=true;$('resetSave').textContent='정말 새로 시작하기';$('settingsMessage').textContent='현재 기록을 덮어씁니다. 보관하려면 먼저 내보내기를 눌러주세요.';return;}
    state=defaults();gameStore.getState().replace(state);runtime.stationReveal=null;runtime.decorCooldowns={};buildGround();trees.forEach(t=>t.readyAt=0);resources.forEach(r=>r.readyAt=0);runtime.camera={...state.player};clearInput();endDecor();save();closeModal();renderHud();renderSidebar();toast('새로운 모험이 시작됐어요!');
  };
}
function focusTrap(e,container){
  if(e.key!=='Tab')return;
  const focusables=[...container.querySelectorAll('button:not(:disabled),input:not(.hidden),[tabindex="0"]')].filter(el=>el.getClientRects().length);
  if(!focusables.length)return;
  const first=focusables[0],last=focusables.at(-1);
  if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
  else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
}
window.addEventListener('keydown',e=>{
  if(runtime.modal){focusTrap(e,$('modal'));if(e.code==='Escape'){e.preventDefault();closeModal();}return;}
  if(runtime.mode==='arcade'){
    focusTrap(e,$('arcade'));const a=runtime.arc;
    if(e.code==='Escape'){e.preventDefault();if(a.phase==='playing')pauseArcade();else if(a.phase==='paused')resumeArcade();else if(a.phase==='ready'||a.phase==='result')leaveArcade();return;}
    if(a.phase!=='playing')return;
    if(['Space','Enter','ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.code))e.preventDefault();
    runtime.keys[e.code]=true;if(e.repeat)return;
    if(a.id==='racing'){if(['ArrowUp','ArrowLeft','KeyW','KeyA'].includes(e.code))changeLane(-1);if(['ArrowDown','ArrowRight','KeyS','KeyD'].includes(e.code))changeLane(1);}
    if(a.id==='figure'&&['ArrowLeft','KeyA','ArrowRight','KeyD'].includes(e.code))figureHit(a,['ArrowLeft','KeyA'].includes(e.code)?'left':'right');
    if(e.code==='Space'||e.code==='Enter')beginArcadeAction(e.code);
    if(e.code==='KeyE')arcadeAction(true);
    if(e.code==='ShiftLeft'||e.code==='ShiftRight')activateBoost();
    return;
  }
  if(e.code==='Escape'){endDecor();clearInput();return;}
  if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space'].includes(e.code))e.preventDefault();
  runtime.keys[e.code]=true;if(!e.repeat&&(e.code==='KeyE'||e.code==='Space'))interact();
});
window.addEventListener('keyup',e=>{delete runtime.keys[e.code];if(e.code==='Space'||e.code==='Enter')releaseArcadeAction(e.code);});
window.addEventListener('blur',()=>{clearInput();if(runtime.arc?.phase==='playing')pauseArcade();save();});
document.addEventListener('visibilitychange',()=>{clearInput();if(document.hidden){if(runtime.arc?.phase==='playing')pauseArcade();save();}lastFrame=performance.now();});
window.addEventListener('pagehide',save);
function bindHold(el,dir){
  el.addEventListener('pointerdown',e=>{
    e.preventDefault();if(runtime.modal)return;
    if(runtime.mode==='arcade'){if(runtime.arc?.phase!=='playing')return;if(runtime.arc.id==='figure'){figureHit(runtime.arc,dir);return;}if(runtime.arc.id==='racing'){changeLane(dir==='left'?-1:1);return;}}
    runtime.touch[dir]=true;try{el.setPointerCapture?.(e.pointerId);}catch{}
  });
  for(const event of ['pointerup','pointercancel','lostpointercapture'])el.addEventListener(event,()=>{runtime.touch[dir]=false;});
}
document.querySelectorAll('[data-dir]').forEach(b=>bindHold(b,b.dataset.dir));
bindHold($('arcLeft'),'left');bindHold($('arcRight'),'right');bindHold($('arcUp'),'up');bindHold($('arcDown'),'down');
$('touchInteract').onclick=interact;$('arcAux').onclick=activateBoost;$('arcAction').onclick=e=>{if(e.detail===0)arcadeAction(false);};
$('arcAction').addEventListener('pointerdown',e=>{e.preventDefault();if(runtime.arc?.phase!=='playing')return;beginArcadeAction('pointer:'+e.pointerId);try{e.currentTarget.setPointerCapture(e.pointerId);}catch{}});
$('arcAction').addEventListener('pointerup',e=>releaseArcadeAction('pointer:'+e.pointerId));
for(const event of ['pointercancel','lostpointercapture'])$('arcAction').addEventListener(event,e=>releaseArcadeAction('pointer:'+e.pointerId,true));$('arcSpecial').onclick=()=>arcadeAction(true);
$('pauseArcade').onclick=()=>runtime.arc?.phase==='paused'?resumeArcade():pauseArcade();$('exitArcade').onclick=exitArcade;
canvas.addEventListener('pointerdown',e=>{
  if(runtime.mode!=='world'||runtime.modal)return;
  const r=canvas.getBoundingClientRect(),p=screenToWorld(e.clientX-r.left,e.clientY-r.top);
  if(runtime.decor||runtime.removeDecor){placeDecor(p);return;}
  if(hypot(p,islands[state.island].port)<90||Math.abs(p.x-islands[state.island].port.x)<85&&Math.abs(p.y-islands[state.island].port.y-75)<45){openFerry();return;}
  if(state.island!=='banana'&&hypot(p,{x:960,y:650})<100){islandPassport(state.island);return;}
  const plazaHit=plazaHitTest(p);if(plazaHit){if(plazaHit.kind==='plazaTrophy')openPlazaRecord(plazaHit.id);else openPlaza();return;}
  if(hypot(p,state.player)<75)interact();else pathTo(p);
  canvas.focus({preventScroll:true});
});
canvas.addEventListener('pointermove',e=>{const r=canvas.getBoundingClientRect();runtime.hover=screenToWorld(e.clientX-r.left,e.clientY-r.top);});
canvas.addEventListener('pointerleave',()=>runtime.hover=null);
$('modalClose').onclick=closeModal;$('modal').addEventListener('pointerdown',e=>{if(e.target===$('modal'))closeModal();});
$('plazaOverviewBtn').onclick=()=>state.island==='banana'?openPlaza():islandPassport(state.island);
$('characterBtn').onclick=characterModal;$('travelBtn').onclick=travelModal;$('helpBtn').onclick=help;$('settingsBtn').onclick=settings;
$('weatherBtn').onclick=cycleWeather;$('ferryBtn').onclick=openFerry;
$('audioBtn').onclick=()=>{state.sound=!state.sound;dirty();sound('talk');};
$('decorateBtn').onclick=()=>{if(runtime.decor||runtime.removeDecor)endDecor();else{setTab('decor');setDecor('flower');}};
$('zoomOut').onclick=()=>{state.zoom=clamp(state.zoom-.1,.7,1.4);save();};$('zoomIn').onclick=()=>{state.zoom=clamp(state.zoom+.1,.7,1.4);save();};
document.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>setTab(b.dataset.tab));
let lastFrame=performance.now(),lastPositionSave=0,lastSidebar=0;
function frame(now){
  const real=Math.min(.2,Math.max(0,(now-lastFrame)/1000)),steps=Math.max(1,Math.ceil(real/(1/30))),dt=real/steps;lastFrame=now;runtime.now=now/1000;
  if(!document.hidden){
    if(runtime.mode==='world'){if(!runtime.modal)for(let i=0;i<steps&&runtime.mode==='world'&&!runtime.modal;i++)updateWorld(dt,now);if(runtime.mode==='world')drawWorld(now/1000);}
    if(runtime.mode==='arcade'){for(let i=0;i<steps&&runtime.arc?.phase==='playing';i++)updateArcade(dt);drawArcade(now/1000);}
    if(now-lastPositionSave>8000){lastPositionSave=now;save();}
    if(now-lastSidebar>1200&&runtime.mode==='world'){lastSidebar=now;renderSidebar();}
  }
  requestAnimationFrame(frame);
}
new ResizeObserver(resize).observe($('worldFrame'));resize();
if(blocked(state.player.x,state.player.y))state.player={x:960,y:760};
runtime.camera={...state.player};renderHud();renderSidebar();save();
if(loadWarning)toast(loadWarning,true);
else setTimeout(()=>toast(!hadSave?'🌿 미니 월드 v23에 오신 걸 환영해요! 가구 체험과 구장 도전을 즐겨보세요!':'🌿 다시 만났네요! 새로운 섬 모험을 이어서 시작해요.'),700);
requestAnimationFrame(frame);


}
