window.addEventListener('load', function() {
    if (pageContext == "index") {
        if (mq3.matches) {
            const tl = gsap.timeline({
                scrollTrigger: {
                    scrub: 1,
                    trigger: "#void",
                    start: "top 0%",
                    endTrigger: "#workList",
                    end: "top 0%",
                },
            });

            tl.to("#logo", { translateY: "-50vh" }),
                tl.to("#text1", { translateY: "-70vh", opacity: 0 }, '<'),
                tl.to("#deco1", { opacity: 0 }, '<'),
                tl.to("#deco2", { opacity: 0 }, '<'),
                tl.to("#deco3", { opacity: 0 }, '<');

            // ScrollforCables

            ScrollTrigger.create({
                start: "top 50%",
                endTrigger: "#workList",
                end: "top 50%",
                onUpdate: (self) => handleScrollProgress(self.progress, "workScroll"),
            });

            ScrollTrigger.create({
                trigger: "#contact",
                start: "top 50%",

                end: "bottom 100%",
                onUpdate: (self) => handleScrollProgress(self.progress, "aboutScroll"),
            });

            //    Snapping 

            // ScrollTrigger.create({
            //     trigger: "#workList",
            //     onLeave: () => {
            //         gsap.to(window, {
            //             scrollTo: {
            //                 y: "#contact", // Scroll to this element
            //                 offsetY: -50, // Optional: Offset for precise positioning
            //             },
            //             duration: 2, // Duration of the scroll animation
            //         });
            //         CABLES.patch.setVariable("stringTexture", "src.phag");
            //     },
            // });

            ScrollTrigger.create({
                trigger: "#workList",
                start: "top center", // Adjust as needed
                onEnter: () => {
                    gsap.to(window, {
                        scrollTo: {
                            y: "#workList", // Scroll to this element
                            offsetY: 70, // Optional: Offset for precise positioning
                        },
                        duration: 1, // Duration of the scroll animation
                    });
                    CABLES.patch.setVariable("stringTexture", "work");
                },
            });

            // ScrollTrigger.create({
            //     trigger: "#contact",
            //     onLeave: () => {
            //         gsap.to(window, {
            //             scrollTo: {
            //                 y: "#workList", // Scroll to this element
            //                 offsetY: 70, // Optional: Offset for precise positioning
            //             },
            //             duration: 2, // Duration of the scroll animation
            //         });
            //         CABLES.patch.setVariable("stringTexture", "work");
            //     },
            // });
        }

        // FadeIn work Elements

        const fadeInAnimation = gsap.timeline({
            paused: true,
            defaults: { opacity: 0, top: "100px" },
          });
          
        fadeInAnimation.to(".work", {
            opacity: 1,
            duration: 1,
            top: "0px",
            stagger: 0.1,
        });

        const options = {
            root: null,
            rootMargin: "0px",
            threshold: 0.2,
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    // Start the GSAP animation when the element is visible
                    fadeInAnimation.play();
                    observer.unobserve(entry.target); // Stop observing once animation starts
                }
            });
        }, options);

        // Start observing each grid item

        gridItems.forEach((item) => {
            observer.observe(item);
        });
    };
});