import S from './PDFViewer.module.css';
import React from 'react';

export type PDFViewerProps = {
  containerRef: React.RefObject<HTMLDivElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  handleArrowKey: (event: React.KeyboardEvent) => void;
};

const PDFViewer: React.FC<PDFViewerProps> = ({
  containerRef,
  canvasRef,
  handleArrowKey,
}) => {
  return (
    <div className="pdf-viewer">
      <div
        style={{
          width: '1370px',
          height: '770px',
        }}
        className={S.PDFContainer}
        tabIndex={0}
        autoFocus
        onKeyDown={handleArrowKey}
        ref={containerRef}
      >
        <canvas
          ref={canvasRef}
          style={{
            display: 'block',
            margin: 'auto',
          }}
        />
      </div>
    </div>
  );
};

export default PDFViewer;
