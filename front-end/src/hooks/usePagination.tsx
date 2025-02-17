import React, { useEffect, useRef, useState } from 'react';

function usePagination() {
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const prevPage = () => {
    setPage((prev) => Math.max(prev - 1, 0));
  };

  const nextPage = () => {
    setPage((prev) => Math.min(prev + 1, totalPages - 1));
  };

  const PaginationDiv = ({
    children,
    containerStyle = {},
    slideStyle = {},
    ...props
  }: {
    children: React.ReactNode;
    containerStyle?: React.CSSProperties;
    slideStyle?: React.CSSProperties;
  }) => {
    const total = React.Children.count(children);
    useEffect(() => {
      setTotalPages(total);
    }, [total]);

    useEffect(() => {
      if (page >= totalPages && totalPages > 0) {
        setPage(totalPages - 1);
      }
    }, [totalPages]);

    const hiddenRef = useRef<HTMLDivElement>(null);
    const [contentHeight, setContentHeight] = useState<number | null>(null);

    useEffect(() => {
      if (hiddenRef.current) {
        setContentHeight(hiddenRef.current.offsetHeight);
      }
    }, [children]);

    const outerStyle: React.CSSProperties = {
      position: 'relative',
      width: '100%',
      height:
        containerStyle.height ||
        (contentHeight ? `${contentHeight}px` : 'auto'),
      ...containerStyle,
    };

    return (
      <div style={outerStyle} {...props}>
        {contentHeight === null && React.Children.count(children) > 0 && (
          <div
            ref={hiddenRef}
            style={{ visibility: 'hidden', position: 'static' }}
          >
            {React.Children.toArray(children)[0]}
          </div>
        )}
        {React.Children.map(children, (child, index) => {
          const slideWrapperStyle: React.CSSProperties = {
            display: index === page ? 'block' : 'none',
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
            ...slideStyle,
          };

          return (
            <div key={index} style={slideWrapperStyle}>
              {child}
            </div>
          );
        })}
      </div>
    );
  };

  return { setPage, prevPage, nextPage, PaginationDiv, page, totalPages };
}

export default usePagination;
