// vercel-prebuild.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const apiUrl = process.env.VITE_API_URL;
if (!apiUrl) {
  console.error('Error: VITE_API_URL 환경변수가 설정되어 있지 않습니다.');
  process.exit(1);
}

const vercelJsonPath = path.join(__dirname, 'vercel.json');

try {
  // vercel.json 파일 읽기
  const fileContent = fs.readFileSync(vercelJsonPath, 'utf8');

  // 파일 내의 모든 "VITE_API_URL" 문자열을 실제 환경변수 값으로 치환
  const updatedContent = fileContent.replace(/VITE_API_URL/g, apiUrl);

  // 치환된 내용을 다시 vercel.json 파일에 기록
  fs.writeFileSync(vercelJsonPath, updatedContent, 'utf8');
  console.log('vercel.json 파일이 성공적으로 업데이트되었습니다.');
} catch (error) {
  console.error('vercel.json 파일 처리 중 에러 발생:', error);
  process.exit(1);
}
