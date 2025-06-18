/**
 * localStorage 유틸리티 함수
 * 데이터 저장, 불러오기, 삭제 기능을 제공합니다.
 */

const StorageUtil = {
    /**
     * localStorage에 데이터를 저장합니다.
     * @param {string} key - 저장할 데이터의 키
     * @param {any} value - 저장할 데이터 값 (자동으로 JSON 문자열로 변환됨)
     */
    setItem: function(key, value) {
        try {
            const serializedValue = JSON.stringify(value);
            localStorage.setItem(key, serializedValue);
            return true;
        } catch (error) {
            console.error('localStorage 저장 오류:', error);
            return false;
        }
    },

    /**
     * localStorage에서 데이터를 불러옵니다.
     * @param {string} key - 불러올 데이터의 키
     * @param {any} defaultValue - 데이터가 없을 경우 반환할 기본값
     * @returns {any} 불러온 데이터 (자동으로 JSON 파싱됨)
     */
    getItem: function(key, defaultValue = null) {
        try {
            const serializedValue = localStorage.getItem(key);
            if (serializedValue === null) {
                return defaultValue;
            }
            return JSON.parse(serializedValue);
        } catch (error) {
            console.error('localStorage 불러오기 오류:', error);
            return defaultValue;
        }
    },

    /**
     * localStorage에서 데이터를 삭제합니다.
     * @param {string} key - 삭제할 데이터의 키
     */
    removeItem: function(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('localStorage 삭제 오류:', error);
            return false;
        }
    },

    /**
     * 특정 접두사로 시작하는 모든 키를 찾습니다.
     * @param {string} prefix - 찾을 키 접두사
     * @returns {Array<string>} 접두사로 시작하는 키 배열
     */
    getKeysByPrefix: function(prefix) {
        const keys = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith(prefix)) {
                keys.push(key);
            }
        }
        return keys;
    },

    /**
     * localStorage를 완전히 비웁니다.
     */
    clear: function() {
        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.error('localStorage 초기화 오류:', error);
            return false;
        }
    }
};