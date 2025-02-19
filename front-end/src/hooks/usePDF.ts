import React, { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

const CONTAINER_WIDTH = 1370;
const CONTAINER_HEIGHT = 770;

const getPageViewport = (page: pdfjsLib.PDFPageProxy, scaleFactor: number) => {
  const unscaledViewport = page.getViewport({ scale: 1 });
  const computedScale =
    unscaledViewport.height > unscaledViewport.width
      ? CONTAINER_HEIGHT / unscaledViewport.height
      : CONTAINER_WIDTH / unscaledViewport.width;
  return page.getViewport({ scale: scaleFactor * computedScale });
};

const createOffscreenCanvas = (
  width: number,
  height: number
): { canvas: HTMLCanvasElement; context: CanvasRenderingContext2D } | null => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  return context ? { canvas, context } : null;
};

const renderPage = async (
  pdf: pdfjsLib.PDFDocumentProxy,
  canvasRef: React.RefObject<HTMLCanvasElement>,
  currentPage: number,
  scale: number,
  renderTaskRef: React.MutableRefObject<pdfjsLib.RenderTask | null>
): Promise<void> => {
  const canvas = canvasRef.current;
  if (!canvas) return;

  const context = canvas.getContext('2d');
  if (!context) return;

  try {
    const page = await pdf.getPage(currentPage);
    const viewport = getPageViewport(page, scale);

    const offscreen = createOffscreenCanvas(viewport.width, viewport.height);
    if (!offscreen) {
      console.error('오프스크린 캔버스 컨텍스트를 생성할 수 없습니다.');
      return;
    }
    const { canvas: offscreenCanvas, context: offscreenContext } = offscreen;

    renderTaskRef.current?.cancel();

    const renderTask = page.render({
      canvasContext: offscreenContext,
      viewport,
    });
    renderTaskRef.current = renderTask;
    await renderTask.promise;

    canvas.width = viewport.width;
    canvas.height = viewport.height;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(offscreenCanvas, 0, 0);
  } catch (error: unknown) {
    const errorObj = error as Error;
    if (errorObj.name === 'RenderingCancelledException') {
      return;
    } else {
      console.error('페이지 렌더링 오류:', error);
    }
  }
};

function usePDF() {
  const [pdf, setPdf] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [scale, setScale] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const renderTaskRef = useRef<pdfjsLib.RenderTask | null>(null);

  const loadPdf = async (pdfSource: File | string) => {
    try {
      let loadingTask;
      if (typeof pdfSource === 'string') {
        loadingTask = pdfjsLib.getDocument(pdfSource);
      } else {
        const arrayBuffer = await pdfSource.arrayBuffer();
        loadingTask = pdfjsLib.getDocument({
          data: new Uint8Array(arrayBuffer),
        });
      }
      const pdfDoc = await loadingTask.promise;
      setPdf(pdfDoc);
      setCurrentPage(1);
    } catch (error) {
      console.error('PDF 로딩 오류:', error);
    }
  };

  useEffect(() => {
    if (pdf) {
      renderPage(pdf, canvasRef, currentPage, scale, renderTaskRef);
      containerRef.current?.focus();
    }
  }, [pdf, currentPage, scale]);

  const prevPage = () => {
    if (pdf && currentPage > 1) {
      setCurrentPage((prev) => Math.max(prev - 1, 1));
    }
  };

  const nextPage = () => {
    if (pdf && currentPage < pdf.numPages) {
      setCurrentPage((prev) => Math.min(prev + 1, pdf.numPages));
    }
  };

  const zoomIn = () => {
    if (pdf && scale < 3) {
      setScale((prev) => Math.min(prev + 0.1, 3));
    }
  };

  const zoomOut = () => {
    if (pdf && scale > 1) {
      setScale((prev) => Math.max(prev - 0.1, 1));
    }
  };

  const handleArrowKey = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      prevPage();
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      nextPage();
    }
  };

  return {
    scale,
    loadPdf,
    prevPage,
    nextPage,
    zoomIn,
    zoomOut,
    handleArrowKey,
    containerRef,
    canvasRef,
  };
}

export default usePDF;
