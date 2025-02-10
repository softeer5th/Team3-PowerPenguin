import S from './LayoutTab.module.css';

type LayoutTabProps = {
  text: string;
  isActive: boolean;
};

const LayoutTab = ({ text, isActive }: LayoutTabProps) => {
  return (
    <div className={`${S.TabContainer} ${isActive ? S.active : ''}`}>
      {text}
    </div>
  );
};

export default LayoutTab;
