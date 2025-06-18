/**
 * 과목 모델
 * 과목 추가, 삭제, 목록 조회 등의 기능을 제공합니다.
 */

const SubjectModel = {
    // 과목 목록을 저장하는 키
    STORAGE_KEY: 'subjectList',
    
    /**
     * 모든 과목 목록을 가져옵니다.
     * @returns {Array<string>} 과목 이름 배열
     */
    getAllSubjects: function() {
        return StorageUtil.getItem(this.STORAGE_KEY, []);
    },
    
    /**
     * 새로운 과목을 추가합니다.
     * @param {string} subjectName - 추가할 과목 이름
     * @returns {boolean} 추가 성공 여부
     */
    addSubject: function(subjectName) {
        if (!subjectName || subjectName.trim() === '') {
            return false;
        }
        
        const trimmedName = subjectName.trim();
        const subjects = this.getAllSubjects();
        
        // 중복 과목 확인
        if (subjects.includes(trimmedName)) {
            return false;
        }
        
        subjects.push(trimmedName);
        return StorageUtil.setItem(this.STORAGE_KEY, subjects);
    },
    
    /**
     * 과목을 삭제합니다.
     * @param {string} subjectName - 삭제할 과목 이름
     * @returns {boolean} 삭제 성공 여부
     */
    deleteSubject: function(subjectName) {
        const subjects = this.getAllSubjects();
        const index = subjects.indexOf(subjectName);
        
        if (index === -1) {
            return false;
        }
        
        subjects.splice(index, 1);
        
        // 과목 삭제 시 관련 노트도 함께 삭제
        StorageUtil.removeItem(`notes_${subjectName}`);
        
        return StorageUtil.setItem(this.STORAGE_KEY, subjects);
    },
    
    /**
     * 특정 과목이 존재하는지 확인합니다.
     * @param {string} subjectName - 확인할 과목 이름
     * @returns {boolean} 존재 여부
     */
    subjectExists: function(subjectName) {
        const subjects = this.getAllSubjects();
        return subjects.includes(subjectName);
    }
};