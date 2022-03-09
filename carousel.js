const carousel = document.querySelector(".carousel");
const slides = document.querySelector(".slides");
const navigators = document.querySelector(".navigators");
const indicators = document.querySelector(".indicators")

// direction is negative : shifting right
// direction is positive : shifing left
let direction = -1;
let currentSlide = 0;
let diff;
let timeInterval;
let infiniteScroll;
let slideWidth;
let timer;
let infiniteScrollDirection;
let slideCount;

function shiftLeft(){
    if(direction===-1){
        slides.append(slides.firstElementChild);
        carousel.style.justifyContent = 'flex-end';
   }
   direction = 1;
   slides.style.transform = `translate(${direction*slideWidth}%)`;
}


function shiftRight(){
    if(direction === 1){
        slides.prepend(slides.lastElementChild);
        carousel.style.justifyContent = 'flex-start';
    }   
    direction = -1;
    slides.style.transform = `translate(${direction*slideWidth}%)`;
}


function autoRotate(){
    clearInterval(timer);
    timer  = setInterval(()=>{
        diff = -infiniteScrollDirection;
        infiniteScrollDirection > 0 ? shiftLeft() : shiftRight();
    },timeInterval);
}



/**
 * it used to do the activities at the end of the each transition 
 * 
 */
function addTailer(){
    document.addEventListener("transitionend",()=>{
        let c = 0;
        if(direction === -1){
            while(c!=diff){
                slides.append(slides.firstElementChild);
                c++;
            }
        }
        if(direction === 1){
            while(c!=diff){ 
                slides.prepend(slides.lastElementChild);
                c--;
            }
        }
        slides.style.transition = "none";
        slides.style.transform = "translate(0)";
        setTimeout(()=>{
            slides.style.transition=`all ${timeInterval/1000}s linear`;
            
        })
        indicators.children[currentSlide].classList.remove("active");
        let  newSlide = currentSlide+parseInt(diff);
        if(newSlide === slideCount)
            newSlide = 0;
        if(newSlide === -1)
            newSlide = slideCount-1;
        indicators.children[newSlide].classList.add("active");
        currentSlide = newSlide;
    })
}

/**
 * 
 * @param {*} width 
 * @param {*} height 
 * @param {*} slideCount 
 * @description dimensions of carosel
 */
function defineCaraousel(width,height,slideCount){
    carousel.style.width=width;
    carousel.style.height=height;
    slides.style.width = `${slideCount*100}%`
}

/**
 * 
 * @param {*} slidesArr array of slides
 * @param {*} slideWidth width of each slide
 * @param {*} defaultSlide default slide to start with
 * @description it injects the slides starting with default slide
 */
function addSlides(slidesArr,slideWidth,defaultSlide){
    slides.innerHTML = slidesArr.slice(defaultSlide)
    .concat(slidesArr.slice(0,defaultSlide))
    .map((slide,index) => (
        `<div class="slide" id="${index}" style="width:${slideWidth}%">${slide}</div>`
    )).join("");
    slides.addEventListener('mouseenter',()=>{
        clearInterval(timer);
    })
    slides.addEventListener('mouseleave',()=>{
        if(infiniteScroll)
            autoRotate();
    })
}

/**
 * 
 * @param {*} slideCount  number of slides
 * @param {*} defaultSlide  starting slide
 * @description injects the indicators to html skeleton
 */
function addIndicators(slideCount,defaultSlide){
    //based on slide count indicators will render.
    let str = '';
    for(let i=0;i<slideCount;i++)
        str+=`<div id="${i}" class="circle ${i=== defaultSlide ? "active" : ""}"></div>`;
    indicators.innerHTML = str;

    /**
     * when user clicks any indicator it stops the auto rotate
     * after manual transition auto rotate will enable.
     */
    indicators.addEventListener('click',(e)=>{
        clearInterval(timer);
        const newSlide = e.target.id;
        diff = newSlide-currentSlide;
        if(diff>0)
            shiftRight();
        if(diff<0)
            shiftLeft();  
        if(infiniteScroll) 
            autoRotate();
    })
}




/**
 *   script to add the left and right navigation buttons
 */
function addNavigators(){
    navigators.innerHTML = `\
            <div class="arrow left">&lt;</div>\
            <div class="arrow right">&gt;</div>\
    `;

    /**
     * when user clicks left/right arrow it stops the auto rotate
     * after manual transition auto rotate will enable.
     */
    navigators.children[0].addEventListener('click', () => {
        clearInterval(timer);
        diff = -1;
        shiftLeft();
        if(infiniteScroll) 
            autoRotate();
    })

    navigators.children[1].addEventListener('click', () => {
        clearInterval(timer);
        diff = 1;
        shiftRight();
        if(infiniteScroll) 
            autoRotate();
    })
}



//main function to drive the carousel
function initCarousel({
    slideArr = [1,2,3,4,5],  //slides content
    defaultSlide =  1,       //default landing slide
    isNavigatorsNeed = true, //to show navigators or not
    isIndicatorsNeed = true, //to show indicators or not
    width="80%",             //width  of carousel
    height="250px",          //height of carousel
    delay = 1000,            //transition delay
    isInfiniteScroll = true, //auto scroll with transition delay
    direction = -1           //auto scroll direction 
}){
    infiniteScrollDirection = direction;
    infiniteScroll = isInfiniteScroll;
    timeInterval = delay;
    infiniteScroll = isInfiniteScroll
    slideCount = slideArr.length;
    slideWidth  = 100/slideCount;
    slides.style.transition = `all ${delay/1000}s linear`;
    defineCaraousel(width,height,slideCount)
    addSlides(slideArr,slideWidth,defaultSlide-1);
    currentSlide = defaultSlide-1;
    if(isIndicatorsNeed)
        addIndicators(slideCount,defaultSlide-1);
    if(isNavigatorsNeed)
        addNavigators();
    if(infiniteScroll)
        autoRotate();
    addTailer();
}



//calling the init function
initCarousel({});