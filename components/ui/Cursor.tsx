// "use client";

// import { useEffect, useState } from "react";
// import styles from "./Cursor.module.css";

// export default function Cursor() {
//   const [coords, setCoords] = useState({ x: 0, y: 0 });
//   const numCircles = 40;
//   const [circles, setCircles] = useState(
//     new Array(numCircles).fill().map(() => ({ x: 0, y: 0 }))
//   );

//   useEffect(() => {
//     document.documentElement.dataset.cursorTheme = "default";
//     const handleMouseMove = (e) => {
//       setCoords({ x: e.clientX, y: e.clientY });
//     };

//     window.addEventListener("mousemove", handleMouseMove);
//     return () => window.removeEventListener("mousemove", handleMouseMove);
//   }, []);

//   useEffect(() => {
//     let animationFrame;
//     const animateCircles = () => {
//       setCircles((prevCircles) => {
//         let x = coords.x;
//         let y = coords.y;
//         return prevCircles.map((circle, index) => {
//           const nextCircle = prevCircles[index - 1] || { x, y };
//           x += (nextCircle.x - x) * 0.3;
//           y += (nextCircle.y - y) * 0.3;
//           return { x, y };
//         });
//       });
//       animationFrame = requestAnimationFrame(animateCircles);
//     };
//     animateCircles();
//     return () => cancelAnimationFrame(animationFrame);
//   }, [coords]);

//   useEffect(() => {
//     const navbar = document.querySelector(".navbar");

//     const handleMouseEnter = () => {
//       document.documentElement.dataset.cursorTheme = "noColor";
//     };

//     const handleMouseLeave = () => {
//       document.documentElement.dataset.cursorTheme = "default";
//     };

//     if (navbar) {
//       navbar.addEventListener("mouseenter", handleMouseEnter);
//       navbar.addEventListener("mouseleave", handleMouseLeave);
//     }

//     return () => {
//       if (navbar) {
//         navbar.removeEventListener("mouseenter", handleMouseEnter);
//         navbar.removeEventListener("mouseleave", handleMouseLeave);
//       }
//     };
//   }, []);

//   return (
//     <div className={styles.cursor}>
//       {circles.map((circle, index) => (
//         <div
//           key={index}
//           className={styles.circle}
//           style={{
//             left: circle.x - 12,
//             top: circle.y - 12,
//             transform: `scale(${(circles.length - index) / circles.length})`,
//           }}
//         />
//       ))}
//     </div>
//   );
// }


"use client";

import { useEffect, useState, useRef } from "react";
import styles from "./Cursor.module.css";

export default function Cursor() {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const numCircles = 30;
  const circlesRef = useRef(
    new Array(numCircles).fill().map(() => ({ x: 0, y: 0 }))
  );
  const cursorRef = useRef(null);
  const requestRef = useRef(null);

  useEffect(() => {
    document.documentElement.dataset.cursorTheme = "default";

    const handleMouseMove = (e) => {
      setCoords({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const animateCircles = () => {
      let x = coords.x;
      let y = coords.y;
      circlesRef.current = circlesRef.current.map((circle, index) => {
        const nextCircle = circlesRef.current[index - 1] || { x, y };
        x += (nextCircle.x - x) * 0.3;
        y += (nextCircle.y - y) * 0.3;
        return { x, y };
      });

      if (cursorRef.current) {
        cursorRef.current.childNodes.forEach((circle, index) => {
          circle.style.left = `${circlesRef.current[index].x - 12}px`;
          circle.style.top = `${circlesRef.current[index].y - 12}px`;
          circle.style.transform = `scale(${(numCircles - index) / numCircles})`;
        });
      }

      requestRef.current = requestAnimationFrame(animateCircles);
    };

    requestRef.current = requestAnimationFrame(animateCircles);
    return () => cancelAnimationFrame(requestRef.current);
  }, [coords]);

  useEffect(() => {
    const updateCursorListeners = () => {
      const sensitiveAreas = document.querySelectorAll(".sensitive-cursor");
  
      const handleMouseEnter = () => {
        document.documentElement.dataset.cursorTheme = "noColor";
      };
  
      const handleMouseLeave = () => {
        document.documentElement.dataset.cursorTheme = "default";
      };
  
      sensitiveAreas.forEach((area) => {
        area.removeEventListener("mouseenter", handleMouseEnter);
        area.removeEventListener("mouseleave", handleMouseLeave);
        
        area.addEventListener("mouseenter", handleMouseEnter);
        area.addEventListener("mouseleave", handleMouseLeave);
      });
    };
  
    updateCursorListeners(); 
      
    const observer = new MutationObserver(() => updateCursorListeners());
    observer.observe(document.body, { childList: true, subtree: true });
  
    return () => observer.disconnect();
  }, []);
  

  return (
    <div className={styles.cursor} ref={cursorRef}>
      {circlesRef.current.map((_, index) => (
        <div key={index} className={styles.circle} />
      ))}
    </div>
  );
}
