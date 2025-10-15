/**
 * 학과/단과대학 목업 데이터
 */
export const mockDepartments = [
  { department: "컴퓨터공학과", college: "공과대학" },
  { department: "전자공학과", college: "공과대학" },
  { department: "기계공학과", college: "공과대학" },
  { department: "화학공학과", college: "공과대학" },
  { department: "경영학과", college: "경영대학" },
  { department: "경제학과", college: "경영대학" },
  { department: "국어국문학과", college: "인문대학" },
  { department: "영어영문학과", college: "인문대학" },
  { department: "수학과", college: "자연과학대학" },
  { department: "물리학과", college: "자연과학대학" },
  { department: "화학과", college: "자연과학대학" },
  { department: "생명과학과", college: "자연과학대학" },
];

/**
 * 고유 단과대학 목록
 */
export const uniqueColleges = Array.from(new Set(mockDepartments.map(d => d.college)));

/**
 * 고유 학과 목록
 */
export const uniqueDepartments = Array.from(new Set(mockDepartments.map(d => d.department)));
