/**
 * 노트 모델
 * 노트 저장, 불러오기 등의 기능을 제공합니다.
 */

const NoteModel = {
    /**
     * 노트 저장소 키 생성
     * @param {string} subjectName - 과목 이름
     * @returns {string} 저장소 키
     */
    getStorageKey: function(subjectName) {
        return `notes_${subjectName}`;
    },
    
    /**
     * 특정 과목의 모든 주차 노트를 가져옵니다.
     * @param {string} subjectName - 과목 이름
     * @returns {Object} 주차별 노트 객체 {week: content}
     */
    getAllNotes: function(subjectName) {
        if (!subjectName) return {};
        return StorageUtil.getItem(this.getStorageKey(subjectName), {});
    },
    
    /**
     * 특정 과목의 특정 주차 노트를 가져옵니다.
     * @param {string} subjectName - 과목 이름
     * @param {number|string} week - 주차 (1-15)
     * @returns {string} 노트 내용
     */
    getNote: function(subjectName, week) {
        if (!subjectName || !week) return '';
        
        const notes = this.getAllNotes(subjectName);
        return notes[week] || '';
    },
    
    /**
     * 노트를 저장합니다.
     * @param {string} subjectName - 과목 이름
     * @param {number|string} week - 주차 (1-15)
     * @param {string} content - 노트 내용
     * @returns {boolean} 저장 성공 여부
     */
    saveNote: function(subjectName, week, content) {
        if (!subjectName || !week) return false;
        
        const notes = this.getAllNotes(subjectName);
        notes[week] = content;
        
        return StorageUtil.setItem(this.getStorageKey(subjectName), notes);
    },
    
    /**
     * 특정 과목의 특정 주차 노트를 삭제합니다.
     * @param {string} subjectName - 과목 이름
     * @param {number|string} week - 주차 (1-15)
     * @returns {boolean} 삭제 성공 여부
     */
    deleteNote: function(subjectName, week) {
        if (!subjectName || !week) return false;
        
        const notes = this.getAllNotes(subjectName);
        if (!notes[week]) return true; // 이미 없는 경우
        
        delete notes[week];
        return StorageUtil.setItem(this.getStorageKey(subjectName), notes);
    },
    
    /**
     * 특정 과목의 모든 노트를 삭제합니다.
     * @param {string} subjectName - 과목 이름
     * @returns {boolean} 삭제 성공 여부
     */
    deleteAllNotes: function(subjectName) {
        if (!subjectName) return false;
        return StorageUtil.removeItem(this.getStorageKey(subjectName));
    }
};