import { useLocation } from 'react-router-dom'
import { useEffect } from 'react'

const smoothScrollToTop = (duration: number) => {
    const start = window.scrollY;
    const startTime = performance.now();

    const step = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1); // Tính phần trăm thời gian
        const ease = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2; // Hàm easing

        window.scrollTo(0, start - start * ease); // Cuộn từ vị trí hiện tại về 0

        if (progress < 1) {
            requestAnimationFrame(step);
        }
    };

    requestAnimationFrame(step);
};
const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        const delayScroll = setTimeout(() => {
            smoothScrollToTop(1000); // Cuộn trong 1 giây
        }, 0); // Delay 500ms

        return () => clearTimeout(delayScroll);
    }, [pathname]);

    return null;
};
export default ScrollToTop;