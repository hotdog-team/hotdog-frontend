const VIEW_LOG_PREFIX = 'd-to-view-log';

// view-log localStorage 전체 읽기
function readAll() {
    try {
        return JSON.parse(localStorage.getItem(VIEW_LOG_PREFIX) ?? '{}');
    } catch {
        return {};
    }
}

// 전체 기록
function writeAll(data) {
    localStorage.setItem(VIEW_LOG_PREFIX, JSON.stringify(data));
}

// 진입 확인
export function onEnter(productId) {
    const all = readAll();
    const id = String(productId);

    if(!all[id]) {
        all[id] = { enterAt: Date.now(), sent: false };
        writeAll(all);
    }
}

// 체류시간 계산
export function getStayDuration(productId) {
    const entry = readAll()[String(productId)];
    if (!entry?.enterAt) return 0;
    return Date.now() - entry.enterAt;
}

// 이미 보냈는지 확인(isSent)
export function isSent(productId) {
    return readAll()[String(productId)]?.sent === true;
}

// 전송 성공
export function markSent(productId) {
    const all = readAll();
    const id = String(productId);

    if (all[id]) {
        all[id].sent = true;
        writeAll(all);
    }
}
