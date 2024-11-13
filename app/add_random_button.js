let RANDOM_BUTTON_PLACED = false;
const rand = items => items[~~(Math.random() * items.length)]

// jump to a random Post
const jumpToRandomPost = async () => {

    const PagePosts = parseNumPage();
    const NumPages = calcNumPages(PagePosts);

    const randomPageN = randomPage(NumPages) - 1;
    const tagName = parseTagName();
    const userId = window.location.pathname.match(/\/users\/(\d+)\//)?.[1];

    const req = await fetch(`https://www.pixiv.net/ajax/user/${userId}/illusts/bookmarks?tag=${tagName}&offset=${PagePosts * (randomPageN)}&limit=${PagePosts}&rest=show&lang=en`);
    let res = await req.json();
    const randomPostId = rand(res.body.works).id;

    location.href = "https://www.pixiv.net/en/artworks/" + randomPostId;
}

// next page number
// If the total number of pages is 2 or more, a different page number than the current one
const randomPage = (NumPages) => {
    if (NumPages <= 1) return 1;

    // 1 ~ (numPage - 1)
    const result = Math.floor(Math.random() * NumPages + 1);

    console.log("[Pixiv Random Plugin] Random Site: ", result);
    return result;
}

const parseTagName = () => {
    const tag = window.location.pathname.match(/\/artworks\/(.+)/)?.[1];
    return !tag ? "" : tag
}

// total number of pages
const parseNumPage = () => {
    return document.querySelectorAll('[size="1"] ,.list-item').length;
}

const calcNumPages = (PagePosts) => {
    return Math.floor(parseNumBookmark() / PagePosts + 1);
}

// total number of bookmarks
const parseNumBookmark = () => parseInt(document.querySelector('.total-num span, [color="text2"]+div').textContent.replaceAll(",", ""))

// current page number
const parseCurrentPage = () => parseInt(document.querySelector('button[aria-current], li a[aria-current]').textContent)

const NavBars = ['nav.pager ul', 'div+nav']
const NavbarElm = selector => {
    return new Promise(res => {
        const intrv = setInterval(() => {
            const targetSelector = NavBars.find(selector => document.querySelector(selector));
            if (!targetSelector) return;
            clearInterval(intrv)
            res({
                "ELEMENT": document.querySelector(targetSelector),
                "IS_MOBILE": targetSelector == 'nav.pager ul'
            });
        }, 500);
    })
}

const addRandomButton = async () => {
    if(document.querySelector('.RandomHREF'))
        return;

    const { ELEMENT, IS_MOBILE } = await NavbarElm();
    console.log('IS_MOBILE : ', IS_MOBILE);
    console.log('ELEMENT   : ', ELEMENT);

    const RandomHREF = document.createElement('button');
    RandomHREF.textContent = "RANDOM";
    RandomHREF.onclick = () => jumpToRandomPost(IS_MOBILE);

    RandomHREF.classList.add('RandomHREF');
    if (IS_MOBILE) RandomHREF.classList.add('MOBILE_STYLE');

    ELEMENT.appendChild(RandomHREF);
}

const intervalId = setInterval(addRandomButton, 1000);
