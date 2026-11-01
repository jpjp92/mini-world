// v23 저장 호환용 상수. 옛 저장 키 이름에 원작 명칭이 들어 있어 이 파일에만 둬요.
import { LEGACY_ID_MAP } from './roster';

export const LEGACY_SAVE_KEY = 'minion-world-explorer-v2';
export const SAVE_KEY = 'mini-world-save';

// 옛 저장(JSON 문자열)의 캐릭터 id를 새 id로 바꿔요. 키와 값 모두 "id" 형태로만 들어 있어요.
export function renameLegacyIds(raw: string): string {
  let out = raw;
  for (const [from, to] of Object.entries(LEGACY_ID_MAP)) {
    out = out.replaceAll(`"${from}"`, `"${to}"`);
  }
  return out;
}

// 새 키에 저장이 없고 옛 키에 있으면 복사해요. 옛 키는 지우지 않아요(롤백 대비).
export function importLegacySave(storage: Storage): boolean {
  try {
    if (storage.getItem(SAVE_KEY)) return false;
    let imported = false;
    for (const suffix of ['', '-backup']) {
      const raw = storage.getItem(LEGACY_SAVE_KEY + suffix);
      if (!raw) continue;
      storage.setItem(SAVE_KEY + suffix, renameLegacyIds(raw));
      imported = true;
    }
    return imported;
  } catch {
    return false;
  }
}
