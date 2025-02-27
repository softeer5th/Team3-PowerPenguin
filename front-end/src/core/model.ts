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

export type Reaction =
  | 'OKAY'
  | 'CLAP'
  | 'THUMBS_UP'
  | 'HEART_EYES'
  | 'CRYING'
  | 'SURPRISED';

export type ReactionType = {
  id: string;
  type: Reaction;
};

export const RequestHard = {
  kind: 'DIFFICULT',
  title: '어려워요 🥲',
  description: '한번만 더 설명해주세요!',
} as const;

export const RequestFast = {
  kind: 'TOO_FAST',
  title: '너무 빨라요 😣',
  description: '조금만 더 천천히 부탁드려요!',
} as const;

export const RequestQuestion = {
  kind: 'HAVE_QUESTION',
  title: '질문 있어요 🥺',
  description: '질문창 한번 봐주세요!',
} as const;

export const RequestSize = {
  kind: 'SCREEN_ISSUE',
  title: '화면이 잘 안 보여요 🧐',
  description: '확대 부탁드려요!',
} as const;

export const RequestSound = {
  kind: 'SOUND_ISSUE',
  title: '소리가 잘 안 들려요 😕',
  description: '조금만 더 크게 부탁드려요!',
} as const;

export type RequestType =
  | (typeof RequestHard)['kind']
  | (typeof RequestFast)['kind']
  | (typeof RequestQuestion)['kind']
  | (typeof RequestSize)['kind']
  | (typeof RequestSound)['kind'];

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
  createdAt: string;
  content: string;
};

export type Course = {
  id: string;
  name: string;
  code: string;
  capacity: number;
  university: string;
  classType: '전공' | '교양' | '기타';
  schedule: Schedule[];
  accessCode: number;
  fileName: string;
  requests: Requests;
  questions: Question[];
};

export type ProfessorQuestion = Omit<Question, 'createdAt'>;

export type CourseMeta = Omit<Course, 'requests' | 'questions'>;

export type CourseSummary = Omit<CourseMeta, 'id' | 'accessCode' | 'fileName'>;

export type ResponseError = {
  success: boolean;
  errorCode: string;
  message: string;
};
