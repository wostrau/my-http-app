const listElement = document.querySelector('.posts');
const postTemplate = document.getElementById('single-post');
const form = document.querySelector('#new-post form');
const fetchButton = document.querySelector('#available-posts button');
const postList = document.querySelector('ul');

const pageUrl = 'https://jsonplaceholder.typicode.com/posts';

const sendHttpRequest = (method, url, data = null) => {
    const promise = new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open(method, url);
        xhr.responseType = 'json';
        xhr.onload = () => resolve(xhr.response);
        xhr.send(JSON.stringify(data));
    });

    return promise;
};

const fetchPosts = async () => {
    const responseData = await sendHttpRequest('GET', pageUrl);
    const listIfPosts = responseData;

    for (const post of listIfPosts) {
        const postEl = document.importNode(postTemplate.content, true);
        postEl.querySelector('h2').textContent = post.title.toUpperCase();
        postEl.querySelector('p').textContent = post.body;
        listElement.append(postEl);
    }
};

const createPost = (title, content) => {
    const userId = Math.random();
    const post = {
        title: title,
        body: content,
        userId: userId
    };

    sendHttpRequest('POST', pageUrl, post);
};


fetchButton.addEventListener('click', fetchPosts);

form.addEventListener('submit', event => {
    event.preventDefault();

    const enteredTitle = event.currentTarget.querySelector('#title').value;
    const enteredContent = event.currentTarget.querySelector('#content').value;

    createPost(enteredTitle, enteredContent);
});

postList.addEventListener('click', event => {
    if (event.target.tagName === 'BUTTON') {
        const postId = event.target.closest('li').id;
        sendHttpRequest('DELETE', `${pageUrl}/${postId}`);
    }
});



