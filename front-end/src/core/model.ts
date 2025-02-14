export type Professor = {
  name: string;
  email: string;
  profileURL: string;
};

export type Schedule = {
  day: '월' | '화' | '수' | '목' | '금' | '토' | '일';
  start: string;
  end: string;
};

export type Reaction = 'okay' | 'clap' | 'thumb' | 'scream' | 'cry' | 'like';

export const RequestHard = {
  kind: 'hard',
  title: '어려워요 🥲',
  description: '한번만 더 설명해주세요!',
} as const;

export const RequestFast = {
  kind: 'fast',
  title: '너무 빨라요 😣',
  description: '조금만 더 천천히 부탁드려요!',
} as const;

export const RequestQuestion = {
  kind: 'question',
  title: '질문 있어요 🥺',
  description: '질문창 한번 봐주세요!',
} as const;

export const RequestSize = {
  kind: 'size',
  title: '화면이 잘 안 보여요 🧐',
  description: '확대 부탁드려요!',
} as const;

export const RequestSound = {
  kind: 'sound',
  title: '소리가 잘 안 들려요 😕',
  description: '조금만 더 크게 부탁드려요!',
} as const;

export type Requests = [
  {
    type: typeof RequestHard;
    count: number;
  },
  {
    type: typeof RequestFast;
    count: number;
  },
  {
    type: typeof RequestQuestion;
    count: number;
  },
  {
    type: typeof RequestSize;
    count: number;
  },
  {
    type: typeof RequestSound;
    count: number;
  },
];

export type Question = {
  id: string;
  time: string;
  content: string;
};

export type Course = {
  id: number;
  name: string;
  code: string;
  capacity: number;
  university: string;
  classType: '전공' | '교양' | '기타';
  schedule: Schedule[];
  accessCode: number;
  fileURL: string;
  requests: Requests;
  questions: Question[];
};

export type CourseMeta = Omit<Course, 'requests' | 'questions'>;

export type CourseSummary = Omit<CourseMeta, 'id' | 'accessCode' | 'fileURL'>;

export type ResponseError = {
  success: boolean;
  errorCode: string;
  message: string;
};
