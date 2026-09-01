// JavaScript source code
const wrapper = document.getElementById('sliderWrapper');
const wrapper2 = document.getElementById('sliderWrapper2');
        const dots = document.querySelectorAll('.dot');
        const totalSlides = 3;
        let currentIndex = 0;

        function updateSlider() {
            // Shift the wrapper left based on the current slide index
            wrapper.style.transform = `translateX(-${currentIndex * 33.333}%)`;
            wrapper2.style.transform = `translateX(-${currentIndex * 33.333}%)`;
            
            // Update active dot visual
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        }

        function nextSlide() {
            // Move to next slide, or loop back to zero
            currentIndex = (currentIndex + 1) % totalSlides;
            updateSlider();
        }

        function goToSlide(index) {
            // Allows users to click dots to navigate manually
            currentIndex = index;
            updateSlider();
            resetTimer();
        }

        // Run nextSlide every 3000ms (3 seconds)
        let slideInterval = setInterval(nextSlide, 3000);

        function resetTimer() {
            // Restarts the timer if a user manually interacts with a dot
            clearInterval(slideInterval);
            slideInterval = setInterval(nextSlide, 3000);
        }