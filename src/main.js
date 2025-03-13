import './style.css';
import { stories } from './data.js';
import gsap from 'gsap';

// Set initial values
let activeStory = 0;
let previousStory = stories.length - 1;
const storyDuration = 3000;
let direction = "next";
let storyTimeout;

const cursor = document.querySelector('.cursor');
const cursorText = cursor.querySelector('p');

const isNext = () => {
    return direction === "next";
}

const findHighlight = () => {
    return document.querySelectorAll('.breadcrumbs-item .highlight')[activeStory];
}

const run = () => {
    animateImages();

    animateProfile();

    animateText();

    animateHighlight(activeStory);

    storyTimeout = setTimeout(changeStory, storyDuration);
}

const animateImages = () => {
    animateNewImage();
    animateOldImage();
}

const animateProfile = () => {
    animateOldProfileIcon();
    animateNewProfileIcon();

    animateOldProfileName();
    animateNewProfileName();
}

const animateText = () => {
    animateOldText();
    animateNewText();
}

const animateOldText = () => {
    const oldText = document.getElementById("text-" + previousStory);
    if (!oldText) return;

    const oldTextLines = oldText.querySelectorAll('.text-line');

    oldTextLines.forEach((line, i) => {
        const paragraph = line.querySelector('p');

        gsap.fromTo(
            paragraph,
            {
                y: 0,
            },
            {
                y: isNext() ? -60 : 60,
                duration: 0.5,
                ease: "power1.inOut",
                onComplete: () => {
                    oldText.remove();
                }
            }
        )
    });
}

const animateNewText = () => {
    const newText = document.createElement("div");
    newText.id = "text-" + activeStory;
    newText.classList.add("text");

    const textContainer = document.querySelector('.text-container');
    textContainer.appendChild(newText);

    stories[activeStory].title.map((line, i) => {
        const newTextLine = document.createElement("div");
        newTextLine.classList.add("text-line");
        const paragraph = document.createElement("p");
        paragraph.innerText = line;
        newTextLine.appendChild(paragraph);

        newText.appendChild(newTextLine);

        gsap.set(paragraph, {
            y: isNext() ? 60 : -60,
        });

        gsap.to(
            paragraph,
            {
                y: 0,
                duration: 1,
                ease: "power1.inOut",
            }
        )

        return newTextLine;
    });
}

const animateOldProfileName = () => {
    const oldProfileName = document.getElementById("profile-name-" + previousStory);
    if (!oldProfileName) return;

    gsap.fromTo(
        oldProfileName,
        {
            y: 0,
        },
        {
            y: isNext() ? -24 : 24,
            duration: 0.5,
            ease: "power1.inOut",
            onComplete: () => {
                oldProfileName.remove();
            }
        }
    )
}

const animateNewProfileName = () => {
    const newProfileName = document.createElement("p");
    newProfileName.id = "profile-name-" + activeStory;
    newProfileName.innerText = stories[activeStory].profileName;

    const profileNameContainer = document.querySelector('.profile-name');
    profileNameContainer.appendChild(newProfileName);

    gsap.set(newProfileName, {
        y: isNext() ? 24 : -24,
    });

    gsap.to(
        newProfileName,
        {
            y: 0,
            duration: 1,
            ease: "power1.inOut",
        }
    )
}

const animateOldProfileIcon = () => {
    const icon = document.getElementById("profile-icon-" + previousStory);
    if (!icon) return;

    gsap.fromTo(
        icon,
        {
            y: 0,
        },
        {
            y: isNext() ? -48 : 48,
            duration: 0.5,
            ease: "power1.inOut",
            onComplete: () => {
                icon.remove();
            }
        }
    )
}

const animateNewProfileIcon = () => {
    const profileIcon = createProfileIcon();

    gsap.set(profileIcon, {
        opacity: 0,
        clipPath: isNext()
            ? "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)"
            : "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
    });

    gsap.to(profileIcon, {
        opacity: 1,
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        duration: 0.5,
        delay: 0.5,
        ease: "power1.inOut",
    });
}

const createProfileIcon = () => {
    const newProfileIcon = document.createElement("img");

    newProfileIcon.id = "profile-icon-" + activeStory;
    newProfileIcon.src = stories[activeStory].profileImg;
    newProfileIcon.alt = stories[activeStory].profileName;

    const profileIconContainer = document.querySelector('.profile-icon');
    profileIconContainer.appendChild(newProfileIcon);

    return newProfileIcon;
}

const createImage = () => {
    const newImage = document.createElement("img");

    newImage.id = "img-" + activeStory;
    newImage.src = stories[activeStory].storyImg;
    newImage.alt = stories[activeStory].profileName;

    const storyImg = document.querySelector('.story-img');
    storyImg.appendChild(newImage);

    return newImage;
}

const animateOldImage = () => {
    const image = document.getElementById("img-" + previousStory);
    if (!image) return;

    gsap.fromTo(
        image,
        {
            scale: 1,
            rotate: 0,
        },
        {
            scale: 2,
            rotate: isNext() ? -25 : 25,
            duration: 1,
            ease: "power4.inOut",
            onComplete: () => {
                image.remove();
            }
        }
    )
}

const animateNewImage = () => {
    const image = createImage();

    gsap.set(image, {
        clipPath: isNext()
            ? "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%"
            : "0% 0%, 0% 0%, 0 % 100%, 0% 100%"
    });

    gsap.fromTo(
        image,
        {
            scale: 2,
            rotate: isNext() ? 25 : -25,
        },
        {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
            scale: 1,
            rotate: 0,
            duration: 1,
            ease: "power4.inOut",
        }
    )
}

const animateHighlight = () => {
    const highlight = findHighlight();

    gsap.set(highlight, {
        width: "0%",
        scaleX: 1,
        transformOrigin: "right center",
    });

    gsap.to(highlight, {
        width: "100%",
        duration: storyDuration / 1000,
    })
}

const resetHighlight = () => {
    const highlight = findHighlight();

    gsap.killTweensOf(highlight);

    gsap.to(highlight, {
        width: isNext() ? "100%" : "0%",
        duration: 0.3,
        ease: "power4.in",
        onStart: () => {
            gsap.to(highlight, {
                transformOrigin: "right center",
                scaleX: 0,
                duration: 0.3,
            });
        }
    })

}

const changeStory = () => {
    resetHighlight();

    setActiveStory();

    run();
}

const setActiveStory = () => {
    previousStory = activeStory;

    activeStory = isNext()
        ? (activeStory + 1) % stories.length
        : (activeStory - 1 + stories.length) % stories.length;
}

document.addEventListener('mousemove', e => {
    const { clientX, clientY } = e;

    gsap.to(cursor, {
        x: clientX - cursor.offsetWidth / 2,
        y: clientY - cursor.offsetHeight / 2,
        ease: "power2.out",
        duration: 0.3,
    })

    if(clientX < window.innerWidth / 2) {
        cursorText.textContent = "Prev";
        direction = "prev";
    }
    else {
        cursorText.textContent = "Next";
        direction = "next";
    }
});

// on click
document.addEventListener('click', () => {
    clearTimeout(storyTimeout);
    resetHighlight();
    changeStory();
})
// stop timeout for next story
// reset highlight (quickly animate to 100% or 0% width)
// change story

run();
