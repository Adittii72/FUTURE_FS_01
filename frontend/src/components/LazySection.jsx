import { useState, useEffect, useRef } from 'react';

/**
 * Mounts children only when the section nears the viewport.
 * Defers API calls and heavy components until the user scrolls.
 */
const LazySection = ({ id, children, minHeight = '50vh', rootMargin = '300px' }) => {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin, threshold: 0.01 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [rootMargin]);

  return (
    <section
      id={id}
      ref={ref}
      className="relative z-10"
      style={!visible ? { minHeight } : undefined}
    >
      {visible ? children : null}
    </section>
  );
};

export default LazySection;
