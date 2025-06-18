/**
 * 과목 컨트롤러
 * 과목 관련 UI 이벤트 처리 및 화면 렌더링을 담당합니다.
 */

const SubjectController = {
    // DOM 요소
    elements: {
        subjectInput: null,
        addSubjectBtn: null,
        subjectList: null,
        currentSubject: null
    },
    
    // 현재 선택된 과목
    selectedSubject: null,
    
    /**
     * 컨트롤러를 초기화합니다.
     */
    init: function() {
        // DOM 요소 참조 가져오기
        this.elements.subjectInput = document.getElementById('subject-input');
        this.elements.addSubjectBtn = document.getElementById('add-subject-btn');
        this.elements.subjectList = document.getElementById('subject-list');
        this.elements.currentSubject = document.getElementById('current-subject');
        
        // 이벤트 리스너 등록
        this.elements.addSubjectBtn.addEventListener('click', this.handleAddSubject.bind(this));
        this.elements.subjectInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleAddSubject();
            }
        });
        
        // 초기 과목 목록 렌더링
        this.renderSubjectList();
    },
    
    /**
     * 과목 추가 버튼 클릭 이벤트 핸들러
     */
    handleAddSubject: function() {
        const subjectName = this.elements.subjectInput.value.trim();
        
        if (!subjectName) {
            alert('과목명을 입력해주세요.');
            return;
        }
        
        // 과목 추가 시도
        const success = SubjectModel.addSubject(subjectName);
        
        if (success) {
            this.elements.subjectInput.value = ''; // 입력창 초기화
            this.renderSubjectList(); // 목록 갱신
        } else {
            alert('이미 존재하는 과목이거나 추가할 수 없습니다.');
        }
    },
    
    /**
     * 과목 삭제 버튼 클릭 이벤트 핸들러
     * @param {string} subjectName - 삭제할 과목 이름
     */
    handleDeleteSubject: function(subjectName) {
        if (confirm(`'${subjectName}' 과목을 삭제하시겠습니까? 관련된 모든 노트가 함께 삭제됩니다.`)) {
            const success = SubjectModel.deleteSubject(subjectName);
            
            if (success) {
                // 현재 선택된 과목이 삭제된 경우 선택 초기화
                if (this.selectedSubject === subjectName) {
                    this.selectSubject(null);
                }
                
                this.renderSubjectList(); // 목록 갱신
            } else {
                alert('과목 삭제에 실패했습니다.');
            }
        }
    },
    
    /**
     * 과목 선택 이벤트 핸들러
     * @param {string} subjectName - 선택할 과목 이름
     */
    selectSubject: function(subjectName) {
        this.selectedSubject = subjectName;
        
        // 현재 선택된 과목 표시 업데이트
        if (subjectName) {
            this.elements.currentSubject.textContent = `선택된 과목: ${subjectName}`;
        } else {
            this.elements.currentSubject.textContent = '선택된 과목: 없음';
        }
        
        // 과목 목록에서 선택 상태 업데이트
        const items = this.elements.subjectList.querySelectorAll('li');
        items.forEach(item => {
            if (item.dataset.subject === subjectName) {
                item.classList.add('selected');
            } else {
                item.classList.remove('selected');
            }
        });
        
        // 노트 컨트롤러에 선택된 과목 변경 알림
        if (NoteController) {
            NoteController.onSubjectChanged(subjectName);
        }
    },
    
    /**
     * 과목 목록을 화면에 렌더링합니다.
     */
    renderSubjectList: function() {
        const subjects = SubjectModel.getAllSubjects();
        this.elements.subjectList.innerHTML = '';
        
        if (subjects.length === 0) {
            const emptyMessage = document.createElement('p');
            emptyMessage.textContent = '등록된 과목이 없습니다.';
            emptyMessage.className = 'empty-message';
            this.elements.subjectList.appendChild(emptyMessage);
            return;
        }
        
        subjects.forEach(subject => {
            const li = document.createElement('li');
            li.dataset.subject = subject;
            
            // 과목 이름
            const subjectText = document.createElement('span');
            subjectText.textContent = subject;
            li.appendChild(subjectText);
            
            // 삭제 버튼
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = '삭제';
            deleteBtn.className = 'delete-subject';
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // 버블링 방지
                this.handleDeleteSubject(subject);
            });
            li.appendChild(deleteBtn);
            
            // 과목 선택 이벤트
            li.addEventListener('click', () => {
                this.selectSubject(subject);
            });
            
            // 현재 선택된 과목인 경우 강조 표시
            if (subject === this.selectedSubject) {
                li.classList.add('selected');
            }
            
            this.elements.subjectList.appendChild(li);
        });
    }
};