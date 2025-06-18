/**
 * 노트 컨트롤러
 * 노트 관련 UI 이벤트 처리 및 화면 렌더링을 담당합니다.
 */

const NoteController = {
    // DOM 요소
    elements: {
        weekSelect: null,
        noteContent: null,
        saveNoteBtn: null,
        saveStatus: null,
        fileInput: null,
        downloadNoteBtn: null
    },
    
    // 현재 선택된 과목 및 주차
    currentSubject: null,
    currentWeek: null,
    
    // 자동 저장 타이머
    autoSaveTimer: null,
    autoSaveInterval: 30000, // 30초마다 자동 저장
    
    /**
     * 컨트롤러를 초기화합니다.
     */
    init: function() {
        // DOM 요소 참조 가져오기
        this.elements.weekSelect = document.getElementById('week-select');
        this.elements.noteContent = document.getElementById('note-content');
        this.elements.saveNoteBtn = document.getElementById('save-note-btn');
        this.elements.saveStatus = document.getElementById('save-status');
        this.elements.fileInput = document.getElementById('note-file-input');
        this.elements.downloadNoteBtn = document.getElementById('download-note-btn');
        
        // 이벤트 리스너 등록
        this.elements.weekSelect.addEventListener('change', this.handleWeekChange.bind(this));
        this.elements.saveNoteBtn.addEventListener('click', this.handleSaveNote.bind(this));
        this.elements.noteContent.addEventListener('input', this.handleNoteInput.bind(this));
        this.elements.downloadNoteBtn.addEventListener('click', this.handleDownloadNote.bind(this));
        
        // 파일 업로드 이벤트 리스너 등록
        if (this.elements.fileInput) {
            this.elements.fileInput.addEventListener('change', this.handleFileUpload.bind(this));
        }
        
        // 초기 상태 설정 (비활성화)
        this.updateUIState(false);
    },
    
    /**
     * 과목 변경 이벤트 핸들러 (SubjectController에서 호출)
     * @param {string} subjectName - 선택된 과목 이름
     */
    onSubjectChanged: function(subjectName) {
        this.currentSubject = subjectName;
        this.currentWeek = null;
        
        // 주차 선택 초기화
        this.elements.weekSelect.value = '';
        
        // UI 상태 업데이트
        this.updateUIState(!!subjectName);
        
        // 노트 내용 초기화
        this.elements.noteContent.value = '';
        
        // 자동 저장 타이머 초기화
        this.resetAutoSaveTimer();
    },
    
    /**
     * 주차 변경 이벤트 핸들러
     */
    handleWeekChange: function() {
        const weekValue = this.elements.weekSelect.value;
        this.currentWeek = weekValue ? parseInt(weekValue, 10) : null;
        
        // 선택된 주차가 있으면 노트 불러오기
        if (this.currentWeek && this.currentSubject) {
            this.loadNote();
            this.elements.noteContent.disabled = false;
            this.elements.saveNoteBtn.disabled = false;
            this.elements.downloadNoteBtn.disabled = false;
        } else {
            this.elements.noteContent.value = '';
            this.elements.noteContent.disabled = true;
            this.elements.saveNoteBtn.disabled = true;
            this.elements.downloadNoteBtn.disabled = true;
        }
        
        // 자동 저장 타이머 초기화
        this.resetAutoSaveTimer();
    },
    
    /**
     * 노트 입력 이벤트 핸들러
     */
    handleNoteInput: function() {
        // 저장 상태 메시지 초기화
        this.elements.saveStatus.textContent = '';
        
        // 자동 저장 타이머 재설정
        this.resetAutoSaveTimer();
    },
    
    /**
     * 노트 저장 버튼 클릭 이벤트 핸들러
     */
    handleSaveNote: function() {
        if (!this.currentSubject || !this.currentWeek) {
            alert('과목과 주차를 선택해주세요.');
            return;
        }
        
        const content = this.elements.noteContent.value;
        this.saveNote(content);
    },
    
    /**
     * 노트를 저장합니다.
     * @param {string} content - 저장할 노트 내용
     */
    saveNote: function(content) {
        if (!this.currentSubject || !this.currentWeek) return;
        
        const success = NoteModel.saveNote(this.currentSubject, this.currentWeek, content);
        
        if (success) {
            this.showSaveStatus('저장되었습니다.');
        } else {
            this.showSaveStatus('저장 실패!', true);
        }
    },
    
    /**
     * 현재 선택된 과목과 주차에 해당하는 노트를 불러옵니다.
     */
    loadNote: function() {
        if (!this.currentSubject || !this.currentWeek) return;
        
        const noteContent = NoteModel.getNote(this.currentSubject, this.currentWeek);
        this.elements.noteContent.value = noteContent;
    },
    
    /**
     * 저장 상태 메시지를 표시합니다.
     * @param {string} message - 표시할 메시지
     * @param {boolean} isError - 오류 메시지 여부
     */
    showSaveStatus: function(message, isError = false) {
        this.elements.saveStatus.textContent = message;
        this.elements.saveStatus.style.color = isError ? '#f44336' : '#4caf50';
        
        // 3초 후 메시지 사라짐
        setTimeout(() => {
            this.elements.saveStatus.textContent = '';
        }, 3000);
    },
    
    /**
     * 자동 저장 타이머를 재설정합니다.
     */
    resetAutoSaveTimer: function() {
        // 기존 타이머 제거
        if (this.autoSaveTimer) {
            clearTimeout(this.autoSaveTimer);
        }
        
        // 과목과 주차가 선택된 경우에만 자동 저장 타이머 설정
        if (this.currentSubject && this.currentWeek) {
            this.autoSaveTimer = setTimeout(() => {
                const content = this.elements.noteContent.value;
                this.saveNote(content);
            }, this.autoSaveInterval);
        }
    },
    
    /**
     * UI 상태를 업데이트합니다.
     * @param {boolean} enabled - 활성화 여부
     */
    updateUIState: function(enabled) {
        this.elements.weekSelect.disabled = !enabled;
        this.elements.noteContent.disabled = true; // 주차 선택 전까지는 항상 비활성화
        this.elements.saveNoteBtn.disabled = true; // 주차 선택 전까지는 항상 비활성화
        this.elements.downloadNoteBtn.disabled = true; // 주차 선택 전까지는 다운로드 버튼 비활성화
        if (this.elements.fileInput) {
            this.elements.fileInput.disabled = !enabled; // 과목 선택 전까지는 파일 업로드 비활성화
        }
    },
    
    /**
     * 파일 업로드 이벤트 핸들러
     * @param {Event} event - 파일 업로드 이벤트
     */
    handleFileUpload: function(event) {
        const file = event.target.files[0];
        if (!file || !file.name.endsWith('.txt')) {
            alert('텍스트 파일(.txt)만 업로드 가능합니다.');
            return;
        }
        
        if (!this.currentSubject || !this.currentWeek) {
            alert('먼저 과목과 주차를 선택해주세요.');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target.result;
            this.elements.noteContent.value = content;
            this.showSaveStatus('파일이 업로드되었습니다.');
            this.resetAutoSaveTimer(); // 자동 저장 예약
        };
        reader.readAsText(file);
        
        // 파일 선택 초기화 (같은 파일을 다시 선택할 수 있도록)
        event.target.value = '';
    },
    
    /**
     * 노트 다운로드 이벤트 핸들러
     */
    handleDownloadNote: function() {
        if (!this.currentSubject || !this.currentWeek) {
            alert('과목과 주차를 선택해주세요.');
            return;
        }

        const content = this.elements.noteContent.value;
        const fileName = `${this.currentSubject}_${this.currentWeek}주차_노트.txt`;
        
        // Blob 객체 생성
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        
        // 다운로드 링크 생성 및 클릭
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        this.showSaveStatus('다운로드가 시작되었습니다.');
    }
};