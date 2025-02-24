import S from './Loading.module.css';
import LoadingIcon from '@/assets/icons/loading.svg?react';

const Loading = () => {
  return (
    <div className={S.loading}>
      <div className={S.loadingContainer}>
        <LoadingIcon className={S.loadingIcon} />
        <div className={S.loadingText}>Loading...</div>
      </div>
    </div>
  );
};

export default Loading;
