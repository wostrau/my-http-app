const listElement = document.querySelector('.posts');
const postTemplate = document.getElementById('single-post');
const form = document.querySelector('#new-post form');
const fetchButton = document.querySelector('#available-posts button');
const postList = document.querySelector('ul');

const pageUrl = 'https://jsonplaceholder.typicode.com/posts';

const sendHttpRequest = (method, url, data) => {
    //* (1) old-fashioned style for HTTP requests:
    // const promise = new Promise((resolve, reject) => {
    //     const xhr = new XMLHttpRequest();
    //     xhr.setRequestHeader('Content-Type', 'application/json');
    //     xhr.open(method, url);
    //     xhr.responseType = 'json';
    //     xhr.onload = () => {
    //         if (xhr.status >= 200 && xhr.status < 300) {
    //             resolve(xhr.response);
    //         } else {
    //             reject(new Error('Something went wrong!'));
    //         }
    //     };
    //     xhr.onerror = () => {
    //         reject(new Error('Failed to send request!'));
    //     };
    //     xhr.send(JSON.stringify(data));
    // });
    // return promise;

    //* (2) NEW Fetch API for HTTP requests:
    return fetch(url, {
        method: method,
        body: data,
        // body: JSON.stringify(data),
        // headers: {
        //     'Content-Type': 'application/json'
        // }
    }).then(response => {
        if (response.status >= 200 && response.status < 300) {
            return response.json();
        } else {
            return response.json().then(errData => {
                console.log(errData);
                throw new Error('Something went wrong on a server-side!');
            });
        }
    }).catch(error => {
        console.log(error);
        throw new Error('Something went wrong!');
    });
};

const fetchPosts = async () => {
    try {
        const responseData = await sendHttpRequest('GET', pageUrl);
        const listIfPosts = responseData;

        for (const post of listIfPosts) {
            const postEl = document.importNode(postTemplate.content, true);
            postEl.querySelector('h2').textContent = post.title.toUpperCase();
            postEl.querySelector('p').textContent = post.body;
            postEl.querySelector('li').id = post.id;
            listElement.append(postEl);
        }
    } catch (error) {
        alert(error.message);
    }
};

const createPost = (title, content) => {
    const userId = Math.random();
    // const post = {
    //     title: title,
    //     body: content,
    //     userId: userId
    // };

    const formData = new FormData(form);
    // formData.append('title', title);
    // formData.append('body', content);
    // formData.append('userId', userId);
    formData.append('userId', userId);

    sendHttpRequest('POST', pageUrl, formData);
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



