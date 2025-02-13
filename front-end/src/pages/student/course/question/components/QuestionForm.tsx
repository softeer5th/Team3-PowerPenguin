import S from './QuestionForm.module.css';

type QuestionFormProps = {
  inputValue: string;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  onInputSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  placeholder: string;
};

const QuestionForm = ({
  inputValue,
  setInputValue,
  onInputSubmit,
  placeholder,
}: QuestionFormProps) => {
  const INPUT_MAX_LENGTH = 200;

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const changeValue = e.target.value;
    if (changeValue.length <= INPUT_MAX_LENGTH) {
      setInputValue(changeValue);
    }
  };

  return (
    <form className={S.formContainer} onSubmit={onInputSubmit}>
      <textarea
        className={S.textareaBox}
        placeholder={placeholder}
        value={inputValue}
        onChange={(e) => handleTextChange(e)}
      />
      <div className={S.formFooter}>
        <div className={S.countText}>
          {inputValue.length}/{INPUT_MAX_LENGTH}
        </div>
        <button
          type="submit"
          className={S.sendButton}
          disabled={inputValue.trim().length === 0}
        >
          전송
        </button>
      </div>
    </form>
  );
};

export default QuestionForm;
