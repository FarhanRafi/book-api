const parentContainer = document.querySelector('.container');
const search_bar = document.getElementById('search-bar');
search_bar.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        searchBook();
    }
});
const toggleSpinner = (cssStyle) => {
    const element = document.getElementById('spinner-div');
    if (element != null) element.style.display = cssStyle;
};
const searchBook = async () => {
    parentContainer.innerHTML = '';
    toggleSpinner('block');
    const searchText = search_bar.value;
    const url = `http://openlibrary.org/search.json?q=${searchText}`;
    const res = await fetch(url);
    const data = await res.json();
    bookCard(data.docs, data.numFound);
};
const bookCard = (books, totalCount) => {
    parentContainer.innerHTML = '';
    if (books.length > 0) {
        parentContainer.classList.add('d-flex');
        books.forEach((book) => {
            const singleCard = document.createElement('div');
            singleCard.classList.add('card', 'me-2', 'mb-2', 'p-2');
            singleCard.setAttribute('style', 'width: 18rem');
            singleCard.innerHTML = `
                <div class="row g-0">
                    <div class="col-md-3 pe-1">
                        <img src="https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg" class="img-fluid rounded-start" alt="">
                    </div>
                    <div class="col-md-9 ps-1">
                        <div class="">
                            <h6 class="card-title">${book.title}</h6>
                            <div id="${book.key}">by  </div>
                            <p class="card-text text-secondary"><small>First published in ${book.first_publish_year}</small></p>
                        </div>
                    </div>
                </div>`;
            parentContainer.appendChild(singleCard);
            const authorParent = document.getElementById(`${book.key}`);
            if (book.author_name?.length == 1) {
                book.author_name.forEach((author) => {
                    const authorSpan = document.createElement('span');
                    authorSpan.textContent = `${author}`;
                    authorParent.appendChild(authorSpan);
                });
            } else if (book.author_name?.length > 1) {
                book.author_name.forEach((author) => {
                    const authorSpan = document.createElement('span');
                    authorSpan.textContent = `${author}, `;
                    authorParent.appendChild(authorSpan);
                });
                authorParent.textContent = authorParent.textContent.slice(
                    0,
                    -2
                );
            }
        });
    } else {
        parentContainer.classList.remove('d-flex');
        parentContainer.innerHTML = `<img src="/img/oops.png" alt="" class="rounded mx-auto d-block"><br>`;
    }
    parentContainer.insertAdjacentHTML(
        'beforeend',
        `<p class="text-center">Total ${totalCount} books found</p>`
    );
    toggleSpinner('none');
};
