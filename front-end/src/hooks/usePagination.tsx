import React, { useEffect, useRef, useState } from 'react';

function usePagination() {
  const [page, setPage] = useState(0);
  const totalPagesRef = useRef<number>(0);

  const prevPage = () => {
    setPage((prev) => Math.max(prev - 1, 0));
  };

  const nextPage = () => {
    setPage((prev) => Math.min(prev + 1, totalPagesRef.current - 1));
  };

  const isPrevDisabled = page === 0;
  const isNextDisabled = page === totalPagesRef.current - 1;

  const PaginationDiv = ({
    children,
    containerStyle = {},
    innerStyle = {},
    ...props
  }: {
    children: React.ReactNode;
    containerStyle?: React.CSSProperties;
    innerStyle?: React.CSSProperties;
  }) => {
    const total = React.Children.count(children);

    useEffect(() => {
      totalPagesRef.current = total;
    }, [total]);
    return (
      <div
        style={{
          overflow: 'hidden',
          width: '100%',
          ...containerStyle,
        }}
        {...props}
      >
        <div
          style={{
            display: 'flex',
            transition: 'transform 0.3s ease',
            transform: `translateX(-${page * 100}%)`,
            ...innerStyle,
          }}
        >
          {React.Children.map(children, (child, index) => (
            <div style={{ flex: '0 0 100%' }} key={index}>
              {child}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return { prevPage, nextPage, PaginationDiv, isPrevDisabled, isNextDisabled };
}

export default usePagination;
